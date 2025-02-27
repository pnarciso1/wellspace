'use client'

import * as React from "react"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Heart, Users, Activity, MessageSquare, FileText, ChevronRight, Menu } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const coreValues = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Compassion",
      description: "We put the well-being of our users at the heart of everything we do."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description: "We believe in the power of connection and support in health journeys."
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible in healthcare technology."
    },
    {
      icon: <span className="text-2xl">💬</span>,
      title: "Excellence",
      description: "We strive for the highest standards in all aspects of our service."
    }
  ]

  const navigationItems = [
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <header className="bg-transparent relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="text-3xl font-bold text-indigo-400">Wellspace</Link>
            
            {/* Mobile Menu Button - visible on small screens */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Menu className="h-6 w-6 text-gray-300" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div>
                  <nav className="flex flex-col space-y-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium transition-colors hover:text-foreground/80"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

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
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Hero Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
              About Wellspace
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Wellspace by PeopleCare.ai is revolutionizing healthcare management through innovative AI-driven solutions. 
              Our mission is to empower individuals to take control of their health journey with ease and confidence.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="text-indigo-400 mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
              Our Story
            </h2>
            <div className="mx-auto max-w-3xl bg-white/10 backdrop-blur-md rounded-lg p-8 text-gray-300">
              <p className="text-lg leading-relaxed">
                Founded with a vision to make healthcare management more accessible and efficient, 
                Wellspace combines cutting-edge AI technology with a deep understanding of healthcare 
                challenges. Our platform is designed to provide personalized support, streamline 
                healthcare processes, and improve overall health outcomes for our users.
              </p>
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
                  <FileText className="h-5 w-5 mr-2" />
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
