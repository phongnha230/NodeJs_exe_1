import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TaskStatus, TaskPriority } from '@prisma/client'

// PUT /api/tasks/[id] - Cập nhật một nhiệm vụ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, status, priority, dueDate } = body

    const updateData: {
      title?: string
      description?: string | null
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: Date | null
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

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Xóa một nhiệm vụ
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
