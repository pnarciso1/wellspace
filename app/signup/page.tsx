'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Menu, Mail, Users, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const plan = {
  title: 'Sign Up - Always Free',
  features: [
    'AI Health Navigator',
    'Health Records Storage',
    'Evidence-based Health Tracks',
    'Access to AI Agents',
    'Rewards to Cash Conversion',
    'Team Management',
    'Custom Health Tracks',
    'Advanced Security'
  ],
  href: '/signup/free',
  buttonText: 'Get Started Free'
}

export default function SignUpPage() {
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
                <li><Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link></li>
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
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

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-4">Get Started with Wellspace</h1>
            <p className="text-gray-300">
              Create your account to access our comprehensive healthcare management platform
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{plan.title}</CardTitle>
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
          </div>
        </div>
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
                  <Mail className="h-5 w-5 mr-2" />
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













