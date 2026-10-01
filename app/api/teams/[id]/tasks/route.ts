import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TaskPriority, TaskStatus } from '@prisma/client'

// GET /api/teams/:id/tasks – List tasks for a team
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: teamId } = await params

    // Kiểm tra user có thuộc team không
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden. You are not a member of this team.' }, { status: 403 })
    }

    const tasks = await prisma.task.findMany({
      where: { teamId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error: unknown) {
    console.error('GET /api/teams/:id/tasks Error:', error)
    return NextResponse.json({ error: 'Failed to fetch team tasks' }, { status: 500 })
  }
}

// POST /api/teams/:id/tasks – Create a new task within a team
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: teamId } = await params
    const body = await request.json()
    const { title, description, status, priority, dueDate, assigneeId } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 })
    }

    // 1. Kiểm tra user có thuộc team không
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden. You must be a member of this team to create tasks.' }, { status: 403 })
    }

    // 2. Nếu có chỉ định assigneeId, kiểm tra assignee có thuộc team không
    if (assigneeId) {
      const assigneeMembership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: assigneeId,
          },
        },
      })
      if (!assigneeMembership) {
        return NextResponse.json({ error: 'Assignee must be a member of this team.' }, { status: 400 })
      }
    }

    const taskStatus = status && Object.values(TaskStatus).includes(status) ? status : TaskStatus.TODO
    const taskPriority = priority && Object.values(TaskPriority).includes(priority) ? priority : TaskPriority.MEDIUM

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: taskStatus,
        priority: taskPriority,
        dueDate: dueDate ? new Date(dueDate) : null,
        teamId,
        assigneeId: assigneeId || null,
        creatorId: user.id,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(newTask, { status: 201 })
  } catch (error: unknown) {
    console.error('POST /api/teams/:id/tasks Error:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
