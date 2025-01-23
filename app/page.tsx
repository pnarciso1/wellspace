"use client"

import * as React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Brain, FileText, Activity, Gift, BotIcon as Robot, Users, Mail, AtSign, Twitter, Heart, Trophy, Wallet, Video, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Brain,
    title: "Meet Charlie, your AI Health Navigator",
    description: "Get personalized assistance to navigate complex healthcare decisions with AI support."
  },
  {
    icon: Video,
    title: "Curated Health Videos",
    description: "Access curated videos that guide you on your personalized health journey."
  },
  {
    icon: FileText,
    title: "Medical Records Storage",
    description: "Securely store and access your medical records in one centralized location."
  },
  {
    icon: Activity,
    title: "Health Tracks",
    description: "Follow personalized health improvement plans and track your progress over time."
  },
  {
    icon: Gift,
    title: "Rewards System",
    description: "Earn tokens that can be converted into cash for healthy behaviors and engaging with the community."
  },
  {
    icon: Robot,
    title: "AI Task Agents",
    description: "Have your AI Task Agent complete essential healthcare tasks like finding doctors, reviewing medical bills, and recommending insurance plans."
  },
  {
    icon: Users,
    title: "Community Connections",
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <header className="bg-transparent relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="text-3xl font-bold text-indigo-400">Wellspace</Link>
            
            {/* Mobile Menu Button - visible on small screens */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6 text-gray-300" />
            </button>

            {/* Desktop Navigation - hidden on mobile */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link href="/about" className="text-gray-300 hover:text-indigo-400 transition-colors">About</Link></li>
                <li><Link href="/features" className="text-gray-300 hover:text-indigo-400 transition-colors">Features</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-indigo-400 transition-colors">Contact</Link></li>
              </ul>
            </nav>

            {/* Desktop Actions - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              <Input type="search" placeholder="Search..." className="max-w-sm bg-white/10 border-white/20" />
              <Link href="/login">
                <Button variant="outline" className="text-indigo-400 border-indigo-400/20 hover:bg-white/10 hover:text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-indigo-500 hover:bg-indigo-600">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile Menu - visible when open */}
            {isMenuOpen && (
              <div className="absolute top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-sm p-4 md:hidden z-50">
                <nav className="flex flex-col space-y-4">
                  <Link 
                    href="/about" 
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/features" 
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <div className="pt-4 border-t border-gray-700">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full mb-2 text-indigo-400 border-indigo-400/20">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-indigo-500">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:20px_20px]" />
        <section className="relative z-10 py-20 flex items-center justify-center min-h-[80vh]">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
              Take Charge of Your Healthcare Today
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto">
              Cut through the confusion. Navigate bills, manage care, and improve your health outcomes—all with the power of AI.
            </p>
            <div className="flex flex-col items-center px-4 md:px-0">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 mb-4 w-full md:w-auto">
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <Link href="/signup/free" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-lg md:text-xl px-6 md:px-10 py-4 md:py-6 text-white">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/features#how-it-works" className="w-full md:w-auto">
                    <Button variant="outline" className="w-full md:w-auto text-lg md:text-xl px-6 md:px-10 py-4 md:py-6 text-indigo-400 border-indigo-400/20 hover:bg-white/10 hover:text-white">
                      See How It Works →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Everything you need to manage your healthcare journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-indigo-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 md:py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
              Choose the plan that's right for you
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                    <p className="text-3xl font-bold text-indigo-400 mb-6">{plan.price}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <CheckCircle className="w-5 h-5 text-indigo-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={
                      plan.title === "Free" ? "/signup/free" :
                      plan.title === "Premium" ? "/signup/premium" :
                      "/contact"
                    }>
                      <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 md:py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
              What our users say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <p className="text-gray-300 mb-4">{testimonial.quote}</p>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-indigo-400">{testimonial.title}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">Wellspace</h3>
              <p className="text-gray-400">
                Simplifying healthcare for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-indigo-400">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-indigo-400">Contact</Link></li>
                <li><Link href="/legal#terms-of-service" className="text-gray-400 hover:text-indigo-400">Terms of Service</Link></li>
                <li><Link href="/legal#privacy-policy" className="text-gray-400 hover:text-indigo-400">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
              <p className="text-gray-400 mb-4">
                Follow us on social media for updates and health tips.
              </p>
              <div className="space-y-2">
                <Link href="mailto:contactus@peoplecare.ai" className="flex items-center text-gray-400 hover:text-indigo-400">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>contactus@peoplecare.ai</span>
                </Link>
                <Link href="https://bsky.app/profile/peoplecare.bsky.social" className="flex items-center text-gray-400 hover:text-indigo-400">
                  <AtSign className="h-5 w-5 mr-2" />
                  <span>@peoplecare.bsky.social</span>
                </Link>
                <Link href="https://twitter.com/peoplecarai" className="flex items-center text-gray-400 hover:text-indigo-400">
                  <Twitter className="h-5 w-5 mr-2" />
                  <span>@peoplecarai</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-center text-sm md:text-base text-gray-400">
              © 2024 Wellspace by PeopleCare.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
















