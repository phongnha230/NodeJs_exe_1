'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Task, TaskPriority, TaskStatus, UpdateTaskDTO } from '@/types/task'

interface TaskEditModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, dto: UpdateTaskDTO) => Promise<boolean>
  isLoading?: boolean
}

function TaskEditForm({
  task,
  onClose,
  onUpdate,
  isLoading,
}: {
  task: Task
  onClose: () => void
  onUpdate: (id: string, dto: UpdateTaskDTO) => Promise<boolean>
  isLoading?: boolean
}) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title cannot be empty')
      return
    }

    const success = await onUpdate(task.id, {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      dueDate: dueDate || null,
    })

    if (success) {
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title *"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          if (error) setError(null)
        }}
        error={error || undefined}
      />

      <Textarea
        label="Description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          options={[
            { label: 'To Do', value: 'TODO' },
            { label: 'In Progress', value: 'IN_PROGRESS' },
            { label: 'Done', value: 'DONE' },
          ]}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          options={[
            { label: 'Low', value: 'LOW' },
            { label: 'Medium', value: 'MEDIUM' },
            { label: 'High', value: 'HIGH' },
            { label: 'Urgent', value: 'URGENT' },
          ]}
        />
      </div>

      <Input
        type="date"
        label="Due Date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}

export function TaskEditModal({ task, isOpen, onClose, onUpdate, isLoading }: TaskEditModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" description="Update your task details and properties.">
      {task && (
        <TaskEditForm
          key={task.id}
          task={task}
          onClose={onClose}
          onUpdate={onUpdate}
          isLoading={isLoading}
        />
      )}
    </Modal>
  )
}
