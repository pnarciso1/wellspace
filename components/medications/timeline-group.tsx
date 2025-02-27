'use client'

import { format } from 'date-fns'
import type { Medication } from '@/types/medications'
import { Card, CardContent } from "@/components/ui/card"

interface TimelineGroupProps {
  label: string
  medications: Medication[]
  expandedMedId: string | null
  onMedicationClick: (medicationId: string) => void
}

export function TimelineGroup({ 
  label, 
  medications, 
  expandedMedId, 
  onMedicationClick 
}: TimelineGroupProps) {
  const getStatusIndicator = (medication: Medication) => {
    if (medication.still_using) return "✓"
    if (medication.as_needed) return "⚡"
    return "×"
  }

  const getStatusClass = (medication: Medication) => {
    if (medication.still_using) return "bg-green-100 text-green-800"
    if (medication.as_needed) return "bg-blue-100 text-blue-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{label}</h3>
      
      <div className="space-y-4">
        {medications.map((med) => (
          <div key={med.id} className="relative pl-8">
            {/* Timeline dot */}
            <div className="absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-primary" />
            
            <Card 
              className={`transition-all duration-200 hover:shadow-md cursor-pointer
                ${expandedMedId === med.id ? 'border-primary' : ''}`}
              onClick={() => onMedicationClick(med.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm ${getStatusClass(med)}`}>
                      {getStatusIndicator(med)}
                    </span>
                    <h4 className="font-medium">{med.drug_name}</h4>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(med.start_date), 'MMM d, yyyy')}
                  </span>
                </div>

                {expandedMedId === med.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Dosage:</strong> {med.dosage}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Frequency:</strong> {med.frequency}
                    </p>
                    {med.notes && (
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {med.notes}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong> {med.still_using ? 'Active' : 'Discontinued'}
                      {!med.still_using && med.stop_date && ` (${format(new Date(med.stop_date), 'MMM d, yyyy')})`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
