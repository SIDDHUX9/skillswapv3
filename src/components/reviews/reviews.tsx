'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Star, MessageSquare, ThumbsUp } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'

interface Review {
  id: string
  stars: number
  comment?: string
  createdAt: string
  reviewer: {
    id: string
    name?: string
    avatarUrl?: string
  }
  skill: {
    id: string
    title: string
  }
}

interface ReviewsProps {
  skillId: string
  bookingId?: string
  canReview?: boolean
}

export function Reviews({ skillId, bookingId, canReview = false }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    fetchReviews()
  }, [skillId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?skillId=${skillId}`)
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !bookingId) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId,
          bookingId,
          stars: rating,
          comment,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowReviewDialog(false)
        setComment('')
        setRating(5)
        fetchReviews()
        
        // Update user credits
        if (user) {
          useAuthStore.getState().updateUser({
            credits: user.credits + 10
          })
        }
      } else {
        alert(data.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Review submission error:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reviews ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              {renderStars(
                Math.round(reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length)
              )}
              <span className="text-sm text-muted-foreground">
                {Math.round(reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length * 10) / 10} average
              </span>
            </div>
          )}
        </div>
        
        {canReview && isAuthenticated && (
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
              <Button>Leave a Review</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
                <DialogDescription>
                  Your feedback helps others make informed decisions and supports the instructor.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rating
                  </label>
                  {renderStars(rating, true, setRating)}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Review (Optional)
                  </label>
                  <Textarea
                    placeholder="Share your experience with this session..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    You'll earn 10 credits for leaving a review!
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold mb-2">No reviews yet</h4>
            <p className="text-muted-foreground">
              Be the first to share your experience with this skill!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {review.reviewer.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {review.reviewer.name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.stars)}
                </div>
                
                {review.comment && (
                  <p className="text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}