"use client"

import * as React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Brain, FileText, Activity, Gift, BotIcon as Robot, Mail, AtSign, Twitter } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
 const { user } = useAuth()
 const router = useRouter()

 useEffect(() => {
   if (user && user.email_confirmed_at) {
     router.push('/dashboard')
   }
 }, [user, router])

return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

  <main className="container mx-auto px-4 py-12">
    <section className="mb-16 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">Welcome to Wellspace by PeopleCare.ai</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-indigo-600">Simplify Your Healthcare Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-6">Navigate the complex healthcare system, manage your health, take control of your healthcare expenses, and improve outcomes—all in one platform.</p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </CardContent>
      </Card>
    </section>

    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Core Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-indigo-600">
              <Brain className="mr-2 text-indigo-500" />
              Meet Charlie, your AI Health Navigator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Get personalized assistance to navigate complex healthcare decisions with AI support.</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-indigo-600">
              <FileText className="mr-2 text-indigo-500" />
              Medical Records Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Securely store and access your medical records in one centralized location.</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-indigo-600">
              <Activity className="mr-2 text-indigo-500" />
              Health Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Follow personalized health improvement plans and track your progress over time.</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-indigo-600">
              <Gift className="mr-2 text-indigo-500" />
              Rewards System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Earn tokens that can be converted into cash for healthy behaviors and engaging with the community.</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-indigo-600">
              <Robot className="mr-2 text-indigo-500" />
              AI Task Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Have your AI Task Agent complete essential healthcare tasks like finding doctors, reviewing medical bills, and recommending insurance plans.</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Pricing Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[600px]">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-600">Free</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4 text-gray-700">$0/month</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                AI Health Navigator
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Health Records Storage
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Evidence-based Health Tracks
              </li>
            </ul>
            <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300 border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-600">Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4 text-indigo-700">$9.99/month</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                All Free plan features
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Access to AI Agents
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Rewards to Cash Conversion
              </li>
            </ul>
            <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/signup/premium">Subscribe Now</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-600">Enterprise</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-700">$49.99</p>
                <p className="text-xl text-gray-600">/member/month</p>
                <p className="text-sm text-gray-600 mt-2">(minimum 50 members)</p>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>All Premium plan features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Custom AI Navigators</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Custom AI Agents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Custom Health Tracks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Enterprise Health Dashboard</span>
                </li>
              </ul>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/contact-sales">Contact Sales</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <p className="italic mb-4 text-gray-600">"Wellspace has transformed how I manage my health. The AI navigator, Charlie, provides incredibly insightful advice, and the health tracks keep me motivated. It's like having a personal health coach in my pocket!"</p>
            <p className="font-semibold text-indigo-600">- Sarah Johnson, Fitness Enthusiast</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <p className="italic mb-4 text-gray-600">"As someone with a chronic condition, keeping track of my medical records was always a hassle. Wellspace's secure storage and easy access have been a game-changer. I feel more in control of my health than ever before."</p>
            <p className="font-semibold text-indigo-600">- Michael Chen, Software Engineer</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <p className="italic mb-4 text-gray-600">"The rewards system is brilliant! It's encouraging to see my healthy choices translate into tangible benefits. Plus, the community feature has connected me with others on similar health journeys. Truly a comprehensive health platform!"</p>
            <p className="font-semibold text-indigo-600">- Emily Rodriguez, Teacher</p>
          </CardContent>
        </Card>
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
















