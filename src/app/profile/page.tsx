'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Wallet } from '@/components/wallet/wallet'
import { User, Star, MapPin, Calendar, BookOpen, Settings, Award, Clock } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'

interface UserStats {
  skillsTaught: number
  skillsLearned: number
  reviewsGiven: number
  reviewsReceived: number
  karmaPoints: number
}

interface Booking {
  id: string
  skill: {
    id: string
    title: string
    category: string
    priceCredits: number
    owner: {
      name?: string
    }
  }
  startTime: string
  endTime: string
  status: string
}

export default function ProfilePage() {
  const [userStats, setUserStats] = useState<UserStats>({
    skillsTaught: 0,
    skillsLearned: 0,
    reviewsGiven: 0,
    reviewsReceived: 0,
    karmaPoints: 0,
  })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (user) {
      fetchUserStats()
      fetchUserBookings()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      // In a real app, you'd fetch this from an API
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setUserStats({
          skillsTaught: 3,
          skillsLearned: 7,
          reviewsGiven: 5,
          reviewsReceived: 8,
          karmaPoints: user?.karma || 0,
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
      setLoading(false)
    }
  }

  const fetchUserBookings = async () => {
    try {
      if (!user) return
      
      const response = await fetch(`/api/bookings?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch user bookings:', error)
    }
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email?.slice(0, 2).toUpperCase() || 'U'
  }

  const getMemberSince = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your profile.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || user?.email} />
                  <AvatarFallback className="text-xl">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">
                      {user?.name || 'Anonymous User'}
                    </h1>
                    {user?.isIdVerified && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ✓ ID Verified
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-3">
                    {user?.email}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {getMemberSince(user?.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="text-center p-4">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.skillsLearned}</div>
              <p className="text-xs text-muted-foreground">Skills Learned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center p-4">
              <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.skillsTaught}</div>
              <p className="text-xs text-muted-foreground">Skills Taught</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center p-4">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{user?.karma || 0}</div>
              <p className="text-xs text-muted-foreground">Karma Points</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center p-4">
              <User className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.reviewsGiven}</div>
              <p className="text-xs text-muted-foreground">Reviews Given</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="skills">My Skills</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="mt-6">
            <Wallet />
          </TabsContent>
          
          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Skills</CardTitle>
                <CardDescription>
                  Skills you're offering to the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Skills Listed</h3>
                  <p className="text-muted-foreground mb-4">
                    Start sharing your expertise with the community!
                  </p>
                  <Button>
                    <BookOpen className="w-4 h-4 mr-2" />
                    List Your First Skill
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>
                  Your upcoming and past learning sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Book your first learning session to get started!
                    </p>
                    <Button onClick={() => window.location.href = '/skills'}>
                      Browse Skills
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{booking.skill.title}</h3>
                          <Badge 
                            variant={booking.status === 'BOOKED' ? 'default' : 
                                   booking.status === 'COMPLETED' ? 'secondary' : 'destructive'}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          with {booking.skill.owner?.name || 'Instructor'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(booking.startTime).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {booking.skill.priceCredits} credits
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Reviews</CardTitle>
                <CardDescription>
                  Feedback you've given and received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Reviews Given ({userStats.reviewsGiven})</h3>
                    <div className="text-center py-8">
                      <Star className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Your reviews help others make informed decisions
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Reviews Received ({userStats.reviewsReceived})</h3>
                    <div className="text-center py-8">
                      <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Build your reputation through quality teaching
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}