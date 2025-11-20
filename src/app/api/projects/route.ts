import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  maxVolunteers: z.number().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const projects = await DatabaseService.getProjects()

    // Add currentVolunteers count and isFull status
    const projectsWithCounts = projects.map(project => ({
      ...project,
      current_volunteers: project.volunteers?.length || 0,
      is_full: (project.volunteers?.length || 0) >= project.max_volunteers,
    }))

    return NextResponse.json({ projects: projectsWithCounts })

  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, maxVolunteers } = createProjectSchema.parse(body)

    // Check if user exists, if not create them
    let user = await DatabaseService.getUserById("demo-user-id")
    if (!user) {
      console.log('User not found, creating user for project creation')
      try {
        user = await DatabaseService.createUser({
          id: "demo-user-id",
          email: "demo-user@example.com",
          name: "Demo User",
          credits: 100,
          karma: 50,
          isIdVerified: false
        })
        console.log('Created new user for project:', user)
      } catch (createError) {
        console.error('Failed to create user for project:', createError)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }
    }

    const project = await DatabaseService.createProject({
      creatorId: "demo-user-id",
      title,
      description,
      maxVolunteers,
    })

    return NextResponse.json({
      message: 'Project created successfully',
      project
    })

  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}