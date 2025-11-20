'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MapPin, Search, Star, Users, Calendar, BookOpen, Heart, Trophy, Sparkles } from 'lucide-react'
import { AuthModal } from '@/components/auth/auth-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import { AccessibilitySettings } from '@/components/accessibility-settings'
import { useAuthStore } from '@/stores/auth'
import { useAccessibility } from '@/contexts/accessibility-context'
import Link from 'next/link'

export default function SimpleHome() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  
  const { isAuthenticated, user } = useAuthStore()
  const { t } = useAccessibility()

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

  const featuredSkills = [
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
      level: 'Beginner'
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
      level: 'Intermediate'
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
      level: 'All Levels'
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
      level: 'Beginner'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">SkillSwap</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AccessibilitySettings />
              <Link href="/skills">
                <Button variant="ghost" className="hover:bg-primary/10 transition-colors">{t('nav.skills')}</Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" className="hover:bg-primary/10 transition-colors">Community</Button>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="hover:bg-primary/10 transition-colors">{t('nav.profile')}</Button>
                  </Link>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.name?.[0] || 'U'}</span>
                  </div>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsAuthModalOpen(true)} className="hover:bg-primary/10 transition-colors">
                    Sign In
                  </Button>
                  <Button onClick={() => setIsAuthModalOpen(true)} className="hover:scale-105 transition-transform">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              Learn from Your Neighbors,
              <br />
              Teach Your Community
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover, book, and pay for micro-lessons and help from verified locals within walking distance. 
              Turn your neighborhood into a learning campus.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="What do you want to learn?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Your location"
                  className="pl-12 h-14 text-lg w-full sm:w-56 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl"
                />
              </div>
              <Link href="/skills">
                <Button className="h-14 px-8 text-lg hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg rounded-xl text-primary-foreground font-medium">
                  Search Skills
                </Button>
              </Link>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Skill Sharing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Skill Sharing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover amazing skills shared by talented people in your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredSkills.map((skill) => (
            <Card key={skill.id} className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{skill.avatar}</div>
                <Badge variant="secondary">{skill.category}</Badge>
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
          ))}
        </div>
      </section>

      {/* Ready to Start Learning Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of neighbors sharing skills and building community with our enhanced accessibility and communication features.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/skills">
              <Button className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg rounded-xl text-primary-foreground font-medium">
                Start Learning
              </Button>
            </Link>
            <Link href="/create-skill">
              <Button variant="outline" className="text-lg px-8 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-xl font-medium">
                Share Your Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}