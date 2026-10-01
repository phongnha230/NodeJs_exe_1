'use client'

import React, { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { teamService } from '@/services/team.service'
import { taskService } from '@/services/task.service'
import { Team, TeamMemberItem } from '@/types/team'
import { Task, TaskPriority, TaskStatus } from '@/types/task'
import {
  Users,
  ArrowLeft,
  Plus,
  Trash2,
  Settings,
  UserPlus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit3,
  UserCheck,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const teamId = resolvedParams.id

  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [team, setTeam] = useState<Team | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL')

  // Modals
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [addingMember, setAddingMember] = useState(false)

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('TODO')
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('MEDIUM')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskAssigneeId, setTaskAssigneeId] = useState('')
  const [creatingTask, setCreatingTask] = useState(false)

  // Task Edit Modal
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const loadTeamData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await teamService.getTeamDetails(teamId)
      setTeam(data)
      setTasks(data.tasks || [])
      setEditName(data.name)
      setEditDesc(data.description || '')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load team'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [teamId, user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      loadTeamData()
    }
  }, [user, authLoading, loadTeamData, router])

  // Team Actions (Owner Only)
  const isOwner = team?.ownerId === user?.id

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return

    try {
      const updated = await teamService.updateTeam(teamId, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
      })
      setTeam((prev) => (prev ? { ...prev, ...updated } : prev))
      setIsEditTeamOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update team'
      alert(msg)
    }
  }

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? All team tasks will be removed!')) return
    try {
      await teamService.deleteTeam(teamId)
      router.push('/teams')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete team'
      alert(msg)
    }
  }

  // Member Actions
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberEmail.trim()) return

    setAddingMember(true)
    try {
      const added = await teamService.addMember(teamId, newMemberEmail.trim())
      setTeam((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          members: [...(prev.members || []), added],
        }
      })
      setNewMemberEmail('')
      setIsAddMemberOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add member'
      alert(msg)
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (member: TeamMemberItem) => {
    if (!confirm(`Are you sure you want to remove ${member.user.name} from this team?`)) return
    try {
      await teamService.removeMember(teamId, member.userId)
      setTeam((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          members: (prev.members || []).filter((m) => m.userId !== member.userId),
        }
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove member'
      alert(msg)
    }
  }

  // Task Actions
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim()) return

    setCreatingTask(true)
    try {
      const newTask = await teamService.createTeamTask(teamId, {
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate || undefined,
        assigneeId: taskAssigneeId || undefined,
      })

      setTasks((prev) => [newTask, ...prev])
      setIsCreateTaskOpen(false)
      setTaskTitle('')
      setTaskDesc('')
      setTaskStatus('TODO')
      setTaskPriority('MEDIUM')
      setTaskDueDate('')
      setTaskAssigneeId('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create task'
      alert(msg)
    } finally {
      setCreatingTask(false)
    }
  }

  const handleToggleTaskStatus = async (task: Task) => {
    const cycleMap: Record<TaskStatus, TaskStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
    }
    const nextStatus = cycleMap[task.status]

    try {
      const updated = await taskService.update(task.id, { status: nextStatus })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...updated } : t)))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task status'
      alert(msg)
    }
  }

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('Delete this task?')) return
    try {
      await taskService.delete(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete task'
      alert(msg)
    }
  }

  const handleUpdateTaskModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return

    try {
      const updated = await taskService.update(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        assigneeId: editingTask.assigneeId,
      })
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...updated } : t)))
      setEditingTask(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task'
      alert(msg)
    }
  }

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'ALL') return true
    return t.status === statusFilter
  })

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 mx-auto mb-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Loading team workspace...</p>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Access Denied or Team Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'Unable to display team details.'}</p>
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Teams
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <Link
            href="/teams"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Teams
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {team.name}
            </h1>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isOwner
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {isOwner ? '👑 You are Owner' : 'Member'}
            </span>
          </div>
          {team.description && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {team.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <button
                type="button"
                onClick={() => setIsEditTeamOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                Settings
              </button>
              <button
                type="button"
                onClick={handleDeleteTeam}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Team
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Team Members Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Team Members</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {team.members?.length || 0}
              </span>
            </div>

            {/* Members List */}
            <div className="space-y-2.5">
              {team.members?.map((m) => {
                const isMemberOwner = m.role === 'OWNER'
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{m.user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{m.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          isMemberOwner
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {m.role}
                      </span>

                      {isOwner && !isMemberOwner && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m)}
                          title="Remove member"
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add Member Button (Owner only) */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="w-full mt-4 py-2 px-3 border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Invite Member by Email
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Tasks Board (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100/90 rounded-xl gap-1">
              {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setIsCreateTaskOpen(true)}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Task
            </Button>
          </div>

          {/* Tasks Container */}
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-xs">
              <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-900">No tasks in this filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Assign tasks to team members to keep projects moving forward.
              </p>
              <Button onClick={() => setIsCreateTaskOpen(true)} size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" /> Create Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((t) => {
                const isDone = t.status === 'DONE'
                // Quyền xóa: Task Creator, Assignee, hoặc Team Owner
                const canDelete =
                  t.creatorId === user?.id || t.assigneeId === user?.id || isOwner

                return (
                  <div
                    key={t.id}
                    className={`p-4 bg-white rounded-2xl border transition-all duration-150 shadow-xs hover:shadow-sm ${
                      isDone
                        ? 'border-slate-200/60 bg-slate-50/40'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <TaskStatusBadge
                            status={t.status}
                            onClick={() => handleToggleTaskStatus(t)}
                          />
                          <TaskPriorityBadge priority={t.priority} />

                          {t.dueDate && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100/70 px-2 py-0.5 rounded-md">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {formatDate(t.dueDate)}
                            </span>
                          )}

                          {t.assignee && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                              <UserCheck className="w-3 h-3 text-blue-500" />
                              {t.assignee.name}
                            </span>
                          )}
                        </div>

                        <h3
                          className={`text-sm font-semibold tracking-tight ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {t.title}
                        </h3>

                        {t.description && (
                          <p
                            className={`text-xs leading-relaxed line-clamp-2 ${
                              isDone ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            {t.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingTask(t)}
                          title="Edit task"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(t)}
                            title="Delete task (Authorized)"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Edit Team Details (Owner Only) */}
      <Modal
        isOpen={isEditTeamOpen}
        onClose={() => setIsEditTeamOpen(false)}
        title="Team Settings"
        description="Update team name and general scope of collaboration."
      >
        <form onSubmit={handleUpdateTeam} className="space-y-4">
          <Input
            label="Team Name *"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <Textarea
            label="Team Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsEditTeamOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Member by Email (Owner Only) */}
      <Modal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        title="Invite Team Member"
        description="Enter the email address of a registered user to add them to this team."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="User Email Address *"
            type="email"
            placeholder="colleague@example.com"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            required
          />
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={addingMember}>
              Add to Team
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Create Team Task */}
      <Modal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        title="Create Team Task"
        description="Add a task and assign it to a team member."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title *"
            placeholder="e.g. Implement Role-based routing"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Acceptance criteria or implementation details..."
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Initial Status"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
              options={[
                { label: 'To Do', value: 'TODO' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'Done', value: 'DONE' },
              ]}
            />

            <Select
              label="Priority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
              options={[
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
                { label: 'Urgent', value: 'URGENT' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Target Due Date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />

            <Select
              label="Assign Member"
              value={taskAssigneeId}
              onChange={(e) => setTaskAssigneeId(e.target.value)}
              options={[
                { label: 'Unassigned', value: '' },
                ...(team.members || []).map((m) => ({
                  label: `${m.user.name} (${m.role})`,
                  value: m.userId,
                })),
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={creatingTask}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 4: Edit Task */}
      {editingTask && (
        <Modal
          isOpen={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          title="Edit Task"
          description="Update task details, status, or assignee."
        >
          <form onSubmit={handleUpdateTaskModal} className="space-y-4">
            <Input
              label="Task Title *"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              required
            />

            <Textarea
              label="Description"
              value={editingTask.description || ''}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              rows={3}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Status"
                value={editingTask.status}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })
                }
                options={[
                  { label: 'To Do', value: 'TODO' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Done', value: 'DONE' },
                ]}
              />

              <Select
                label="Priority"
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, priority: e.target.value as TaskPriority })
                }
                options={[
                  { label: 'Low', value: 'LOW' },
                  { label: 'Medium', value: 'MEDIUM' },
                  { label: 'High', value: 'HIGH' },
                  { label: 'Urgent', value: 'URGENT' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="Due Date"
                value={
                  editingTask.dueDate
                    ? new Date(editingTask.dueDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
              />

              <Select
                label="Assignee"
                value={editingTask.assigneeId || ''}
                onChange={(e) => setEditingTask({ ...editingTask, assigneeId: e.target.value })}
                options={[
                  { label: 'Unassigned', value: '' },
                  ...(team.members || []).map((m) => ({
                    label: `${m.user.name} (${m.role})`,
                    value: m.userId,
                  })),
                ]}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
