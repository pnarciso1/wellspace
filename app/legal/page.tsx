'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mail, Mail as EmailIcon, MessageSquare, Menu } from 'lucide-react'
import { useState } from 'react'

export default function LegalPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      <main className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">Legal Information</h1>

        {/* Terms of Service Card */}
        <Card className="mb-6 md:mb-8">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-semibold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mt-4">Terms of Service for Wellspace by PeopleCare.AI</h2>
            <p className="text-sm text-gray-600">Last Updated: December 9, 2024</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">1. Acceptance of Terms</h3>
            <p className="text-sm md:text-base">By accessing or using Wellspace ("the Service"), provided by PeopleCare.AI ("we," "our," or "the Company"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">2. Description of Service</h3>
            <p className="text-sm md:text-base">Wellspace is a healthcare navigation and AI support platform that assists users in managing their healthcare journey. The Service includes AI-powered assistance, healthcare information, and navigation tools.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">3. Medical Disclaimer</h3>
            <p className="text-sm md:text-base">The Service does not provide medical advice, diagnosis, or treatment. All information is for general informational purposes only. Always consult qualified healthcare professionals for medical advice.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">4. User Accounts</h3>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>You must provide accurate, current, and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 18 years old to use the Service</li>
              <li>You may not share or transfer your account</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">5. AI Technology Usage</h3>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>Our AI technology is designed to assist, not replace, human judgment</li>
              <li>AI responses are generated based on available data and may not be complete or accurate</li>
              <li>Users should verify critical information through official healthcare channels</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">6. Data Usage and Privacy</h3>
            <p className="text-sm md:text-base">Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as detailed in the Privacy Policy.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">7. Limitation of Liability</h3>
            <p className="text-sm md:text-base">To the maximum extent permitted by law, PeopleCare.AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">8. Modifications</h3>
            <p className="text-sm md:text-base">We reserve the right to modify these terms at any time. Users will be notified of significant changes.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">9. Termination</h3>
            <p className="text-sm md:text-base">We may terminate or suspend access to the Service immediately, without prior notice, for conduct that violates these Terms.</p>
          </CardContent>
        </Card>

        {/* Privacy Policy Card */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-semibold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mt-4">Privacy Policy for Wellspace by PeopleCare.AI</h2>
            <p className="text-sm text-gray-600">Last Updated: December 9, 2024</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">1. Information Collection</h3>
            <p className="text-sm md:text-base">We collect:</p>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>Personal information you provide</li>
              <li>Health-related information</li>
              <li>Usage data and interactions with our AI system</li>
              <li>Device and technical information</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">2. HIPAA Compliance</h3>
            <p className="text-sm md:text-base">We maintain HIPAA compliance for all protected health information (PHI). Our security measures include encryption, access controls, and regular security audits.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">3. Use of Information</h3>
            <p className="text-sm md:text-base">We use your information to:</p>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>Provide and improve our services</li>
              <li>Personalize your experience</li>
              <li>Develop and enhance our AI capabilities</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">4. Data Sharing and Sales</h3>
            <p className="text-sm md:text-base">We do not sell your personal information without your explicit consent. We may share your information:</p>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>With healthcare providers you designate</li>
              <li>For legal compliance</li>
              <li>With service providers under strict confidentiality agreements</li>
              <li>In an emergency to protect your vital interests</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">5. AI Training and Data Usage</h3>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>We may use anonymized and aggregated data to improve our AI systems</li>
              <li>Personal health information is never used for AI training without explicit consent</li>
              <li>You can opt out of AI improvement contributions while maintaining full service access</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">6. Data Security</h3>
            <p className="text-sm md:text-base">We implement:</p>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>End-to-end encryption</li>
              <li>Regular security audits</li>
              <li>Access controls</li>
              <li>Incident response procedures</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">7. User Rights</h3>
            <p className="text-sm md:text-base">You have the right to:</p>
            <ul className="list-disc pl-4 md:pl-6 text-sm md:text-base space-y-2">
              <li>Access your personal data</li>
              <li>Request corrections</li>
              <li>Request deletion</li>
              <li>Export your data</li>
              <li>Withdraw consent</li>
              <li>Opt out of certain data processing</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold mt-4">8. Data Retention</h3>
            <p className="text-sm md:text-base">We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account at any time.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">9. Updates to Privacy Policy</h3>
            <p className="text-sm md:text-base">We will notify users of material changes to this policy. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>

            <h3 className="text-base md:text-lg font-semibold mt-4">10. Contact Information</h3>
            <p className="text-sm md:text-base">For privacy-related questions, contact our Privacy Officer at privacy@peoplecare.ai</p>
          </CardContent>
        </Card>
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
              <p className="text-gray-300 mb-3 md:mb-4">Follow us on social media for updates and health tips.</p>
              <div className="space-y-2 md:space-y-3">
                <a href="mailto:contactus@peoplecare.ai" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-indigo-300 transition-colors">
                  <Mail className="h-5 w-5 mr-2"/>
                  <span>contactus@peoplecare.ai</span>
                </a>
                <a href="https://bsky.app/profile/peoplecare.bsky.social" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
                  <EmailIcon className="h-5 w-5 mr-2"/> @peoplecare.bsky.social
                </a>
                <a href="https://twitter.com/peoplecarai" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-300 transition-colors">
                  <MessageSquare className="h-5 w-5 mr-2"/> @peoplecarai
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

