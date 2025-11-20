'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Star, 
  Users, 
  CreditCard, 
  BookOpen, 
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Plus,
  Eye
} from 'lucide-react'
import { DatabaseService } from '@/lib/db'
import { useAuthStore } from '@/stores/auth'
import Link from 'next/link'

interface Booking {
  id: string
  skill: {
    id: string
    title: string
    category: string
    price_credits: number
    owner: {
      id: string
      name: string
      avatar_url?: string
    }
  }
  start_time: string
  status: string
  notes: string
}

interface CreditTransaction {
  id: string
  amount: number
  type: string
  message: string
  created_at: string
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData()
    }
  }, [isAuthenticated, user])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's bookings
      const bookingsData = await DatabaseService.getUserBookings(user!.id)
      setBookings(bookingsData || [])

      // Fetch credit transactions
      const transactionsData = await DatabaseService.getUserCreditTransactions(user!.id)
      setCreditTransactions(transactionsData || [])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const upcomingBookings = bookings.filter(b => b.status === 'BOOKED')
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
  const totalEarned = creditTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  const totalSpent = Math.abs(creditTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOOKED': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">
              Manage your skills, bookings, and track your learning progress
            </p>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="skills">My Skills</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Available Credits</p>
                        <p className="text-2xl font-bold text-primary">{user.credits}</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Karma Points</p>
                        <p className="text-2xl font-bold text-green-600">{user.karma}</p>
                      </div>
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming Sessions</p>
                        <p className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed Sessions</p>
                        <p className="text-2xl font-bold text-green-600">{completedBookings.length}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No bookings yet. Start exploring skills!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{booking.skill.title}</p>
                            <p className="text-sm text-muted-foreground">
                              with {booking.skill.owner.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(booking.start_time)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Credit Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {creditTransactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No credit transactions yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {creditTransactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{transaction.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                          <span className={`font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Bookings</h2>
              <Link href="/skills">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Book New Skill
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>
                    Your scheduled learning sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No upcoming sessions
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{booking.skill.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Instructor: {booking.skill.owner.name}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(booking.start_time)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-3 w-3" />
                                  {booking.skill.price_credits} credits
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completed Sessions</CardTitle>
                  <CardDescription>
                    Your learning history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {completedBookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No completed sessions yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {completedBookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{booking.skill.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Instructor: {booking.skill.owner.name}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(booking.start_time)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-3 w-3" />
                                  {booking.skill.price_credits} credits
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Star className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Your complete credit transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {creditTransactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No transactions yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {creditTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{transaction.message}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {transaction.type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Credit Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Current Balance</span>
                      <span className="text-2xl font-bold text-primary">{user.credits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Earned</span>
                      <span className="text-lg font-bold text-green-600">+{totalEarned}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="text-lg font-bold text-red-600">-{totalSpent}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How to Earn Credits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Leave reviews (+10)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Join projects (+5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Teach skills (+earnings)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Skills</h2>
              <Link href="/create-skill">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Skill
                </Button>
              </Link>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Skills Created Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start sharing your expertise by creating your first skill listing
                  </p>
                  <Link href="/create-skill">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Skill
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}