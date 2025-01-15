'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from 'lucide-react'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PremiumSignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // First create the user account
      const { user } = await signUp(email, password, name)
      setShowVerificationMessage(true)
      
      if (!user?.id) {
        throw new Error('User creation failed')
      }

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      // Load Stripe and redirect to checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "An error occurred during sign up. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-10">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
              <CardDescription className="text-gray-300">
                We've sent you an email verification link. Please verify your email before proceeding with the subscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-white/10 border-indigo-400/20 text-gray-300 mb-4">
                <Info className="h-4 w-4 text-indigo-400" />
                <AlertDescription>
                  After verifying your email, you'll be redirected to complete your premium subscription setup.
                </AlertDescription>
              </Alert>
              <Button 
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white" 
                variant="outline" 
                onClick={() => router.push('/login')}
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-10">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Sign Up for Premium Plan</CardTitle>
            <CardDescription className="text-gray-300">
              Create your account to get started with our premium features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Alert className="bg-white/10 border-indigo-400/20 text-gray-300">
                <Info className="h-4 w-4 text-indigo-400" />
                <AlertDescription>
                  You'll need to verify your email before completing the subscription process.
                </AlertDescription>
              </Alert>
              <Button 
                type="submit" 
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white" 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Sign Up and Subscribe'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}







