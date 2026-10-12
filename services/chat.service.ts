import { ChatMessage } from '@/types/chat'

export const chatService = {
  async getMessages(teamId: string): Promise<ChatMessage[]> {
    const res = await fetch(`/api/teams/${teamId}/chat`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to fetch messages')
    }
    return res.json()
  },

  async sendMessage(teamId: string, content: string): Promise<ChatMessage> {
    const res = await fetch(`/api/teams/${teamId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to send message')
    }
    return res.json()
  },
}
