'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoCircledIcon } from '@radix-ui/react-icons'
import type { Symptom, SymptomType } from '@/types/doctor-visit'

interface SymptomFormProps {
  onUpdate: (symptomType: SymptomType, data: Partial<Symptom>) => void
  currentData: Record<SymptomType, Partial<Symptom>>
}

const symptomInfo = {
  speech: {
    title: 'Speech Difficulties (Dysarthria)',
    description: 'Problems with speaking or slurred speech',
    timePatterns: ['Morning speech issues', 'Worsens throughout day', 'Evening difficulties'],
    triggers: ['Extended conversations', 'Stress', 'Fatigue']
  },
  swallowing: {
    title: 'Swallowing Problems (Dysphagia)',
    description: 'Difficulty swallowing or choking sensation',
    timePatterns: ['During meals', 'With certain foods', 'When tired'],
    triggers: ['Specific foods', 'Quick eating', 'Stress']
  },
  breathing: {
    title: 'Breathing Difficulties (Dyspnea)',
    description: 'Shortness of breath or breathing problems',
    timePatterns: ['During activity', 'At rest', 'While lying down'],
    triggers: ['Physical activity', 'Stress', 'Environmental factors']
  },
  vision: {
    title: 'Double Vision (Diplopia)',
    description: 'Seeing double or blurred vision',
    timePatterns: ['Morning vision issues', 'After reading', 'Evening worsening'],
    triggers: ['Reading', 'Screen time', 'Fatigue']
  },
  eyelid: {
    title: 'Drooping Eyelids (Ptosis)',
    description: 'Drooping of one or both eyelids',
    timePatterns: ['Morning drooping', 'Worsens through day', 'Evening heaviness'],
    triggers: ['Fatigue', 'Reading', 'Bright light']
  },
  expression: {
    title: 'Reduced Facial Expression',
    description: 'Decreased facial muscle movement or expression',
    timePatterns: ['Constant', 'Varies with fatigue', 'Social situations'],
    triggers: ['Extended conversations', 'Fatigue', 'Emotional situations']
  },
  muscle_weakness: {
    title: 'Muscle Weakness',
    description: 'General muscle weakness or fatigue',
    timePatterns: ['Morning weakness', 'Activity-related', 'Evening worsening'],
    triggers: ['Physical activity', 'Stress', 'Temperature changes']
  }
} as const

export function SymptomForm({ onUpdate, currentData }: SymptomFormProps) {
  const symptoms: SymptomType[] = ['speech', 'swallowing', 'breathing', 'vision', 'eyelid', 'expression', 'muscle_weakness']

  const handleSymptomChange = (type: SymptomType, field: string, value: unknown) => {
    const currentSymptom = currentData[type] || {}
    onUpdate(type, {
      ...currentSymptom,
      [field]: value
    })
  }

  const renderSymptomQuestions = (type: SymptomType) => {
    const data = currentData[type] || {}
    const info = symptomInfo[type]
    
    return (
      <Card key={type} className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{info.title}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{info.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Initial presence question */}
          <div>
            <Label>Do you currently experience this symptom?</Label>
            <RadioGroup
              value={data.is_present?.toString()}
              onValueChange={(value: string) => {
                handleSymptomChange(type, 'is_present', value === 'true')
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${type}-yes`} />
                <Label htmlFor={`${type}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${type}-no`} />
                <Label htmlFor={`${type}-no`}>No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show additional questions only if symptom is present */}
          {data.is_present && (
            <>
              {/* Frequency */}
              <div>
                <Label>How often do you experience this symptom?</Label>
                <RadioGroup
                  value={data.frequency}
                  onValueChange={(value: string) => handleSymptomChange(type, 'frequency', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SOMETIMES" id={`${type}-freq-sometimes`} />
                    <Label htmlFor={`${type}-freq-sometimes`}>Sometimes, but not daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DAILY" id={`${type}-freq-daily`} />
                    <Label htmlFor={`${type}-freq-daily`}>Daily, but not constant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CONSTANT" id={`${type}-freq-constant`} />
                    <Label htmlFor={`${type}-freq-constant`}>Constant</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Intensity */}
              <div>
                <Label>How severe is this symptom? (1-5)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={data.intensity || ''}
                    onChange={(e) => handleSymptomChange(type, 'intensity', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    (1 = Mild, 5 = Severe)
                  </span>
                </div>
              </div>

              {/* Time Patterns */}
              <div>
                <Label className="mb-2 block">When does this symptom typically occur?</Label>
                <div className="grid gap-2">
                  {info.timePatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${type}-pattern-${index}`}
                        checked={data.time_patterns && typeof data.time_patterns === 'object' ? 
                          // @ts-ignore - We know this might not be type-safe but it's how the data is structured
                          data.time_patterns[pattern] : false}
                        onCheckedChange={(checked: boolean) => {
                          const patterns = { ...(data.time_patterns || {}) }
                          // @ts-ignore - We know this might not be type-safe but it's how the data is structured
                          patterns[pattern] = checked
                          handleSymptomChange(type, 'time_patterns', patterns)
                        }}
                      />
                      <Label htmlFor={`${type}-pattern-${index}`}>{pattern}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div>
                <Label className="mb-2 block">What triggers or worsens this symptom?</Label>
                <div className="grid gap-2">
                  {info.triggers.map((trigger, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${type}-trigger-${index}`}
                        checked={data.triggers?.includes(trigger) || false}
                        onCheckedChange={(checked: boolean) => {
                          const triggers = [...(data.triggers || [])]
                          if (checked) {
                            triggers.push(trigger)
                          } else {
                            const index = triggers.indexOf(trigger)
                            if (index > -1) triggers.splice(index, 1)
                          }
                          handleSymptomChange(type, 'triggers', triggers)
                        }}
                      />
                      <Label htmlFor={`${type}-trigger-${index}`}>{trigger}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Additional notes about this symptom</Label>
                <Textarea
                  value={data.notes || ''}
                  onChange={(e) => handleSymptomChange(type, 'notes', e.target.value)}
                  placeholder="Describe any specific patterns, concerns, or additional information..."
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {symptoms.map(symptom => renderSymptomQuestions(symptom))}
    </div>
  )
}
