'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BodyArea {
  id: string
  label: string
  description: string
}

const bodyAreas: BodyArea[] = [
  { id: 'face_head', label: 'Face / Head', description: 'Facial muscles, including eyes and mouth' },
  { id: 'neck', label: 'Neck', description: 'Neck muscles affecting head movement and swallowing' },
  { id: 'shoulders', label: 'Shoulders', description: 'Shoulder muscles and upper arm strength' },
  { id: 'upper_arms', label: 'Upper Arms', description: 'Biceps and triceps strength' },
  { id: 'lower_arms', label: 'Lower Arms', description: 'Forearm strength and grip' },
  { id: 'hands', label: 'Hands', description: 'Hand strength and fine motor control' },
  { id: 'upper_back', label: 'Upper Back', description: 'Upper back muscle strength' },
  { id: 'middle_back', label: 'Middle Back', description: 'Mid-back muscle strength' },
  { id: 'lower_back', label: 'Lower Back', description: 'Lower back muscle strength' },
  { id: 'abdomen', label: 'Abdomen/Core', description: 'Core muscle strength' },
  { id: 'hips', label: 'Hips', description: 'Hip muscle strength and mobility' },
  { id: 'upper_legs', label: 'Upper Legs', description: 'Thigh muscle strength' },
  { id: 'lower_legs', label: 'Lower Legs', description: 'Calf muscle strength' },
  { id: 'feet', label: 'Feet', description: 'Foot muscle strength and stability' }
]

interface BodyReferenceProps {
  selectedAreas?: string[]
  onAreaSelect?: (areaId: string) => void
  readOnly?: boolean
}

export function BodyReference({ 
  selectedAreas = [], 
  onAreaSelect,
  readOnly = false 
}: BodyReferenceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Affected Areas Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto max-w-md">
          <div className="grid grid-cols-2 gap-4">
            {/* Front view */}
            <div className="relative">
              <Image
                src="/body-reference-front.png"
                alt="Front body reference"
                width={200}
                height={400}
                className="w-full"
              />
              <TooltipProvider>
                {bodyAreas.map((area) => (
                  <Tooltip key={area.id}>
                    <TooltipTrigger asChild>
                      <button
                        className={`absolute cursor-pointer p-1 rounded-full transition-colors
                          ${selectedAreas.includes(area.id) ? 'bg-primary/50' : 'bg-transparent hover:bg-primary/20'}
                          ${readOnly ? 'pointer-events-none' : ''}`}
                        style={getAreaPosition(area.id, 'front')}
                        onClick={() => !readOnly && onAreaSelect?.(area.id)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{area.label}</p>
                      <p className="text-sm text-gray-500">{area.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            {/* Back view */}
            <div className="relative">
              <Image
                src="/body-reference-back.png"
                alt="Back body reference"
                width={200}
                height={400}
                className="w-full"
              />
              <TooltipProvider>
                {bodyAreas.map((area) => (
                  <Tooltip key={area.id}>
                    <TooltipTrigger asChild>
                      <button
                        className={`absolute cursor-pointer p-1 rounded-full transition-colors
                          ${selectedAreas.includes(area.id) ? 'bg-primary/50' : 'bg-transparent hover:bg-primary/20'}
                          ${readOnly ? 'pointer-events-none' : ''}`}
                        style={getAreaPosition(area.id, 'back')}
                        onClick={() => !readOnly && onAreaSelect?.(area.id)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{area.label}</p>
                      <p className="text-sm text-gray-500">{area.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected Areas:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedAreas.map((areaId) => {
              const area = bodyAreas.find(a => a.id === areaId)
              return area ? (
                <span
                  key={areaId}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                >
                  {area.label}
                </span>
              ) : null
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getAreaPosition(areaId: string, view: 'front' | 'back'): React.CSSProperties {
  // Define positions for each area on both front and back views
  const positions: Record<string, { front?: React.CSSProperties, back?: React.CSSProperties }> = {
    face_head: {
      front: { top: '5%', left: '50%', transform: 'translateX(-50%)' },
      back: { top: '5%', left: '50%', transform: 'translateX(-50%)' }
    },
    neck: {
      front: { top: '15%', left: '50%', transform: 'translateX(-50%)' },
      back: { top: '15%', left: '50%', transform: 'translateX(-50%)' }
    },
    // Add positions for other areas...
  }

  return positions[areaId]?.[view] || {}
}
