import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>Get started with our basic features</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside mb-4">
              <li>AI Health Navigator</li>
              <li>Health Records Storage</li>
              <li>Evidence-based Health Tracks</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/signup/free">Sign Up for Free</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Premium Plan</CardTitle>
            <CardDescription>Unlock all features for $9.99/month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside mb-4">
              <li>All Free plan features</li>
              <li>Access to AI Agents</li>
              <li>Rewards to Cash Conversion</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/signup/premium">Sign Up for Premium</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}













