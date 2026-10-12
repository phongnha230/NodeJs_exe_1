export interface ChatMessage {
  id: string
  content: string
  teamId: string
  senderId: string
  createdAt: string
  sender: {
    id: string
    name: string
    email: string
  }
}
