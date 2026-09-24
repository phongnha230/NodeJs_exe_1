import { useMemo, useState } from 'react'
import { Task, TaskPriority, TaskStatus } from '@/types/task'

export function useTaskFilter(tasks: Task[]) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchStatus = statusFilter === 'ALL' || task.status === statusFilter
      const matchPriority = priorityFilter === 'ALL' || task.priority === priorityFilter
      const matchSearch =
        searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchStatus && matchPriority && matchSearch
    })
  }, [tasks, statusFilter, priorityFilter, searchQuery])

  const stats = useMemo(() => {
    const total = tasks.length
    const todoCount = tasks.filter((t) => t.status === 'TODO').length
    const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
    const doneCount = tasks.filter((t) => t.status === 'DONE').length

    return {
      total,
      todoCount,
      inProgressCount,
      doneCount,
    }
  }, [tasks])

  return {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    stats,
  }
}
