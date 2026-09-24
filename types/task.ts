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
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDTO {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
}

export interface UpdateTaskDTO {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
}

export interface TaskFilterOptions {
  status: 'ALL' | TaskStatus
  priority: 'ALL' | TaskPriority
  searchQuery: string
}
