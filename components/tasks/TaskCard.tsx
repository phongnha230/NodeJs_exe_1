import { Calendar, Trash2, Edit3, Check } from 'lucide-react'
import { Task } from '@/types/task'
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onToggleStatus: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const isDone = task.status === 'DONE'

  return (
    <div
      className={`group p-4 bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
        isDone ? 'border-slate-200/60 bg-slate-50/50' : 'border-slate-200/90 hover:border-indigo-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1.5">
          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={task.status} onClick={() => onToggleStatus(task)} />
            <TaskPriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-sm font-semibold tracking-tight transition-colors ${
              isDone ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className={`text-xs leading-relaxed line-clamp-2 ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
              {task.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onToggleStatus(task)}
            title="Mark as done / cycle status"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
