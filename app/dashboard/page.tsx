"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserCircle, MessageCircle, Users, Activity, FileText, Heart, Zap, Award, Upload } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  const tokenBalance = 150
  const recentActivities = [
    { id: 1, description: "Completed 'Reduce Sugar' task", tokens: 10, icon: Award },
    { id: 2, description: "Joined 'Stress Management' group", tokens: 5, icon: Users },
    { id: 3, description: "Uploaded medical record", tokens: 15, icon: Upload },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
            Welcome, {user?.user_metadata?.name || 'User'}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 flex items-center">
                  <UserCircle className="mr-2 h-5 w-5" />
                  {user?.email}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Token Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-green-500 dark:text-green-400 flex items-center justify-center">
                  <Zap className="mr-2 h-8 w-8" />
                  {tokenBalance}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/ai-chat">
                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                      <MessageCircle className="mr-2 h-5 w-5" /> AI Chat
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      <Users className="mr-2 h-5 w-5" /> Community
                    </Button>
                  </Link>
                  <Link href="/health-tracks">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <Activity className="mr-2 h-5 w-5" /> Health Tracks
                    </Button>
                  </Link>
                  <Link href="/medical-records">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <FileText className="mr-2 h-5 w-5" /> Medical Records
                    </Button>
                  </Link>
                  <Link href="/health-profile">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      <Heart className="mr-2 h-5 w-5" /> Health Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="flex items-center text-gray-700 dark:text-gray-200">
                        <activity.icon className="mr-2 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                        {activity.description}
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">+{activity.tokens} tokens</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}




