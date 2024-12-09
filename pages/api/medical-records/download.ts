import { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient<Database>({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({
      error: 'not_authenticated',
      description: 'The user does not have an active session or is not authenticated',
    })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid record ID' })
  }

  try {
    const { data: record, error: fetchError } = await supabase
      .from('medical_records')
      .select('file_path, file_name')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError) throw fetchError
    if (!record) return res.status(404).json({ error: 'Record not found' })

    const { data, error } = await supabase.storage
      .from('medical_records')
      .download(record.file_path)

    if (error) throw error

    res.setHeader('Content-Type', data.type)
    res.setHeader('Content-Disposition', `attachment; filename=${record.file_name}`)
    res.send(data)
  } catch (error: any) {
    console.error('Error in download handler:', error)
    res.status(400).json({ error: error.message })
  }
}











