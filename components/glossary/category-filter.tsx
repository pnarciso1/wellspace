import { Button } from "@/components/ui/button"
import type { GlossaryCategory } from "@/types/glossary"

interface CategoryFilterProps {
  selectedCategory: GlossaryCategory | 'all'
  onCategoryChange: (category: GlossaryCategory | 'all') => void
}

const categories: (GlossaryCategory | 'all')[] = [
  'all',
  'symptoms',
  'procedures',
  'conditions',
  'medications',
  'anatomy',
  'medical_terms'
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="capitalize"
        >
          {category.replace('_', ' ')}
        </Button>
      ))}
    </div>
  )
}
