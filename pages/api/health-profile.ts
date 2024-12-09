import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return res.status(401).json({
      error: 'not_authenticated',
      description: 'The user does not have an active session or is not authenticated',
    })

  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('health_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error) throw error

        res.status(200).json(data)
      } catch (error) {
        res.status(500).json({ error: 'Error fetching health profile' })
      }
      break

    case 'POST':
    case 'PUT':
      try {
        const { data, error } = await supabase
          .from('health_profiles')
          .upsert({ ...req.body, user_id: session.user.id })
          .select()
          .single()

        if (error) throw error

        res.status(200).json(data)
      } catch (error) {
        res.status(500).json({ error: 'Error updating health profile' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}


