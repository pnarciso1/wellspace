"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, FileText, Activity, Star, User, Activity as ActivityIcon, Users, Lock, Mail, Mail as EmailIcon, MessageSquare, Menu } from 'lucide-react'
import { useState } from 'react'

export default function FeaturesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-md relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="text-3xl font-bold text-indigo-600">Wellspace</Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</Link></li>
                <li><Link href="/features" className="text-indigo-600 font-semibold">Features</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link></li>
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Input type="search" placeholder="Search..." className="max-w-sm" />
              <Link href="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-20 left-0 right-0 bg-white shadow-lg p-4 md:hidden z-50">
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                  <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
                  <Link href="/features" className="text-indigo-600 font-semibold" onClick={() => setIsMenuOpen(false)}>Features</Link>
                  <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  <div className="pt-4 border-t border-gray-200">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full mb-2">Log In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mb-16 text-center relative overflow-hidden min-h-[70vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:20px_20px]" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
              Wellspace Features
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto px-4 md:px-0">
              Discover the tools and features that make Wellspace your complete healthcare management solution.
            </p>
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

        <div className="container mx-auto px-4">
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">Free Plan Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4 md:px-8">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <AlertCircle className="mr-2 text-indigo-500" />
                    AI Health Navigator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get personalized assistance to navigate complex healthcare decisions with AI support.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="mr-2 text-indigo-500" />
                    Medical Records Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Securely store and access your medical records in one centralized location.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Activity className="mr-2 text-indigo-500" />
                    Health Tracks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Follow personalized health improvement plans and track your progress over time.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8">Premium Plan Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CheckCircle className="mr-2 text-indigo-500" />
                    All Free Plan Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Enjoy all the features of the Free plan, plus the following premium benefits.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <User className="mr-2 text-indigo-500" />
                    AI Task Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Access AI agents to help with tasks like finding doctors, reviewing medical bills, and recommending insurance plans.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Star className="mr-2 text-indigo-500" />
                    Rewards to Cash Conversion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Convert earned tokens into cash rewards for maintaining healthy behaviors and engaging with the community.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8">Enterprise Plan Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CheckCircle className="mr-2 text-indigo-500" />
                    All Premium Plan Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Access all features from the Free and Premium plans, plus exclusive enterprise-level benefits.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <ActivityIcon className="mr-2 text-indigo-500" />
                    Custom AI Navigators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Tailor AI health navigators to your organization's specific needs and healthcare policies.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Users className="mr-2 text-indigo-500" />
                    Team Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Efficiently manage and monitor the health and wellness of your entire team or organization.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Activity className="mr-2 text-indigo-500" />
                    Custom Health Tracks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create and implement custom health improvement plans tailored to your organization's goals.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Lock className="mr-2 text-indigo-500" />
                    Advanced Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Benefit from enhanced security features and compliance measures for enterprise-level data protection.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="text-center mt-16 md:mt-24 mb-16 md:mb-24 px-4 md:px-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">Ready to Get Started?</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto">
              Join Wellspace today and take control of your health journey with our innovative AI-powered platform.
            </p>
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full md:w-auto"
              asChild
            >
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Wellspace</h3>
              <p className="text-gray-300">Simplifying healthcare for everyone.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-indigo-300 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-indigo-300 transition-colors">About</Link></li>
                <li><Link href="/features" className="hover:text-indigo-300 transition-colors">Features</Link></li>
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
                  <EmailIcon className="h-5 w-5 mr-2" />
                  contactus@peoplecare.ai
                </a>
                <a href="https://bsky.app/profile/peoplecare.bsky.social" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
                  <Users className="h-5 w-5 mr-2" />
                  @peoplecare.bsky.social
                </a>
                <a href="https://twitter.com/peoplecarai" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
                  <MessageSquare className="h-5 w-5 mr-2" />
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






