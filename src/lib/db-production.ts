// Production database setup for Vercel
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Initialize database with demo data if needed
export async function initDatabase() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if we have any skills, if not add demo data
    const skillsCount = await prisma.skill.count()
    if (skillsCount === 0) {
      console.log('🌱 Seeding database with demo data...')
      await seedDemoData()
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

async function seedDemoData() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User',
      credits: 1000,
    }
  })

  // Create demo skills
  const demoSkills = [
    {
      id: 'demo-skill-1',
      ownerId: demoUser.id,
      title: 'Web Development',
      description: 'Learn modern web development with React, Next.js, and TypeScript',
      category: 'TECH' as const,
      priceCredits: 50,
      lat: 40.7128,
      lng: -74.0060,
    },
    {
      id: 'demo-skill-2',
      ownerId: demoUser.id,
      title: 'UI/UX Design',
      description: 'Master the principles of user interface and user experience design',
      category: 'ARTS' as const,
      priceCredits: 40,
      lat: 40.7580,
      lng: -73.9855,
    },
    {
      id: 'demo-skill-3',
      ownerId: demoUser.id,
      title: 'Photography Basics',
      description: 'Learn composition, lighting, and editing for stunning photos',
      category: 'ARTS' as const,
      priceCredits: 35,
      lat: 40.7489,
      lng: -73.9680,
    },
    {
      id: 'demo-skill-4',
      ownerId: demoUser.id,
      title: 'Business Strategy',
      description: 'Develop strategic thinking and business planning skills',
      category: 'BUSINESS' as const,
      priceCredits: 60,
      lat: 40.7614,
      lng: -73.9776,
    }
  ]

  for (const skill of demoSkills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: skill
    })
  }

  console.log('✅ Demo data seeded successfully')
}