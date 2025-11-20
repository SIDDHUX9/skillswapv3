'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface HowItWorks3DProps {
  steps: Array<{
    step: number
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

export function HowItWorks3D({ steps }: HowItWorks3DProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            How SkillSwap Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start learning and teaching in your community in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  rotateX: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="text-center bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="pb-4">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 relative overflow-hidden group"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Animated Background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      <Icon className="w-10 h-10 text-primary relative z-10" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
                    >
                      <Badge className="mb-3 bg-gradient-to-r from-primary/20 to-primary/10 border-primary/20 text-sm px-4 py-1">
                        Step {item.step}
                      </Badge>
                    </motion.div>
                    
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <motion.p 
                      className="text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.2 + 0.4, duration: 0.4 }}
                    >
                      {item.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <motion.line
            x1="25%"
            y1="50%"
            x2="50%"
            y2="50%"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ delay: 0.8, duration: 1 }}
          />
          <motion.line
            x1="50%"
            y1="50%"
            x2="75%"
            y2="50%"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ delay: 1, duration: 1 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  )
}