import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

// GET /api/teams/:id – Get team details, including members and tasks
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

    // Kiểm tra user có thuộc team này không
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

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true },
            },
            creator: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...team,
      currentUserRole: membership.role,
    })
  } catch (error: unknown) {
    console.error('GET /api/teams/:id Error:', error)
    return NextResponse.json({ error: 'Failed to fetch team details' }, { status: 500 })
  }
}

// PUT /api/teams/:id – Update team info (Owner only)
export async function PUT(
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
    const { name, description } = body

    // Kiểm tra quyền Owner
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership || membership.role !== Role.OWNER) {
      return NextResponse.json({ error: 'Forbidden. Only the team Owner can update team details.' }, { status: 403 })
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
      },
    })

    return NextResponse.json(updatedTeam)
  } catch (error: unknown) {
    console.error('PUT /api/teams/:id Error:', error)
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}

// DELETE /api/teams/:id – Delete a team (Owner only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: teamId } = await params

    // Kiểm tra quyền Owner
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!membership || membership.role !== Role.OWNER) {
      return NextResponse.json({ error: 'Forbidden. Only the team Owner can delete this team.' }, { status: 403 })
    }

    await prisma.team.delete({
      where: { id: teamId },
    })

    return NextResponse.json({ message: 'Team deleted successfully' })
  } catch (error: unknown) {
    console.error('DELETE /api/teams/:id Error:', error)
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 })
  }
}
