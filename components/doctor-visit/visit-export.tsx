'use client'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { format } from 'date-fns'
import { symptomCategories } from './symptom-category-filter'
import type { 
  DoctorVisitRecord, 
  Symptom, 
  VisitImpact, 
  VisitHistory,
  SymptomType,
  QualityOfLife 
} from '@/types/doctor-visit'

interface VisitExportData {
  record: DoctorVisitRecord
  symptoms: Symptom[]
  impact: VisitImpact
  history: VisitHistory
  qualityOfLife?: QualityOfLife
}

export async function generateVisitPDF(data: VisitExportData) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  // Add a page
  const page = pdfDoc.addPage([612, 792]) // US Letter size
  const { width, height } = page.getSize()
  
  // Add header
  page.drawText('Myasthenia Gravis Patient Program', {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0.7)
  })

  page.drawText('Doctor Visit Report', {
    x: 50,
    y: height - 80,
    size: 20,
    font: boldFont
  })

  // Add date and patient info
  let yPosition = height - 120
  
  page.drawText(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font
  })

  yPosition -= 40

  // Patient Information
  page.drawText('Patient Information:', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont
  })

  yPosition -= 25

  // Format patient info to avoid "null" values
  const formatValue = (value: string | null): string => 
    value ? value.toString().trim() : ''

  const patientInfo = [
    { 
      label: 'Name', 
      value: `${formatValue(data.record.first_name)} ${formatValue(data.record.last_name)}`.trim() || 'Not provided'
    },
    { 
      label: 'Email', 
      value: formatValue(data.record.email) || 'Not provided'
    },
    { 
      label: 'Address', 
      value: [
        formatValue(data.record.address),
        formatValue(data.record.state),
        formatValue(data.record.zip_code)
      ].filter(Boolean).join(', ') || 'Not provided'
    },
    { 
      label: 'Birth Year', 
      value: formatValue(data.record.birth_year) || 'Not provided'
    },
    { 
      label: 'Years with MG', 
      value: formatValue(data.record.years_with_mg) || 'Not provided'
    }
  ]

  for (const info of patientInfo) {
    page.drawText(`${info.label}:`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: boldFont
    })
    page.drawText(info.value, {
      x: 200,
      y: yPosition,
      size: 12,
      font
    })
    yPosition -= 20
  }

  yPosition -= 20

  // Quality of Life Assessment
  if (data.qualityOfLife) {
    page.drawText('Quality of Life Assessment:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    })

    yPosition -= 25

    const qolCategories = [
      {
        title: 'Daily Activities Impact',
        items: [
          { label: 'Work/School', value: data.qualityOfLife.work_impact },
          { label: 'Household Tasks', value: data.qualityOfLife.household_impact },
          { label: 'Social Activities', value: data.qualityOfLife.social_impact },
          { label: 'Exercise/Physical Activity', value: data.qualityOfLife.exercise_impact }
        ]
      },
      {
        title: 'Physical Wellbeing',
        items: [
          { label: 'Energy Level', value: data.qualityOfLife.energy_level },
          { label: 'Sleep Quality', value: data.qualityOfLife.sleep_quality },
          { label: 'Physical Comfort', value: data.qualityOfLife.physical_comfort }
        ]
      },
      {
        title: 'Emotional Wellbeing',
        items: [
          { label: 'Mood', value: data.qualityOfLife.mood_state },
          { label: 'Anxiety Level', value: data.qualityOfLife.anxiety_level },
          { label: 'Stress Management', value: data.qualityOfLife.stress_management }
        ]
      }
    ]

    for (const category of qolCategories) {
      page.drawText(category.title + ':', {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont
      })
      yPosition -= 20

      for (const item of category.items) {
        if (item.value !== undefined && item.value !== null) {
          page.drawText(`• ${item.label}: ${item.value}/5`, {
            x: 90,
            y: yPosition,
            size: 10,
            font
          })
          yPosition -= 15
        }
      }
      yPosition -= 10
    }
  }

  // Symptom Summary
  yPosition -= 20
  page.drawText('Current Symptoms:', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont
  })

  yPosition -= 25

  // Group symptoms by presence
  const presentSymptoms = data.symptoms.filter(s => s.is_present)
  const absentSymptoms = data.symptoms.filter(s => !s.is_present)

  if (presentSymptoms.length === 0) {
    page.drawText('No current symptoms reported', {
      x: 70,
      y: yPosition,
      size: 12,
      font
    })
    yPosition -= 20
  }

  for (const symptom of presentSymptoms) {
    const category = symptomCategories[symptom.symptom_type as SymptomType]
    
    page.drawText(`• ${category.label}:`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: boldFont
    })
    yPosition -= 20

    if (symptom.frequency) {
      page.drawText(`  Frequency: ${symptom.frequency.toLowerCase()}`, {
        x: 90,
        y: yPosition,
        size: 10,
        font
      })
      yPosition -= 15
    }

    if (symptom.intensity) {
      page.drawText(`  Severity: ${symptom.intensity}/5`, {
        x: 90,
        y: yPosition,
        size: 10,
        font
      })
      yPosition -= 15
    }

    if (symptom.triggers && symptom.triggers.length > 0) {
      page.drawText(`  Triggers: ${symptom.triggers.join(', ')}`, {
        x: 90,
        y: yPosition,
        size: 10,
        font
      })
      yPosition -= 15
    }

    if (symptom.notes) {
      const notes = `  Notes: ${symptom.notes}`
      const words = notes.split(' ')
      let line = ''
      
      for (const word of words) {
        const testLine = line + word + ' '
        const width = font.widthOfTextAtSize(testLine, 10)
        
        if (width > 400) {
          page.drawText(line, {
            x: 90,
            y: yPosition,
            size: 10,
            font
          })
          yPosition -= 15
          line = word + ' '
        } else {
          line = testLine
        }
      }
      
      if (line) {
        page.drawText(line, {
          x: 90,
          y: yPosition,
          size: 10,
          font
        })
        yPosition -= 15
      }
    }

    yPosition -= 10
  }

  // Impact Summary
  if (data.impact) {
    yPosition -= 20
    page.drawText('Impact on Daily Life:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    })

    yPosition -= 25

    const impactAreas = [
      { label: 'Overall Wellbeing', value: data.impact.overall_wellbeing },
      { label: 'Fatigue Level', value: data.impact.fatigue_level },
      { label: 'Stress Level', value: data.impact.stress_level },
      { label: 'Sleep Quality', value: data.impact.sleep_quality }
    ]

    for (const area of impactAreas) {
      if (area.value) {
        page.drawText(`• ${area.label}: ${area.value}/5`, {
          x: 70,
          y: yPosition,
          size: 10,
          font
        })
        yPosition -= 15
      }
    }

    if (data.impact.notes) {
      yPosition -= 10
      page.drawText('Additional Notes:', {
        x: 70,
        y: yPosition,
        size: 10,
        font: boldFont
      })
      yPosition -= 15

      const notes = data.impact.notes
      const words = notes.split(' ')
      let line = ''
      
      for (const word of words) {
        const testLine = line + word + ' '
        const width = font.widthOfTextAtSize(testLine, 10)
        
        if (width > 400) {
          page.drawText(line, {
            x: 90,
            y: yPosition,
            size: 10,
            font
          })
          yPosition -= 15
          line = word + ' '
        } else {
          line = testLine
        }
      }
      
      if (line) {
        page.drawText(line, {
          x: 90,
          y: yPosition,
          size: 10,
          font
        })
        yPosition -= 15
      }
    }
  }

  // Add footer
  const footerText = 'This report is part of the MGPP Doctor Visit Preparation System'
  const footerWidth = font.widthOfTextAtSize(footerText, 10)
  page.drawText(footerText, {
    x: (width - footerWidth) / 2,
    y: 30,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5)
  })

  // Generate PDF bytes
  return await pdfDoc.save()
}
