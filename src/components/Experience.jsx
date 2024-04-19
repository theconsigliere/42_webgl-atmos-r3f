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
import { TextGroup } from "./TextGroup"
import { CloudGroup } from "./CloudGroup"

export const Experience = () => {
  const config = {
    LINE_NB_POINTS: 1000,
    CURVE_DISTANCE: 250,
    CURVE_AHEAD_CAMERA: 0.008,
    CURVE_AHEAD_AIRPLANE: 0.02,
    AIRPLANE_MAX_ANGLE: 35,
  }

  const cameraGroup = useRef()
  const scroll = useScroll()
  const airplane = useRef()

  // create curved line for plane to follow
  // save as memo to prevent re-rendering

  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -config.CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * config.CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * config.CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * config.CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * config.CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -6 * config.CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * config.CURVE_DISTANCE),
    ],
    []
  )

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5)
  }, [])

  // generate a plane that follows the curve
  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, -0.08)
    shape.lineTo(0, 0.08)

    return shape
  }, [curve])

  // useFrame to move camera group based on scroll
  useFrame((_state, delta) => {
    // avoid having a negative value
    const scrollOffset = Math.max(scroll.offset, 0)

    // get current position of line based on scroll percentage
    const curPoint = curve.getPoint(scrollOffset)

    // lerp our camera group position to the current point
    cameraGroup.current.position.lerp(curPoint, delta * 24)

    //make the camera look at the point ahead
    const lookAtPoint = curve.getPoint(
      Math.min(scrollOffset + config.CURVE_AHEAD_CAMERA, 1)
    )

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    )

    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize()

    // lerp the look at direction
    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24)

    // set the new look at direction
    cameraGroup.current.lookAt(cameraGroup.current.position.clone().add(lookAt))

    // AIRPLANE ROTATION
    const tangent = curve.getTangent(scrollOffset + config.CURVE_AHEAD_AIRPLANE)

    // to avoid smooth effect from the camera we create a new group
    const nonLerpLookAt = new THREE.Group()
    nonLerpLookAt.position.copy(curPoint)
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt))

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    )

    //calculate the right angle

    let angle = Math.atan2(-tangent.z, tangent.x)
    angle = -Math.PI / 2 + angle

    let angleDegrees = (angle * 180) / Math.PI
    angleDegrees *= 2.4 // stronger angle

    // LIMIT PLANE ANGLE
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -config.AIRPLANE_MAX_ANGLE)
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, config.AIRPLANE_MAX_ANGLE)
    }

    // SET BACK ANGLE
    // covert angle to radian
    angle = (angleDegrees * Math.PI) / 180

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    )
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2)
  })

  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={40} makeDefault />
        <group ref={airplane}>
          <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
            <Plane rotation={[0, -Math.PI, 0]} scale={0.45} />
          </Float>
        </group>
      </group>

      <TextGroup />

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
          <meshStandardMaterial
            color={"white"}
            opacity={1}
            transparent
            envMapIntensity={2}
          />
        </mesh>
      </group>

      {/* CLOUDS */}
      <CloudGroup />
    </>
  )
}
