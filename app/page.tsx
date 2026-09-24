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
import { AlertCircle, RefreshCw, Layers } from 'lucide-react'

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
      {/* Modern SaaS Header with Asymmetric Visual Rhythm */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Layers className="w-3 h-3 text-blue-600" />
              Assignment 1 Workspace
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Next.js + Prisma + Supabase</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Task Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Public real-time task manager demonstrating full REST CRUD route handlers, transaction pooling, and type-safe database migrations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>Sync Board</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Metrics Bento Section */}
      <TaskStats stats={stats} />

      {/* Main Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-4">
          <TaskCreateForm onSubmit={createTask} isLoading={isMutating} />
        </div>

        {/* Right Column: Filter & Task Cards */}
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