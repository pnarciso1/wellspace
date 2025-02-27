'use client'

import { Check, CircleDot } from 'lucide-react'

interface ProgressIndicatorProps {
  currentStep: 'personal_info' | 'symptoms' | 'daily_living' | 'quality_of_life' | 'completed'
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { id: 'personal_info', label: 'Personal Info' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'daily_living', label: 'Daily Living' },
    { id: 'quality_of_life', label: 'Quality of Life' },
  ]

  const getStepStatus = (stepId: string) => {
    const stepOrder = steps.map(s => s.id)
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(stepId)

    if (currentStep === 'completed' || stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  return (
    <div className="mb-8">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="absolute h-full bg-primary transition-all duration-300"
            style={{
              width: currentStep === 'completed'
                ? '100%'
                : `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                      status === 'completed'
                        ? 'bg-primary border-primary'
                        : status === 'current'
                        ? 'bg-white border-primary'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : status === 'current' ? (
                      <CircleDot className="w-5 h-5 text-primary" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    status === 'completed' || status === 'current'
                      ? 'text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
