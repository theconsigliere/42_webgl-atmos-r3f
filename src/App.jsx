import { ScrollControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Experience } from "./components/Experience"
import Lights from "./components/Lights"

function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 30,
        }}
      >
        <color attach="background" args={["#ececec"]} />

        {/* Wrapp experience in scrollcontrols so we can scroll through the experience */}
        <ScrollControls pages={5} damping={0.3}>
          <Experience />
        </ScrollControls>
        <Lights />
      </Canvas>
    </>
  )
}

export default App
