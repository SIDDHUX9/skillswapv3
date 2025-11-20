'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, Clock, User, CreditCard, Star, MapPin, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { format, addDays, setHours, setMinutes } from 'date-fns'

interface Skill {
  id: string
  title: string
  description: string
  category: string
  priceCredits: number
  avgRating: number
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

interface BookingPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BookingPage({ params }: BookingPageProps) {
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [skillId, setSkillId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [notes, setNotes] = useState('')
  
  const { user, isAuthenticated } = useAuthStore()

  // Generate time slots from 9 AM to 8 PM
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9 // Start at 9 AM
    return `${hour.toString().padStart(2, '0')}:00`
  })

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params
      setSkillId(id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (skillId) {
      fetchSkill()
    }
  }, [skillId])

  const fetchSkill = async () => {
    try {
      const response = await fetch(`/api/skills/${skillId}`)
      const data = await response.json()
      
      if (response.ok) {
        setSkill(data.skill)
      }
    } catch (error) {
      console.error('Failed to fetch skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !skill) return

    setIsBooking(true)
    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const startTime = setMinutes(setHours(selectedDate, hours), minutes)
      const endTime = addDays(startTime, 0) // Same day, add 1 hour
      const finalEndTime = addHours(endTime, 1)

      // Use user ID if authenticated, otherwise let API create demo user
      const userId = user?.id || undefined

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill_id: skill.id,
          learner_id: userId,
          scheduled_at: startTime.toISOString(),
          notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBookingSuccess(true)
        // Update user credits if authenticated
        if (user && data.updatedCredits !== undefined) {
          useAuthStore.getState().updateUser({
            credits: data.updatedCredits
          })
        }
      } else {
        alert(data.error || 'Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setIsBooking(false)
    }
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
        </div>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              <CardDescription>
                Your session has been successfully booked.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{skill.title}</h3>
                <p className="text-sm text-muted-foreground">
                  with {skill.owner.name || 'Instructor'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation email shortly with the session details.
              </p>
              <Button onClick={() => window.location.href = '/skills'}>
                Back to Skills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Details */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getCategoryColor(skill.category)}>
                    {skill.category.toLowerCase()}
                  </Badge>
                  {skill.owner.isIdVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">{skill.title}</CardTitle>
                <CardDescription className="text-base">
                  {skill.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Instructor Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {skill.owner.name || 'Anonymous'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Instructor
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{skill.avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({skill._count.reviews} review{skill._count.reviews !== 1 ? 's' : ''})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-medium">Session Price</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {skill.priceCredits}
                  </div>
                </div>

                {/* What to expect */}
                <div>
                  <h3 className="font-semibold mb-2">What to expect</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1-hour personalized session</li>
                    <li>• Hands-on learning experience</li>
                    <li>• Q&A and practice time</li>
                    <li>• Follow-up resources provided</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Book Your Session
                </CardTitle>
                <CardDescription>
                  Select a date and time that works for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Date
                  </label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0,0,0,0))}
                    className="rounded-md border"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Time
                  </label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Let the instructor know what you'd like to focus on..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Credit Check - only show if user is authenticated */}
                {user && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Your credits:</span>
                      <Badge variant="secondary">{user.credits}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm">Session cost:</span>
                      <Badge variant="outline">{skill.priceCredits}</Badge>
                    </div>
                    {user.credits < skill.priceCredits && (
                      <p className="text-sm text-red-600 mt-2">
                        Insufficient credits. Please add more credits to continue.
                      </p>
                    )}
                  </div>
                )}

                {/* Demo User Notice - show if not authenticated */}
                {!user && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Demo Mode:</strong> A demo account will be created automatically for this booking.
                    </p>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || !skill || (user && user.credits < skill.priceCredits) || isBooking}
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    `Book Session - ${skill.priceCredits} credits`
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Free cancellation up to 24 hours before the session
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to add hours to a date
function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}