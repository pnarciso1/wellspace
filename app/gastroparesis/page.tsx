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
    icon: MessageSquare,
    title: "AI Assistance",
    description: "Chat with Charlie, our AI assistant designed specifically for the gastroparesis community."
  },
  {
    icon: FileText,
    title: "Educational Resources",
    description: "Access a comprehensive glossary and educational materials to better understand your condition."
  },
  {
    icon: Star,
    title: "Financial AI Helpers",
    description: "Reduce your administrative burden of dealing with medical bills, insurance benefits, and coordinating care by using our AI Helpers who will do the work for you."
  },
  {
    icon: Users,
    title: "Extensive Video Library",
    description: "Access curated video content, including exclusive content from G-PACT conferences, and Podcast."
  }
]

export default function GastroparesisPage() {
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
                <Image
                  src="/images/gpact-logo.png"
                  alt="GPACT Logo"
                  width={200}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
              Gastroparesis Patient Program
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-indigo-400 mb-6">
              Take Control of Your Gastroparesis Journey
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto">
              G-PACT, and Wellspace by PeopleCare.ai are revolutionizing healthcare management for Gastroparesis patients through innovative AI-driven solutions. Our mission is to empower you to take control of your health journey with ease and confidence.
            </p>
            <div className="flex flex-col items-center px-4 md:px-0">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 mb-4 w-full md:w-auto">
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <Link href="/signup" className="w-full md:w-auto">
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

        {/* Why Choose Our Program Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Why Choose Our Gastroparesis Program?
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 md:p-10">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    G-PACT is the first and longest running nonprofit patient support organization for gastroparesis and intestinal dysmotility. We have a thriving community of GP patients on social media, and our president and board members are involved in multiple aspects of healthcare and wellness. We have long standing relationships with the IFFGD, Oley Foundation, and many of the other representatives of GP patients and clinicians. All of our services are provided free of charge. We rely 100% on donations and grants. Our staff is fully voluntary and no one is paid for their services. This allows us to use 100% of all funding towards our awareness, advocacy, and operating expenses. Beginning in 2015, we sponsored the first international Gastroparesis Registry in cooperation with the NIH. G-PACT is led by GP patients, so we get it.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
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
                  "G-Pact has been an amazing resource for me and thanks to them I don't feel alone along my GP journey. Thank you!"
                </p>
                <div className="text-right">
                  <p className="text-white font-semibold text-lg">Joni R.</p>
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
                  <p className="text-gray-300 text-lg">
                    Developed in collaboration with G-PACT, the nation's largest advocacy for gastroparesis and intestinal dysmotility, G-PACT is dedicated to providing a network of resources for gastroparesis and chronic intestinal pseudo-obstruction patients, medical professionals, and the general population.
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
              The Gastroparesis Patient Program is now available nationwide. Take the first step toward more effective healthcare management today.
            </p>
            <Link href="/signup">
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