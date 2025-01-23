"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Heart, Users, Zap, Award, Mail, AtSign, Twitter, Menu } from 'lucide-react'
import { useState } from 'react'

export default function AboutPage() {
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
                <li><Link href="/about" className="text-indigo-600 font-semibold">About</Link></li>
                <li><Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link></li>
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
                  <Link href="/about" className="text-indigo-600 font-semibold" onClick={() => setIsMenuOpen(false)}>About</Link>
                  <Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
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
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">About Wellspace</h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto px-4 md:px-0">
              Wellspace by PeopleCare.ai is revolutionizing healthcare management through innovative AI-driven solutions. Our mission is to empower individuals to take control of their health journey with ease and confidence.
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
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 md:mb-8 text-center px-4">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-4 md:px-8">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-indigo-600">
                    <Heart className="mr-2 text-indigo-500" />
                    Compassion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We put the well-being of our users at the heart of everything we do.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-indigo-600">
                    <Users className="mr-2 text-indigo-500" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We believe in the power of connection and support in health journeys.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-indigo-600">
                    <Zap className="mr-2 text-indigo-500" />
                    Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We continuously push the boundaries of what's possible in healthcare technology.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-indigo-600">
                    <Award className="mr-2 text-indigo-500" />
                    Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We strive for the highest standards in all aspects of our service.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12 md:mb-16 px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 md:mb-8 text-center">Our Story</h2>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 md:p-8">
                <p className="text-gray-600 mb-4">
                  Wellspace was born from a simple yet powerful idea: healthcare management should be accessible, intuitive, and personalized. Our team of healthcare professionals and tech innovators recognized the challenges individuals face in navigating the complex world of healthcare.
                </p>
                <p className="text-gray-600 mb-4">
                  Inspired by the potential of AI to transform healthcare, we set out to create a platform that would serve as a personal health assistant for everyone. We envisioned a world where managing your health is as simple as checking your email, where personalized health insights are at your fingertips, and where taking control of your well-being is empowering rather than overwhelming.
                </p>
                <p className="text-gray-600">
                  Today, Wellspace stands as a testament to that vision. We're proud to offer a comprehensive suite of tools that help our users navigate their health journeys with confidence, from AI-powered health navigation to secure medical record storage, from personalized health tracks to community support. As we continue to grow and evolve, our commitment remains the same: to empower every individual to live their healthiest, happiest life.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="text-center mb-16 md:mb-24 px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-8">Join Us on This Journey</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto">
              Be part of the healthcare revolution. Experience the future of personalized health management with Wellspace.
            </p>
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full md:w-auto"
              asChild
            >
              <Link href="/signup">Get Started Today</Link>
            </Button>
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 md:py-12 mt-12 md:mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Wellspace</h3>
              <p className="text-gray-300">Simplifying healthcare for everyone.</p>
            </div>

            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-indigo-300 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-indigo-300 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">Contact</Link></li>
                <li><Link href="/legal" className="hover:text-indigo-300 transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal" className="hover:text-indigo-300 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Connect With Us</h4>
              <p className="text-gray-300 mb-3 md:mb-4">Follow us on social media for updates and health tips.</p>
              <div className="space-y-2 md:space-y-3">
                <a href="mailto:contactus@peoplecare.ai" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-indigo-300 transition-colors">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>contactus@peoplecare.ai</span>
                </a>
                <a href="https://bsky.app/profile/peoplecare.bsky.social" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-indigo-300 transition-colors">
                  <AtSign className="h-5 w-5 mr-2" />
                  <span>@peoplecare.bsky.social</span>
                </a>
                <a href="https://twitter.com/peoplecarai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-indigo-300 transition-colors">
                  <Twitter className="h-5 w-5 mr-2" />
                  <span>@peoplecarai</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-sm md:text-base text-gray-400">
              © 2024 Wellspace by PeopleCare.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}






















