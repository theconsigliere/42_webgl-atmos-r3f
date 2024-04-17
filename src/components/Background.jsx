import { Environment, Sphere } from "@react-three/drei"
import { Gradient, LayerMaterial } from "lamina"
import { useRef } from "react"

import * as THREE from "three"

export const Background = () => {
  return (
    <>
      <Sphere scale={[100, 100, 100]} rotation={[0, Math.PI / 2, 0]}>
        <LayerMaterial
          lighting="physical"
          transmission={1}
          side={THREE.BackSide}
        >
          <Gradient
            colorA={"#001baf"}
            colorB={"#6868ff"}
            colorC={"white"}
            axes={"y"}
            start={0}
            end={-0.5}
          />
        </LayerMaterial>
      </Sphere>
    </>
  )
}
