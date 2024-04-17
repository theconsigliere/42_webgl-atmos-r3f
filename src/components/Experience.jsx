import { Float, OrbitControls } from "@react-three/drei"
import Lights from "./Lights"
import { Plane } from "./Plane"

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Lights />
      <Float floatIntensity={2} speed={2}>
        <Plane rotation={[0, -Math.PI, 0]} scale={0.45} />
      </Float>
    </>
  )
}
