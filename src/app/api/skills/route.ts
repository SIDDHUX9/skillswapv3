import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { z } from 'zod'

const createSkillSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['ACADEMIC', 'ARTS', 'BUSINESS', 'COOKING', 'FITNESS', 'LANGUAGE', 'MUSIC', 'TECH', 'TRADES', 'OTHER']),
  priceCredits: z.number().min(0),
  lat: z.number(),
  lng: z.number(),
  ownerId: z.string(),
  // Optional fields that frontend sends but we don't store in DB
  duration: z.string().optional(),
  level: z.string().optional(),
  avatar: z.string().optional(),
})

// GET /api/skills - Get all skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius')
    const limit = searchParams.get('limit')

    const filters: any = {}
    
    if (category && category !== 'all') {
      filters.category = category.toUpperCase()
    }
    
    if (lat && lng) {
      filters.lat = parseFloat(lat)
      filters.lng = parseFloat(lng)
    }
    
    if (radius) {
      filters.radius = parseFloat(radius)
    }
    
    if (limit) {
      filters.limit = parseInt(limit)
    }

    const skills = await DatabaseService.getSkills(filters)
    
    return NextResponse.json({ skills })
  } catch (error) {
    console.error('Get skills error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/skills - Create a new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received skill creation request:', body)
    
    const skillData = createSkillSchema.parse(body)
    console.log('Parsed skill data:', skillData)

    // Check if user exists first, if not create them
    let user = await DatabaseService.getUserById(skillData.ownerId)
    if (!user) {
      console.log('User not found, creating user:', skillData.ownerId)
      // For demo purposes, create a basic user
      try {
        user = await DatabaseService.createUser({
          id: skillData.ownerId,
          email: `user-${skillData.ownerId}@example.com`,
          name: 'Demo User',
          credits: 100,
          karma: 50,
          isIdVerified: false
        })
        console.log('Created new user:', user)
      } catch (createError) {
        console.error('Failed to create user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }
    }

    // Only send the fields that exist in the database schema
    const dbSkillData = {
      title: skillData.title,
      description: skillData.description,
      category: skillData.category,
      priceCredits: skillData.priceCredits,
      lat: skillData.lat,
      lng: skillData.lng,
      ownerId: skillData.ownerId
    }

    const skill = await DatabaseService.createSkill(dbSkillData)
    console.log('Created skill:', skill)
    
    return NextResponse.json({
      message: 'Skill created successfully',
      skill
    })
  } catch (error) {
    console.error('Create skill error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}