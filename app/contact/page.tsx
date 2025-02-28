"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icons } from '@/lib/icons'
import { useState } from 'react'

const EmailButton = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:contact@peoplecare.ai"
  }

  return (
    <Button onClick={handleEmailClick} className="w-full md:w-auto">
      <Icons.Mail className="mr-2 h-4 w-4" /> Email Us
    </Button>
  )
}

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
    {icon}
    <span>{label}</span>
  </a>
)

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-md relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="text-3xl font-bold text-indigo-600">Wellspace</Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Icons.Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</Link></li>
                <li><Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link></li>
                <li><Link href="/contact" className="text-indigo-600 font-semibold">Contact</Link></li>
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
                  <Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
                  <Link href="/contact" className="text-indigo-600 font-semibold" onClick={() => setIsMenuOpen(false)}>Contact</Link>
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
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">Contact Us</h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto px-4 md:px-0">
              We're here to help and answer any question you might have. We look forward to hearing from you!
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-semibold">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">
                <p className="text-gray-600">We're here to help and answer any question you might have. We look forward to hearing from you!</p>
                <EmailButton />
                <div className="flex items-center space-x-2 text-gray-600">
                  <Icons.Phone className="h-5 w-5" />
                  <span>301-310-2112</span>
                </div>
                <div className="flex items-start space-x-2 text-gray-600">
                  <Icons.Mail className="h-5 w-5 mt-1" />
                  <p>
                    131 Continental Dr Suite 305<br />
                    Newark, DE, 19713<br />
                    United States
                  </p>
                </div>
                <p className="text-sm text-gray-500">We believe in a virtual workplace, but this is our physical address for official correspondence.</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-semibold">Connect with Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">
                <p className="text-gray-600">Follow us on social media for the latest updates, health tips, and community stories.</p>
                <div className="space-y-3">
                  <SocialLink href="https://bsky.app/profile/peoplecare.bsky.social" icon={<Icons.Mail className="h-5 w-5" />} label="BlueSky: @peoplecare.bsky.social" />
                  <SocialLink href="https://truthsocial.com/@peoplecareai" icon={<Icons.Mail className="h-5 w-5" />} label="Truth Social: @peoplecareai" />
                  <SocialLink href="https://www.reddit.com/user/peoplecareai" icon={<Icons.Mail className="h-5 w-5" />} label="Reddit: u/peoplecareai" />
                  <SocialLink href="https://twitter.com/peoplecarai" icon={<Icons.Mail className="h-5 w-5" />} label="X: @peoplecarai" />
                  <SocialLink href="https://www.tiktok.com/@peoplecareai" icon={<Icons.Mail className="h-5 w-5" />} label="TikTok: @peoplecareai" />
                  <SocialLink href="https://www.instagram.com/peoplecare.ai" icon={<Icons.Mail className="h-5 w-5" />} label="Instagram: @peoplecare.ai" />
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="text-center mb-8 md:mb-12 px-4 md:px-0">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">We're Here to Help</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you have a question about our services, need technical support, or want to explore partnership opportunities, our team is ready to assist you.
            </p>
          </section>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 mb-16 md:mb-24">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">
              <div>
                <h3 className="font-semibold text-lg">What are your customer support hours?</h3>
                <p className="text-gray-600">Our customer support team is available 24/7 to assist you with any questions or concerns.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">How quickly can I expect a response?</h3>
                <p className="text-gray-600">We strive to respond to all inquiries within 24 hours. For urgent matters, please call our support line.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Do you offer in-person consultations?</h3>
                <p className="text-gray-600">While we primarily operate virtually, we can arrange in-person consultations for enterprise clients upon request.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 md:py-12 mt-12 md:mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Wellspace</h3>
              <p className="text-gray-300">Simplifying healthcare for everyone.</p>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-indigo-300 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-indigo-300 transition-colors">About</Link></li>
                <li><Link href="/features" className="hover:text-indigo-300 transition-colors">Features</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">Contact</Link></li>
                <li><Link href="/legal" className="hover:text-indigo-300 transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal" className="hover:text-indigo-300 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Connect Section */}
            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Connect With Us</h4>
              <p className="text-gray-300 mb-4">Follow us on social media for updates and health tips.</p>
              <div className="space-y-3">
                <a href="mailto:contactus@peoplecare.ai" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
                  <Icons.Mail className="h-5 w-5 mr-2" />
                  contactus@peoplecare.ai
                </a>
                <a href="https://bsky.app/profile/peoplecare.bsky.social" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
                  <Icons.Mail className="h-5 w-5 mr-2" />
                  @peoplecare.bsky.social
                </a>
                <a href="https://twitter.com/peoplecarai" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
                  <Icons.Mail className="h-5 w-5 mr-2" />
                  @peoplecarai
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
