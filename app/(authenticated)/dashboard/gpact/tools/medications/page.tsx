'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from '@/lib/icons'
import { MedicationList } from "@/components/medications/medication-list"
import { MedicationForm } from "@/components/medications/medication-form"
import { MedicationTimeline } from "@/components/medications/medication-timeline"
import { generateMedicationPDF } from "@/components/medications/medication-export"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'
import type { Medication } from "@/types/medications"
import type { Database } from 'wellspace/types/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'
import { MedicationEventTimeline } from "@/components/medications/medication-event-timeline"

export default function MedicationsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const { toast } = useToast()
  const [discontinueModalOpen, setDiscontinueModalOpen] = useState(false)
  const [medicationToDiscontinue, setMedicationToDiscontinue] = useState<Medication | null>(null)
  const [discontinueReason, setDiscontinueReason] = useState('')
  const [discontinueLoading, setDiscontinueLoading] = useState(false)
  const supabase = createClientComponentClient()
  type MedicationHistoryEvent = any
  const [events, setEvents] = useState<MedicationHistoryEvent[]>([])

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication)
    setShowForm(true)
  }

  const handleMedicationsLoaded = (loadedMedications: Medication[]) => {
    setMedications(loadedMedications)
  }

  // Fetch medication events for export and timeline
  useEffect(() => {
    const fetchEvents = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from('medication_history')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true })
      if (!error && data) setEvents(data)
    }
    fetchEvents()
  }, [supabase])

  const handleFormClose = () => {
    setShowForm(false)
    setEditingMedication(null)
  }

  const handleFormSuccess = async (medicationData: any, isEdit: boolean = false) => {
    if (isEdit && editingMedication) {
      // Log the change event in medication_history
      try {
        const { error: historyError } = await supabase
          .from('medication_history')
          .insert({
            medication_id: editingMedication.id,
            user_id: editingMedication.user_id,
            event_type: 'change',
            event_date: new Date().toISOString(),
            reason: `Medication updated - Previous: ${editingMedication.dosage} ${editingMedication.frequency}`,
            dosage: medicationData.dosage,
            frequency: medicationData.frequency,
            notes: medicationData.notes,
            drug_name: editingMedication.drug_name,
            indication: editingMedication.indication,
            timing: editingMedication.timing,
            gastroparesis_specific: editingMedication.gastroparesis_specific,
            as_needed: editingMedication.as_needed,
            symptom_target: editingMedication.symptom_target,
          })
        if (historyError) {
          console.error('Error logging medication change:', historyError)
        }
        // Refresh events after change
        const { data, error } = await supabase
          .from('medication_history')
          .select('*')
          .eq('user_id', editingMedication.user_id)
          .order('event_date', { ascending: true })
        if (!error && data) setEvents(data)
      } catch (error) {
        console.error('Error logging medication change:', error)
      }
    }
    
    handleFormClose()
  }

  const handleExport = async () => {
    try {
      // Fetch latest events before export
      const { data: { user } } = await supabase.auth.getUser()
      let exportEvents = events
      if (user) {
        const { data, error } = await supabase
          .from('medication_history')
          .select('*')
          .eq('user_id', user.id)
          .order('event_date', { ascending: true })
        if (!error && data) exportEvents = data
      }
      const pdfBytes = await generateMedicationPDF(medications, exportEvents)
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download', 
        `gpact-medication-log-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Medication log exported successfully"
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDiscontinue = (medication: Medication) => {
    setMedicationToDiscontinue(medication)
    setDiscontinueModalOpen(true)
  }

  const handleDiscontinueConfirm = async () => {
    if (!medicationToDiscontinue) return
    setDiscontinueLoading(true)
    try {
      // Update medication as discontinued
      const { error: updateError } = await supabase
        .from('medications')
        .update({
          still_using: false,
          status: 'discontinued',
          stop_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', medicationToDiscontinue.id)

      if (updateError) throw updateError

      // Log event in medication_history
      const { error: historyError } = await supabase
        .from('medication_history')
        .insert({
          medication_id: medicationToDiscontinue.id,
          user_id: medicationToDiscontinue.user_id,
          event_type: 'stop',
          event_date: new Date().toISOString(),
          reason: discontinueReason,
          dosage: medicationToDiscontinue.dosage,
          frequency: medicationToDiscontinue.frequency,
          notes: medicationToDiscontinue.notes,
          drug_name: medicationToDiscontinue.drug_name,
          indication: medicationToDiscontinue.indication,
          timing: medicationToDiscontinue.timing,
          gastroparesis_specific: medicationToDiscontinue.gastroparesis_specific,
          as_needed: medicationToDiscontinue.as_needed,
          symptom_target: medicationToDiscontinue.symptom_target,
        })

      if (historyError) throw historyError

      toast({
        title: 'Medication discontinued',
        description: 'The medication was discontinued and logged.',
      })
      setDiscontinueModalOpen(false)
      setMedicationToDiscontinue(null)
      setDiscontinueReason('')
      // Refresh list
      // Optionally: refetch medications
      // We'll trigger handleMedicationsLoaded by updating MedicationList key
      // Or you can call a fetch function here if needed
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to discontinue medication. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDiscontinueLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medication Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Icons.Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => {
            setEditingMedication(null)
            setShowForm(true)
          }}>
            <Icons.Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
          <Button asChild>
            <Link href="/dashboard/gpact">
              Back to Tools
              <Icons.ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingMedication ? 'Edit Medication' : 'Add New Medication'}</CardTitle>
            </CardHeader>
            <CardContent>
              <MedicationForm 
                onSuccess={handleFormSuccess}
                editingMedication={editingMedication}
              />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">
              <Icons.FileText className="mr-2 h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Icons.FileText className="mr-2 h-4 w-4" />
              Timeline View
            </TabsTrigger>
            <TabsTrigger value="event-timeline">
              <Icons.FileText className="mr-2 h-4 w-4" />
              Event Timeline
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <MedicationList 
              onEdit={handleEdit}
              onMedicationsLoaded={handleMedicationsLoaded}
              onDiscontinue={handleDiscontinue}
            />
          </TabsContent>
          <TabsContent value="timeline">
            <MedicationTimeline medications={medications} />
          </TabsContent>
          <TabsContent value="event-timeline">
            <MedicationEventTimeline />
          </TabsContent>
        </Tabs>
      </div>
      {/* Discontinue Modal */}
      <Dialog open={discontinueModalOpen} onOpenChange={setDiscontinueModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discontinue Medication</DialogTitle>
            <DialogDescription>
              Please provide a reason for discontinuing this medication. This will be logged in your medication history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="discontinue-reason">Reason</Label>
            <Textarea
              id="discontinue-reason"
              value={discontinueReason}
              onChange={e => setDiscontinueReason(e.target.value)}
              placeholder="Reason for discontinuation (required)"
              required
              minLength={2}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDiscontinueConfirm}
              disabled={discontinueLoading || !discontinueReason.trim()}
            >
              {discontinueLoading ? 'Discontinuing...' : 'Discontinue'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 