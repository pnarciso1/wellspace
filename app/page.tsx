"use client"

import * as React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Brain, FileText, Activity, Gift, BotIcon as Robot, Users, Mail, AtSign, Twitter } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Meet Charlie, your AI Health Navigator",
    icon: <Brain className="mr-2 text-indigo-500" />,
    description: "Get personalized assistance to navigate complex healthcare decisions with AI support."
  },
  {
    title: "Medical Records Storage",
    icon: <FileText className="mr-2 text-indigo-500" />,
    description: "Securely store and access your medical records in one centralized location."
  },
  {
    title: "Health Tracks",
    icon: <Activity className="mr-2 text-indigo-500" />,
    description: "Follow personalized health improvement plans and track your progress over time."
  },
  {
    title: "Rewards System",
    icon: <Gift className="mr-2 text-indigo-500" />,
    description: "Earn tokens that can be converted into cash for healthy behaviors and engaging with the community."
  },
  {
    title: "AI Task Agents",
    icon: <Robot className="mr-2 text-indigo-500" />,
    description: "Have your AI Task Agent complete essential healthcare tasks like finding doctors, reviewing medical bills, and recommending insurance plans."
  },
  {
    title: "Community Connections",
    icon: <Users className="mr-2 text-indigo-500" />,
    description: "Find local resources and connect with people and organizations to help you achieve your health goals."
  }
]

const pricingPlans = [
  {
    title: "Free",
    price: "$0/month",
    features: [
      "AI Health Navigator",
      "Health Records Storage",
      "Evidence-based Health Tracks"
    ],
    buttonText: "Get Started"
  },
  {
    title: "Premium",
    price: "$9.99/month",
    features: [
      "All Free plan features",
      "Access to AI Agents",
      "Rewards to Cash Conversion"
    ],
    buttonText: "Subscribe Now"
  },
  {
    title: "Enterprise",
    price: "Contact Sales",
    features: [
      "All Premium plan features",
      "Custom AI Navigators",
      "Custom AI Agents",
      "Custom Health Tracks",
      "Enterprise Health Dashboard"
    ],
    buttonText: "Contact Sales"
  }
]

const testimonials = [
  {
    quote: "Wellspace has transformed how I manage my health. The AI navigator, Charlie, provides incredibly insightful advice, and the health tracks keep me motivated. It's like having a personal health coach in my pocket!",
    author: "Sarah Johnson",
    title: "Fitness Enthusiast"
  },
  {
    quote: "As someone with a chronic condition, keeping track of my medical records was always a hassle. Wellspace's secure storage and easy access have been a game-changer. I feel more in control of my health than ever before.",
    author: "Michael Chen",
    title: "Software Engineer"
  },
  {
    quote: "The rewards system is brilliant! It's encouraging to see my healthy choices translate into tangible benefits. Plus, the community feature has connected me with others on similar health journeys. Truly a comprehensive health platform!",
    author: "Emily Rodriguez",
    title: "Teacher"
  }
]

export default function HomePage() {
 const { user } = useAuth()
 const router = useRouter()

 useEffect(() => {
   if (user && user.email_confirmed_at) {
     router.push('/dashboard')
   }
 }, [user, router])

return (
<div className="min-h-screen bg-white">
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between py-6">
        <Link href="/" className="text-3xl font-bold text-indigo-600">Wellspace</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</Link></li>
            <li><Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Input type="search" placeholder="Search..." className="max-w-sm" />
          <Link href="/login">
            <Button variant="outline">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  </header>

  <main>
    <section className="mb-16 text-center relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:20px_20px]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
          Welcome to{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
            Wellspace
          </span>
        </h1>
        <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Navigate the complex healthcare system, manage your health, and improve outcomes—all in one platform.
        </p>
        <Card className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="py-8">
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-indigo-400 text-indigo-300 hover:bg-indigo-400/10 hover:text-indigo-200 px-8 py-6 text-lg transition-all duration-200"
                  asChild
                >
                  <Link href="/features">See How It Works →</Link>
                </Button>
              </div>
              <p className="text-gray-400 text-sm">
                No credit card required · Free forever plan available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <div className="relative -mt-16 mb-16">
      <svg 
        viewBox="0 0 1440 116" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        <path 
          d="M0 116L60 101.8C120 87.7 240 59.3 360 49.5C480 39.7 600 48.3 720 53.2C840 58 960 58 1080 63.8C1200 69.7 1320 81.3 1380 87.2L1440 93V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V116Z" 
          fill="white"
        />
      </svg>
    </div>

    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Core Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-indigo-600 group-hover:text-indigo-700">
                {feature.icon}
                <span className="ml-2">{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Pricing Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[600px]">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.title}
            className={cn(
              "hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
              plan.title === "Premium" && "border-2 border-indigo-500 relative overflow-hidden"
            )}
          >
            {plan.title === "Premium" && (
              <div className="absolute -right-12 top-6 bg-indigo-500 text-white px-12 py-1 rotate-45">
                Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-600">{plan.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4 text-gray-700">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                <Link href="/signup">{plan.buttonText}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section className="mb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent" />
      <div className="relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 relative">
                <div className="absolute -top-4 left-6 text-indigo-200 text-6xl">"</div>
                <p className="italic mb-4 text-gray-600 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-600">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </main>

  <footer className="bg-gray-800 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <h3 className="text-2xl font-bold mb-4">Wellspace</h3>
          <p className="text-gray-300">Simplifying healthcare for everyone.</p>
        </div>
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-indigo-300 transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">Contact</Link></li>
            <li><Link href="/legal" className="hover:text-indigo-300 transition-colors">Terms of Service</Link></li>
            <li><Link href="/legal" className="hover:text-indigo-300 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="w-full md:w-1/3">
          <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
          <p className="text-gray-300 mb-4">Follow us on social media for updates and health tips.</p>
          <div className="space-y-3">
            <a href="mailto:contactus@peoplecare.ai" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
              <Mail className="h-5 w-5 mr-2" />
              contactus@peoplecare.ai
            </a>
            <a href="https://bsky.app/profile/peoplecare.bsky.social" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
              <AtSign className="h-5 w-5 mr-2" />
              @peoplecare.bsky.social
            </a>
            <a href="https://twitter.com/peoplecarai" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
              <Twitter className="h-5 w-5 mr-2" />
              @peoplecarai
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>&copy; 2024 Wellspace by PeopleCare.ai. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>
)
}
















