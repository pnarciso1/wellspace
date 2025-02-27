'use client'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { format } from 'date-fns'
import type { Medication } from '@/types/medications'

export async function generateMedicationPDF(medications: Medication[]) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()
  
  // Embed the standard font
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

  page.drawText('Medication Log Report', {
    x: 50,
    y: height - 80,
    size: 20,
    font: boldFont
  })

  // Add date
  page.drawText(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, {
    x: 50,
    y: height - 110,
    size: 12,
    font
  })

  // Group medications
  const currentMeds = medications.filter(med => med.still_using)
  const previousMeds = medications.filter(med => !med.still_using)

  // Add current medications
  let yPosition = height - 150
  
  page.drawText('Currently Taking:', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0.7)
  })

  yPosition -= 30
  
  for (const med of currentMeds) {
    // Draw medication name with bullet point
    page.drawText(`• ${med.drug_name}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: boldFont
    })
    yPosition -= 20
    
    // Draw medication details
    page.drawText(`Dosage: ${med.dosage}`, {
      x: 90,
      y: yPosition,
      size: 10,
      font
    })
    yPosition -= 15
    
    page.drawText(`Frequency: ${med.frequency}`, {
      x: 90,
      y: yPosition,
      size: 10,
      font
    })
    yPosition -= 15
    
    if (med.notes) {
      page.drawText(`Notes: ${med.notes}`, {
        x: 90,
        y: yPosition,
        size: 10,
        font
      })
      yPosition -= 15
    }
    
    page.drawText(`Started: ${format(new Date(med.start_date), 'MMMM d, yyyy')}`, {
      x: 90,
      y: yPosition,
      size: 10,
      font
    })
    yPosition -= 30
  }

  // Add previous medications if any
  if (previousMeds.length > 0) {
    yPosition -= 20
    page.drawText('Previous Medications:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0.7)
    })

    yPosition -= 30
    
    for (const med of previousMeds) {
      page.drawText(`• ${med.drug_name}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont
      })
      yPosition -= 20
      
      page.drawText(`Dosage: ${med.dosage}`, {
        x: 90,
        y: yPosition,
        size: 10,
        font
      })
      yPosition -= 15
      
      page.drawText(`Frequency: ${med.frequency}`, {
        x: 90,
        y: yPosition,
        size: 10,
        font
      })
      yPosition -= 15
      
      if (med.notes) {
        page.drawText(`Notes: ${med.notes}`, {
          x: 90,
          y: yPosition,
          size: 10,
          font
        })
        yPosition -= 15
      }
      
      page.drawText(`Started: ${format(new Date(med.start_date), 'MMMM d, yyyy')}`, {
        x: 90,
        y: yPosition,
        size: 10,
        font
      })
      if (med.stop_date) {
        yPosition -= 15
        page.drawText(`Stopped: ${format(new Date(med.stop_date), 'MMMM d, yyyy')}`, {
          x: 90,
          y: yPosition,
          size: 10,
          font
        })
      }
      yPosition -= 30
    }
  }

  // Add footer
  const footerText = 'This report is part of the MGPP Medication Tracking System'
  const footerWidth = font.widthOfTextAtSize(footerText, 10)
  page.drawText(footerText, {
    x: (width - footerWidth) / 2,
    y: 30,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5)
  })

  // Generate PDF bytes
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
