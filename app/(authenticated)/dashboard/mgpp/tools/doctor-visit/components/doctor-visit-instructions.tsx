'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DoctorVisitInstructionsProps {
  onGetStarted?: () => void
  isModal?: boolean
}

export function DoctorVisitInstructions({ onGetStarted, isModal = false }: DoctorVisitInstructionsProps) {
  const instructions = [
    {
      title: "Before Your Visit",
      steps: [
        "Fill out your personal information",
        "Record your symptoms and their patterns",
        "Complete the quality of life assessment",
        "Review your visit summary"
      ]
    },
    {
      title: "During Your Visit",
      steps: [
        "Share your symptom timeline with your doctor",
        "Discuss your quality of life concerns",
        "Review your treatment history",
        "Ask questions about your condition"
      ]
    },
    {
      title: "After Your Visit",
      steps: [
        "Review your doctor's recommendations",
        "Schedule follow-up appointments if needed",
        "Update your symptom tracking as needed",
        "Keep your medical records up to date"
      ]
    }
  ]

  return (
    <Card className={isModal ? "w-full max-w-2xl mx-auto" : "max-w-3xl mx-auto shadow-md"}>
      <CardHeader>
        <CardTitle className="text-2xl">Preparing for Your Doctor Visit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          This tool will help you prepare for your doctor visit by organizing your symptoms and health information.
        </p>
        
        <div className="space-y-6">
          {instructions.map((section, index) => (
            <div key={index} className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <ul className="space-y-2">
                {section.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {onGetStarted && (
          <div className="flex justify-center pt-4">
            <Button onClick={onGetStarted} size="lg">
              Get Started
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 