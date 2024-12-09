'use client'

import { useEffect, useState } from 'react'

export default function EnvironmentTest() {
  const [supabaseUrl, setSupabaseUrl] = useState<string | undefined>()
  const [supabaseKeySet, setSupabaseKeySet] = useState<boolean>(false)

  useEffect(() => {
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
    setSupabaseKeySet(!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Environment Variables Test</h2>
      <p>Supabase URL: {supabaseUrl || 'Not set'}</p>
      <p>Supabase Anon Key: {supabaseKeySet ? 'Set' : 'Not set'}</p>
    </div>
  )
}

