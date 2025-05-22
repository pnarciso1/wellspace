'use client'

import * as React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/lib/icons"
import { GPACT_SYMPTOM_DISPLAYS, GPACTSymptomType, GPACTSymptomCategoryFilterProps } from '@/types/gpact-doctor-visit'

export function SymptomCategoryFilter({ 
  selectedCategories,
  onCategoryChange
}: GPACTSymptomCategoryFilterProps) {
  const categories = (Object.keys(GPACT_SYMPTOM_DISPLAYS) as GPACTSymptomType[]).map((type) => ({
    type,
    label: GPACT_SYMPTOM_DISPLAYS[type].label,
    icon: GPACT_SYMPTOM_DISPLAYS[type].icon
  }))

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Filter by Symptom Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {categories.map((category) => {
            let Icon = Icons[category.icon as keyof typeof Icons]
            const isSelected = selectedCategories.includes(category.type)
            if (!Icon) {
              console.warn(`Icon '${category.icon}' not found in Icons object. Using AlertCircle as fallback.`)
              Icon = Icons.AlertCircle
            }

            return (
              <Button
                key={category.type}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onCategoryChange(category.type)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 