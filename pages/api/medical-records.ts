import type { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import formidable from 'formidable'
import { createReadStream } from 'fs'
import type { Database } from '@/types/database'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient<Database>({ req, res })

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    switch (req.method) {
      case 'GET':
        const { data: records, error: fetchError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('user_id', session.user.id)
          .order('upload_date', { ascending: false })

        if (fetchError) throw fetchError
        return res.status(200).json(records)

      case 'POST':
        const form = formidable({})
        const [fields, files] = await form.parse(req)
        const uploadedFile = files.file?.[0]
        
        if (!uploadedFile) {
          return res.status(400).json({ error: 'No file provided' })
        }

        const file_name = uploadedFile.originalFilename || 'unnamed_file'
        const file_path = `${session.user.id}/${Date.now()}-${file_name}`
        
        const fileStream = createReadStream(uploadedFile.filepath)
        const chunks: Buffer[] = []
        for await (const chunk of fileStream) {
          chunks.push(Buffer.from(chunk))
        }
        const buffer = Buffer.concat(chunks)

        const { error: uploadError } = await supabase.storage
          .from('medical_records')
          .upload(file_path, buffer)

        if (uploadError) throw uploadError

        const { data: record, error: insertError } = await supabase
          .from('medical_records')
          .insert({
            user_id: session.user.id,
            file_name,
            file_path,
            file_type: uploadedFile.mimetype || 'application/octet-stream',
            file_size: uploadedFile.size,
            description: fields.description?.[0] || null,
            record_type: fields.record_type?.[0] || null,
          })
          .select()
          .single()

        if (insertError) throw insertError
        return res.status(200).json(record)

      case 'DELETE':
        const { id } = req.query
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid record ID' })
        }

        const { error: deleteError } = await supabase
          .from('medical_records')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id)

        if (deleteError) throw deleteError
        return res.status(200).json({ message: 'Record deleted successfully' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}









































