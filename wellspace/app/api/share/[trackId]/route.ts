import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type Track = Database['public']['Tables']['user_health_tracks']['Row']

export async function GET(
  request: NextRequest,
  context: { params: { trackId: string } }
) {
  const { trackId } = context.params
  
  if (!trackId) {
    return NextResponse.json(
      { error: 'Track ID is required' },
      { status: 400 }
    )
  }

  try {
    const { data: track, error } = await supabase
      .from('user_health_tracks')
      .select(`
        id,
        current_day,
        progress,
        module:health_track_modules (
          title
        )
      `)
      .eq('id', trackId)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      )
    }

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(track)

  } catch (error) {
    console.error('Share API Error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}