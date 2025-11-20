'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Star, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  ThumbsUp,
  Clock,
  CheckCircle,
  Target,
  Zap,
  Crown,
  Gem,
  Shield
} from 'lucide-react'

interface ReputationSystemProps {
  userId: string
  userReputation?: any
  testimonials?: any[]
  endorsements?: any[]
  isOwnProfile?: boolean
  onEndorseSkill?: (skillId: string, comment: string) => void
  onLeaveTestimonial?: (content: string, rating: number) => void
}

export function ReputationSystem({ 
  userId, 
  userReputation, 
  testimonials = [], 
  endorsements = [],
  isOwnProfile = false,
  onEndorseSkill,
  onLeaveTestimonial
}: ReputationSystemProps) {
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false)
  const [endorsementDialogOpen, setEndorsementDialogOpen] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({ content: '', rating: 5 })
  const [newEndorsement, setNewEndorsement] = useState({ skillId: '', comment: '' })

  const reputation = userReputation || {
    overallRating: 4.5,
    totalReviews: 23,
    reliabilityScore: 4.7,
    skillScore: 4.3,
    communicationScore: 4.8,
    responseRate: 95,
    responseTime: 30,
    level: 'ADVANCED' as const,
    badges: ['Quick Responder', 'Highly Rated', 'Reliable']
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'BEGINNER': return <Target className="h-6 w-6" />
      case 'INTERMEDIATE': return <Zap className="h-6 w-6" />
      case 'ADVANCED': return <Award className="h-6 w-6" />
      case 'EXPERT': return <Gem className="h-6 w-6" />
      case 'MASTER': return <Crown className="h-6 w-6" />
      default: return <Shield className="h-6 w-6" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'text-gray-500'
      case 'INTERMEDIATE': return 'text-blue-500'
      case 'ADVANCED': return 'text-purple-500'
      case 'EXPERT': return 'text-orange-500'
      case 'MASTER': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Quick Responder': return <Clock className="h-4 w-4" />
      case 'Highly Rated': return <Star className="h-4 w-4" />
      case 'Reliable': return <CheckCircle className="h-4 w-4" />
      case 'Top Contributor': return <TrendingUp className="h-4 w-4" />
      case 'Verified': return <Shield className="h-4 w-4" />
      default: return <Award className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number, size = 'sm') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} fill-current text-yellow-400`} />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} fill-current text-yellow-400 opacity-50`} />)
      } else {
        stars.push(<Star key={i} className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} text-gray-300`} />)
      }
    }
    
    return stars
  }

  const handleTestimonialSubmit = () => {
    if (newTestimonial.content.trim() && onLeaveTestimonial) {
      onLeaveTestimonial(newTestimonial.content, newTestimonial.rating)
      setNewTestimonial({ content: '', rating: 5 })
      setTestimonialDialogOpen(false)
    }
  }

  const handleEndorsementSubmit = () => {
    if (newEndorsement.skillId && onEndorseSkill) {
      onEndorseSkill(newEndorsement.skillId, newEndorsement.comment)
      setNewEndorsement({ skillId: '', comment: '' })
      setEndorsementDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Reputation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${getLevelColor(reputation.level)}`}>
              {getLevelIcon(reputation.level)}
              <span className="text-lg font-bold">{reputation.level}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(reputation.overallRating)}
              <span className="text-lg font-semibold ml-2">{reputation.overallRating}</span>
              <span className="text-sm text-muted-foreground">({reputation.totalReviews} reviews)</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Reliability Score */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Reliability</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{reputation.reliabilityScore}</div>
              <Progress value={reputation.reliabilityScore * 20} className="mt-2" />
            </div>

            {/* Skill Score */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Skills</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{reputation.skillScore}</div>
              <Progress value={reputation.skillScore * 20} className="mt-2" />
            </div>

            {/* Communication Score */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium">Communication</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{reputation.communicationScore}</div>
              <Progress value={reputation.communicationScore * 20} className="mt-2" />
            </div>

            {/* Response Rate */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium">Response Rate</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{reputation.responseRate}%</div>
              <div className="text-xs text-muted-foreground">
                ~{reputation.responseTime}min response time
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {reputation.badges.map((badge: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {getBadgeIcon(badge)}
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reputation Tabs */}
      <Tabs defaultValue="testimonials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="endorsements">Skill Endorsements</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Client Testimonials</h3>
            {!isOwnProfile && (
              <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Leave Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Leave a Testimonial</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Rating</label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewTestimonial(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <Star 
                              className={`h-6 w-6 ${
                                star <= newTestimonial.rating 
                                  ? 'fill-current text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Your Testimonial</label>
                      <Textarea
                        value={newTestimonial.content}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Share your experience working with this person..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleTestimonialSubmit}>
                        Submit Testimonial
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No testimonials yet</p>
                </CardContent>
              </Card>
            ) : (
              testimonials.map((testimonial: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.giverAvatar} />
                        <AvatarFallback>
                          {testimonial.giverName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">{testimonial.giverName}</p>
                            <div className="flex items-center gap-1">
                              {renderStars(testimonial.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(testimonial.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{testimonial.content}</p>
                        {testimonial.isVerified && (
                          <Badge variant="secondary" className="mt-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="endorsements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Skill Endorsements</h3>
            {!isOwnProfile && (
              <Dialog open={endorsementDialogOpen} onOpenChange={setEndorsementDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Endorse Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Endorse a Skill</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Skill</label>
                      <select 
                        value={newEndorsement.skillId}
                        onChange={(e) => setNewEndorsement(prev => ({ ...prev, skillId: e.target.value }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="">Choose a skill...</option>
                        {/* This would be populated with user's skills */}
                        <option value="skill1">Web Development</option>
                        <option value="skill2">Graphic Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Comment (Optional)</label>
                      <Textarea
                        value={newEndorsement.comment}
                        onChange={(e) => setNewEndorsement(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Add a comment about this skill..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEndorsementDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEndorsementSubmit}>
                        Endorse Skill
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {endorsements.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <ThumbsUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No skill endorsements yet</p>
                </CardContent>
              </Card>
            ) : (
              endorsements.map((endorsement: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={endorsement.endorserAvatar} />
                          <AvatarFallback>
                            {endorsement.endorserName?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{endorsement.endorserName}</p>
                          <p className="text-sm text-muted-foreground">
                            endorsed {endorsement.skillTitle}
                          </p>
                          {endorsement.comment && (
                            <p className="text-sm mt-1">"{endorsement.comment}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">Endorsed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}