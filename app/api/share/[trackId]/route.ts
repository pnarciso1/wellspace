import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { trackId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: track } = await supabase
    .from('user_health_tracks')
    .select(`
      *,
      module:health_track_modules (
        title,
        description,
        duration_days
      )
    `)
    .eq('id', params.trackId)
    .single()

  if (!track) {
    return NextResponse.json(
      { error: 'Track not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    title: track.module.title,
    currentDay: track.current_day,
    totalDays: track.module.duration_days,
    streak: track.progress.current_streak,
    lastActive: track.last_active
  })
} 