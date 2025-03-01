import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'

function Avatar() {
  const meshRef = useRef()
  const keysPressed = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true
    }
    
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return

    const moveSpeed = 0.1
    
    if (keysPressed.current['w']) {
      meshRef.current.position.z -= moveSpeed
    }
    if (keysPressed.current['s']) {
      meshRef.current.position.z += moveSpeed
    }
    if (keysPressed.current['a']) {
      meshRef.current.position.x -= moveSpeed
    }
    if (keysPressed.current['d']) {
      meshRef.current.position.x += moveSpeed
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default Avatar