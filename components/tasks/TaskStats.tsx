import { CheckCircle2, Clock, ListTodo, Sparkles } from 'lucide-react'

interface TaskStatsProps {
  stats: {
    total: number
    todoCount: number
    inProgressCount: number
    doneCount: number
  }
}

export function TaskStats({ stats }: TaskStatsProps) {
  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
    },
    {
      label: 'To Do',
      value: stats.todoCount,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      label: 'In Progress',
      value: stats.inProgressCount,
      icon: Sparkles,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
    },
    {
      label: 'Completed',
      value: stats.doneCount,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`p-4 bg-white rounded-2xl border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
              <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">{card.value}</div>
          </div>
        )
      })}
    </div>
  )
}
