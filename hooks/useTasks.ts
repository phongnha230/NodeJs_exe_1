import { useState, useEffect, useCallback } from 'react'
import { CreateTaskDTO, Task, TaskStatus, UpdateTaskDTO } from '@/types/task'
import { taskService } from '@/services/task.service'

export function useTasks(initialStatus?: TaskStatus | 'ALL') {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isMutating, setIsMutating] = useState<boolean>(false)

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await taskService.getAll(initialStatus)
      setTasks(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching tasks'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [initialStatus])

  useEffect(() => {
    let isSubscribed = true
    taskService
      .getAll(initialStatus)
      .then((data) => {
        if (isSubscribed) {
          setTasks(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (isSubscribed) {
          const message = err instanceof Error ? err.message : 'Error fetching tasks'
          setError(message)
          setIsLoading(false)
        }
      })

    return () => {
      isSubscribed = false
    }
  }, [initialStatus])

  const createTask = async (dto: CreateTaskDTO): Promise<boolean> => {
    setIsMutating(true)
    setError(null)
    try {
      const newTask = await taskService.create(dto)
      setTasks((prev) => [newTask, ...prev])
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error creating task'
      setError(message)
      return false
    } finally {
      setIsMutating(false)
    }
  }

  const updateTask = async (id: string, dto: UpdateTaskDTO): Promise<boolean> => {
    setIsMutating(true)
    setError(null)
    try {
      const updated = await taskService.update(id, dto)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error updating task'
      setError(message)
      return false
    } finally {
      setIsMutating(false)
    }
  }

  const deleteTask = async (id: string): Promise<boolean> => {
    setIsMutating(true)
    setError(null)
    try {
      await taskService.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting task'
      setError(message)
      return false
    } finally {
      setIsMutating(false)
    }
  }

  const toggleTaskStatus = async (task: Task): Promise<boolean> => {
    const cycleMap: Record<TaskStatus, TaskStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
    }
    const nextStatus = cycleMap[task.status]
    return updateTask(task.id, { status: nextStatus })
  }

  return {
    tasks,
    isLoading,
    isMutating,
    error,
    refresh: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  }
}
