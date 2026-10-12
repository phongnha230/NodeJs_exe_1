import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

// PATCH /api/teams/:id/members/:userId – Update a member's role (Owner only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: teamId, userId: targetUserId } = await params
    const body = await request.json()
    const { role } = body

    if (!role || !['ADMIN', 'MEMBER'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role is required (ADMIN or MEMBER).' },
        { status: 400 }
      )
    }

    // 1. Kiểm tra quyền của người gửi: Chỉ OWNER mới được đổi vai trò
    const currentMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!currentMembership || currentMembership.role !== Role.OWNER) {
      return NextResponse.json(
        { error: 'Forbidden. Only the team Owner can change member roles.' },
        { status: 403 }
      )
    }

    // 2. Không cho phép đổi vai trò của chính Owner
    if (user.id === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot change the role of the team Owner.' },
        { status: 400 }
      )
    }

    // 3. Cập nhật role
    const updatedMember = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
      data: {
        role: role as Role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error('Error updating member role:', error)
    return NextResponse.json({ error: 'Failed to update member role' }, { status: 500 })
  }
}

// DELETE /api/teams/:id/members/:userId – Remove a member from a team (Owner or Admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: teamId, userId: targetUserId } = await params

    // 1. Kiểm tra quyền của người thực hiện (Owner hoặc Admin)
    const currentMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!currentMembership || (currentMembership.role !== Role.OWNER && currentMembership.role !== Role.ADMIN)) {
      return NextResponse.json(
        { error: 'Forbidden. Only Team Owners or Admins can remove members.' },
        { status: 403 }
      )
    }

    // 2. Không cho phép Owner tự xóa chính mình
    if (user.id === targetUserId) {
      return NextResponse.json(
        { error: 'Team Owner cannot be removed. You can delete the team instead.' },
        { status: 400 }
      )
    }

    // 3. Lấy thông tin thành viên cần xóa
    const targetMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
    })

    if (!targetMembership) {
      return NextResponse.json({ error: 'Target member not found in team.' }, { status: 404 })
    }

    // Nếu người xóa là ADMIN: không được xóa OWNER hoặc ADMIN khác
    if (currentMembership.role === Role.ADMIN) {
      if (targetMembership.role === Role.OWNER || targetMembership.role === Role.ADMIN) {
        return NextResponse.json(
          { error: 'Forbidden. Admins can only remove regular Members.' },
          { status: 403 }
        )
      }
    }

    // 4. Xóa member
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
    })

    // Xóa assignee của các task mà người này được gán trong team
    await prisma.task.updateMany({
      where: {
        teamId,
        assigneeId: targetUserId,
      },
      data: {
        assigneeId: null,
      },
    })

    return NextResponse.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}
