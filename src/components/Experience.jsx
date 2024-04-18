import { Float, OrbitControls } from "@react-three/drei"
import Lights from "./Lights"
import { Plane } from "./Plane"
import { Cloud } from "./Cloud"

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Lights />
      <Float floatIntensity={2} speed={2}>
        <Plane rotation={[0, -Math.PI, 0]} scale={0.45} />
      </Float>
      <Cloud position={[-2, 1, 3]} scale={0.3} opacity={0.5} />
      <Cloud position={[3.5, -0.5, -2]} scale={[0.2, 0.3, 0.4]} opacity={0.5} />
      <Cloud
        position={[2, -0.2, -2]}
        scale={[0.3, 0.3, 0.4]}
        opacity={0.85}
        rotation-y={Math.PI / 9}
      />
      <Cloud
        position={[1, -0.2, 12]}
        scale={[0.4, 0.4, 0.4]}
        opacity={0.7}
        rotation-y={Math.PI / 9}
      />
      <Cloud position={[-1, 1, -53]} scale={0.5} opacity={0.7} />
      <Cloud position={[0, 1, -100]} scale={0.8} opacity={0.3} />
    </>
  )
}
