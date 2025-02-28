'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface DoctorVisitFormProps {
  onSuccess: () => void
}

interface SymptomDetails {
  isPresent: boolean
  frequency?: string
  intensity: string
  treatments: string[]
  context: string[]
  rhythm: string[]
  notes?: string
  triggers: {
    hasTrigggers: boolean
    description?: string
  }
}

interface VisitFormData {
  dysarthria: SymptomDetails
  dysphagia: SymptomDetails
  dyspnea: SymptomDetails
  diplopia: SymptomDetails
  refractiveErrors: SymptomDetails
  ptosis: SymptomDetails
  flatAffect: SymptomDetails
  myasthenia: SymptomDetails
}

const defaultSymptomState: SymptomDetails = {
  isPresent: false,
  intensity: "1",  // Set a default value for intensity
  treatments: [],
  context: [],
  rhythm: [],
  triggers: {
    hasTrigggers: false
  }
}

export function DoctorVisitForm({ onSuccess }: DoctorVisitFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<VisitFormData>({
    dysarthria: { ...defaultSymptomState },
    dysphagia: { ...defaultSymptomState },
    dyspnea: { ...defaultSymptomState },
    diplopia: { ...defaultSymptomState },
    refractiveErrors: { ...defaultSymptomState },
    ptosis: { ...defaultSymptomState },
    flatAffect: { ...defaultSymptomState },
    myasthenia: { ...defaultSymptomState }
  })

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const updateSymptomDetails = (
    symptom: keyof VisitFormData,
    field: keyof SymptomDetails | 'triggerDescription',
    value: any
  ) => {
    console.log(`Updating ${symptom} ${field}:`, value); // Debug log
    setFormData(prev => {
      // Create a deep copy to ensure state updates properly
      const updatedData = JSON.parse(JSON.stringify(prev));
      
      if (field === 'triggerDescription') {
        updatedData[symptom].triggers.description = value;
      } else {
        updatedData[symptom][field] = value;
      }
      
      console.log('Updated form data:', updatedData[symptom]); // Debug log
      return updatedData;
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      // Add validation
      const selectedSymptoms = Object.entries(formData)
        .filter(([_, details]) => details.isPresent)
        
      // Validate required fields
      const invalidSymptoms = selectedSymptoms.filter(([_, details]) => {
        // Check if frequency exists and intensity is not empty
        return !details.frequency || !details.intensity || details.intensity === "";
      })

      if (invalidSymptoms.length > 0) {
        throw new Error('Please complete all required fields for selected symptoms')
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No authenticated user')

      const { data: record, error: recordError } = await supabase
        .from('doctor_visit_records')
        .insert([{
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (recordError) throw recordError
      if (!record) throw new Error('Failed to create visit record')

      const symptoms = Object.entries(formData)
        .filter(([_, details]) => details.isPresent)
        .map(([type, details]) => {
          console.log(`Submitting symptom ${type}:`, {
            intensity: details.intensity ? parseInt(details.intensity) : 1,
            frequency: details.frequency,
            treatments: details.treatments
          });
          return {
            record_id: record.id,
            symptom_type: type,
            is_present: true,
            frequency: details.frequency || null,
            intensity: details.intensity ? parseInt(details.intensity) : 1,
            treatments: JSON.stringify(details.treatments),
            context: JSON.stringify(details.context),
            time_patterns: JSON.stringify(details.rhythm),
            triggers: JSON.stringify(details.triggers),
            notes: details.notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        })

      if (symptoms.length > 0) {
        const { error: symptomsError } = await supabase
          .from('doctor_visit_symptoms')
          .insert(symptoms)

        if (symptomsError) throw symptomsError
      }

      toast({
        title: "Success",
        description: "Visit record created successfully",
      })
      
      onSuccess()
    } catch (error) {
      console.error('Error saving visit record:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save visit record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderSymptomSection = (
    symptomKey: keyof VisitFormData,
    title: string,
    description: string,
    intensityOptions: { value: string, label: string }[],
    contextOptions: string[]
  ) => {
    const symptomData = formData[symptomKey]

    return (
      <div className="border-b pb-8 mb-8 last:border-b-0">
        <h3 className="font-medium text-lg">{title}</h3>
        
        <div className="mt-4">
          <p className="mb-2">I experience {title} - {description}...</p>
          <RadioGroup
            value={symptomData.isPresent ? "yes" : "no"}
            onValueChange={(value: string) => updateSymptomDetails(
              symptomKey,
              'isPresent',
              value === "yes"
            )}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${symptomKey}-no`} />
              <label htmlFor={`${symptomKey}-no`}>No (skip to next symptom)</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${symptomKey}-yes`} />
              <label htmlFor={`${symptomKey}-yes`}>Yes (reveal additional fields)</label>
            </div>
          </RadioGroup>
        </div>

        {symptomData.isPresent && (
          <div className="space-y-6 mt-6">
            <div>
              <h4 className="font-medium mb-2">
                FREQUENCY (Choose one): I experience {description}...
                <span className="text-red-500">*</span>
              </h4>
              <RadioGroup
                value={symptomData.frequency}
                onValueChange={(value: string) => updateSymptomDetails(symptomKey, 'frequency', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sometimes" id={`${symptomKey}-freq-sometimes`} />
                  <label htmlFor={`${symptomKey}-freq-sometimes`}>Sometimes, but not daily</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily-not-constant" id={`${symptomKey}-freq-daily`} />
                  <label htmlFor={`${symptomKey}-freq-daily`}>Daily, but not constant</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="constant" id={`${symptomKey}-freq-constant`} />
                  <label htmlFor={`${symptomKey}-freq-constant`}>Constant</label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                INTENSITY (Choose one): Generally, my {description} is...
                <span className="text-red-500">*</span>
              </h4>
              <RadioGroup
                value={symptomData.intensity}
                onValueChange={(value: string) => {
                  console.log('Setting intensity:', value); // Debug log
                  updateSymptomDetails(symptomKey, 'intensity', value);
                }}
              >
                {intensityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${symptomKey}-int-${option.value}`} />
                    <label htmlFor={`${symptomKey}-int-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h4 className="font-medium mb-2">TREATMENT (choose any that apply): Do you use a medication, treatment, or device to prevent or manage this symptom?</h4>
              <div className="space-y-2">
                {['medication', 'treatment', 'device', 'none'].map((treatment) => (
                  <div key={treatment} className="flex items-center space-x-2">
                    <Checkbox
                      checked={symptomData.treatments.includes(treatment)}
                      onCheckedChange={(checked: boolean) => {
                        updateSymptomDetails(
                          symptomKey,
                          'treatments',
                          checked
                            ? [...symptomData.treatments, treatment]
                            : symptomData.treatments.filter(t => t !== treatment)
                        )
                      }}
                      id={`${symptomKey}-treatment-${treatment}`}
                    />
                    <label htmlFor={`${symptomKey}-treatment-${treatment}`}>
                      {treatment === 'none' ? 'None of the Above' : treatment.charAt(0).toUpperCase() + treatment.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">CONTEXT: Please check any boxes that apply to you (choose any that apply):</h4>
              <div className="space-y-2">
                {contextOptions.map((context, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      checked={symptomData.context.includes(context)}
                      onCheckedChange={(checked: boolean) => {
                        updateSymptomDetails(
                          symptomKey,
                          'context',
                          checked
                            ? [...symptomData.context, context]
                            : symptomData.context.filter(c => c !== context)
                        )
                      }}
                      id={`${symptomKey}-context-${index}`}
                    />
                    <label htmlFor={`${symptomKey}-context-${index}`}>{context}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">RHYTHM (choose any that apply): I find my {description} to be more prominent in - select all that apply</h4>
              <div className="space-y-2">
                {['Beginning of my day', 'Middle of my day', 'End of my day'].map((rhythm, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      checked={symptomData.rhythm.includes(rhythm)}
                      onCheckedChange={(checked: boolean) => {
                        updateSymptomDetails(
                          symptomKey,
                          'rhythm',
                          checked
                            ? [...symptomData.rhythm, rhythm]
                            : symptomData.rhythm.filter(r => r !== rhythm)
                        )
                      }}
                      id={`${symptomKey}-rhythm-${index}`}
                    />
                    <label htmlFor={`${symptomKey}-rhythm-${index}`}>{rhythm}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">TRIGGERS: This symptom is triggered or aggravated by other activities or situations</h4>
              <RadioGroup
                value={symptomData.triggers.hasTrigggers ? "yes" : "no"}
                onValueChange={(value: string) => updateSymptomDetails(
                  symptomKey,
                  'triggers',
                  { ...symptomData.triggers, hasTrigggers: value === "yes" }
                )}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${symptomKey}-triggers-yes`} />
                  <label htmlFor={`${symptomKey}-triggers-yes`}>Yes - explain more below</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${symptomKey}-triggers-no`} />
                  <label htmlFor={`${symptomKey}-triggers-no`}>No</label>
                </div>
              </RadioGroup>

              {symptomData.triggers.hasTrigggers && (
                <textarea
                  value={symptomData.triggers.description || ''}
                  onChange={(e) => updateSymptomDetails(
                    symptomKey,
                    'triggerDescription',
                    e.target.value
                  )}
                  className="mt-2 w-full p-2 border rounded min-h-[100px]"
                  placeholder="Please describe what triggers or aggravates this symptom"
                />
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">More to say about your {title}?</h4>
              <textarea
                value={symptomData.notes || ''}
                onChange={(e) => updateSymptomDetails(symptomKey, 'notes', e.target.value)}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder={`Add any additional notes about your ${description.toLowerCase()}`}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const intensityScale = [
    { value: "1", label: "Mild - Barely noticeable" },
    { value: "2", label: "Slight - Noticeable but not limiting" },
    { value: "3", label: "Moderate - Somewhat limiting" },
    { value: "4", label: "Severe - Very limiting" },
    { value: "5", label: "Very Severe - Extremely limiting" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {renderSymptomSection(
        'dysarthria',
        'DYSARTHRIA',
        'difficulty speaking',
        intensityScale,
        [
          'I experience dysarthria during brief conversations',
          'I alter my schedule around the likelihood of having dysarthria',
          'I rely on texting or other non-speaking methods of communication because of dysarthria'
        ]
      )}

      {renderSymptomSection(
        'dysphagia',
        'DYSPHAGIA',
        'difficulty swallowing',
        intensityScale,
        [
          'I experience difficulty swallowing liquids',
          'I experience difficulty swallowing solid foods',
          'I need to modify my diet due to swallowing difficulties',
          'I avoid eating in public due to swallowing difficulties'
        ]
      )}

      {renderSymptomSection(
        'dyspnea',
        'DYSPNEA',
        'difficulty breathing',
        intensityScale,
        [
          'I experience shortness of breath during physical activity',
          'I experience shortness of breath while talking',
          'I need to rest frequently due to breathing difficulties',
          'I avoid certain activities due to breathing difficulties'
        ]
      )}

      {renderSymptomSection(
        'diplopia',
        'DIPLOPIA',
        'double vision',
        intensityScale,
        [
          'I experience double vision when reading',
          'I experience double vision when looking at screens',
          'I need to close one eye to see clearly',
          'My double vision affects my ability to drive'
        ]
      )}

      {renderSymptomSection(
        'refractiveErrors',
        'REFRACTIVE ERRORS',
        'vision problems',
        intensityScale,
        [
          'I have difficulty focusing on near objects',
          'I have difficulty focusing on distant objects',
          'My vision changes throughout the day',
          'I require frequent changes to my prescription'
        ]
      )}

      {renderSymptomSection(
        'ptosis',
        'PTOSIS',
        'drooping eyelids',
        intensityScale,
        [
          'I need to tilt my head back to see clearly',
          'My eyelid drooping affects my vision',
          'My eyelid drooping is worse when I am tired',
          'I avoid certain activities due to eyelid drooping'
        ]
      )}

      {renderSymptomSection(
        'flatAffect',
        'FLAT AFFECT',
        'reduced facial expression',
        intensityScale,
        [
          'Others comment on my lack of facial expression',
          'I have difficulty showing emotions through facial expressions',
          'My facial muscles feel weak',
          'My facial expression affects my social interactions'
        ]
      )}

      {renderSymptomSection(
        'myasthenia',
        'MYASTHENIA',
        'muscle weakness',
        intensityScale,
        [
          'I experience general muscle weakness',
          'My weakness affects specific muscle groups',
          'My weakness is worse with activity',
          'I need to rest frequently due to muscle weakness'
        ]
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Visit Record"}
      </Button>
    </form>
  )
}
