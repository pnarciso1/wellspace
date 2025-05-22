'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface VisitInfoFormProps {
  onSubmit: (data: {
    visit_date: string
    doctor_name: string
    visit_reason: string
    diagnosis: string
  }) => void
  loading?: boolean
}

export function VisitInfoForm({ onSubmit, loading }: VisitInfoFormProps) {
  const [visitDate, setVisitDate] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [visitReason, setVisitReason] = useState('')
  const [diagnosis, setDiagnosis] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      visit_date: visitDate,
      doctor_name: doctorName,
      visit_reason: visitReason,
      diagnosis
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Visit Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="visit-date">Visit Date</Label>
            <Input
              id="visit-date"
              type="date"
              value={visitDate}
              onChange={e => setVisitDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="doctor-name">Doctor's Name</Label>
            <Input
              id="doctor-name"
              value={doctorName}
              onChange={e => setDoctorName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="visit-reason">Reason for Visit</Label>
            <Input
              id="visit-reason"
              value={visitReason}
              onChange={e => setVisitReason(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="diagnosis">Diagnosis (optional)</Label>
            <Input
              id="diagnosis"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Continue to Symptoms'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 