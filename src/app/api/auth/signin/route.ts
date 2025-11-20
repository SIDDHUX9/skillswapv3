import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = signinSchema.parse(body)

    // Find user
    const user = await DatabaseService.getUserByEmail(email)

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        karma: user.karma,
        isIdVerified: user.isIdVerified,
        createdAt: user.createdAt,
      }
    })

  } catch (error) {
    console.error('Signin error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}