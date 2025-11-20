import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { z } from 'zod'

const createBookingSchema = z.object({
  skill_id: z.string(),
  learner_id: z.string().optional(),
  scheduled_at: z.string().datetime(),
  notes: z.string().optional(),
})

const updateBookingSchema = z.object({
  status: z.enum(['BOOKED', 'COMPLETED', 'CANCELLED']),
})

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || searchParams.get('learnerId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // For demo purposes, ensure demo user exists
    if (userId === 'demo-user-id') {
      const existingUser = await DatabaseService.getUserById(userId)
      if (!existingUser) {
        await DatabaseService.createUser({
          id: userId,
          email: 'demo@example.com',
          name: 'Demo User',
          credits: 100,
          karma: 50,
          isIdVerified: false
        })
      }
    }

    const bookings = await DatabaseService.getUserBookings(userId)
    
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skill_id, learner_id, scheduled_at, notes } = createBookingSchema.parse(body)

    // Use provided learner_id or fallback to demo user ID
    const final_learner_id = learner_id || "demo-learner-1"

    // Get skill details to check availability and pricing
    let skill
    try {
      skill = await DatabaseService.getSkillById(skill_id)
    } catch (error) {
      // Handle demo skills
      const demoSkillsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/skills/${skill_id}`)
      const skillData = await demoSkillsResponse.json()
      skill = skillData.skill
    }
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      )
    }

    // For demo, create or get the user
    let user = await DatabaseService.getUserById(final_learner_id)
    if (!user) {
      // Create demo user if doesn't exist
      user = await DatabaseService.createUser({
        id: final_learner_id,
        email: `user-${final_learner_id}@example.com`,
        password: 'password123',
        name: 'Demo User',
        credits: 100, // Give demo user enough credits
        karma: 50,
        isIdVerified: false
      })
    }

    // Check if user has enough credits
    if (user.credits < skill.priceCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await DatabaseService.createBooking({
      skillId: skill_id,
      learnerId: final_learner_id,
      startTime: new Date(scheduled_at),
      endTime: new Date(new Date(scheduled_at).getTime() + 60 * 60 * 1000), // +1 hour
      status: 'BOOKED',
    })

    // Deduct credits from learner
    await DatabaseService.updateUser(final_learner_id, {
      credits: user.credits - skill.priceCredits
    })

    // Create credit transaction
    await DatabaseService.createCreditTransaction({
      userId: final_learner_id,
      amount: -skill.priceCredits,
      type: 'SPENT',
      refId: booking.id,
      message: `Booked skill: ${skill.title}`,
    })

    return NextResponse.json({
      message: 'Booking created successfully',
      booking,
      updatedCredits: user.credits - skill.priceCredits
    })

  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings - Update booking status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = updateBookingSchema.parse(body)

    const booking = await DatabaseService.updateBooking(bookingId, { status })

    // If booking is completed, add credits to instructor
    if (status === 'COMPLETED') {
      // Get booking details to find instructor and skill
      // This would need to be implemented in DatabaseService
      // For now, we'll skip the credit addition
    }

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking
    })

  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}