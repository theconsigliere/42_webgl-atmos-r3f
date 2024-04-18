import { Cloud } from "./Cloud"

export function CloudGroup() {
  return (
    <>
      <Cloud scale={0.7} position={[-2, 1, -3]} />
      <Cloud scale={[0.4]} position={[1.5, -0.5, -10]} />
      <Cloud scale={0.6} rotation-y={Math.PI / 9} position={[2, -0.2, -2]} />
      <Cloud scale={0.5} rotation-y={Math.PI / 9} position={[1, -0.2, -22]} />
      <Cloud scale={[0.5, 0.5, 0.5]} position={[-1, 1, -53]} />
      <Cloud scale={[0.8, 0.8, 0.8]} position={[-3, 1, -100]} />
    </>
  )
}
