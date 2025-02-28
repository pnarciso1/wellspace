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
      <Card key={type} className="mb-6 shadow-sm border-muted/60 hover:border-muted transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-medium">{info.title}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{info.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-0">
          {/* Initial presence question */}
          <div className="bg-muted/20 p-3 rounded-md">
            <Label className="font-medium mb-2 block">Do you currently experience this symptom?</Label>
            <RadioGroup
              value={data.is_present?.toString()}
              onValueChange={(value: string) => {
                handleSymptomChange(type, 'is_present', value === 'true')
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${type}-yes`} />
                <Label htmlFor={`${type}-yes`} className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${type}-no`} />
                <Label htmlFor={`${type}-no`} className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show additional questions only if symptom is present */}
          {data.is_present && (
            <div className="space-y-5 border-t pt-4 mt-4">
              {/* Frequency */}
              <div>
                <Label className="font-medium mb-2 block">How often do you experience this symptom?</Label>
                <RadioGroup
                  value={data.frequency}
                  onValueChange={(value: string) => handleSymptomChange(type, 'frequency', value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SOMETIMES" id={`${type}-freq-sometimes`} />
                    <Label htmlFor={`${type}-freq-sometimes`} className="cursor-pointer">Sometimes, but not daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DAILY" id={`${type}-freq-daily`} />
                    <Label htmlFor={`${type}-freq-daily`} className="cursor-pointer">Daily, but not constant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CONSTANT" id={`${type}-freq-constant`} />
                    <Label htmlFor={`${type}-freq-constant`} className="cursor-pointer">Constant</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Intensity */}
              <div>
                <Label className="font-medium mb-2 block">How severe is this symptom? (1-5)</Label>
                <div className="flex items-center gap-3">
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
                <Label className="font-medium mb-3 block">When does this symptom typically occur?</Label>
                <div className="grid gap-2.5">
                  {info.timePatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center space-x-2 hover:bg-muted/20 p-1.5 rounded-md transition-colors">
                      <Checkbox
                        id={`${type}-pattern-${index}`}
                        checked={data.time_patterns && typeof data.time_patterns === 'object' ? 
                          // @ts-expect-error - We know this might not be type-safe but it's how the data is structured
                          data.time_patterns[pattern] : false}
                        onCheckedChange={(checked: boolean) => {
                          const patterns = { ...(data.time_patterns || {}) }
                          // @ts-expect-error - We know this might not be type-safe but it's how the data is structured
                          patterns[pattern] = checked
                          handleSymptomChange(type, 'time_patterns', patterns)
                        }}
                      />
                      <Label htmlFor={`${type}-pattern-${index}`} className="cursor-pointer">{pattern}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div>
                <Label className="font-medium mb-3 block">What triggers or worsens this symptom?</Label>
                <div className="grid gap-2.5">
                  {info.triggers.map((trigger, index) => (
                    <div key={index} className="flex items-center space-x-2 hover:bg-muted/20 p-1.5 rounded-md transition-colors">
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
                      <Label htmlFor={`${type}-trigger-${index}`} className="cursor-pointer">{trigger}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="font-medium mb-2 block">Additional notes about this symptom</Label>
                <Textarea
                  value={data.notes || ''}
                  onChange={(e) => handleSymptomChange(type, 'notes', e.target.value)}
                  placeholder="Describe any specific patterns, concerns, or additional information..."
                  className="min-h-[100px] resize-y"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Symptom Details</h2>
      {symptoms.map(symptom => renderSymptomQuestions(symptom))}
    </div>
  )
}
