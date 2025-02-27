'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

interface GenerateReportProps {
  recordId: string
}

export async function generateDoctorVisitReport(recordId: string) {
  const supabase = createClientComponentClient()
  const doc = new jsPDF()

  try {
    // Fetch all related data
    const { data: record, error: recordError } = await supabase
      .from('doctor_visit_records')
      .select('*')
      .eq('id', recordId)
      .single()

    if (recordError) throw recordError

    const { data: symptoms, error: symptomsError } = await supabase
      .from('doctor_visit_symptoms')
      .select('*')
      .eq('record_id', recordId)
      .single()

    const { data: dailyLiving, error: dailyLivingError } = await supabase
      .from('doctor_visit_daily_living')
      .select('*')
      .eq('record_id', recordId)
      .single()

    const { data: qualityOfLife, error: qolError } = await supabase
      .from('doctor_visit_quality_of_life')
      .select('*')
      .eq('record_id', recordId)
      .single()

    // Add title
    doc.setFontSize(20)
    doc.text('MG Doctor Visit Report', 14, 20)

    // Add date and patient info
    doc.setFontSize(12)
    doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 14, 30)
    doc.text(`Patient: ${record.first_name} ${record.last_name}`, 14, 40)
    doc.text(`Years with MG: ${record.years_with_mg}`, 14, 50)

    // Add Symptoms Section
    doc.setFontSize(16)
    doc.text('MG Symptoms', 14, 70)
    
    const symptomsData = [
      ['Symptom', 'Present', 'Severity'],
      ['Difficulty Talking (Dysarthria)', symptoms.dysarthria ? 'Yes' : 'No', symptoms.dysarthria_severity || 'N/A'],
      ['Difficulty Chewing (Dysphagia)', symptoms.dysphagia ? 'Yes' : 'No', symptoms.dysphagia_severity || 'N/A'],
      ['Difficulty Breathing (Dyspnea)', symptoms.dyspnea ? 'Yes' : 'No', symptoms.dyspnea_severity || 'N/A'],
    ]

    autoTable(doc, {
      startY: 75,
      head: [symptomsData[0]],
      body: symptomsData.slice(1),
      theme: 'grid',
    })

    // Add Daily Living Impact Section
    doc.setFontSize(16)
    doc.text('Daily Living Impact', 14, doc.lastAutoTable.finalY + 20)

    const dailyLivingData = [
      ['Activity', 'Impact Level'],
      ['Work/School', dailyLiving.work_impact],
      ['Household Tasks', dailyLiving.household_impact],
      ['Social Activities', dailyLiving.social_impact],
    ]

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [dailyLivingData[0]],
      body: dailyLivingData.slice(1),
      theme: 'grid',
    })

    // Add Quality of Life Section
    doc.setFontSize(16)
    doc.text('Quality of Life Assessment', 14, doc.lastAutoTable.finalY + 20)

    const qolData = [
      ['Aspect', 'Rating (1-5)'],
      ['Overall Wellbeing', qualityOfLife.overall_wellbeing],
      ['Emotional State', qualityOfLife.emotional_state],
      ['Physical Limitations', qualityOfLife.physical_limitations],
      ['Fatigue Level', qualityOfLife.fatigue_level],
      ['Sleep Quality', qualityOfLife.sleep_quality],
      ['Stress Level', qualityOfLife.stress_level],
    ]

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [qolData[0]],
      body: qolData.slice(1),
      theme: 'grid',
    })

    // Add Notes Section if any notes exist
    if (symptoms.notes || dailyLiving.notes || qualityOfLife.notes) {
      doc.addPage()
      doc.setFontSize(16)
      doc.text('Additional Notes', 14, 20)
      doc.setFontSize(12)
      
      let yPos = 30
      if (symptoms.notes) {
        doc.text('Symptoms Notes:', 14, yPos)
        doc.setFontSize(10)
        doc.text(symptoms.notes, 14, yPos + 5, { maxWidth: 180 })
        yPos += 20
      }

      if (dailyLiving.notes) {
        doc.setFontSize(12)
        doc.text('Daily Living Notes:', 14, yPos)
        doc.setFontSize(10)
        doc.text(dailyLiving.notes, 14, yPos + 5, { maxWidth: 180 })
        yPos += 20
      }

      if (qualityOfLife.notes) {
        doc.setFontSize(12)
        doc.text('Quality of Life Notes:', 14, yPos)
        doc.setFontSize(10)
        doc.text(qualityOfLife.notes, 14, yPos + 5, { maxWidth: 180 })
      }
    }

    // Save the PDF
    const fileName = `mg-doctor-visit-${format(new Date(), 'yyyy-MM-dd')}.pdf`
    doc.save(fileName)

    return true
  } catch (error) {
    console.error('Error generating report:', error)
    return false
  }
}
