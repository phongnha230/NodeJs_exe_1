'use client'

import Link from 'next/link'
import { CheckSquare, Users, LogIn, Code2 } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 transition group-hover:scale-105">
              <CheckSquare className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                TaskFlow
              </span>
              <span className="ml-2 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100/80">
                Ass 1
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
            >
              Tasks Board
            </Link>
            <Link
              href="/teams"
              className="px-3.5 py-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-slate-400" />
              Teams
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200/60 rounded">
                Soon
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            title="GitHub Repository"
          >
            <Code2 className="w-5 h-5" />
          </a>

          <button
            type="button"
            onClick={() => alert('Authentication (Login/Register) will be unlocked in Assignment 2!')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            Login
          </button>
        </div>
      </div>
    </header>
  )
}
