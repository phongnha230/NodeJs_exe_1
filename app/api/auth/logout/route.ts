import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error: unknown) {
    console.error('Logout API Error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
