'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Search, Star, Users, Calendar, CreditCard, BookOpen, Heart, Trophy, Sparkles, Filter, ArrowLeft } from 'lucide-react'
import { AuthModal } from '@/components/auth/auth-modal'
import { UserProfile } from '@/components/auth/user-profile'
import { ThemeToggle } from '@/components/theme-toggle'
import { AccessibilitySettings } from '@/components/accessibility-settings'
import { useAuthStore } from '@/stores/auth'
import { useAccessibility } from '@/contexts/accessibility-context'
import { GeoLocationFilter } from '@/components/location/geo-location-filter'
import { NearbySkills } from '@/components/location/nearby-skills'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 })
  const [radius, setRadius] = useState(5)
  const [filters, setFilters] = useState({
    category: 'all',
    minRating: 0,
    maxPrice: 100,
    availability: 'all',
    sortBy: 'distance'
  })
  
  const { isAuthenticated, user } = useAuthStore()
  const { t } = useAccessibility()
  const router = useRouter()

  const categories = [
    { id: 'all', name: t('skill.category') || 'All Skills', icon: Sparkles },
    { id: 'academic', name: 'Academic', icon: BookOpen },
    { id: 'arts', name: 'Arts', icon: Heart },
    { id: 'business', name: 'Business', icon: Trophy },
    { id: 'cooking', name: 'Cooking', icon: Heart },
    { id: 'fitness', name: 'Fitness', icon: Trophy },
    { id: 'language', name: 'Language', icon: BookOpen },
    { id: 'music', name: 'Music', icon: Heart },
    { id: 'tech', name: 'Tech', icon: Sparkles },
    { id: 'trades', name: 'Trades', icon: Trophy },
  ]

  const allSkills = [
    {
      id: 1,
      title: 'Guitar Lessons for Beginners',
      category: 'Music',
      price: 30,
      rating: 4.8,
      reviews: 12,
      distance: '0.5 km',
      instructor: 'Sarah M.',
      avatar: '👩‍🎤',
      description: 'Learn guitar basics in a relaxed environment',
      duration: '1 hour',
      level: 'Beginner',
      availability: 'Weekends',
      verified: true
    },
    {
      id: 2,
      title: 'Web Development Mentorship',
      category: 'Tech',
      price: 50,
      rating: 4.9,
      reviews: 23,
      distance: '1.2 km',
      instructor: 'John D.',
      avatar: '👨‍💻',
      description: 'Full-stack development guidance',
      duration: '2 hours',
      level: 'Intermediate',
      availability: 'Evenings',
      verified: true
    },
    {
      id: 3,
      title: 'French Conversation Practice',
      category: 'Language',
      price: 25,
      rating: 4.7,
      reviews: 8,
      distance: '0.8 km',
      instructor: 'Marie L.',
      avatar: '👩‍🏫',
      description: 'Improve your French speaking skills',
      duration: '1 hour',
      level: 'All Levels',
      availability: 'Flexible',
      verified: true
    },
    {
      id: 4,
      title: 'Home Cooking Basics',
      category: 'Cooking',
      price: 35,
      rating: 4.9,
      reviews: 15,
      distance: '2.0 km',
      instructor: 'Carlos R.',
      avatar: '👨‍🍳',
      description: 'Learn essential cooking techniques',
      duration: '1.5 hours',
      level: 'Beginner',
      availability: 'Weekdays',
      verified: true
    },
    {
      id: 5,
      title: 'Yoga and Meditation',
      category: 'Fitness',
      price: 20,
      rating: 4.6,
      reviews: 18,
      distance: '0.3 km',
      instructor: 'Emma S.',
      avatar: '👩‍🦰',
      description: 'Find your inner peace with guided sessions',
      duration: '1 hour',
      level: 'All Levels',
      availability: 'Mornings',
      verified: true
    },
    {
      id: 6,
      title: 'Digital Marketing Basics',
      category: 'Business',
      price: 45,
      rating: 4.7,
      reviews: 9,
      distance: '1.5 km',
      instructor: 'Alex K.',
      avatar: '👨‍💼',
      description: 'Learn digital marketing strategies',
      duration: '1.5 hours',
      level: 'Beginner',
      availability: 'Weekends',
      verified: true
    },
    {
      id: 7,
      title: 'Photography Fundamentals',
      category: 'Arts',
      price: 40,
      rating: 4.8,
      reviews: 14,
      distance: '0.7 km',
      instructor: 'Lisa W.',
      avatar: '👩‍🎨',
      description: 'Master the art of photography',
      duration: '2 hours',
      level: 'Beginner',
      availability: 'Flexible',
      verified: true
    },
    {
      id: 8,
      title: 'Spanish for Beginners',
      category: 'Language',
      price: 25,
      rating: 4.5,
      reviews: 11,
      distance: '1.0 km',
      instructor: 'Miguel R.',
      avatar: '👨‍🎓',
      description: 'Start your Spanish learning journey',
      duration: '1 hour',
      level: 'Beginner',
      availability: 'Evenings',
      verified: true
    }
  ]

  const filteredSkills = allSkills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesRating = skill.rating >= filters.minRating
    const matchesPrice = skill.price <= filters.maxPrice
    
    return matchesSearch && matchesCategory && matchesRating && matchesPrice
  })

  const SkillCard = ({ skill, index }: { skill: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">{skill.avatar}</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary">{skill.category}</Badge>
            {skill.verified && (
              <Badge variant="default" className="bg-green-500">Verified</Badge>
            )}
          </div>
          <CardTitle className="text-lg">{skill.title}</CardTitle>
          <CardDescription className="text-sm">{skill.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{skill.rating}</span>
              <span className="text-muted-foreground">({skill.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{skill.distance}</span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instructor:</span>
              <span className="font-medium">{skill.instructor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>{skill.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Level:</span>
              <span>{skill.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability:</span>
              <span>{skill.availability}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-2xl font-bold text-primary">${skill.price}</div>
            <Button 
              className="hover:scale-105 transition-transform"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="relative z-20 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">All Skills</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AccessibilitySettings />
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <Button variant="outline" onClick={() => setIsAuthModalOpen(true)} className="hover:bg-primary/10 transition-colors">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search skills, instructors, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-14 bg-background/50 backdrop-blur-sm border-primary/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="h-14 px-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Available Skills</h1>
              <p className="text-muted-foreground">
                {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'} found near you
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No skills found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setFilters({...filters, minRating: 0, maxPrice: 100})
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}