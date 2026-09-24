import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TaskStatus, TaskPriority } from '@prisma/client'

// GET /api/tasks - Lấy danh sách nhiệm vụ, hỗ trợ filter status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const priorityParam = searchParams.get('priority')

    const whereClause: {
      status?: TaskStatus
      priority?: TaskPriority
    } = {}

    if (statusParam && statusParam !== 'ALL' && Object.values(TaskStatus).includes(statusParam as TaskStatus)) {
      whereClause.status = statusParam as TaskStatus
    }

    if (priorityParam && priorityParam !== 'ALL' && Object.values(TaskPriority).includes(priorityParam as TaskPriority)) {
      whereClause.priority = priorityParam as TaskPriority
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/tasks - Tạo mới một nhiệm vụ
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, priority, dueDate } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate enum nếu có
    const taskStatus = status && Object.values(TaskStatus).includes(status) ? status : TaskStatus.TODO
    const taskPriority = priority && Object.values(TaskPriority).includes(priority) ? priority : TaskPriority.MEDIUM

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: taskStatus,
        priority: taskPriority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
