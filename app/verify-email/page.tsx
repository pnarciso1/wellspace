'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyEmail() {
  const [isVerified, setIsVerified] = useState(false)
  const { user, refreshSession } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams?.get('code')

  useEffect(() => {
    const checkVerification = async () => {
      if (code) {
        // If we have a code, redirect to login
        router.push('/login')
        return
      }

      if (user) {
        await refreshSession()
        if (user.email_confirmed_at) {
          setIsVerified(true)
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000)
        }
      }
    }

    checkVerification()
    const interval = setInterval(checkVerification, 5000)

    return () => clearInterval(interval)
  }, [user, refreshSession, router, code])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            {isVerified
              ? "Your email has been verified. You'll be redirected to the dashboard shortly."
              : "Please check your email and click the verification link to complete your registration."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isVerified && (
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}






