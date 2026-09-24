'use client'

import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { CreateTaskDTO, TaskPriority, TaskStatus } from '@/types/task'

interface TaskCreateFormProps {
  onSubmit: (data: CreateTaskDTO) => Promise<boolean>
  isLoading?: boolean
}

export function TaskCreateForm({ onSubmit, isLoading }: TaskCreateFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<{ title?: string }>({})

  const validate = () => {
    const newErrors: { title?: string } = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const success = await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
    })

    if (success) {
      setTitle('')
      setDescription('')
      setStatus('TODO')
      setPriority('MEDIUM')
      setDueDate('')
      setErrors({})
    }
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm sticky top-24">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Create New Task</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title *"
          placeholder="e.g., Integrate Supabase Auth"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) setErrors({})
          }}
          error={errors.title}
        />

        <Textarea
          label="Description"
          placeholder="Brief details or acceptance criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
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

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add Task
        </Button>
      </form>
    </div>
  )
}
