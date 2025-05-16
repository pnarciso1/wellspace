'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Icons } from '@/lib/icons'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Heart className="h-5 w-5" />
              Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your health metrics and see your progress over time.
            </p>
            <Button asChild className="mt-4">
              <Link href="/health-profile">View Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.FileText className="h-5 w-5" />
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep track of your medical history and important documents.
            </p>
            <Button asChild className="mt-4">
              <Link href="/medical-records">View Records</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Video className="h-5 w-5" />
              Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Watch educational videos about managing your health.
            </p>
            <Button asChild className="mt-4">
              <Link href="/videos">Watch Videos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Activity className="h-5 w-5" />
              Health Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Follow guided health programs and track your progress with specialized tools.
            </p>
            <Button asChild className="mt-4">
              <Link href="/health-tracks">View Tracks</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.MessageSquare className="h-5 w-5" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Find resources in your community, connect with others, and build your support network.
            </p>
            <Button asChild className="mt-4">
              <Link href="/community">Join Discussion</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Chat with Charlie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Charlie is your personal GenAI healthcare assistant. Ask Charlie anything related to insurance, medical bills, or understanding your diagnosis.
            </p>
            <Button asChild className="mt-4">
              <Link href="/ai-chat">Start Chat</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Hire An Autonomous AI Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hire an AI Agent to handle all the tedious administrative healthcare challenges like following up on insurance claims, understanding and reducing your bill, or setting appointments with healthcare professionals.
            </p>
            <Button asChild className="mt-4">
              <Link href="https://www.helper.peoplecare.ai" target="_blank" rel="noopener noreferrer">
                Hire Agent
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Activity className="h-5 w-5" />
              Myasthenia Gravis Patient Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A comprehensive program designed to help you manage Myasthenia Gravis with personalized tools, assessments, and resources.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/mgpp">Enter Program</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Star className="h-5 w-5" />
              Gutsmart for G-PACT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A comprehensive program designed to help you manage Gastroparesis with specialized tools, resources, and a video library.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/gpact">Enter Program</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
