"use client"

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Helper to log to server (Terminal) as well as console
async function logToServer(message: string, data: any) {
  console.log('[DEBUG]', message, data)
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, data })
    })
  } catch (e) {
    // Ignore server log errors
  }
}

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  // DEBUG: Log at every render
  console.log('[DEBUG] ResetPasswordForm rendered')
  console.log('[DEBUG] searchParams:', searchParams?.toString())
  const access_token = searchParams?.get('access_token')
  const refresh_token = searchParams?.get('refresh_token')
  const emailFromUrl = searchParams?.get('email')
  console.log('[DEBUG] access_token:', access_token)
  console.log('[DEBUG] refresh_token:', refresh_token)
  console.log('[DEBUG] emailFromUrl:', emailFromUrl)

  useEffect(() => {
    console.log('[DEBUG] useEffect running. access_token:', access_token)
    const effectiveEmail = emailFromUrl || email
    if (!access_token || !effectiveEmail) {
      console.warn('[DEBUG] No access_token or email in URL/input')
      return
    }
    const doRecovery = async () => {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token: access_token,
        email: effectiveEmail
      })
      console.log('[DEBUG] verifyOtp result:', { data, error })
      if (error) {
        console.error('[DEBUG] verifyOtp error:', error)
        toast({
          title: 'Error',
          description: 'Failed to authenticate reset link. Please try again.',
          variant: 'destructive',
        })
        router.push('/login')
      } else {
        setSessionReady(true)
      }
    }
    doRecovery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, access_token, email, emailFromUrl])

  if (!searchParams?.get('type') || !access_token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invalid Reset Link</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">This password reset link is invalid or has expired.</p>
          <div className="text-xs text-red-500 mt-2">[DEBUG] searchParams: {searchParams?.toString() || 'null'}<br/>access_token: {access_token || 'null'}</div>
          <Button className="w-full mt-4" onClick={() => router.push('/login')}>
            Return to Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!emailFromUrl && !email) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); setEmail((e.target as any).email.value); }} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            <Button type="submit" className="w-full">Continue</Button>
          </form>
          <div className="text-xs text-blue-500 mt-2">[DEBUG] searchParams: {searchParams?.toString() || 'null'}<br/>access_token: {access_token || 'null'}</div>
        </CardContent>
      </Card>
    )
  }

  if (!sessionReady) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authenticating...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Please wait while we verify your reset link.</p>
          <div className="text-xs text-blue-500 mt-2">[DEBUG] searchParams: {searchParams?.toString() || 'null'}<br/>access_token: {access_token || 'null'}<br/>email: {emailFromUrl || email || 'null'}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <div className="text-xs text-green-500 mt-2">[DEBUG] searchParams: {searchParams?.toString() || 'null'}<br/>access_token: {access_token || 'null'}<br/>email: {emailFromUrl || email || 'null'}</div>
      </CardContent>
    </Card>
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    createClientComponentClient().auth.updateUser({ password })
      .then(({ error }) => {
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
        } else {
          toast({
            title: "Success",
            description: "Password has been reset. Please log in.",
          })
          router.push('/login')
        }
      })
      .finally(() => setLoading(false))
  }
}

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Suspense 
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
} 