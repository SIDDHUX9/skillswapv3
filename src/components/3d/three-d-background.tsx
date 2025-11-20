'use client'

import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

// Floating Geometric Shape Component
function FloatingShape({ position, shape, color, speed }: {
  position: [number, number, number]
  shape: 'box' | 'sphere' | 'torus' | 'octahedron'
  color: string
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.01
      meshRef.current.rotation.y += speed * 0.01
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3
    }
  })

  const shapeProps = {
    ref: meshRef,
    position,
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
    scale: hovered ? 1.2 : 1
  }

  const materialProps = {
    color: hovered ? '#ffffff' : color,
    emissive: color,
    emissiveIntensity: hovered ? 0.5 : 0.2,
    transparent: true,
    opacity: 0.8,
    wireframe: hovered
  }

  switch (shape) {
    case 'box':
      return (
        <mesh {...shapeProps}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    case 'sphere':
      return (
        <mesh {...shapeProps}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    case 'torus':
      return (
        <mesh {...shapeProps}>
          <torusGeometry args={[0.7, 0.3, 16, 100]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    case 'octahedron':
      return (
        <mesh {...shapeProps}>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    default:
      return null
  }
}

// Particle System
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      particlesRef.current.rotation.x += 0.0005
    }
  })

  const particlesCount = 500
  const positions = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20
    positions[i + 1] = (Math.random() - 0.5) * 20
    positions[i + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main 3D Background Component
export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#ec4899"
        />
        
        {/* Stars Background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        {/* Floating Shapes */}
        <FloatingShape
          position={[-4, 2, -2]}
          shape="box"
          color="#8b5cf6"
          speed={0.5}
        />
        <FloatingShape
          position={[4, -2, -3]}
          shape="sphere"
          color="#3b82f6"
          speed={0.7}
        />
        <FloatingShape
          position={[-3, -3, -1]}
          shape="torus"
          color="#ec4899"
          speed={0.3}
        />
        <FloatingShape
          position={[3, 3, -4]}
          shape="octahedron"
          color="#10b981"
          speed={0.6}
        />
        <FloatingShape
          position={[0, 0, -5]}
          shape="sphere"
          color="#f59e0b"
          speed={0.4}
        />
        
        {/* Particle Field */}
        <ParticleField />
        
        {/* Subtle Camera Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}