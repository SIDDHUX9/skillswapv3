import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah@example.com',
        name: 'Sarah Mitchell',
        credits: 150,
        karma: 85,
        isIdVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Davis',
        credits: 200,
        karma: 92,
        isIdVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'marie@example.com',
        name: 'Marie Laurent',
        credits: 120,
        karma: 78,
        isIdVerified: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos@example.com',
        name: 'Carlos Rodriguez',
        credits: 180,
        karma: 88,
        isIdVerified: true,
      },
    }),
  ])

  // Create sample skills
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        ownerId: users[0].id,
        title: 'Guitar Lessons for Beginners',
        description: 'Learn the basics of guitar playing in a relaxed, friendly environment. Perfect for complete beginners who want to start their musical journey.',
        category: 'MUSIC',
        priceCredits: 30,
        lat: 37.7749,
        lng: -122.4194,
        avgRating: 4.8,
      },
    }),
    prisma.skill.create({
      data: {
        ownerId: users[1].id,
        title: 'Web Development Mentorship',
        description: 'One-on-one mentorship for aspiring web developers. Learn React, Node.js, and modern web development practices from an experienced developer.',
        category: 'TECH',
        priceCredits: 50,
        lat: 37.7849,
        lng: -122.4094,
        avgRating: 4.9,
      },
    }),
    prisma.skill.create({
      data: {
        ownerId: users[2].id,
        title: 'French Conversation Practice',
        description: 'Improve your French speaking skills with a native speaker. Casual conversation sessions to help you become more fluent and confident.',
        category: 'LANGUAGE',
        priceCredits: 25,
        lat: 37.7649,
        lng: -122.4294,
        avgRating: 4.7,
      },
    }),
    prisma.skill.create({
      data: {
        ownerId: users[3].id,
        title: 'Home Cooking Basics',
        description: 'Learn essential cooking skills and delicious recipes for everyday meals. From knife skills to meal planning, become a confident home cook.',
        category: 'COOKING',
        priceCredits: 35,
        lat: 37.7549,
        lng: -122.4394,
        avgRating: 4.9,
      },
    }),
    prisma.skill.create({
      data: {
        ownerId: users[0].id,
        title: 'Yoga for Stress Relief',
        description: 'Gentle yoga sessions focused on reducing stress and improving flexibility. Perfect for beginners and those looking to unwind after a long day.',
        category: 'FITNESS',
        priceCredits: 20,
        lat: 37.7449,
        lng: -122.4494,
        avgRating: 4.6,
      },
    }),
    prisma.skill.create({
      data: {
        ownerId: users[1].id,
        title: 'Photography Fundamentals',
        description: 'Master the basics of photography, from composition to lighting. Bring your camera and learn to capture stunning images.',
        category: 'ARTS',
        priceCredits: 40,
        lat: 37.7349,
        lng: -122.4594,
        avgRating: 4.8,
      },
    }),
  ])

  // Create sample bookings first
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        skillId: skills[0].id,
        learnerId: users[1].id,
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
        status: 'COMPLETED',
      },
    }),
    prisma.booking.create({
      data: {
        skillId: skills[1].id,
        learnerId: users[2].id,
        startTime: new Date('2024-01-16T14:00:00Z'),
        endTime: new Date('2024-01-16T16:00:00Z'),
        status: 'COMPLETED',
      },
    }),
    prisma.booking.create({
      data: {
        skillId: skills[2].id,
        learnerId: users[3].id,
        startTime: new Date('2024-01-17T16:00:00Z'),
        endTime: new Date('2024-01-17T17:00:00Z'),
        status: 'COMPLETED',
      },
    }),
  ])

  // Create sample reviews
  await Promise.all([
    prisma.review.create({
      data: {
        skillId: skills[0].id,
        reviewerId: users[1].id,
        bookingId: bookings[0].id,
        stars: 5,
        comment: 'Sarah is an amazing guitar teacher! Very patient and knowledgeable.',
      },
    }),
    prisma.review.create({
      data: {
        skillId: skills[1].id,
        reviewerId: users[2].id,
        bookingId: bookings[1].id,
        stars: 5,
        comment: 'John helped me land my first developer job. Highly recommend!',
      },
    }),
    prisma.review.create({
      data: {
        skillId: skills[2].id,
        reviewerId: users[3].id,
        bookingId: bookings[2].id,
        stars: 4,
        comment: 'Great conversation practice. Marie is very friendly and helpful.',
      },
    }),
  ])

  // Create sample community projects
  await Promise.all([
    prisma.communityProject.create({
      data: {
        creatorId: users[0].id,
        title: 'Community Garden',
        description: 'Help us build a sustainable garden for the neighborhood. We need volunteers for planting, watering, and maintenance.',
        maxVolunteers: 10,
        currentVolunteers: 8,
      },
    }),
    prisma.communityProject.create({
      data: {
        creatorId: users[1].id,
        title: 'Kids Coding Club',
        description: 'Teach basic programming to local children aged 8-12. No prior teaching experience required, just enthusiasm for coding!',
        maxVolunteers: 5,
        currentVolunteers: 5,
      },
    }),
    prisma.communityProject.create({
      data: {
        creatorId: users[2].id,
        title: 'Fix-a-thon',
        description: 'Help neighbors with household repairs and maintenance. Skilled and unskilled volunteers welcome - we need all hands!',
        maxVolunteers: 15,
        currentVolunteers: 12,
      },
    }),
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })