import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function updatePassword(password: string, token: string) {
  const supabase = createClientComponentClient()

  try {
    // Exchange the recovery token for a session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(token)
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      throw new Error('Invalid or expired reset link')
    }

    // Update password with the new session
    const { error: updateError } = await supabase.auth.updateUser({ password })
    
    if (updateError) {
      console.error('Update error:', updateError)
      throw new Error('Failed to update password')
    }
  } catch (error) {
    console.error('Reset error:', error)
    throw error
  }
} 