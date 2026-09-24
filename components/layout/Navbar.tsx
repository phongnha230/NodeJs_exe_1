'use client'

import Link from 'next/link'
import { CheckSquare, Users, LogIn, ExternalLink, Database } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm transition group-hover:bg-blue-600">
              <CheckSquare className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                TaskFlow
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                v1.0
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1.5">
            <Link
              href="/"
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 rounded-lg transition"
            >
              Dashboard
            </Link>
            <Link
              href="/teams"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Teams
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                Soon
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3 h-3 text-emerald-600" />
            Supabase Connected
          </div>

          <button
            type="button"
            onClick={() => alert('Authentication will be implemented in Assignment 2!')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-2xs active:scale-[0.98]"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            Sign In
          </button>
        </div>
      </div>
    </header>
  )
}
