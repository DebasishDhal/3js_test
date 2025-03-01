import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Avatar from './Avatar'
import { useEffect } from 'react'

function Scene() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 5, 10)
  }, [camera])

  return (
    <>
      <OrbitControls />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Environment */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#303030" />
      </mesh>

      <Avatar />
    </>
  )
}

export default Scene