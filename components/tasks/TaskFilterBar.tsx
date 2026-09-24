'use client'

import { Search, Filter } from 'lucide-react'
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
  const statusTabs: { label: string; value: 'ALL' | TaskStatus }[] = [
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
    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 mb-5">
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by task title or criteria..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs text-slate-900 bg-slate-50/80 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition"
          />
        </div>

        {/* Priority Filter */}
        <div className="relative w-full sm:w-40 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as 'ALL' | TaskPriority)}
            className="w-full pl-8 pr-8 py-1.5 text-xs font-medium text-slate-700 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition cursor-pointer appearance-none"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Segmented Control Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="inline-flex p-1 bg-slate-100/90 rounded-xl gap-1">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <span className="text-[11px] text-slate-400 font-medium px-1">
          <strong className="text-slate-700">{totalFiltered}</strong> results
        </span>
      </div>
    </div>
  )
}
