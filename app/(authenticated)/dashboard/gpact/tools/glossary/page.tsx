'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/lib/icons"
import { toast } from 'sonner'
import Link from 'next/link'
import { GlossaryClient } from './glossary-client'

export default function GPACTGlossaryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gastroparesis Glossary</h1>
        <Button asChild>
          <Link href="/dashboard/gpact">
            Back to Tools
            <Icons.ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.FileText className="h-5 w-5" />
            Medical Terms and Definitions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A comprehensive glossary of medical terms related to Gastroparesis. 
            Use the search box to find specific terms or browse by category.
          </p>
        </CardContent>
      </Card>

      <GlossaryClient />
    </div>
  )
} 