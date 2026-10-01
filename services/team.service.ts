import { CreateTeamDTO, Team, TeamMemberItem, UpdateTeamDTO } from '@/types/team'
import { CreateTaskDTO, Task } from '@/types/task'

export const teamService = {
  async getMyTeams(): Promise<Team[]> {
    const res = await fetch('/api/teams')
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to fetch teams')
    }
    return res.json()
  },

  async createTeam(dto: CreateTeamDTO): Promise<Team> {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create team')
    return data
  },

  async getTeamDetails(id: string): Promise<Team> {
    const res = await fetch(`/api/teams/${id}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch team')
    return data
  },

  async updateTeam(id: string, dto: UpdateTeamDTO): Promise<Team> {
    const res = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update team')
    return data
  },

  async deleteTeam(id: string): Promise<void> {
    const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to delete team')
  },

  async addMember(teamId: string, email: string): Promise<TeamMemberItem> {
    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to add member')
    return data
  },

  async removeMember(teamId: string, userId: string): Promise<void> {
    const res = await fetch(`/api/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to remove member')
  },

  async getTeamTasks(teamId: string): Promise<Task[]> {
    const res = await fetch(`/api/teams/${teamId}/tasks`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch team tasks')
    return data
  },

  async createTeamTask(teamId: string, dto: CreateTaskDTO): Promise<Task> {
    const res = await fetch(`/api/teams/${teamId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create team task')
    return data
  },
}
