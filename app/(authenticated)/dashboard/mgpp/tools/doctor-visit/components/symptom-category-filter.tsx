'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../../components/ui/tooltip"
import type { CategoryType, SymptomType } from '../types'
import { SYMPTOM_DEFINITIONS } from '../types'
import type * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from "@/lib/utils"
import { ChevronDown, Check, Menu } from 'lucide-react'

interface SymptomCategoryFilterProps {
  selectedCategory: CategoryType
  onCategoryChange: (category: CategoryType) => void
}

export function SymptomCategoryFilter({ 
  selectedCategory, 
  onCategoryChange
}: SymptomCategoryFilterProps) {
  const categories: CategoryType[] = ['all', ...Object.keys(SYMPTOM_DEFINITIONS) as SymptomType[]]

  return (
    <TooltipProvider>
      <div className="w-full">
        <h3 className="text-sm font-medium mb-3">Filter by Symptom Type</h3>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <div key={category}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div role="button" tabIndex={0}>
                    <Button
                      onClick={() => onCategoryChange(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`capitalize text-sm h-8 px-3 ${selectedCategory === category ? 'shadow-md' : 'border-dashed'}`}
                      size="sm"
                    >
                      {category === 'all' ? 'All Symptoms' : SYMPTOM_DEFINITIONS[category as SymptomType].medical_term}
                    </Button>
                  </div>
                </TooltipTrigger>
                {category !== 'all' && (
                  <TooltipContent side="bottom" className="max-w-[250px]">
                    <p className="font-medium">{SYMPTOM_DEFINITIONS[category as SymptomType].description}</p>
                    {SYMPTOM_DEFINITIONS[category as SymptomType].example && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Example: {SYMPTOM_DEFINITIONS[category as SymptomType].example}
                      </p>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <Menu className="h-4 w-4 mr-2" />
          <ChevronDown className="h-4 w-4 ml-2" />
        </div>
      </div>
    </TooltipProvider>
  )
}
