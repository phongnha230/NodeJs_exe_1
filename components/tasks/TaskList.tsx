import { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { Inbox } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onToggleStatus: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, isLoading, onToggleStatus, onEdit, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-3">
            <div className="flex gap-2">
              <div className="w-16 h-5 bg-slate-200 rounded-full" />
              <div className="w-14 h-5 bg-slate-200 rounded-full" />
            </div>
            <div className="w-2/3 h-5 bg-slate-200 rounded-md" />
            <div className="w-full h-4 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Inbox className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No tasks found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Get started by creating your first task using the form on the left, or adjust your active filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
