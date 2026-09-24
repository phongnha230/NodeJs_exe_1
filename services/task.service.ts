import { CreateTaskDTO, Task, TaskStatus, UpdateTaskDTO } from '@/types/task'

export const taskService = {
  async getAll(status?: TaskStatus | 'ALL'): Promise<Task[]> {
    const query = status && status !== 'ALL' ? `?status=${status}` : ''
    const response = await fetch(`/api/tasks${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch tasks')
    }

    return response.json()
  },

  async create(data: CreateTaskDTO): Promise<Task> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to create task')
    }

    return response.json()
  },

  async update(id: string, data: UpdateTaskDTO): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to update task')
    }

    return response.json()
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to delete task')
    }
  },
}
