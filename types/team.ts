import { UserProfile } from './user'
import { Task } from './task'

export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface TeamMemberItem {
  id: string
  teamId: string
  userId: string
  role: TeamRole
  joinedAt: string
  user: UserProfile
}

export interface Team {
  id: string
  name: string
  description: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
  owner?: UserProfile
  members?: TeamMemberItem[]
  tasks?: Task[]
  _count?: {
    members: number
    tasks: number
  }
}

export interface CreateTeamDTO {
  name: string
  description?: string
}

export interface UpdateTeamDTO {
  name?: string
  description?: string
}

export interface AddMemberDTO {
  email: string
  role?: TeamRole
}
