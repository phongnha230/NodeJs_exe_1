export interface NotificationItem {
  id: string
  userId: string
  title: string
  content: string
  type: 'TASK_ASSIGNED' | 'ADDED_TO_TEAM' | string
  link?: string | null
  isRead: boolean
  createdAt: string
}

export interface NotificationResponse {
  notifications: NotificationItem[]
  unreadCount: number
}
