import { Database, ShieldCheck, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Assignment 1</span> — Task & Team Management App
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Next.js 16 App Router</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Database className="w-3.5 h-3.5 text-sky-500" />
            <span>Prisma 6 & Supabase Postgres</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Vercel Ready</span>
          </div>
        </div>

        <p className="text-slate-400">© 2026 Fullstack Architecture Showcase</p>
      </div>
    </footer>
  )
}
