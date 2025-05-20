'use client'

import { format } from 'date-fns'
import { jsPDF } from 'jspdf'
import type { Medication } from '@/types/medications'

export async function generateMedicationPDF(medications: Medication[]): Promise<Uint8Array> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const lineHeight = 7
  let y = margin

  // Add title
  doc.setFontSize(20)
  doc.text('Medication Log', pageWidth / 2, y, { align: 'center' })
  y += lineHeight * 2

  // Add date
  doc.setFontSize(12)
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, y, { align: 'center' })
  y += lineHeight * 2

  // Group medications by status
  const activeMedications = medications.filter(m => m.still_using)
  const inactiveMedications = medications.filter(m => !m.still_using)

  // Add active medications
  if (activeMedications.length > 0) {
    doc.setFontSize(16)
    doc.text('Active Medications', margin, y)
    y += lineHeight * 1.5

    activeMedications.forEach((medication, index) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage()
        y = margin
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(medication.drug_name, margin, y)
      y += lineHeight

      doc.setFont('helvetica', 'normal')
      doc.text(`Dosage: ${medication.dosage}`, margin, y)
      y += lineHeight

      doc.text(`Frequency: ${medication.frequency}${medication.as_needed ? ' (as needed)' : ''}`, margin, y)
      y += lineHeight

      if (medication.timing) {
        doc.text(`Timing: ${medication.timing}`, margin, y)
        y += lineHeight
      }

      if (medication.indication) {
        doc.text(`Indication: ${medication.indication}`, margin, y)
        y += lineHeight
      }

      doc.text(`Started: ${format(new Date(medication.start_date), 'MMM d, yyyy')}`, margin, y)
      y += lineHeight

      if (medication.notes) {
        doc.text(`Notes: ${medication.notes}`, margin, y)
        y += lineHeight
      }

      if (medication.gastroparesis_specific) {
        doc.text('Gastroparesis-Specific Medication', margin, y)
        y += lineHeight
      }

      // Add space between medications
      y += lineHeight
    })
  }

  // Add inactive medications
  if (inactiveMedications.length > 0) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }

    doc.setFontSize(16)
    doc.text('Inactive Medications', margin, y)
    y += lineHeight * 1.5

    inactiveMedications.forEach((medication) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage()
        y = margin
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(medication.drug_name, margin, y)
      y += lineHeight

      doc.setFont('helvetica', 'normal')
      doc.text(`Dosage: ${medication.dosage}`, margin, y)
      y += lineHeight

      doc.text(`Frequency: ${medication.frequency}${medication.as_needed ? ' (as needed)' : ''}`, margin, y)
      y += lineHeight

      if (medication.timing) {
        doc.text(`Timing: ${medication.timing}`, margin, y)
        y += lineHeight
      }

      if (medication.indication) {
        doc.text(`Indication: ${medication.indication}`, margin, y)
        y += lineHeight
      }

      doc.text(`Started: ${format(new Date(medication.start_date), 'MMM d, yyyy')}`, margin, y)
      y += lineHeight

      if (medication.stop_date) {
        doc.text(`Stopped: ${format(new Date(medication.stop_date), 'MMM d, yyyy')}`, margin, y)
        y += lineHeight
      }

      if (medication.notes) {
        doc.text(`Notes: ${medication.notes}`, margin, y)
        y += lineHeight
      }

      if (medication.gastroparesis_specific) {
        doc.text('Gastroparesis-Specific Medication', margin, y)
        y += lineHeight
      }

      // Add space between medications
      y += lineHeight
    })
  }

  const pdfBytes = doc.output('arraybuffer')
  return new Uint8Array(pdfBytes)
}
