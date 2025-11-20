'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  Navigation,
  ExternalLink,
  Heart,
  MessageCircle
} from 'lucide-react'

interface Skill {
  id: string
  title: string
  description: string
  category: string
  priceCredits: number
  lat: number
  lng: number
  avgRating: number
  owner: {
    id: string
    name: string
    avatar?: string
    location?: string
  }
  distance?: number
  estimatedTime?: string
  isSaved?: boolean
}

interface NearbySkillsProps {
  location: { lat: number; lng: number }
  radius: number
  filters: any
  onSkillSelect: (skill: Skill) => void
  className?: string
}

export function NearbySkills({ 
  location, 
  radius, 
  filters, 
  onSkillSelect,
  className 
}: NearbySkillsProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Fetch nearby skills
  const fetchNearbySkills = async () => {
    if (!location) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        radius: radius.toString(),
        category: filters.category !== 'all' ? filters.category : '',
        minRating: filters.minRating.toString(),
        maxPrice: filters.maxPrice.toString(),
        availability: filters.availability,
        sortBy: filters.sortBy
      })

      const response = await fetch(`/api/skills/nearby?${params}`)
      if (!response.ok) throw new Error('Failed to fetch nearby skills')

      const data = await response.json()
      
      // Calculate distances and add to skills
      const skillsWithDistance = data.map((skill: Skill) => ({
        ...skill,
        distance: calculateDistance(location.lat, location.lng, skill.lat, skill.lng),
        estimatedTime: getEstimatedTime(calculateDistance(location.lat, location.lng, skill.lat, skill.lng))
      }))

      setSkills(skillsWithDistance)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch nearby skills')
    } finally {
      setLoading(false)
    }
  }

  // Get estimated travel time
  const getEstimatedTime = (distance: number) => {
    if (distance < 1) return 'Walking distance'
    if (distance < 5) return `${Math.ceil(distance * 12)} min walk`
    if (distance < 15) return `${Math.ceil(distance * 4)} min drive`
    return `${Math.ceil(distance * 3)} min drive`
  }

  // Format distance
  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ACADEMIC: 'bg-blue-100 text-blue-800',
      ARTS: 'bg-purple-100 text-purple-800',
      BUSINESS: 'bg-green-100 text-green-800',
      COOKING: 'bg-orange-100 text-orange-800',
      FITNESS: 'bg-red-100 text-red-800',
      LANGUAGE: 'bg-indigo-100 text-indigo-800',
      MUSIC: 'bg-pink-100 text-pink-800',
      TECH: 'bg-gray-100 text-gray-800',
      TRADES: 'bg-yellow-100 text-yellow-800',
      OTHER: 'bg-slate-100 text-slate-800'
    }
    return colors[category] || colors.OTHER
  }

  // Render stars
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-current text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-current text-yellow-400 opacity-50" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
      }
    }
    
    return stars
  }

  useEffect(() => {
    fetchNearbySkills()
  }, [location, radius, filters])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Finding nearby skills...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchNearbySkills} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (skills.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">No skills found nearby</p>
            <p className="text-sm text-muted-foreground">
              Try expanding your search radius or adjusting filters
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {skills.length} Skills Within {radius}km
        </h3>
        <Button variant="outline" size="sm" onClick={fetchNearbySkills}>
          <Navigation className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {skills.map((skill) => (
          <Card key={skill.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar>
                      <AvatarImage src={skill.owner.avatar} />
                      <AvatarFallback>
                        {skill.owner.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">{skill.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        by {skill.owner.name}
                        {skill.owner.location && ` • ${skill.owner.location}`}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {skill.description}
                  </p>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(skill.avgRating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        {skill.avgRating.toFixed(1)}
                      </span>
                    </div>
                    <Badge className={getCategoryColor(skill.category)}>
                      {skill.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {skill.priceCredits} credits
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {formatDistance(skill.distance || 0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {skill.estimatedTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => onSkillSelect(skill)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}