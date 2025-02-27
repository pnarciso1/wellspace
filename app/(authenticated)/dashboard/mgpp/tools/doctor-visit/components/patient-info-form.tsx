'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface PatientInfoFormProps {
  onSubmit: (data: {
    first_name: string
    last_name: string
    email: string
    address: string
    state: string
    zip_code: string
    birth_year: string
    years_with_mg: string
  }) => void
}

export function PatientInfoForm({ onSubmit }: PatientInfoFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit({
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      state: formData.get('state') as string,
      zip_code: formData.get('zip_code') as string,
      birth_year: formData.get('birth_year') as string,
      years_with_mg: formData.get('years_with_mg') as string,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" name="first_name" required />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" name="last_name" required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input id="zip_code" name="zip_code" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birth_year">Birth Year</Label>
              <Input id="birth_year" name="birth_year" type="number" required />
            </div>
            <div>
              <Label htmlFor="years_with_mg">Years with MG</Label>
              <Input id="years_with_mg" name="years_with_mg" type="number" required />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Continue to Symptoms</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
