import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function POST() {
  try {
    // Create or get demo instructor
    let instructor = await DatabaseService.getUserByEmail('sarah@example.com')
    if (!instructor) {
      instructor = await DatabaseService.createUser({
        id: 'demo-instructor-1',
        email: 'sarah@example.com',
        password: 'password123', // Required field
        name: 'Sarah Mitchell',
        credits: 200,
        karma: 85,
        isIdVerified: true
      })
    }

    // Create demo skills
    const skills = [
      {
        ownerId: instructor.id,
        title: 'Guitar Lessons for Beginners',
        description: 'Learn guitar basics in a relaxed environment. Perfect for complete beginners who want to start their musical journey.',
        category: 'MUSIC',
        priceCredits: 30,
        lat: 40.7128,
        lng: -74.0060,
        avgRating: 4.8,
        isActive: true
      },
      {
        ownerId: instructor.id,
        title: 'Web Development Mentorship',
        description: 'Full-stack development guidance from an experienced developer. Learn modern web technologies and best practices.',
        category: 'TECH',
        priceCredits: 50,
        lat: 40.7260,
        lng: -73.9897,
        avgRating: 4.9,
        isActive: true
      },
      {
        ownerId: instructor.id,
        title: 'French Conversation Practice',
        description: 'Improve your French speaking skills with a native speaker. All levels welcome from beginner to advanced.',
        category: 'LANGUAGE',
        priceCredits: 25,
        lat: 40.7489,
        lng: -73.9680,
        avgRating: 4.7,
        isActive: true
      },
      {
        ownerId: instructor.id,
        title: 'Home Cooking Basics',
        description: 'Learn essential cooking techniques and recipes that will make you confident in the kitchen.',
        category: 'COOKING',
        priceCredits: 35,
        lat: 40.7282,
        lng: -74.0776,
        avgRating: 4.9,
        isActive: true
      }
    ]

    const createdSkills = []
    for (const skillData of skills) {
      try {
        const skill = await DatabaseService.createSkill(skillData)
        createdSkills.push(skill)
      } catch (error) {
        console.log('Skill might already exist:', error.message)
      }
    }

    // Create or get demo learner
    let learner = await DatabaseService.getUserByEmail('learner@example.com')
    if (!learner) {
      learner = await DatabaseService.createUser({
        id: 'demo-learner-1',
        email: 'learner@example.com',
        password: 'password123', // Required field
        name: 'Alex Johnson',
        credits: 100,
        karma: 50,
        isIdVerified: false
      })
    }

    return NextResponse.json({
      message: 'Demo data created successfully',
      instructor,
      learner,
      skills: createdSkills
    })

  } catch (error) {
    console.error('Seed demo error:', error)
    return NextResponse.json(
      { error: 'Failed to seed demo data', details: error.message },
      { status: 500 }
    )
  }
}