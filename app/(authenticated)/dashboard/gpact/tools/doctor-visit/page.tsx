'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/lib/icons"
import { DoctorVisitClient } from './doctor-visit-client'

export default function GPACTDoctorVisitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Visit Preparation</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          <Icons.ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.AlertCircle className="h-5 w-5" />
            Symptom Tracker and Doctor Visit Preparation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Track your symptoms and prepare effectively for your medical appointments. 
            This tool helps you document your symptoms, their patterns, and impact on your daily life.
          </p>
        </CardContent>
      </Card>

      <DoctorVisitClient />
    </div>
  )
} 