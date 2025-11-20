'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Search, Star, Users, Calendar, CreditCard, BookOpen, Heart, Trophy, Sparkles, MessageSquare, Award, Navigation, Globe } from 'lucide-react'
import { AuthModal } from '@/components/auth/auth-modal'
import { UserProfile } from '@/components/auth/user-profile'
import { ThemeToggle } from '@/components/theme-toggle'
import { AccessibilitySettings } from '@/components/accessibility-settings'
import { ChatContainer } from '@/components/chat/chat-container'
import { ReputationSystem } from '@/components/reputation/reputation-system'
import { GeoLocationFilter } from '@/components/location/geo-location-filter'
import { NearbySkills } from '@/components/location/nearby-skills'
import { useAuthStore } from '@/stores/auth'
import { useAccessibility } from '@/contexts/accessibility-context'
import { ChatProvider } from '@/contexts/chat-context'
import Link from 'next/link'

export default function MediumHome() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('discover')
  
  const { isAuthenticated, user } = useAuthStore()
  const { t } = useAccessibility()

  // Location and filter state
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 }) // Default: NYC
  const [radius, setRadius] = useState(5)
  const [filters, setFilters] = useState({
    category: 'all',
    minRating: 0,
    maxPrice: 100,
    availability: 'all',
    sortBy: 'distance'
  })

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

  const howItWorks = [
    {
      step: 1,
      title: 'Discover Skills',
      description: 'Find talented neighbors offering skills within walking distance',
      icon: Search
    },
    {
      step: 2,
      title: 'Book & Pay',
      description: 'Schedule sessions that work for you and pay securely with credits',
      icon: Calendar
    },
    {
      step: 3,
      title: 'Learn & Connect',
      description: 'Meet amazing people in your community and learn something new',
      icon: Users
    }
  ]

  const newFeatures = [
    {
      icon: AccessibilitySettings,
      title: 'Accessibility & Inclusivity',
      description: 'Voice navigation, high-contrast modes, and multi-language support for everyone.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant messaging with skill providers to coordinate and communicate.',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Award,
      title: 'Reputation System',
      description: 'Build trust with ratings, testimonials, and skill endorsements.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Navigation,
      title: 'Geo-Location Matching',
      description: 'Find skills near you with customizable radius search and filtering.',
      color: 'from-indigo-500 to-purple-600'
    }
  ]

  const SkillCard = ({ skill, index }: { skill: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="relative z-20 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">SkillSwap</span>
            </motion.div>
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
                  <UserProfile />
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
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Learn from Your Neighbors,
              <br />
              Teach Your Community
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover, book, and pay for micro-lessons and help from verified locals within walking distance. 
              Turn your neighborhood into a learning campus.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
                <motion.button 
                  className="h-14 px-8 text-lg hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg rounded-xl text-primary-foreground font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search Skills
                </motion.button>
              </Link>
            </motion.div>

            {/* Category Pills */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <motion.button
                    key={category.id}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    {category.name}
                  </motion.button>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skill Sharing Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Skill Sharing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover amazing skills shared by talented people in your community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredSkills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      </section>

      {/* Ready to Start Learning Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ready to Start Learning?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of neighbors sharing skills and building community with our enhanced accessibility and communication features.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/skills">
              <motion.button 
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg rounded-xl text-primary-foreground font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning
              </motion.button>
            </Link>
            <Link href="/create-skill">
              <motion.button 
                className="text-lg px-8 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Your Skills
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with skill sharing in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((step, index) => (
            <motion.div
              key={step.step}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-primary mb-2">Step {step.step}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Join Our Growing Community
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Active Skills', icon: BookOpen },
            { value: '1,200+', label: 'Happy Learners', icon: Users },
            { value: '50+', label: 'Neighborhoods', icon: MapPin },
            { value: '4.9★', label: 'Average Rating', icon: Star }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Enhanced Learning Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover powerful new features designed to make skill sharing more accessible, connected, and personalized
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Features Demo */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Try Our New Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of community learning with our interactive tools
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="reputation" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Reputation
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <GeoLocationFilter
                  onLocationChange={setLocation}
                  onRadiusChange={setRadius}
                  onFiltersChange={setFilters}
                />
              </div>
              <div className="lg:col-span-2">
                <NearbySkills
                  location={location}
                  radius={radius}
                  filters={filters}
                  onSkillSelect={(skill) => console.log('Selected skill:', skill)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reputation" className="mt-8">
            <ReputationSystem
              userId="demo-user"
              userReputation={{
                overallRating: 4.7,
                totalReviews: 23,
                reliabilityScore: 4.8,
                skillScore: 4.6,
                communicationScore: 4.9,
                responseRate: 95,
                responseTime: 30,
                level: 'ADVANCED',
                badges: ['Quick Responder', 'Highly Rated', 'Reliable', 'Top Contributor']
              }}
              testimonials={[
                {
                  id: 1,
                  giverName: 'Alex Johnson',
                  giverAvatar: '',
                  content: 'Amazing teacher! Very patient and knowledgeable. Highly recommend!',
                  rating: 5,
                  createdAt: new Date().toISOString(),
                  isVerified: true
                },
                {
                  id: 2,
                  giverName: 'Sam Lee',
                  giverAvatar: '',
                  content: 'Great experience. Learned so much in just one session.',
                  rating: 5,
                  createdAt: new Date(Date.now() - 86400000).toISOString(),
                  isVerified: false
                }
              ]}
              endorsements={[
                {
                  id: 1,
                  endorserName: 'Jordan Smith',
                  endorserAvatar: '',
                  skillTitle: 'Web Development',
                  comment: 'Excellent full-stack developer!',
                  createdAt: new Date().toISOString()
                }
              ]}
            />
          </TabsContent>

          <TabsContent value="chat" className="mt-8">
            <ChatProvider>
              <ChatContainer />
            </ChatProvider>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Accessibility & Inclusivity Features
                </CardTitle>
                <CardDescription>
                  Experience our platform with enhanced accessibility features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Voice Navigation</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enable voice navigation to have the platform read content and guide you through features.
                    </p>
                    <Button variant="outline" size="sm">
                      Try Voice Navigation
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">High Contrast Mode</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Switch to high contrast mode for better visibility and reduced eye strain.
                    </p>
                    <Button variant="outline" size="sm">
                      Enable High Contrast
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Multi-Language Support</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose from multiple languages to navigate the platform in your preferred language.
                    </p>
                    <Button variant="outline" size="sm">
                      Change Language
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Keyboard Navigation</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Navigate the entire platform using just your keyboard for enhanced accessibility.
                    </p>
                    <Button variant="outline" size="sm">
                      Enable Keyboard Mode
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}