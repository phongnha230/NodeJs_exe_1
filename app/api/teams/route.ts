import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

// GET /api/teams – List teams the current user belongs to
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
    }

    const memberships = await prisma.teamMember.findMany({
      where: { userId: user.id },
      include: {
        team: {
          include: {
            owner: {
              select: { id: true, name: true, email: true },
            },
            _count: {
              select: { members: true, tasks: true },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    })

    const teams = memberships.map((m) => ({
      ...m.team,
      userRole: m.role,
    }))

    return NextResponse.json(teams)
  } catch (error: unknown) {
    console.error('GET /api/teams Error:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

// POST /api/teams – Create a new team (creator automatically becomes Owner)
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
    }

    // Tạo team và gán creator thành OWNER trong bảng TeamMember qua transaction
    const newTeam = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: name.trim(),
          description: description?.trim() || null,
          ownerId: user.id,
        },
      })

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: Role.OWNER,
        },
      })

      return team
    })

    return NextResponse.json(newTeam, { status: 201 })
  } catch (error: unknown) {
    console.error('POST /api/teams Error:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}
