'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/lib/icons"
import { toast } from 'sonner'
import { GlossaryTerm } from '@/types/gpact-glossary'

export function GlossaryClient() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const supabase = createClientComponentClient()
  const charlieSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTerms()
  }, [])

  const scrollToCharlie = () => {
    charlieSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('gpact_glossary_terms')
        .select('*')
        .order('term', { ascending: true })

      if (error) throw error

      setTerms(data || [])
    } catch (error) {
      console.error('Error fetching glossary terms:', error)
      toast.error('Failed to load glossary terms')
    } finally {
      setLoading(false)
    }
  }

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.plain_language_meaning.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || term.type === selectedType
    return matchesSearch && matchesType
  })

  const types = [
    { key: 'all', label: 'All' },
    { key: 'Condition', label: 'Conditions' },
    { key: 'Finding', label: 'Findings' },
    { key: 'Physiology', label: 'Physiology' },
    { key: 'Anatomy', label: 'Anatomy' },
    { key: 'Sub-type', label: 'Sub-types' },
    { key: 'Test', label: 'Tests' },
    { key: 'Test/Procedure', label: 'Tests/Procedures' },
    { key: 'Drug class', label: 'Drug Classes' },
    { key: 'Prescription prokinetic', label: 'Prescription Prokinetics' },
    { key: 'Restricted prokinetic', label: 'Restricted Prokinetics' },
    { key: 'Investigational prokinetic', label: 'Investigational Prokinetics' },
    { key: 'Off-label prokinetic', label: 'Off-label Prokinetics' },
    { key: 'Prescription anti-nausea', label: 'Anti-nausea Medications' },
    { key: 'Prescription', label: 'Prescriptions' },
    { key: 'OTC/herbal', label: 'OTC/Herbal' },
    { key: 'Procedure', label: 'Procedures' },
    { key: 'Device', label: 'Devices' },
    { key: 'Device/Procedure', label: 'Devices/Procedures' },
    { key: 'Symptom', label: 'Symptoms' },
    { key: 'Complication', label: 'Complications' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.Activity className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading glossary terms...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                <Icons.MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Meet Charlie, Your Gastroparesis Guide
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Have questions about gastroparesis? Chat with Charlie, our AI assistant trained on medical literature and patient experiences. 
                Get instant answers about symptoms, treatments, and living with gastroparesis.
              </p>
              <Button onClick={scrollToCharlie} className="gap-2 w-full sm:w-auto">
                <Icons.MessageSquare className="h-4 w-4" />
                Chat with Charlie Now
              </Button>
            </div>
            <div className="hidden md:block">
              <Icons.MessageSquare className="h-16 w-16 text-primary/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
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
            setSelectedType('all')
          }}
          className="w-full sm:w-auto"
        >
          Clear
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {types.map((type) => (
          <Button
            key={type.key}
            variant={selectedType === type.key ? "default" : "outline"}
            onClick={() => setSelectedType(type.key)}
            className="text-sm whitespace-nowrap"
          >
            {type.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTerms.map((term) => (
          <Card key={term.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">{term.term}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                    {term.type}
                  </span>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {term.plain_language_meaning}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <Icons.FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No terms found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      <div ref={charlieSectionRef} className="mt-12 space-y-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Ask Charlie About Gastroparesis</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Have questions about gastroparesis? Chat with Charlie, our AI assistant trained on medical literature and patient experiences. 
              Get instant answers about symptoms, treatments, and living with gastroparesis.
            </p>
            <div className="rounded-lg overflow-hidden border">
              <iframe 
                src="https://gastroparesischarlie-69312.chipp.ai" 
                height="600px"
                width="100%" 
                frameBorder="0" 
                title="Gastroparesis Charlie"
                className="bg-white w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 