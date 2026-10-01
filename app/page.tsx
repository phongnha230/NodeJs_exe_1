'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  Users,
  CheckSquare,
  Shield,
  Layers,
  ArrowRight,
  Database,
  LogIn,
  UserPlus,
} from 'lucide-react'

export default function HomePage() {
  const { user, isLoading } = useAuth()

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Assignment 2 • Task & Team Management
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              Supabase Auth & PostgreSQL
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Collaborative Task & Team Management Workspace
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            A fullstack platform built on Next.js App Router, Prisma ORM, and Supabase. Experience team collaboration, member invitations by email, role-based authorization, and real-time task lifecycle tracking.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isLoading ? (
              <div className="h-10 w-36 bg-slate-100 rounded-xl animate-pulse" />
            ) : user ? (
              <Link
                href="/teams"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition active:scale-[0.98]"
              >
                <span>Go to Teams Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Multi-Team Collaboration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create organizations, switch between multiple teams effortlessly, and invite peers directly by their registered email address.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Role-Based Permissions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fine-grained access control: Owners can manage members and team settings. Task deletion is strictly restricted to Creators, Assignees, or Team Owners.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Task Lifecycle & Kanban</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Assign tasks to teammates, set priorities from Low to Urgent, target due dates, and update statuses with smooth micro-interactions.
          </p>
        </div>
      </div>

      {/* User Status Banner if logged in */}
      {user && (
        <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">Logged in as {user.name}</span>
            </div>
            <h2 className="text-lg font-bold">Ready to manage your sprint tasks?</h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore your assigned items or review pending deliverables.</p>
          </div>
          <Link
            href="/teams"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition self-start sm:self-auto"
          >
            Open Teams Workspace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}