'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { InteractiveCard3D } from './interactive-card-3d'

interface FeatureCard3DProps {
  skill: {
    id: number
    title: string
    category: string
    price: number
    rating: number
    reviews: number
    distance: string
    instructor: string
    avatar: string
    description?: string
    duration?: string
    level?: string
  }
  index: number
}

export function FeatureCard3D({ skill, index }: FeatureCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10,
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <InteractiveCard3D className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <motion.div 
              className="text-3xl"
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? 10 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {skill.avatar}
            </motion.div>
            <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/20 backdrop-blur-sm">
              {skill.category}
            </Badge>
          </div>
          
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
            {skill.title}
          </CardTitle>
          
          <CardDescription className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {skill.distance} away • {skill.instructor}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </motion.div>
              <span className="font-medium">{skill.rating}</span>
              <span className="text-muted-foreground text-sm">({skill.reviews})</span>
            </div>
            
            <motion.div 
              className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              ${skill.price}
            </motion.div>
          </div>

          {skill.description && (
            <motion.p 
              className="text-sm text-muted-foreground line-clamp-2"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            >
              {skill.description}
            </motion.p>
          )}

          {skill.duration && skill.level && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{skill.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{skill.level}</span>
              </div>
            </div>
          )}
          
          <Link href={`/bookings/${skill.id}`} className="w-full">
            <motion.button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-primary-foreground py-2 px-4 rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book Session
            </motion.button>
          </Link>
        </CardContent>
      </InteractiveCard3D>
    </motion.div>
  )
}