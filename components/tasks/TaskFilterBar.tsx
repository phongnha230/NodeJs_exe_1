'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { TaskPriority, TaskStatus } from '@/types/task'

interface TaskFilterBarProps {
  statusFilter: 'ALL' | TaskStatus
  onStatusChange: (status: 'ALL' | TaskStatus) => void
  priorityFilter: 'ALL' | TaskPriority
  onPriorityChange: (priority: 'ALL' | TaskPriority) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  totalFiltered: number
}

export function TaskFilterBar({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  totalFiltered,
}: TaskFilterBarProps) {
  const statusOptions: { label: string; value: 'ALL' | TaskStatus }[] = [
    { label: 'All Tasks', value: 'ALL' },
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
  ]

  const priorityOptions: { label: string; value: 'ALL' | TaskPriority }[] = [
    { label: 'All Priorities', value: 'ALL' },
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Urgent', value: 'URGENT' },
  ]

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks by title or details..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-44">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as any)}
              className="w-full pl-8 pr-8 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer appearance-none"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onStatusChange(opt.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing <span className="font-semibold text-slate-700">{totalFiltered}</span> task{totalFiltered === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}
