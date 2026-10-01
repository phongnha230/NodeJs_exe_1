import { UserProfile } from './user'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  teamId: string | null
  assigneeId: string | null
  creatorId: string | null
  createdAt: string
  updatedAt: string
  assignee?: UserProfile | null
  creator?: UserProfile | null
  team?: {
    id: string
    name: string
    ownerId: string
  } | null
}

export interface CreateTaskDTO {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  assigneeId?: string | null
  teamId?: string | null
}

export interface UpdateTaskDTO {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  assigneeId?: string | null
}

export interface TaskFilterOptions {
  status: 'ALL' | TaskStatus
  priority: 'ALL' | TaskPriority
  searchQuery: string
  assigneeId?: 'ALL' | string
}
