import Link from 'next/link'
import { Users2, ArrowLeft, Shield, Sparkles, UserPlus } from 'lucide-react'

export default function TeamsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
        <Users2 className="w-8 h-8" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        Coming Soon in Assignment 2
      </span>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3">
        Team Collaboration & Workspaces
      </h1>

      <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed mb-8">
        We have designed the database schema with <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-xs">Team</code> and <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-xs">TeamMember</code> models in Prisma. Full team creation, role assignment, and multi-tenant tasks will be active in Assignment 2!
      </p>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto mb-10">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <UserPlus className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Invite Members</h3>
          <p className="text-[11px] text-slate-500">Collaborate with peers across projects with email invitations.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Role Permissions</h3>
          <p className="text-[11px] text-slate-500">Owner, Admin, and Member roles with fine-grained access control.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Assigned Tasks</h3>
          <p className="text-[11px] text-slate-500">Assign specific tasks to team members with real-time status.</p>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm shadow-indigo-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Tasks Board
      </Link>
    </div>
  )
}
