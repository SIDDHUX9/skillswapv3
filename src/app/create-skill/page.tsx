'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, MapPin, Clock, Users, DollarSign } from 'lucide-react'
import { DatabaseService } from '@/lib/db'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = [
  { value: 'ACADEMIC', label: 'Academic', icon: '🎓' },
  { value: 'ARTS', label: 'Arts', icon: '🎨' },
  { value: 'BUSINESS', label: 'Business', icon: '💼' },
  { value: 'COOKING', label: 'Cooking', icon: '👨‍🍳' },
  { value: 'FITNESS', label: 'Fitness', icon: '💪' },
  { value: 'LANGUAGE', label: 'Language', icon: '🗣️' },
  { value: 'MUSIC', label: 'Music', icon: '🎵' },
  { value: 'TECH', label: 'Tech', icon: '💻' },
  { value: 'TRADES', label: 'Trades', icon: '🔧' },
  { value: 'OTHER', label: 'Other', icon: '📚' }
]

const levels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'All Levels', label: 'All Levels' }
]

const durations = [
  { value: '30 minutes', label: '30 minutes' },
  { value: '1 hour', label: '1 hour' },
  { value: '1.5 hours', label: '1.5 hours' },
  { value: '2 hours', label: '2 hours' },
  { value: '3 hours', label: '3 hours' }
]

const avatarOptions = ['🎓', '🎨', '💼', '👨‍🍳', '💪', '🗣️', '🎵', '💻', '🔧', '📚', '🎯', '🚀', '🌟', '💡', '🎪']

export default function CreateSkillPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_credits: 10,
    duration: '1 hour',
    level: 'Beginner',
    avatar: '🎓',
    lat: 40.7128, // Default NYC coordinates
    lng: -74.0060
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to create a skill listing
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.title || !formData.description || !formData.category) {
        setError('Please fill in all required fields')
        return
      }

      const skillData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priceCredits: formData.price_credits,
        duration: formData.duration,
        level: formData.level,
        avatar: formData.avatar,
        lat: formData.lat,
        lng: formData.lng,
        ownerId: user!.id
      }

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/skills?created=true')
      } else {
        setError(data.error || 'Failed to create skill. Please try again.')
      }
    } catch (error) {
      console.error('Failed to create skill:', error)
      setError('Failed to create skill. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationChange = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Could not get your location. Using default coordinates.')
        }
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/skills" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Skills
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Create New Skill</h1>
            <p className="text-muted-foreground">
              Share your expertise and earn credits by teaching others
            </p>
          </motion.div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Tell us about the skill you want to teach
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Skill Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Learn Guitar Basics"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what students will learn, your teaching style, and any requirements..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              <span className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                {category.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="level">Skill Level</Label>
                      <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                  <CardDescription>
                    Set up your session parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durations.map(duration => (
                            <SelectItem key={duration.value} value={duration.value}>
                              {duration.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="price">Price (Credits)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="price"
                          type="number"
                          min="1"
                          max="200"
                          value={formData.price_credits}
                          onChange={(e) => setFormData(prev => ({ ...prev, price_credits: parseInt(e.target.value) || 0 }))}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Typical range: 10-100 credits
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Current location (NYC area)</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLocationChange}
                      >
                        Use My Location
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avatar Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Avatar</CardTitle>
                  <CardDescription>
                    Select an avatar to represent your skill
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                        className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                          formData.avatar === avatar
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{formData.avatar}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {formData.title || 'Skill Title'}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {formData.category || 'Category'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {formData.description || 'Skill description will appear here...'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formData.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{formData.level}</span>
                        </div>
                      </div>
                      <div className="font-bold text-primary">
                        {formData.price_credits} credits
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Success</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Be specific about what students will learn</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Set competitive pricing based on your expertise</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Include any materials or requirements</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Choose an avatar that represents your skill</p>
                  </div>
                </CardContent>
              </Card>

              {/* User Credits */}
              {user && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Your Available Credits</p>
                      <p className="text-2xl font-bold text-primary">{user.credits}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <Link href="/skills">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-primary/80">
              {loading ? 'Creating...' : 'Create Skill'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}