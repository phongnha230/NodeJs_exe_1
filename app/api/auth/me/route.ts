import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy thông tin user kèm danh sách teams đã tham gia
    const userWithTeams = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        memberships: {
          select: {
            role: true,
            team: {
              select: {
                id: true,
                name: true,
                description: true,
                ownerId: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ user: userWithTeams })
  } catch (error: unknown) {
    console.error('Auth ME API Error:', error)
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 })
  }
}
