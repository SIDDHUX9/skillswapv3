"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, Filter, X, Star, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface SkillLocation {
  id: number
  title: string
  category: string
  instructor: string
  avatar: string
  price: number
  rating: number
  reviews: number
  distance: string
  lat: number
  lng: number
  description: string
  duration: string
  level: string
}

const mockLocations: SkillLocation[] = [
  {
    id: 1,
    title: 'Guitar Lessons for Beginners',
    category: 'Music',
    instructor: 'Sarah M.',
    avatar: '👩‍🎤',
    price: 30,
    rating: 4.8,
    reviews: 12,
    distance: '0.5 km',
    lat: 40.7128,
    lng: -74.0060,
    description: 'Learn guitar basics in a relaxed environment',
    duration: '1 hour',
    level: 'Beginner'
  },
  {
    id: 2,
    title: 'Web Development Mentorship',
    category: 'Tech',
    instructor: 'John D.',
    avatar: '👨‍💻',
    price: 50,
    rating: 4.9,
    reviews: 23,
    distance: '1.2 km',
    lat: 40.7260,
    lng: -73.9897,
    description: 'Full-stack development guidance',
    duration: '2 hours',
    level: 'Intermediate'
  },
  {
    id: 3,
    title: 'French Conversation Practice',
    category: 'Language',
    instructor: 'Marie L.',
    avatar: '👩‍🏫',
    price: 25,
    rating: 4.7,
    reviews: 8,
    distance: '0.8 km',
    lat: 40.7489,
    lng: -73.9680,
    description: 'Improve your French speaking skills',
    duration: '1 hour',
    level: 'All Levels'
  },
  {
    id: 4,
    title: 'Home Cooking Basics',
    category: 'Cooking',
    instructor: 'Carlos R.',
    avatar: '👨‍🍳',
    price: 35,
    rating: 4.9,
    reviews: 15,
    distance: '2.0 km',
    lat: 40.6892,
    lng: -74.0445,
    description: 'Learn essential cooking techniques',
    duration: '1.5 hours',
    level: 'Beginner'
  }
]

export function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<SkillLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: 'all', name: 'All Skills', color: 'bg-gray-500' },
    { id: 'music', name: 'Music', color: 'bg-purple-500' },
    { id: 'tech', name: 'Tech', color: 'bg-blue-500' },
    { id: 'language', name: 'Language', color: 'bg-green-500' },
    { id: 'cooking', name: 'Cooking', color: 'bg-orange-500' },
    { id: 'academic', name: 'Academic', color: 'bg-red-500' }
  ]

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const filteredLocations = mockLocations.filter(location => {
    const matchesSearch = location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || location.category.toLowerCase() === selectedCategory
    const matchesPrice = location.price >= priceRange[0] && location.price <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleLocationClick = (location: SkillLocation) => {
    setSelectedLocation(location)
    setMapCenter({ lat: location.lat, lng: location.lng })
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setMapCenter(location)
        }
      )
    }
  }

  return (
    <div className="relative h-full bg-background">
      {/* Map Container */}
      <div ref={mapRef} className="relative h-full min-h-[600px] bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300 dark:border-gray-700" />
            ))}
          </div>
        </div>

        {/* Map Markers */}
        <AnimatePresence>
          {filteredLocations.map((location) => (
            <motion.div
              key={location.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute cursor-pointer"
              style={{
                left: `${((location.lng - (-74.1)) / 0.2) * 100}%`,
                top: `${((40.8 - location.lat) / 0.2) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleLocationClick(location)}
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                  categories.find(c => c.id === location.category.toLowerCase())?.color || 'bg-gray-500'
                }`}>
                  {location.avatar}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-current rotate-45" />
                {selectedLocation?.id === location.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-white dark:border-gray-900"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* User Location Marker */}
        {userLocation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
            style={{
              left: `${((userLocation.lng - (-74.1)) / 0.2) * 100}%`,
              top: `${((40.8 - userLocation.lat) / 0.2) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <motion.div
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500 rounded-full opacity-30"
            />
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg p-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search skills or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleGetCurrentLocation}
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Category</Label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Location Detail Card */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute bottom-4 right-4 z-10 w-80"
            >
              <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{selectedLocation.avatar}</div>
                      <div>
                        <CardTitle className="text-lg">{selectedLocation.title}</CardTitle>
                        <CardDescription>{selectedLocation.instructor}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLocation(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{selectedLocation.category}</Badge>
                      <div className="font-bold text-primary">
                        ${selectedLocation.price}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedLocation.rating}</span>
                        <span>({selectedLocation.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedLocation.distance}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedLocation.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedLocation.level}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.description}
                    </p>

                    <Button className="w-full">
                      Book Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <h4 className="font-medium text-sm mb-2">Categories</h4>
              <div className="space-y-1">
                {categories.slice(1).map((category) => (
                  <div key={category.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}