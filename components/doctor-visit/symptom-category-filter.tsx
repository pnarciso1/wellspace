'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoCircledIcon } from '@radix-ui/react-icons'
import type { SymptomCategory, SymptomType } from '@/types/doctor-visit'

interface SymptomCategoryFilterProps {
  selectedCategory: SymptomType | 'all'
  onCategoryChange: (category: SymptomType | 'all') => void
}

export function SymptomCategoryFilter({ 
  selectedCategory, 
  onCategoryChange 
}: SymptomCategoryFilterProps) {
  const categories: SymptomCategory[] = [
    {
      id: 'DYSARTHRIA',
      label: 'Speech',
      description: 'Difficulty speaking or slurred speech',
      relatedTerms: ['speech', 'voice', 'articulation']
    },
    {
      id: 'DYSPHAGIA',
      label: 'Swallowing',
      description: 'Difficulty swallowing or choking',
      relatedTerms: ['swallow', 'choke', 'eating']
    },
    {
      id: 'DYSPNEA',
      label: 'Breathing',
      description: 'Shortness of breath or difficulty breathing',
      relatedTerms: ['breath', 'respiratory', 'air']
    },
    {
      id: 'DIPLOPIA',
      label: 'Vision',
      description: 'Double vision or blurred vision',
      relatedTerms: ['vision', 'sight', 'eyes']
    },
    {
      id: 'PTOSIS',
      label: 'Eyelid',
      description: 'Drooping eyelids',
      relatedTerms: ['eyelid', 'droop', 'eyes']
    },
    {
      id: 'FLAT_AFFECT',
      label: 'Expression',
      description: 'Reduced facial expressions',
      relatedTerms: ['face', 'expression', 'smile']
    },
    {
      id: 'MYASTHENIA',
      label: 'Muscle Weakness',
      description: 'General muscle weakness',
      relatedTerms: ['weakness', 'fatigue', 'strength']
    }
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => onCategoryChange('all')}
                  className="text-sm"
                >
                  All Symptoms
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View all symptoms</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {categories.map((category) => (
            <TooltipProvider key={category.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => onCategoryChange(category.id)}
                    className="text-sm"
                  >
                    {category.label}
                    {category.description && (
                      <InfoCircledIcon className="ml-1 h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{category.label}</p>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  {category.relatedTerms && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Related: {category.relatedTerms.join(', ')}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Export categories for reuse
export const symptomCategories = {
  DYSARTHRIA: {
    label: 'Speech',
    description: 'Difficulty speaking or slurred speech',
    relatedTerms: ['speech', 'voice', 'articulation']
  },
  DYSPHAGIA: {
    label: 'Swallowing',
    description: 'Difficulty swallowing or choking',
    relatedTerms: ['swallow', 'choke', 'eating']
  },
  DYSPNEA: {
    label: 'Breathing',
    description: 'Shortness of breath or difficulty breathing',
    relatedTerms: ['breath', 'respiratory', 'air']
  },
  DIPLOPIA: {
    label: 'Vision',
    description: 'Double vision or blurred vision',
    relatedTerms: ['vision', 'sight', 'eyes']
  },
  PTOSIS: {
    label: 'Eyelid',
    description: 'Drooping eyelids',
    relatedTerms: ['eyelid', 'droop', 'eyes']
  },
  FLAT_AFFECT: {
    label: 'Expression',
    description: 'Reduced facial expressions',
    relatedTerms: ['face', 'expression', 'smile']
  },
  MYASTHENIA: {
    label: 'Muscle Weakness',
    description: 'General muscle weakness',
    relatedTerms: ['weakness', 'fatigue', 'strength']
  }
} as const
