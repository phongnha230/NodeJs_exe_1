import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/teams/:id/chat – Lấy lịch sử tin nhắn của team
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

    // Kiểm tra người dùng có phải là thành viên của team không
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden. You are not a member of this team.' },
        { status: 403 }
      )
    }

    // Lấy 50 tin nhắn gần nhất
    const messages = await prisma.chatMessage.findMany({
      where: { teamId },
      orderBy: { createdAt: 'asc' },
      take: 100,
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('GET /api/teams/:id/chat Error:', error)
    return NextResponse.json({ error: 'Failed to fetch chat messages' }, { status: 500 })
  }
}

// POST /api/teams/:id/chat – Gửi tin nhắn mới vào phòng chat của team
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
    const { content } = body

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 })
    }

    // Kiểm tra quyền thành viên
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden. You are not a member of this team.' },
        { status: 403 }
      )
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        teamId,
        senderId: user.id,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('POST /api/teams/:id/chat Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
