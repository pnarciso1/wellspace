'use client'

import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import type { Medication } from '@/types/medications'

interface MedicationTimelineProps {
  medications: Medication[]
}

export function MedicationTimeline({ medications }: MedicationTimelineProps) {
  // Group medications by month
  const groupedMedications = medications.reduce((groups, medication) => {
    const month = format(new Date(medication.start_date), 'MMMM yyyy')
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(medication)
    return groups
  }, {} as Record<string, Medication[]>)

  return (
    <div className="space-y-8">
      {Object.entries(groupedMedications).map(([month, monthMedications]) => (
        <div key={month}>
          <h3 className="text-lg font-semibold mb-4">{month}</h3>
          <div className="space-y-4">
            {monthMedications.map((medication) => (
              <Card key={medication.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg mb-2">
                        {medication.drug_name}
                        {medication.gastroparesis_specific && (
                          <span className="ml-2 text-xs text-primary">GP</span>
                        )}
                      </h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Dosage: {medication.dosage}</p>
                        <p>
                          Frequency: {medication.frequency}
                          {medication.as_needed && (
                            <span className="ml-2">(as needed)</span>
                          )}
                        </p>
                        {medication.timing && <p>Timing: {medication.timing}</p>}
                        <p>Started: {format(new Date(medication.start_date), 'MMM d, yyyy')}</p>
                        {medication.stop_date && (
                          <p>Stopped: {format(new Date(medication.stop_date), 'MMM d, yyyy')}</p>
                        )}
                        {medication.indication && (
                          <p>Indication: {medication.indication}</p>
                        )}
                      </div>
                      {medication.notes && (
                        <p className="mt-2 text-sm italic">{medication.notes}</p>
                      )}
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${medication.still_using ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {medication.still_using ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      {medications.length === 0 && (
        <div className="text-center text-muted-foreground">
          No medications found. Add your first medication to get started.
        </div>
      )}
    </div>
  )
}
