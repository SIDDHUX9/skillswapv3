import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

// Demo skills fallback
const demoSkills = {
  'demo-skill-1': {
    id: 'demo-skill-1',
    title: 'Guitar Lessons for Beginners',
    description: 'Learn guitar basics in a relaxed environment. Perfect for complete beginners who want to start their musical journey.',
    category: 'MUSIC',
    priceCredits: 30,
    avgRating: 4.8,
    owner: {
      id: 'demo-instructor-1',
      name: 'Sarah Mitchell',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      karma: 85,
      isIdVerified: true
    },
    _count: {
      reviews: 12
    }
  },
  'demo-skill-2': {
    id: 'demo-skill-2',
    title: 'Web Development Mentorship',
    description: 'Full-stack development guidance from an experienced developer. Learn modern web technologies and best practices.',
    category: 'TECH',
    priceCredits: 50,
    avgRating: 4.9,
    owner: {
      id: 'demo-instructor-1',
      name: 'Sarah Mitchell',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      karma: 85,
      isIdVerified: true
    },
    _count: {
      reviews: 23
    }
  },
  'demo-skill-3': {
    id: 'demo-skill-3',
    title: 'French Conversation Practice',
    description: 'Improve your French speaking skills with a native speaker. All levels welcome from beginner to advanced.',
    category: 'LANGUAGE',
    priceCredits: 25,
    avgRating: 4.7,
    owner: {
      id: 'demo-instructor-1',
      name: 'Sarah Mitchell',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      karma: 85,
      isIdVerified: true
    },
    _count: {
      reviews: 8
    }
  },
  'demo-skill-4': {
    id: 'demo-skill-4',
    title: 'Home Cooking Basics',
    description: 'Learn essential cooking techniques and recipes that will make you confident in the kitchen.',
    category: 'COOKING',
    priceCredits: 35,
    avgRating: 4.9,
    owner: {
      id: 'demo-instructor-1',
      name: 'Sarah Mitchell',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      karma: 85,
      isIdVerified: true
    },
    _count: {
      reviews: 15
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Try to get from database first
    try {
      const skill = await DatabaseService.getSkillById(id)
      if (skill) {
        return NextResponse.json({ skill })
      }
    } catch (dbError) {
      console.log('Database error, using demo data:', dbError.message)
    }
    
    // Fallback to demo data
    const demoSkill = demoSkills[id as keyof typeof demoSkills]
    if (demoSkill) {
      return NextResponse.json({ skill: demoSkill })
    }
    
    return NextResponse.json(
      { error: 'Skill not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Skill fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    )
  }
}