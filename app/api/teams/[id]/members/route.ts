import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

// POST /api/teams/:id/members – Add a member to a team by email (Owner only)
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
    const { email, role } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Member email is required' }, { status: 400 })
    }

    // 1. Kiểm tra quyền Owner của người thực hiện
    const currentMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!currentMembership || currentMembership.role !== Role.OWNER) {
      return NextResponse.json({ error: 'Forbidden. Only the team Owner can add members.' }, { status: 403 })
    }

    // 2. Tìm người dùng theo email trong cơ sở dữ liệu
    const targetUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: `User with email "${email}" not found. Please ask them to register first.` },
        { status: 404 }
      )
    }

    // 3. Kiểm tra xem người dùng đã ở trong team chưa
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUser.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this team.' }, { status: 400 })
    }

    // 4. Thêm vào team
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: targetUser.id,
        role: role === 'ADMIN' ? Role.ADMIN : Role.MEMBER,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(newMember, { status: 201 })
  } catch (error: unknown) {
    console.error('POST /api/teams/:id/members Error:', error)
    return NextResponse.json({ error: 'Failed to add member to team' }, { status: 500 })
  }
}
