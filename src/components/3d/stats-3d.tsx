'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
}

function AnimatedCounter({ value, suffix = '', duration = 2 }: AnimatedCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now()
      const endTime = startTime + duration * 1000
      
      const updateValue = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / (endTime - startTime), 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setDisplayValue(Math.floor(easeOutQuart * value))
        
        if (progress < 1) {
          requestAnimationFrame(updateValue)
        }
      }
      
      requestAnimationFrame(updateValue)
    }
  }, [isInView, value, duration])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
      {displayValue}{suffix}
    </div>
  )
}

interface Stats3DProps {
  stats: Array<{
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
  }>
}

export function Stats3D({ stats }: Stats3DProps) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
      <div className="absolute inset-0 bg-grid-white/5 bg-grid-16" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <Card className="text-center bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden">
                <CardContent className="p-6">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center"
                  >
                    {stat.icon && <stat.icon className="w-8 h-8 text-primary" />}
                  </motion.div>
                  
                  <div className="space-y-2">
                    <AnimatedCounter
                      value={parseInt(stat.value.replace(/\D/g, ''))}
                      suffix={stat.value.replace(/\d/g, '')}
                      duration={2}
                    />
                    <div className="text-muted-foreground text-sm md:text-base group-hover:text-foreground transition-colors">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}