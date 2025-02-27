import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { format } from 'date-fns'

interface ExportData {
  record: {
    first_name: string
    last_name: string
    email: string
    address: string
    state: string
    zip_code: string
    birth_year: string
    years_with_mg: string
    created_at: string
  }
  symptoms: Array<{
    symptom_type: string
    is_present: boolean
    frequency: string
    intensity: number
    treatments: string[]
    context: string[]
    time_patterns: string[]
    notes?: string
  }>
  qualityOfLife: {
    work_impact: number
    household_impact: number
    social_impact: number
    exercise_impact: number
    energy_level: number
    notes?: string
  } | null
}

export async function generateVisitPDF(data: ExportData) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const page = pdfDoc.addPage([612, 792]) // US Letter
  const { width, height } = page.getSize()
  
  let yPos = height - 50

  // Header
  page.drawText('Myasthenia Gravis Patient Program', {
    x: 50,
    y: yPos,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0.7)
  })

  yPos -= 30
  page.drawText('Doctor Visit Report', {
    x: 50,
    y: yPos,
    size: 20,
    font: boldFont
  })

  yPos -= 30
  page.drawText(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, {
    x: 50,
    y: yPos,
    size: 12,
    font
  })

  // Personal Information
  yPos -= 40
  page.drawText('Personal Information', {
    x: 50,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0.7)
  })

  yPos -= 25
  page.drawText(`Name: ${data.record.first_name} ${data.record.last_name}`, {
    x: 70,
    y: yPos,
    size: 12,
    font
  })

  yPos -= 20
  page.drawText(`Email: ${data.record.email}`, {
    x: 70,
    y: yPos,
    size: 12,
    font
  })

  yPos -= 20
  page.drawText(`Address: ${data.record.address}`, {
    x: 70,
    y: yPos,
    size: 12,
    font
  })

  yPos -= 20
  page.drawText(`${data.record.state}, ${data.record.zip_code}`, {
    x: 70,
    y: yPos,
    size: 12,
    font
  })

  yPos -= 20
  page.drawText(`Birth Year: ${data.record.birth_year}`, {
    x: 70,
    y: yPos,
    size: 12,
    font
  })

  yPos -= 20
  page.drawText(`Years with MG: ${data.record.years_with_mg}`, {
    x: 70,
    y: yPos,
    size: 12,
    font
  })

  // Symptoms
  yPos -= 40
  page.drawText('Symptoms', {
    x: 50,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0.7)
  })

  for (const symptom of data.symptoms) {
    yPos -= 30
    page.drawText(`• ${symptom.symptom_type}`, {
      x: 70,
      y: yPos,
      size: 12,
      font: boldFont
    })

    yPos -= 20
    page.drawText(`Intensity: ${symptom.intensity}/5`, {
      x: 90,
      y: yPos,
      size: 10,
      font
    })

    yPos -= 15
    page.drawText(`Frequency: ${symptom.frequency}`, {
      x: 90,
      y: yPos,
      size: 10,
      font
    })

    if (symptom.treatments.length > 0) {
      yPos -= 15
      page.drawText('Treatments:', {
        x: 90,
        y: yPos,
        size: 10,
        font
      })
      
      for (const treatment of symptom.treatments) {
        yPos -= 15
        page.drawText(`- ${treatment}`, {
          x: 110,
          y: yPos,
          size: 10,
          font
        })
      }
    }

    if (symptom.context.length > 0) {
      yPos -= 15
      page.drawText('Context:', {
        x: 90,
        y: yPos,
        size: 10,
        font
      })
      
      for (const ctx of symptom.context) {
        yPos -= 15
        page.drawText(`- ${ctx}`, {
          x: 110,
          y: yPos,
          size: 10,
          font
        })
      }
    }
  }

  // Quality of Life
  if (data.qualityOfLife) {
    yPos -= 40
    page.drawText('Quality of Life Assessment', {
      x: 50,
      y: yPos,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0.7)
    })

    yPos -= 25
    page.drawText(`Work Impact: ${data.qualityOfLife.work_impact}/5`, {
      x: 70,
      y: yPos,
      size: 12,
      font
    })

    yPos -= 20
    page.drawText(`Household Impact: ${data.qualityOfLife.household_impact}/5`, {
      x: 70,
      y: yPos,
      size: 12,
      font
    })

    yPos -= 20
    page.drawText(`Social Impact: ${data.qualityOfLife.social_impact}/5`, {
      x: 70,
      y: yPos,
      size: 12,
      font
    })

    yPos -= 20
    page.drawText(`Exercise Impact: ${data.qualityOfLife.exercise_impact}/5`, {
      x: 70,
      y: yPos,
      size: 12,
      font
    })

    yPos -= 20
    page.drawText(`Energy Level: ${data.qualityOfLife.energy_level}/5`, {
      x: 70,
      y: yPos,
      size: 12,
      font
    })

    if (data.qualityOfLife.notes) {
      yPos -= 20
      page.drawText('Notes:', {
        x: 70,
        y: yPos,
        size: 12,
        font: boldFont
      })

      yPos -= 15
      page.drawText(data.qualityOfLife.notes, {
        x: 90,
        y: yPos,
        size: 10,
        font
      })
    }
  }

  // Footer
  const footerText = 'This report is part of the MGPP Doctor Visit Tracking System'
  const footerWidth = font.widthOfTextAtSize(footerText, 10)
  page.drawText(footerText, {
    x: (width - footerWidth) / 2,
    y: 30,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5)
  })

  return pdfDoc.save()
} 