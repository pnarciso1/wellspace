'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Edit2, Trash2 } from 'lucide-react'
import type { Medication } from '@/types/medications'

interface MedicationListProps {
  onEdit: (medication: Medication) => void
  onMedicationsLoaded: (medications: Medication[]) => void
}

export function MedicationList({ onEdit, onMedicationsLoaded }: MedicationListProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchMedications()
  }, [])

  const fetchMedications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const medicationsData = data || []
      setMedications(medicationsData)
      onMedicationsLoaded(medicationsData) // Pass medications up to parent

    } catch (error) {
      console.error('Error fetching medications:', error)
      toast({
        title: "Error",
        description: "Failed to load medications. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)

      if (error) throw error

      const updatedMedications = medications.filter(med => med.id !== id)
      setMedications(updatedMedications)
      onMedicationsLoaded(updatedMedications) // Update parent after deletion

      toast({
        title: "Success",
        description: "Medication deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting medication:', error)
      toast({
        title: "Error",
        description: "Failed to delete medication. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (medications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No medications added yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <Card key={medication.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-2">{medication.drug_name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Dosage: {medication.dosage}</p>
                  <p>Frequency: {medication.frequency}</p>
                  {medication.timing && <p>Timing: {medication.timing}</p>}
                  <p>Started: {new Date(medication.start_date).toLocaleDateString()}</p>
                  {medication.stop_date && (
                    <p>Stopped: {new Date(medication.stop_date).toLocaleDateString()}</p>
                  )}
                  {medication.indication && (
                    <p>Indication: {medication.indication}</p>
                  )}
                </div>
                {medication.notes && (
                  <p className="mt-2 text-sm italic">{medication.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(medication)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(medication.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
