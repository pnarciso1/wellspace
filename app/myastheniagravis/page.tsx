"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, MessageSquare, FileText, Activity, Users, Mail, Menu, Star, Calendar } from 'lucide-react'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Raleway } from 'next/font/google'

const raleway = Raleway({ 
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-raleway',
})

const coreFeatures = [
  {
    icon: Activity,
    title: "Comprehensive Tracking",
    description: "Track symptoms, medications, activities, and quality-of-life metrics in one secure place."
  },
  {
    icon: Calendar,
    title: "Appointment Preparation",
    description: "Generate detailed reports that can be integrated directly into your electronic medical records, ensuring physicians have access to crucial information before appointments begin."
  },
  {
    icon: Users,
    title: "Peer Support",
    description: "Connect with experienced MG patients who provide coaching on maximizing appointment effectiveness."
  },
  {
    icon: MessageSquare,
    title: "AI Assistance",
    description: "Navigate complex medical terminology with our AI assistant designed specifically for the MG community."
  }
]

export default function MyastheniaGravisPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 ${raleway.variable}`}>
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
        
        {/* Hero Section */}
        <section className="relative z-10 py-20 flex items-center justify-center min-h-[80vh]">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-8">
              <div className="relative bg-white rounded-lg p-6 flex items-center justify-center">
                <h2 className="text-4xl md:text-5xl font-bold tracking-wider font-raleway" style={{ color: 'rgb(244, 115, 29)' }}>
                  PATIENTS RISING
                </h2>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
              Myasthenia Gravis Patient Program
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-indigo-400 mb-6">
              Take Control of Your MG Journey
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto">
              Wellspace by PeopleCare.ai is revolutionizing healthcare management for Myasthenia Gravis patients through innovative AI-driven solutions. Our mission is to empower you to take control of your health journey with ease and confidence.
            </p>
            <div className="flex flex-col items-center px-4 md:px-0">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 mb-4 w-full md:w-auto">
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <Link href="/signup/free" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-lg md:text-xl px-6 md:px-10 py-4 md:py-6 text-white">
                      Join Our Program
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full md:w-auto">
                    <Button variant="outline" className="w-full md:w-auto text-lg md:text-xl px-6 md:px-10 py-4 md:py-6 text-indigo-400 border-indigo-400/20 hover:bg-white/10 hover:text-white">
                      Log In →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Our MG Program Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Why Choose Our MG Program?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-400">The Challenge</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-300 text-lg">
                    The average doctor's visit lasts just 18.5 minutes, with much of that time spent on administrative tasks rather than meaningful patient care.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-400">Our Solution</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-300 text-lg">
                    We've created tools that respect the precious minutes of your doctor's appointment by helping you communicate your complex experiences efficiently and effectively.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Our Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8">
              {coreFeatures.map((feature, index) => (
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

        {/* Impact Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Our Impact
            </h2>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <p className="text-gray-300 text-xl italic mb-6">
                  "When patients arrive prepared with organized, relevant health data, physicians can focus less on documentation and more on what truly matters—providing care. This program strengthens the doctor-patient relationship, which remains the cornerstone of effective healthcare."
                </p>
                <div className="text-right">
                  <p className="text-white font-semibold text-lg">Jim Sliney Jr.</p>
                  <p className="text-indigo-400">Chief Patient Officer at Patients Rising</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Our Story
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8">
                  <p className="text-gray-300 text-lg mb-6">
                    Developed in collaboration between Patients Rising, the nation's leading grassroots patient advocacy organization, and PeopleCare.ai, with support from UCB, a global biopharmaceutical company specializing in neurological and immunological conditions.
                  </p>
                  <p className="text-gray-300 text-lg">
                    This partnership was formed after identifying low satisfaction with physician interactions among MG patients, creating a targeted solution to address these specific needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Join Our Community Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-8">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              The Myasthenia Gravis Patient Program is now available nationwide. Take the first step toward more effective healthcare management today.
            </p>
            <Link href="/signup/free">
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-lg px-10 py-6 text-white">
                Get Started Now
              </Button>
            </Link>
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