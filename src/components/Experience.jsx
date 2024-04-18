import {
  Float,
  Line,
  PerspectiveCamera,
  OrbitControls,
  useScroll,
} from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import { Background } from "./Background"
import { Plane } from "./Plane"
import { Cloud } from "./Cloud"

export const Experience = () => {
  const config = {
    LINE_NB_POINTS: 12000,
  }

  const cameraGroup = useRef()
  const scroll = useScroll()
  const airplane = useRef()

  // create curved line for plane to follow
  // save as memo to prevent re-rendering
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, -10),
        new THREE.Vector3(-2, 0, -20),
        new THREE.Vector3(-3, 0, -30),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(5, 0, -50),
        new THREE.Vector3(7, 0, -60),
        new THREE.Vector3(5, 0, -70),
        new THREE.Vector3(0, 0, -80),
        new THREE.Vector3(0, 0, -90),
        new THREE.Vector3(0, 0, -100),
      ],
      false,
      "catmullrom",
      0.5
    )
  }, [])

  // get points for curved line
  const linePoints = useMemo(() => {
    return curve.getPoints(config.LINE_NB_POINTS)
  }, [curve])

  // generate a plane that follows the curve
  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, -0.2)
    shape.lineTo(0, 0.2)

    return shape
  }, [curve])

  // useFrame to move camera group based on scroll
  useFrame((_state, delta) => {
    // get current position of line based on scroll percentage
    const curPointIndex = Math.min(
      Math.round(scroll.offset * linePoints.length),
      linePoints.length - 1
    )

    // get closest index
    const curPoint = linePoints[curPointIndex]

    // lerp our camera group position to the current point
    cameraGroup.current.position.lerp(curPoint, delta * 24)

    // slightly rotate camera group based on curve
    const pointAhead =
      linePoints[Math.min(curPointIndex + 1, linePoints.length - 1)]

    // lets calcualte the angle between the current point and the next point
    const xDisplacement = (pointAhead.x - curPoint.x) * 200

    // so we can determine if we are going left or right
    // Math.PI / 2 -> LEFT
    // -Math.PI / 2 -> RIGHT
    // Math.PI / 3 -> MAX ROTATION
    const angleRotation =
      (xDisplacement < 0 ? 1 : -1) *
      Math.min(Math.abs(xDisplacement), Math.PI / 3)

    // we cant lerp a rotation so we will use quaternions
    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angleRotation
      )
    )

    // also rotate the camera group to match the airplane
    const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        cameraGroup.current.rotation.x,
        angleRotation,
        cameraGroup.current.rotation.z
      )
    )

    // now we have the target rotation we can slerp to it
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2)
    cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2)
  })

  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        <group ref={airplane}>
          <Float floatIntensity={2} speed={2}>
            <Plane rotation={[0, -Math.PI, 0]} scale={0.45} />
          </Float>
        </group>
      </group>

      {/* LINE */}

      {/* <Line
          points={linePoints}
          color="#fff"
          opacity={0.7}
          transparent
          lineWidth={16}
        /> */}

      {/* Use the shape createed above to create a mesh that follows the curve and visually represents the path of the line */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: config.LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={0.7} transparent />
        </mesh>
      </group>

      {/* CLOUDS */}
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1, -3]} />
      <Cloud opacity={0.5} scale={[0.2, 0.3, 0.4]} position={[1.5, -0.5, -2]} />
      <Cloud
        opacity={0.7}
        scale={[0.3, 0.3, 0.4]}
        rotation-y={Math.PI / 9}
        position={[2, -0.2, -2]}
      />
      <Cloud
        opacity={0.7}
        scale={[0.4, 0.4, 0.4]}
        rotation-y={Math.PI / 9}
        position={[1, -0.2, -12]}
      />
      <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[-1, 1, -53]} />
      <Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 1, -100]} />
    </>
  )
}
