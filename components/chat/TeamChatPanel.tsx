'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, MessageSquare, Loader2, Sparkles, User, RefreshCw } from 'lucide-react'
import { chatService } from '@/services/chat.service'
import { ChatMessage } from '@/types/chat'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'

interface TeamChatPanelProps {
  teamId: string
  teamName: string
}

export function TeamChatPanel({ teamId, teamName }: TeamChatPanelProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true)
      const data = await chatService.getMessages(teamId)
      setMessages(data)
      setTimeout(() => scrollToBottom(false), 50)
    } catch (err) {
      console.error('Failed to load chat history:', err)
    } finally {
      setLoading(false)
    }
  }, [teamId])

  useEffect(() => {
    let isMounted = true
    chatService.getMessages(teamId)
      .then((data) => {
        if (isMounted) {
          setMessages(data)
          setLoading(false)
          setTimeout(() => scrollToBottom(false), 50)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load chat history:', err)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [teamId])

  // 2. Thiết lập kênh Supabase Realtime cho phòng chat
  useEffect(() => {
    const supabase = createClient()
    const channelName = `team-chat-${teamId}`
    const channel = supabase.channel(channelName)

    channel
      .on('broadcast', { event: 'NEW_CHAT_MESSAGE' }, (payload) => {
        if (payload?.payload) {
          const incomingMsg = payload.payload as ChatMessage
          setMessages((prev) => {
            // Tránh trùng lặp tin nhắn nếu chính mình gửi
            if (prev.some((m) => m.id === incomingMsg.id)) return prev
            return [...prev, incomingMsg]
          })
          setTimeout(() => scrollToBottom(true), 50)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true)
        } else {
          setIsRealtimeConnected(false)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [teamId])

  // Cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom(true)
  }, [messages.length])

  // 3. Gửi tin nhắn mới
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || sending) return

    setSending(true)
    setInputText('')

    try {
      // Lưu vào PostgreSQL qua API route
      const createdMessage = await chatService.sendMessage(teamId, trimmed)

      // Cập nhật state cục bộ
      setMessages((prev) => {
        if (prev.some((m) => m.id === createdMessage.id)) return prev
        return [...prev, createdMessage]
      })

      // Phát sóng (Broadcast) ngay lập tức tới các thành viên online khác qua Realtime
      const supabase = createClient()
      const channel = supabase.channel(`team-chat-${teamId}`)
      await channel.send({
        type: 'broadcast',
        event: 'NEW_CHAT_MESSAGE',
        payload: createdMessage,
      })

      setTimeout(() => scrollToBottom(true), 50)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message'
      alert(msg)
      setInputText(trimmed)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-[560px] overflow-hidden">
      {/* Chat Room Header */}
      <div className="p-4 px-5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <MessageSquare className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              #{teamName} Team Chat
            </h3>
            <p className="text-[10px] text-slate-400">
              Persisted message history with Supabase Realtime
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isRealtimeConnected ? 'Realtime Connected' : 'Connecting...'}</span>
          </div>

          <button
            type="button"
            onClick={fetchHistory}
            title="Reload messages"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading chat messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs py-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="font-semibold text-slate-700">No messages yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Be the first to say hello to your team!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 border border-slate-200">
                    {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                )}

                <div className={`max-w-[78%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] font-bold text-slate-700">
                        {msg.sender?.name || 'Team Member'}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                  <div
                    className={`p-3 px-4 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-xs shadow-xs font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>

                  {isMe && (
                    <div className="text-right px-1">
                      <span className="text-[9px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 px-4 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          aria-label="Type your message to the team"
          placeholder="Type your message to the team... (Press Enter to send)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
          className="flex-1 bg-slate-50 border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="p-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md shadow-blue-500/25 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs font-semibold shrink-0"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
