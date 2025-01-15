'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'

const plans = [
  {
    title: 'Free Plan',
    price: '$0/month',
    features: [
      'AI Health Navigator',
      'Health Records Storage',
      'Evidence-based Health Tracks'
    ],
    href: '/signup/free',
    buttonText: 'Get Started Free'
  },
  {
    title: 'Premium Plan',
    price: '$9.99/month',
    features: [
      'All Free plan features',
      'Access to AI Agents',
      'Rewards to Cash Conversion'
    ],
    href: '/signup/premium',
    buttonText: 'Subscribe Now'
  }
]

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-300">
            Select the plan that best fits your healthcare needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.title} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{plan.title}</CardTitle>
                <CardDescription className="text-xl font-bold text-indigo-400">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}













