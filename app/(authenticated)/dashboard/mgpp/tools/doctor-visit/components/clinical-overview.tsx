'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/lib/icons"
import { 
  SYMPTOM_DEFINITIONS,
  TREATMENT_OPTIONS
} from '../types'
import { format, subMonths, isWithinInterval } from 'date-fns'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import type { 
  DoctorVisitRecord, 
  SymptomData,
  QualityOfLife,
  SymptomType,
  FrequencyType,
  TreatmentType
} from '../types'
import { SymptomChart, TreatmentChart, QualityOfLifeChart } from './charts'

interface ChartData {
  date: string;
  intensity: number;
  frequency: FrequencyType;
  treatments: TreatmentType[];
}

interface ClinicalOverviewProps {
  record: DoctorVisitRecord
  symptoms: SymptomData[]
  qualityOfLife: QualityOfLife | null
  onBack: () => void
}

interface TreatmentAnalysis {
  [key: string]: {
    count: number;
    avgIntensity: number;
  }
}

interface TreatmentEntry {
  treatment: string;
  data: {
    count: number;
    avgIntensity: number;
  }
}

export function ClinicalOverview({ record, symptoms, qualityOfLife, onBack }: ClinicalOverviewProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Prepare trend data for each symptom type
  const symptomTrends = useMemo(() => {
    const trends: { [key in SymptomType]?: ChartData[] } = {}
    
    Object.keys(SYMPTOM_DEFINITIONS).forEach(type => {
      const typeSymptoms = symptoms
        .filter(s => s.symptom_type === type)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map(s => ({
          date: format(new Date(s.created_at), 'MM/dd'),
          intensity: s.intensity,
          frequency: s.frequency,
          treatments: s.treatments
        }))
      
      if (typeSymptoms.length > 0) {
        trends[type as SymptomType] = typeSymptoms
      }
    })
    
    return trends
  }, [symptoms])

  // Calculate trigger patterns
  const triggerAnalysis = useMemo(() => {
    const patterns: { [key: string]: number } = {}
    let totalWithTriggers = 0

    symptoms.forEach(symptom => {
      if (symptom.triggers?.hasTrigggers && symptom.triggers.description) {
        totalWithTriggers++
        const words = symptom.triggers.description.toLowerCase().split(/\W+/)
        words.forEach(word => {
          if (word.length > 3) { // Ignore small words
            patterns[word] = (patterns[word] || 0) + 1
          }
        })
      }
    })

    return {
      patterns: Object.entries(patterns)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      totalWithTriggers,
      totalSymptoms: symptoms.length
    }
  }, [symptoms])

  // Calculate time pattern distribution
  const timePatternAnalysis = useMemo(() => {
    const patterns = {
      morning: 0,
      afternoon: 0,
      evening: 0
    }

    let totalWithPatterns = 0

    symptoms.forEach(symptom => {
      if (symptom.time_patterns && symptom.time_patterns.length > 0) {
        totalWithPatterns++
        symptom.time_patterns.forEach(pattern => {
          patterns[pattern]++
        })
      }
    })

    return {
      patterns,
      totalWithPatterns,
      totalSymptoms: symptoms.length
    }
  }, [symptoms])

  // Calculate treatment effectiveness
  const treatmentAnalysis = useMemo<TreatmentAnalysis>(() => {
    const treatments: TreatmentAnalysis = {}

    symptoms.forEach(symptom => {
      symptom.treatments.forEach(treatment => {
        if (!treatments[treatment]) {
          treatments[treatment] = { count: 0, avgIntensity: 0 }
        }
        treatments[treatment].count++
        treatments[treatment].avgIntensity += symptom.intensity
      })
    })

    // Calculate averages
    Object.keys(treatments).forEach(key => {
      treatments[key].avgIntensity /= treatments[key].count
    })

    return treatments
  }, [symptoms])

  // Quality of life trend analysis
  const qolTrends = useMemo(() => {
    if (!qualityOfLife) return []

    return [
      { name: 'Work', impact: qualityOfLife.work_impact },
      { name: 'Household', impact: qualityOfLife.household_impact },
      { name: 'Social', impact: qualityOfLife.social_impact },
      { name: 'Exercise', impact: qualityOfLife.exercise_impact },
      { name: 'Energy', impact: qualityOfLife.energy_level }
    ]
  }, [qualityOfLife])

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // Set initial position and constants
      let yOffset = 10
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 10
      const contentWidth = pageWidth - (margin * 2)
      
      // Helper function to add a new page
      const addNewPage = () => {
        pdf.addPage()
        yOffset = margin
      }

      // Helper function to check and add new page if needed
      const checkNewPage = (neededSpace: number) => {
        if (yOffset + neededSpace > 270) {
          addNewPage()
          return true
        }
        return false
      }

      // Helper function to add section header
      const addSectionHeader = (title: string) => {
        checkNewPage(20)
        pdf.setFontSize(16)
        pdf.text(title, margin, yOffset)
        yOffset += 10
      }

      // Add header
      pdf.setFontSize(20)
      pdf.text('Clinical Report', pageWidth / 2, yOffset, { align: 'center' })
      yOffset += 10

      // Add date
      pdf.setFontSize(12)
      pdf.text(`Generated on: ${format(new Date(), 'MM/dd/yyyy')}`, pageWidth / 2, yOffset, { align: 'center' })
      yOffset += 15

      // Patient Information Section
      addSectionHeader('Patient Information')
      pdf.setFontSize(12)
      pdf.text(`Name: ${record.first_name} ${record.last_name}`, margin + 5, yOffset)
      yOffset += 7
      pdf.text(`Email: ${record.email}`, margin + 5, yOffset)
      yOffset += 7
      if (record.address) {
        pdf.text(`Address: ${record.address}${record.state ? `, ${record.state}` : ''}${record.zip_code ? ` ${record.zip_code}` : ''}`, margin + 5, yOffset)
        yOffset += 7
      }
      pdf.text(`Birth Year: ${record.birth_year}`, margin + 5, yOffset)
      yOffset += 7
      pdf.text(`Years with MG: ${record.years_with_mg}`, margin + 5, yOffset)
      yOffset += 15

      // Detailed Symptom Records Section
      addSectionHeader('Detailed Symptom Records')
      
      // Group symptoms by type for organized presentation
      const symptomsByType = Object.keys(SYMPTOM_DEFINITIONS).reduce((acc, type) => {
        acc[type] = symptoms.filter(s => s.symptom_type === type)
        return acc
      }, {} as { [key: string]: SymptomData[] })

      // Iterate through each symptom type
      for (const [type, typeSymptoms] of Object.entries(symptomsByType)) {
        if (typeSymptoms.length > 0) {
          checkNewPage(30)
          
          // Add symptom type header
          pdf.setFontSize(14)
          const medicalTerm = SYMPTOM_DEFINITIONS[type as SymptomType].medical_term
          pdf.text(medicalTerm, margin, yOffset)
          yOffset += 10

          // Add chart if available
          const chartElement = document.querySelector(`#symptom-chart-${type}`)
          if (chartElement) {
            const canvas = await html2canvas(chartElement as HTMLElement)
            const imgData = canvas.toDataURL('image/png')
            const imgWidth = 190
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            
            checkNewPage(imgHeight + 20)
            pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight)
            yOffset += imgHeight + 10
          }

          // Add detailed records for this symptom type
          pdf.setFontSize(12)
          typeSymptoms
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .forEach(symptom => {
              checkNewPage(40)
              
              // Date and Severity
              pdf.text(`Date: ${format(new Date(symptom.created_at), 'MM/dd/yyyy')}`, margin + 5, yOffset)
              yOffset += 7
              pdf.text(`Severity: ${symptom.intensity}/5`, margin + 5, yOffset)
              yOffset += 7
              
              // Frequency if available
              if (symptom.frequency) {
                pdf.text(`Frequency: ${symptom.frequency}`, margin + 5, yOffset)
                yOffset += 7
              }

              // Treatments
              if (symptom.treatments.length > 0) {
                pdf.text('Treatments:', margin + 5, yOffset)
                yOffset += 7
                symptom.treatments.forEach(treatment => {
                  const treatmentLabel = TREATMENT_OPTIONS.find(t => t.value === treatment)?.label
                  if (treatmentLabel) {
                    pdf.text(`• ${treatmentLabel}`, margin + 10, yOffset)
                    yOffset += 5
                  }
                })
              }

              // Time Patterns
              if (symptom.time_patterns && symptom.time_patterns.length > 0) {
                pdf.text('Time Patterns:', margin + 5, yOffset)
                yOffset += 7
                pdf.text(`• ${symptom.time_patterns.join(', ')}`, margin + 10, yOffset)
                yOffset += 7
              }

              // Triggers
              if (symptom.triggers?.hasTrigggers && symptom.triggers.description) {
                pdf.text('Triggers:', margin + 5, yOffset)
                yOffset += 7
                const splitTriggers = pdf.splitTextToSize(symptom.triggers.description, contentWidth - 15)
                pdf.text(splitTriggers, margin + 10, yOffset)
                yOffset += (splitTriggers.length * 5) + 2
              }

              // Notes
              if (symptom.notes) {
                pdf.text('Notes:', margin + 5, yOffset)
                yOffset += 7
                const splitNotes = pdf.splitTextToSize(symptom.notes, contentWidth - 15)
                pdf.text(splitNotes, margin + 10, yOffset)
                yOffset += (splitNotes.length * 5) + 5
              }

              yOffset += 10 // Space between records
            })
        }
      }

      // Treatment Effectiveness Analysis
      if (Object.keys(treatmentAnalysis).length > 0) {
        addSectionHeader('Treatment Effectiveness Analysis')
        
        // Add chart if available
        const treatmentChartElement = document.querySelector('#treatment-effectiveness-chart')
        if (treatmentChartElement) {
          const canvas = await html2canvas(treatmentChartElement as HTMLElement)
          const imgData = canvas.toDataURL('image/png')
          const imgWidth = 190
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          
          checkNewPage(imgHeight + 20)
          pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight)
          yOffset += imgHeight + 10
        }

        // Detailed treatment statistics
        pdf.setFontSize(12)
        Object.entries(treatmentAnalysis).forEach((entry) => {
          const [treatment, data] = entry as [string, { count: number; avgIntensity: number }]
          const treatmentLabel = TREATMENT_OPTIONS.find(t => t.value === treatment)?.label
          if (treatmentLabel) {
            checkNewPage(25)
            pdf.text(`${treatmentLabel}:`, margin + 5, yOffset)
            yOffset += 7
            pdf.text(`• Usage Count: ${data.count}`, margin + 10, yOffset)
            yOffset += 7
            pdf.text(`• Average Intensity: ${data.avgIntensity.toFixed(1)}/5`, margin + 10, yOffset)
            yOffset += 10
          }
        })
      }

      // Quality of Life Assessment
      if (qualityOfLife) {
        addSectionHeader('Quality of Life Assessment')
        
        // Add QoL chart if available
        const qolChartElement = document.querySelector('#quality-of-life-chart')
        if (qolChartElement) {
          const canvas = await html2canvas(qolChartElement as HTMLElement)
          const imgData = canvas.toDataURL('image/png')
          const imgWidth = 190
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          
          checkNewPage(imgHeight + 20)
          pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight)
          yOffset += imgHeight + 10
        }

        // Detailed QoL metrics
        pdf.setFontSize(12)
        const qolMetrics = [
          { label: 'Work Impact', value: qualityOfLife.work_impact },
          { label: 'Household Impact', value: qualityOfLife.household_impact },
          { label: 'Social Impact', value: qualityOfLife.social_impact },
          { label: 'Exercise Impact', value: qualityOfLife.exercise_impact },
          { label: 'Energy Level', value: qualityOfLife.energy_level }
        ]

        qolMetrics.forEach(metric => {
          checkNewPage(10)
          pdf.text(`${metric.label}: ${metric.value}/5`, margin + 5, yOffset)
          yOffset += 7
        })

        if (qualityOfLife.notes) {
          checkNewPage(20)
          yOffset += 5
          pdf.text('Notes:', margin + 5, yOffset)
          yOffset += 7
          const splitNotes = pdf.splitTextToSize(qualityOfLife.notes, contentWidth - 15)
          pdf.text(splitNotes, margin + 5, yOffset)
          yOffset += (splitNotes.length * 5)
        }
      }

      // Save the PDF
      pdf.save(`clinical-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <Icons.ChevronLeft className="h-4 w-4 mr-2" />
          Back to Symptoms
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Icons.Activity className="h-4 w-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Icons.FileText className="h-4 w-4 mr-2" />
              Export Report
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Overview</CardTitle>
        </CardHeader>
        <CardContent id="clinical-overview-content">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Patient Profile</TabsTrigger>
              <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
              <TabsTrigger value="triggers">Trigger Patterns</TabsTrigger>
              <TabsTrigger value="treatments">Treatment Response</TabsTrigger>
              <TabsTrigger value="qol">Quality of Life</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Patient Demographics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {record.first_name} {record.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{record.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {record.address}
                      {record.state && `, ${record.state}`}
                      {record.zip_code && ` ${record.zip_code}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Birth Year</p>
                    <p className="text-sm text-muted-foreground">{record.birth_year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Years with MG</p>
                    <p className="text-sm text-muted-foreground">{record.years_with_mg}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Symptom Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{symptoms.length}</div>
                        <p className="text-sm text-muted-foreground">Total Records</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {Object.keys(symptomTrends).length}
                        </div>
                        <p className="text-sm text-muted-foreground">Active Symptoms</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {triggerAnalysis.totalWithTriggers}
                        </div>
                        <p className="text-sm text-muted-foreground">Identified Triggers</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="space-y-6">
              {Object.entries(symptomTrends).map(([type, data]) => (
                <Card key={type} className="p-6">
                  <h4 className="text-sm font-medium mb-2">
                    {SYMPTOM_DEFINITIONS[type as SymptomType].medical_term} Trend
                  </h4>
                  <div id={`symptom-chart-${type}`}>
                    <SymptomChart data={data} type={type} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.slice(-1)[0].treatments.map((treatment: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {TREATMENT_OPTIONS.find(t => t.value === treatment)?.label}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="triggers" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Common Triggers</h4>
                  <div className="space-y-4">
                    {triggerAnalysis.patterns.map(([trigger, count], index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="capitalize">{trigger}</span>
                        <Badge variant="secondary">{count} occurrences</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Time Pattern Distribution</h4>
                  <div className="flex flex-col gap-4">
                    {Object.entries(timePatternAnalysis.patterns).map(([time, count]) => (
                      <div key={time} className="flex items-center justify-between">
                        <span className="capitalize">{time}</span>
                        <span>{count} occurrences</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {timePatternAnalysis.totalWithPatterns} out of {timePatternAnalysis.totalSymptoms} records have time patterns.
                    </p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="treatments" className="space-y-6">
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Treatment Effectiveness</h4>
                <div id="treatment-effectiveness-chart">
                  <TreatmentChart
                    data={Object.entries(treatmentAnalysis)
                      .map(([name, data]) => {
                        const treatment = TREATMENT_OPTIONS.find(t => t.value === name)
                        return treatment ? {
                          name: treatment.label as "Medication" | "Physical Therapy" | "Rest" | "Lifestyle Changes" | "None of the Above",
                          count: data.count,
                          avgIntensity: Number(data.avgIntensity.toFixed(1))
                        } : null
                      })
                      .filter((item): item is {
                        name: "Medication" | "Physical Therapy" | "Rest" | "Lifestyle Changes" | "None of the Above";
                        count: number;
                        avgIntensity: number;
                      } => item !== null)
                    }
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="qol" className="space-y-6">
              {qualityOfLife ? (
                <>
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4">Quality of Life Impact</h4>
                    <div id="quality-of-life-chart">
                      <QualityOfLifeChart data={qolTrends} />
                    </div>
                  </Card>

                  {qualityOfLife.notes && (
                    <Card className="p-6">
                      <h4 className="font-semibold mb-2">Additional Notes</h4>
                      <p className="text-muted-foreground">{qualityOfLife.notes}</p>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No quality of life assessment data available.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}