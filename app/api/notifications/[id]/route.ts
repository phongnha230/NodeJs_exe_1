import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/notifications/:id – Đánh dấu một thông báo là đã đọc
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: notificationId } = await params

    const existingNotification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!existingNotification || existingNotification.userId !== user.id) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/notifications/:id Error:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
