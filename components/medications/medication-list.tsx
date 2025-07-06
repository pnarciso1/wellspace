'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Icons } from '@/lib/icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Medication } from '@/types/medications'
import type { Database } from 'wellspace/types/supabase'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface MedicationListProps {
  onEdit: (medication: Medication) => void
  onMedicationsLoaded: (medications: Medication[]) => void
  onDiscontinue?: (medication: Medication) => void
}

export function MedicationList({ onEdit, onMedicationsLoaded, onDiscontinue }: MedicationListProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: medications, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false })

        if (error) throw error

        setMedications(medications)
        onMedicationsLoaded(medications)
      } catch (error) {
        console.error('Error fetching medications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedications()
  }, [supabase, onMedicationsLoaded])

  if (loading) {
    return <div>Loading medications...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell className="font-medium">
                {medication.drug_name}
                {medication.gastroparesis_specific && (
                  <span className="ml-2 text-xs text-primary">GP</span>
                )}
              </TableCell>
              <TableCell>{medication.dosage}</TableCell>
              <TableCell>
                {medication.frequency}
                {medication.as_needed && (
                  <span className="ml-2 text-xs text-muted-foreground">(as needed)</span>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(medication.start_date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${medication.still_using ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {medication.still_using ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icons.Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(medication)}>
                      <Icons.Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDiscontinue && onDiscontinue(medication)}>
                      <Icons.Trash className="mr-2 h-4 w-4 text-red-500" /> Discontinue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {medications.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No medications found. Add your first medication to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
