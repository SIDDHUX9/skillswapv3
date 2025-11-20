'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface InteractiveCard3DProps {
  children: React.ReactNode
  className?: string
  tiltIntensity?: number
}

export function InteractiveCard3D({ children, className = '', tiltIntensity = 15 }: InteractiveCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltIntensity
    const rotateY = ((x - centerX) / centerX) * tiltIntensity

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`)
    
    // Update glow position
    setGlowPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    })
  }

  const handleMouseLeave = () => {
    setTransform('')
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ zIndex: 10 }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(139, 92, 246, 0.15), transparent 50%)`,
          filter: 'blur(20px)'
        }}
      />
      
      {/* Card content */}
      <Card className="relative h-full bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-2xl group">
        {children}
      </Card>
    </motion.div>
  )
}