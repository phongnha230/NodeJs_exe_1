import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TaskStatus, TaskPriority } from '@prisma/client'

// PUT /api/tasks/:id – Update a task (Members can update task status, priority, and details)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: taskId } = await params
    const body = await request.json()
    const { title, description, status, priority, dueDate, assigneeId } = body

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        team: true,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Nếu task thuộc về một team, kiểm tra user có phải là thành viên của team đó không
    if (existingTask.teamId) {
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: existingTask.teamId,
            userId: user.id,
          },
        },
      })
      if (!membership) {
        return NextResponse.json({ error: 'Forbidden. You are not a member of this team.' }, { status: 403 })
      }

      // Nếu cập nhật assigneeId mới, kiểm tra assignee có thuộc team không
      if (assigneeId) {
        const assigneeMembership = await prisma.teamMember.findUnique({
          where: {
            teamId_userId: {
              teamId: existingTask.teamId,
              userId: assigneeId,
            },
          },
        })
        if (!assigneeMembership) {
          return NextResponse.json({ error: 'New assignee must be a member of this team.' }, { status: 400 })
        }
      }
    }

    const updateData: {
      title?: string
      description?: string | null
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: Date | null
      assigneeId?: string | null
    } = {}

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
      }
      updateData.title = title.trim()
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null
    }

    if (status !== undefined && Object.values(TaskStatus).includes(status)) {
      updateData.status = status
    }

    if (priority !== undefined && Object.values(TaskPriority).includes(priority)) {
      updateData.priority = priority
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null
    }

    if (assigneeId !== undefined) {
      updateData.assigneeId = assigneeId || null
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error: unknown) {
    console.error('PUT /api/tasks/:id Error:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks/:id – Delete a task
// Rule: Only the task creator, the assignee, or the team Owner can delete a task.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: taskId } = await params

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Kiểm tra quyền xóa:
    // 1. Is Task Creator?
    const isCreator = existingTask.creatorId === user.id
    // 2. Is Task Assignee?
    const isAssignee = existingTask.assigneeId === user.id
    // 3. Is Team Owner?
    const isTeamOwner = existingTask.team?.ownerId === user.id

    if (!isCreator && !isAssignee && !isTeamOwner) {
      return NextResponse.json(
        { error: 'Forbidden. Only the task creator, assignee, or team owner can delete this task.' },
        { status: 403 }
      )
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    return NextResponse.json({ success: true, message: 'Task deleted successfully' })
  } catch (error: unknown) {
    console.error('DELETE /api/tasks/:id Error:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
