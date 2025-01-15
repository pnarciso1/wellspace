"use client"

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function VerifyEmailContent() {
  const [message, setMessage] = useState('Verifying your email...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams?.get('token')
        const type = searchParams?.get('type')

        if (!token || !type) {
          setMessage('Invalid verification link')
          return
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) throw error
        setMessage('Email verified successfully!')
      } catch (error) {
        console.error('Error:', error)
        setMessage('Failed to verify email. Please try again.')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">{message}</p>
          <Button 
            className="w-full" 
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}




