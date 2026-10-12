import { NotificationResponse, NotificationItem } from '@/types/notification'

export const notificationService = {
  async getNotifications(): Promise<NotificationResponse> {
    const res = await fetch('/api/notifications')
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to fetch notifications')
    }
    return res.json()
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    const res = await fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to mark notification as read')
    }
    return res.json()
  },

  async markAllAsRead(): Promise<{ message: string; unreadCount: number }> {
    const res = await fetch('/api/notifications', {
      method: 'PATCH',
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to mark all as read')
    }
    return res.json()
  },
}
