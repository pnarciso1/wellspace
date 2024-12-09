'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PremiumSignUpSuccess() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        router.push('/')
        return
      }

      try {
        // Here you would typically verify the session with your backend
        // and update the user's subscription status
        setIsLoading(false)
      } catch (error) {
        console.error('Error verifying session:', error)
        router.push('/')
      }
    }

    verifySession()
  }, [sessionId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="text-center">Verifying your subscription...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Subscription Successful</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Thank you for subscribing to the Premium plan!</p>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  )
}


