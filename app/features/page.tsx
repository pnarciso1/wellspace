import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Brain, FileText, Activity, Gift, BotIcon as Robot, Zap, Users, Shield, Mail, AtSign, Twitter } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="text-3xl font-bold text-indigo-600">Wellspace</Link>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</Link></li>
                <li><Link href="/features" className="text-indigo-600 font-semibold">Features</Link></li>
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
        <h1 className="text-4xl font-bold text-center mb-12">Wellspace Features</h1>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Free Plan Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Brain className="mr-2 text-indigo-500" />
                  AI Health Navigator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get personalized assistance to navigate complex healthcare decisions with AI support.</p>
              </CardContent>
            </Card>
            <Card>
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
            <Card>
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
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Robot className="mr-2 text-indigo-500" />
                  AI Task Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access AI agents to help with tasks like finding doctors, reviewing medical bills, and recommending insurance plans.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Gift className="mr-2 text-indigo-500" />
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
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Zap className="mr-2 text-indigo-500" />
                  Custom AI Navigators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Tailor AI health navigators to your organization's specific needs and healthcare policies.</p>
              </CardContent>
            </Card>
            <Card>
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
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="mr-2 text-indigo-500" />
                  Advanced Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Benefit from enhanced security features and compliance measures for enterprise-level data protection.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="text-center mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join Wellspace today and take control of your health journey with our innovative AI-powered platform.
          </p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/signup">Sign Up Now</Link>
          </Button>
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






