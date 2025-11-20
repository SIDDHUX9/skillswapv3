'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, User, MapPin, Calendar, CreditCard, BookOpen, ArrowLeft, Clock } from 'lucide-react'
import { Reviews } from '@/components/reviews/reviews'
import { useAuthStore } from '@/stores/auth'
import Link from 'next/link'

interface Skill {
  id: string
  title: string
  description: string
  category: string
  priceCredits: number
  avgRating: number
  lat: number
  lng: number
  owner: {
    id: string
    name?: string
    avatarUrl?: string
    isIdVerified: boolean
  }
  _count: {
    reviews: number
  }
}

interface SkillDetailPageProps {
  params: {
    id: string
  }
}

export default function SkillDetailPage({ params }: SkillDetailPageProps) {
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [userBookings, setUserBookings] = useState<any[]>([])
  
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    fetchSkill()
    if (isAuthenticated) {
      fetchUserBookings()
    }
  }, [params.id, isAuthenticated])

  const fetchSkill = async () => {
    try {
      const response = await fetch(`/api/skills/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        // Ensure _count exists
        const skillWithCount = {
          ...data.skill,
          _count: data.skill._count || { reviews: 0 }
        }
        setSkill(skillWithCount)
      }
    } catch (error) {
      console.error('Failed to fetch skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?learnerId=demo-user-id`)
      const data = await response.json()
      
      if (response.ok) {
        setUserBookings(data.bookings)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    }
  }

  const canReview = () => {
    if (!isAuthenticated || !skill) return false
    
    const completedBooking = userBookings.find(
      booking => booking.skillId === skill.id && booking.status === 'COMPLETED'
    )
    
    return !!completedBooking
  }

  const getReviewBookingId = () => {
    if (!skill) return null
    
    const completedBooking = userBookings.find(
      booking => booking.skillId === skill.id && booking.status === 'COMPLETED'
    )
    
    return completedBooking?.id || null
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ACADEMIC: 'bg-blue-100 text-blue-800',
      ARTS: 'bg-purple-100 text-purple-800',
      BUSINESS: 'bg-green-100 text-green-800',
      COOKING: 'bg-orange-100 text-orange-800',
      FITNESS: 'bg-red-100 text-red-800',
      LANGUAGE: 'bg-indigo-100 text-indigo-800',
      MUSIC: 'bg-pink-100 text-pink-800',
      TECH: 'bg-cyan-100 text-cyan-800',
      TRADES: 'bg-yellow-100 text-yellow-800',
      OTHER: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.OTHER
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading skill details...</p>
        </div>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Skill not found</h2>
          <p className="text-muted-foreground">This skill may no longer be available.</p>
          <Link href="/skills" className="inline-block mt-4">
            <Button>Back to Skills</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/skills" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Skills
        </Link>

        {/* Skill Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCategoryColor(skill.category)}>
                {skill.category.toLowerCase()}
              </Badge>
              {skill.owner.isIdVerified && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ Verified Instructor
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {skill.description}
            </p>

            {/* Key Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{skill.avgRating.toFixed(1)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {skill._count.reviews} reviews
                </div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {skill.priceCredits}
                </div>
                <div className="text-xs text-muted-foreground">credits</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">1 hour</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Local</div>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Instructor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {skill.owner.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {skill.owner.name || 'Anonymous'}
                    </div>
                    {skill.owner.isIdVerified && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ✓ ID Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{skill.avgRating.toFixed(1)} rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{skill._count.reviews} reviews</span>
                  </div>
                </div>
                
                <Link href={`/bookings/${skill.id}`} className="w-full">
                  <Button className="w-full">
                    Book Session - {skill.priceCredits} credits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="what-to-expect">What to Expect</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Skill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Session Format</h3>
                  <p className="text-muted-foreground">
                    This is a 1-hour one-on-one session tailored to your specific needs and skill level. 
                    The instructor will provide personalized guidance and hands-on practice.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">What's Included</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Personalized instruction</li>
                    <li>• Hands-on practice time</li>
                    <li>• Q&A session</li>
                    <li>• Learning materials and resources</li>
                    <li>• Follow-up recommendations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-muted-foreground">
                    No prior experience necessary. Just bring your enthusiasm and willingness to learn!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="what-to-expect" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Before the Session</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• You'll receive a confirmation email with the session details</li>
                    <li>• Think about what you'd like to learn or achieve</li>
                    <li>• Prepare any questions you might have</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">During the Session</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Brief introduction and goal setting</li>
                    <li>• Hands-on learning and practice</li>
                    <li>• Personalized feedback and guidance</li>
                    <li>• Time for questions and clarification</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">After the Session</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Summary of what you learned</li>
                    <li>• Recommendations for continued practice</li>
                    <li>• Resources and materials to take home</li>
                    <li>• Opportunity to book follow-up sessions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Reviews 
              skillId={skill.id} 
              bookingId={getReviewBookingId() || undefined}
              canReview={canReview()}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}