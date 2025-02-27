import PDFDocument from 'pdfkit'

type SymptomData = {
  symptom_type: string
  display_name: string
  frequency: string
  intensity: number
  treatments: string[]
  context: string[]
  time_patterns: string[]
  notes: string
}

type QualityOfLifeData = {
  work_impact: number
  household_impact: number
  social_impact: number
  exercise_impact: number
  energy_level: number
  notes: string | null
}

type ExportData = {
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
  symptoms: SymptomData[]
  qualityOfLife: QualityOfLifeData | null
}

export const generateVisitPDF = async (data: ExportData): Promise<Buffer> => {
  const doc = new PDFDocument()
  const chunks: Buffer[] = []

  // Collect PDF data chunks
  doc.on('data', (chunk) => chunks.push(chunk))
  
  // Return promise that resolves with PDF buffer
  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks)
      resolve(pdfBuffer)
    })
    
    doc.on('error', reject)

    try {
      // PDF Generation
      const margin = 50
      let y = margin

      // Header
      doc.fontSize(20)
        .text('MG Visit Report', margin, y)
      y += 40

      // Personal Information
      doc.fontSize(16)
        .text('Personal Information', margin, y)
      y += 30

      doc.fontSize(12)
      const personalInfo = [
        `Name: ${data.record.first_name} ${data.record.last_name}`,
        `Email: ${data.record.email}`,
        `Address: ${data.record.address}`,
        `State: ${data.record.state}`,
        `Zip Code: ${data.record.zip_code}`,
        `Birth Year: ${data.record.birth_year}`,
        `Years with MG: ${data.record.years_with_mg}`
      ]

      personalInfo.forEach(info => {
        doc.text(info, margin, y)
        y += 20
      })

      y += 20

      // Symptoms Section
      doc.fontSize(16)
        .text('Symptoms', margin, y)
      y += 30

      doc.fontSize(12)
      data.symptoms.forEach(symptom => {
        // Use symptom.display_name for the heading
        doc.text(`${symptom.display_name}:`, margin, y)
        y += 20

        doc.text(`Frequency: ${symptom.frequency}`, margin + 20, y)
        y += 20

        doc.text(`Intensity: ${symptom.intensity}/10`, margin + 20, y)
        y += 20

        if (symptom.treatments.length > 0) {
          doc.text('Treatments:', margin + 20, y)
          y += 20
          symptom.treatments.forEach(treatment => {
            doc.text(`• ${treatment}`, margin + 40, y)
            y += 20
          })
        }

        if (symptom.context.length > 0) {
          doc.text('Context:', margin + 20, y)
          y += 20
          symptom.context.forEach(ctx => {
            doc.text(`• ${ctx}`, margin + 40, y)
            y += 20
          })
        }

        if (symptom.time_patterns.length > 0) {
          doc.text('Time Patterns:', margin + 20, y)
          y += 20
          symptom.time_patterns.forEach(pattern => {
            doc.text(`• ${pattern}`, margin + 40, y)
            y += 20
          })
        }

        if (symptom.notes) {
          doc.text('Notes:', margin + 20, y)
          y += 20
          doc.text(symptom.notes, margin + 40, y)
          y += 20
        }

        y += 20
      })

      // Quality of Life Section
      if (data.qualityOfLife) {
        y += 20
        doc.fontSize(16)
          .text('Quality of Life Assessment', margin, y)
        y += 30

        doc.fontSize(12)
        const qolData = [
          `Work Impact: ${data.qualityOfLife.work_impact}/10`,
          `Household Impact: ${data.qualityOfLife.household_impact}/10`,
          `Social Impact: ${data.qualityOfLife.social_impact}/10`,
          `Exercise Impact: ${data.qualityOfLife.exercise_impact}/10`,
          `Energy Level: ${data.qualityOfLife.energy_level}/10`
        ]

        qolData.forEach(item => {
          doc.text(item, margin, y)
          y += 20
        })

        if (data.qualityOfLife.notes) {
          doc.text('Notes:', margin, y)
          y += 20
          doc.text(data.qualityOfLife.notes, margin + 20, y)
        }
      }

      // Finalize PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
} 