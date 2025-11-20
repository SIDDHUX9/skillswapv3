import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { z } from 'zod'

const donateCreditsSchema = z.object({
  amount: z.number().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's credit balance
    const user = await DatabaseService.getUserById(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get recent credit transactions
    const transactions = await DatabaseService.getUserCreditTransactions(userId)

    return NextResponse.json({
      balance: user.credits,
      transactions
    })

  } catch (error) {
    console.error('Get credits error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount } = donateCreditsSchema.parse(body)

    // For demo purposes, we'll use a hardcoded user ID
    // In a real app, you'd get this from the authenticated session
    const userId = "demo-user-id"

    // Get user's current credit balance
    const user = await DatabaseService.getUserById(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.credits < amount) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    // Deduct credits from user
    await DatabaseService.updateUser(userId, {
      credits: user.credits - amount
    })

    // Create credit transaction
    await DatabaseService.createCreditTransaction({
      userId: userId,
      amount: -amount,
      type: 'DONATED',
      message: `Donated ${amount} credits to community pool`,
    })

    return NextResponse.json({
      message: 'Credits donated successfully',
      newBalance: user.credits - amount
    })

  } catch (error) {
    console.error('Donate credits error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}