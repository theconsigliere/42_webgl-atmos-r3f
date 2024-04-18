import { Text } from "@react-three/drei"

export function TextGroup() {
  return (
    <>
      {/* Text */}
      <group position={[-3, 0, -15]}>
        <Text
          color="white"
          anchorX={"left"}
          anchorY="middle"
          fontSize={0.22}
          maxWidth={2.5}
          font={"./fonts/beausite-grand-light.ttf"}
        >
          Welcome to maxmos Have a seat and enjoy the ride!
        </Text>
      </group>

      <group position={[1, 0, -50]}>
        <Text
          color="white"
          anchorX={"left"}
          anchorY="center"
          fontSize={0.52}
          maxWidth={2.5}
          font={"./fonts/beausite-grand-light.ttf"}
        >
          Services
        </Text>
        <Text
          color="white"
          anchorX={"left"}
          anchorY="top"
          position-y={-0.6}
          fontSize={0.22}
          maxWidth={2.5}
          font={"./fonts/beausite-grand-light.ttf"}
        >
          Do you want a drink? we have a lot of options
        </Text>
      </group>
    </>
  )
}
