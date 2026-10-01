import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

// DELETE /api/teams/:id/members/:userId – Remove a member from a team (Owner only)
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

    // 1. Kiểm tra quyền Owner
    const currentMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!currentMembership || currentMembership.role !== Role.OWNER) {
      return NextResponse.json({ error: 'Forbidden. Only the team Owner can remove members.' }, { status: 403 })
    }

    // 2. Không cho phép Owner tự xóa chính mình
    if (user.id === targetUserId) {
      return NextResponse.json(
        { error: 'Team Owner cannot be removed. You can delete the team instead.' },
        { status: 400 }
      )
    }

    // 3. Xóa member
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

    return NextResponse.json({ message: 'Member removed successfully from team' })
  } catch (error: unknown) {
    console.error('DELETE /api/teams/:id/members/:userId Error:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}
