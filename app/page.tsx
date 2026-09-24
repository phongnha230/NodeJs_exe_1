'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useTaskFilter } from '@/hooks/useTaskFilter'
import { TaskStats } from '@/components/tasks/TaskStats'
import { TaskCreateForm } from '@/components/tasks/TaskCreateForm'
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskEditModal } from '@/components/tasks/TaskEditModal'
import { Task } from '@/types/task'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function HomePage() {
  const {
    tasks,
    isLoading,
    isMutating,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refresh,
  } = useTasks()

  const {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    stats,
  } = useTaskFilter(tasks)

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  return (
    <div className="space-y-6">
      {/* Hero Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Task Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time public task tracking backed by Next.js Route Handlers, Prisma ORM, and Supabase PostgreSQL.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 self-start md:self-auto px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          Sync Data
        </button>
      </div>

      {/* Global Error Alert */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Section */}
      <TaskStats stats={stats} />

      {/* Main Grid: Form (Left) & Task List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-4">
          <TaskCreateForm onSubmit={createTask} isLoading={isMutating} />
        </div>

        {/* Right Column: Filters and Task Cards */}
        <div className="lg:col-span-8 space-y-4">
          <TaskFilterBar
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalFiltered={filteredTasks.length}
          />

          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            onToggleStatus={toggleTaskStatus}
            onEdit={(task) => setEditingTask(task)}
            onDelete={deleteTask}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onUpdate={updateTask}
        isLoading={isMutating}
      />
    </div>
  )
}