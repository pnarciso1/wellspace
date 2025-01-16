"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoCategory } from "@/types"

interface CategoryFilterProps {
  selectedCategory: VideoCategory | null
  onCategoryChange: (category: VideoCategory | null) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => onCategoryChange(value === "all" ? null : value as VideoCategory)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="wellness">Wellness</SelectItem>
          <SelectItem value="nutrition">Nutrition</SelectItem>
          <SelectItem value="fitness">Fitness</SelectItem>
          <SelectItem value="mental-health">Mental Health</SelectItem>
          <SelectItem value="medical-info">Medical Info</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
