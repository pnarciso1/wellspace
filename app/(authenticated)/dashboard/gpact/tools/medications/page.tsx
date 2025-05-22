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

export default function MedicationsPage() {
  const [showForm, setShowForm] = useState(false)
  const [medications, setMedications] = useState<Medication[]>([])
  const { toast } = useToast()

  const handleEdit = (medication: Medication) => {
    // Handle edit functionality
    console.log('Edit medication:', medication)
  }

  const handleMedicationsLoaded = (loadedMedications: Medication[]) => {
    setMedications(loadedMedications)
  }

  const handleFormClose = () => {
    setShowForm(false)
  }

  const handleExport = async () => {
    try {
      const pdfBytes = await generateMedicationPDF(medications)
      
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medication Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Icons.Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => setShowForm(true)}>
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
              <CardTitle>Add New Medication</CardTitle>
            </CardHeader>
            <CardContent>
              <MedicationForm onSuccess={handleFormClose} />
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
          </TabsList>
          <TabsContent value="list">
            <MedicationList 
              onEdit={handleEdit}
              onMedicationsLoaded={handleMedicationsLoaded}
            />
          </TabsContent>
          <TabsContent value="timeline">
            <MedicationTimeline medications={medications} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 