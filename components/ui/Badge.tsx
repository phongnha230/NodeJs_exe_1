import React from 'react'
import { cn } from '@/lib/utils'
import { TaskPriority, TaskStatus } from '@/types/task'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function TaskStatusBadge({ status, onClick }: { status: TaskStatus; onClick?: () => void }) {
  const config: Record<TaskStatus, { label: string; variant: BadgeProps['variant']; dot: string }> = {
    TODO: { label: 'To Do', variant: 'warning', dot: 'bg-amber-500' },
    IN_PROGRESS: { label: 'In Progress', variant: 'info', dot: 'bg-sky-500' },
    DONE: { label: 'Done', variant: 'success', dot: 'bg-emerald-500' },
  }

  const { label, variant, dot } = config[status]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variant === 'warning' && 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        variant === 'info' && 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
        variant === 'success' && 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
        !onClick && 'cursor-default hover:bg-inherit'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </button>
  )
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const config: Record<TaskPriority, { label: string; variant: BadgeProps['variant'] }> = {
    LOW: { label: 'Low', variant: 'neutral' },
    MEDIUM: { label: 'Medium', variant: 'info' },
    HIGH: { label: 'High', variant: 'warning' },
    URGENT: { label: 'Urgent', variant: 'danger' },
  }

  const { label, variant } = config[priority]

  return <Badge variant={variant}>{label}</Badge>
}
