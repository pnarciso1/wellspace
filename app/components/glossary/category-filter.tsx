import { Button } from "@/components/ui/button"
import type { GlossaryCategory } from '@/app/(authenticated)/dashboard/mgpp/tools/glossary/types/glossary'

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
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant={selectedCategory === category ? "default" : "outline"}
          className="capitalize"
          size="sm"
        >
          {category === 'all' ? 'All Categories' : category.replace('_', ' ')}
        </Button>
      ))}
    </div>
  )
}
