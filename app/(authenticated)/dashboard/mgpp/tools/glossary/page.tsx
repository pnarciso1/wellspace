'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'
import type { GlossaryTerm, GlossaryCategory } from './types/glossary'
import { MessageSquare, Activity, ChevronRight } from 'lucide-react'
import { ChatPreview } from "@/app/components/glossary/chat-preview"
import { CategoryFilter } from "@/app/components/glossary/category-filter"

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadGlossaryData()
  }, [])

  const loadGlossaryData = async () => {
    try {
      const { data: termsData, error: termsError } = await supabase
        .from('glossary_terms')
        .select('*')
        .order('term')

      if (termsError) throw termsError

      setTerms(termsData || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load glossary data",
        variant: "destructive"
      })
    }
  }

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || term.categories.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">MG Glossary</h1>
        <Button asChild>
          <Link href="/dashboard/mgpp">
            Back to Tools
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Understanding Medical Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This glossary provides definitions for common terms related to Myasthenia Gravis (MG).
            Use the search box to find specific terms or filter by category.
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChatPreview />

      <div className="my-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="grid gap-4 mt-6">
        {filteredTerms.map((term) => (
          <Card key={term.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {term.term}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{term.definition}</p>
            </CardContent>
          </Card>
        ))}
        {filteredTerms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No terms found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}
