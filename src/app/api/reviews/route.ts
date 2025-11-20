import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { z } from 'zod'

const createReviewSchema = z.object({
  skill_id: z.string().uuid(),
  booking_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skill_id, booking_id, rating, comment } = createReviewSchema.parse(body)

    // For demo purposes, we'll use a hardcoded user ID
    // In a real app, you'd get this from the authenticated session
    const reviewer_id = "demo-user-id"

    // Create review
    const review = await DatabaseService.createReview({
      skill_id,
      reviewer_id,
      booking_id,
      rating,
      comment,
    })

    return NextResponse.json({
      message: 'Review created successfully',
      review
    })

  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get('skillId')

    if (!skillId) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      )
    }

    const reviews = await DatabaseService.getSkillReviews(skillId)

    return NextResponse.json({ reviews })

  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}