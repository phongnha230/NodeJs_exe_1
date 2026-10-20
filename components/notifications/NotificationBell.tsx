'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, Check, Clock, ExternalLink } from 'lucide-react'
import { notificationService } from '@/services/notification.service'
import { NotificationItem } from '@/types/notification'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'

export function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    try {
      const res = await notificationService.getNotifications()
      setNotifications(res.notifications || [])
      setUnreadCount(res.unreadCount || 0)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    }
  }, [user])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Lắng nghe thông báo Real-time qua Supabase Realtime
  useEffect(() => {
    if (!user) return

    const supabase = createClient()
    const channelName = `notifications-${user.id}`
    const channel = supabase.channel(channelName)

    channel
      .on('broadcast', { event: 'NEW_NOTIFICATION' }, (event) => {
        if (event.payload) {
          const newNotif = event.payload as NotificationItem
          setNotifications((prev) => [newNotif, ...prev])
          setUnreadCount((prev) => prev + 1)
        }
      })
      .subscribe()

    // Fallback polling nhẹ mỗi 15 giây để luôn đồng bộ
    const timer = setInterval(() => {
      fetchNotifications()
    }, 15000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(timer)
    }
  }, [user, fetchNotifications])

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all read:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 border border-slate-200/80 transition-all active:scale-95 flex items-center justify-center bg-white shadow-2xs"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-3.5 px-4 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* List items */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                You have no notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 px-4 transition-colors flex items-start gap-3 hover:bg-slate-50/80 ${
                    !notif.isRead ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !notif.isRead ? 'bg-blue-600' : 'bg-transparent'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </p>
                      <span
                        suppressHydrationWarning
                        className="text-[10px] text-slate-400 flex items-center gap-0.5 shrink-0"
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {notif.content}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      {notif.link ? (
                        <Link
                          href={notif.link}
                          onClick={() => {
                            if (!notif.isRead) handleMarkAsRead(notif.id, {} as React.MouseEvent)
                            setIsOpen(false)
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          View Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span />
                      )}

                      {!notif.isRead && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          title="Mark as read"
                          className="text-[10px] font-medium text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
