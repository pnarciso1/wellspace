'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Download } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MedicalRecord {
  id: string
  user_id: string
  file_path: string
  file_name: string
  file_type: string
  file_size: number
  description: string
  record_type: string
  upload_date: string
}

export default function MedicalRecords() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [recordType, setRecordType] = useState('Medical History')
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    fetchRecords()
  }, [])

  async function fetchRecords() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No authenticated user found')
      }

      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })
      
      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Failed to fetch records: ${error.message}`)
      }
      
      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching records:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch records')
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    if (!file) {
      setError('Please select a file')
      return
    }

    try {
      setUploading(true)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No authenticated user found')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now().toString()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Ensure we have the correct file type
      const fileType = file.type || `application/${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('medical_records')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { error: insertError } = await supabase
        .from('medical_records')
        .insert({
          user_id: user.id,
          file_path: filePath,
          file_name: file.name,
          file_type: fileType,
          file_size: file.size,
          description: description,
          record_type: recordType
        })

      if (insertError) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage
          .from('medical_records')
          .remove([filePath])
        throw new Error(`Database insert failed: ${insertError.message}`)
      }

      await fetchRecords()
      setDescription('')
      setFile(null)
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (error) {
      console.error('Upload process error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload record')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (record: MedicalRecord) => {
    try {
      setDownloading(record.id)
      setError(null)

      const { data, error } = await supabase.storage
        .from('medical_records')
        .download(record.file_path)

      if (error) {
        throw error
      }

      // Create blob and download
      const blob = new Blob([data], { type: record.file_type })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = record.file_name
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      setError('Failed to download file. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Medical Records</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="file">File (PDF, JPEG, PNG)</Label>
              <input
                id="file"
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90"
              />
            </div>
            
            <div>
              <Label htmlFor="record-type">Record Type</Label>
              <Select 
                value={recordType}
                onValueChange={setRecordType}
              >
                <SelectTrigger id="record-type">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical History">Medical History</SelectItem>
                  <SelectItem value="Lab Results">Lab Results</SelectItem>
                  <SelectItem value="Imaging">Imaging</SelectItem>
                  <SelectItem value="Prescriptions">Prescriptions</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <Button
              type="submit"
              disabled={uploading || !file}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground">No medical records found</p>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border-b pb-4 last:border-0">
                  <p className="font-semibold">{record.record_type}</p>
                  <p className="text-sm text-muted-foreground">{record.description}</p>
                  <Button
                    variant="link"
                    onClick={() => handleDownload(record)}
                    disabled={downloading === record.id}
                    className="mt-2 h-auto p-0 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {downloading === record.id ? 'Downloading...' : record.file_name}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}




















































