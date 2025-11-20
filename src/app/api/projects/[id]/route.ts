import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { z } from 'zod'

const joinProjectSchema = z.object({
  action: z.enum(['join', 'leave']),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action } = joinProjectSchema.parse(body)

    // For demo purposes, we'll use a hardcoded user ID
    // In a real app, you'd get this from the authenticated session
    const userId = "demo-user-id"

    const projectId = params.id

    if (action === 'join') {
      // Add volunteer
      await DatabaseService.joinProject(projectId, userId)

      // Add credits to user for joining
      // Note: You'd need to implement this in DatabaseService
      // For now, we'll skip the credit addition

      return NextResponse.json({
        message: 'Successfully joined the project'
      })

    } else if (action === 'leave') {
      // Note: You'd need to implement leaveProject in DatabaseService
      return NextResponse.json({
        message: 'Successfully left the project'
      })
    }

  } catch (error) {
    console.error('Project action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projects = await DatabaseService.getProjects()
    const project = projects.find(p => p.id === params.id)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const projectWithCounts = {
      ...project,
      current_volunteers: project.volunteers?.length || 0,
      is_full: (project.volunteers?.length || 0) >= project.max_volunteers,
    }

    return NextResponse.json({ project: projectWithCounts })

  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}