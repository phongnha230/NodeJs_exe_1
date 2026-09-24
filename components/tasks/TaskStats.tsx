import { CheckCircle2, Clock, PlayCircle, BarChart3 } from 'lucide-react'

interface TaskStatsProps {
  stats: {
    total: number
    todoCount: number
    inProgressCount: number
    doneCount: number
  }
}

export function TaskStats({ stats }: TaskStatsProps) {
  const percentage = stats.total > 0 ? Math.round((stats.doneCount / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 mb-8">
      {/* Hero Bento Card: Completion Progress */}
      <div className="md:col-span-5 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Project Velocity
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {stats.doneCount}/{stats.total} Tasks
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{percentage}%</span>
            <span className="text-xs text-slate-500 font-medium">Completion Rate</span>
          </div>
          {/* Progress track */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="md:col-span-7 grid grid-cols-3 gap-3">
        {/* To Do */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">To Do</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.todoCount}</div>
          <span className="text-[10px] text-amber-700 font-medium mt-1">Pending queue</span>
        </div>

        {/* In Progress */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">In Progress</span>
            <PlayCircle className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.inProgressCount}</div>
          <span className="text-[10px] text-blue-700 font-medium mt-1">Active sprint</span>
        </div>

        {/* Done */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.doneCount}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1">Resolved</span>
        </div>
      </div>
    </div>
  )
}
