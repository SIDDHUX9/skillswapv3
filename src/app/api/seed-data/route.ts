import { NextResponse } from 'next/server'
import { PrismaDatabaseService } from '@/lib/prisma-db'

// GET /api/seed-data - Check if seed data exists
export async function GET() {
  try {
    const skills = await PrismaDatabaseService.getSkills({ limit: 1 })
    const hasData = skills.length > 0

    return NextResponse.json({
      hasData,
      message: hasData ? 'Seed data already exists' : 'No seed data found'
    })
  } catch (error) {
    console.error('Error checking seed data:', error)
    return NextResponse.json({
      hasData: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // First, create sample users
    const users = [
      {
        email: 'sarah@example.com',
        name: 'Sarah M.',
        credits: 100,
        karma: 50,
        isIdVerified: true
      },
      {
        email: 'john@example.com', 
        name: 'John D.',
        credits: 150,
        karma: 75,
        isIdVerified: true
      },
      {
        email: 'marie@example.com',
        name: 'Marie L.', 
        credits: 80,
        karma: 40,
        isIdVerified: true
      },
      {
        email: 'carlos@example.com',
        name: 'Carlos R.',
        credits: 120,
        karma: 60,
        isIdVerified: true
      }
    ]

    const createdUsers = []
    for (const user of users) {
      try {
        const existingUser = await PrismaDatabaseService.getUserByEmail(user.email)
        if (!existingUser) {
          const createdUser = await PrismaDatabaseService.createUser(user)
          createdUsers.push(createdUser)
        } else {
          createdUsers.push(existingUser)
        }
      } catch (error) {
        console.error('Error creating user:', error)
      }
    }

    // Create sample skills
    const skills = [
      {
        title: 'Guitar Lessons for Beginners',
        description: 'Learn guitar basics in a relaxed environment. Perfect for complete beginners who want to start their musical journey.',
        category: 'MUSIC',
        ownerId: createdUsers[0]?.id || 'demo-user-id',
        priceCredits: 30,
        lat: 40.7128,
        lng: -74.0060,
        avgRating: 4.8,
        isActive: true
      },
      {
        title: 'Web Development Mentorship',
        description: 'Full-stack development guidance from an experienced developer. Learn modern web technologies and best practices.',
        category: 'TECH',
        ownerId: createdUsers[1]?.id || 'demo-user-id',
        priceCredits: 50,
        lat: 40.7580,
        lng: -73.9855,
        avgRating: 4.9,
        isActive: true
      },
      {
        title: 'French Conversation Practice',
        description: 'Improve your French speaking skills with a native speaker. Casual conversation to build confidence and fluency.',
        category: 'LANGUAGE',
        ownerId: createdUsers[2]?.id || 'demo-user-id',
        priceCredits: 25,
        lat: 40.7489,
        lng: -73.9680,
        avgRating: 4.7,
        isActive: true
      },
      {
        title: 'Home Cooking Basics',
        description: 'Learn essential cooking techniques and recipes that will make you confident in the kitchen. From knife skills to meal planning.',
        category: 'COOKING',
        ownerId: createdUsers[3]?.id || 'demo-user-id',
        priceCredits: 35,
        lat: 40.7282,
        lng: -73.9942,
        avgRating: 4.9,
        isActive: true
      }
    ]

    const createdSkills = []
    for (const skill of skills) {
      try {
        const createdSkill = await PrismaDatabaseService.createSkill(skill)
        createdSkills.push(createdSkill)
      } catch (error) {
        console.error('Error creating skill:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully!',
      data: {
        users: createdUsers.length,
        skills: createdSkills.length
      }
    })

  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}