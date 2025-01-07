'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GoalTracker from '@/app/(authenticated)/health-tracks/components/GoalTracker'
import ActiveTracks from '@/app/(authenticated)/health-tracks/components/ActiveTracks'
import TrackLibrary from '@/app/(authenticated)/health-tracks/components/TrackLibrary'

export default function HealthTracksPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Health Tracks</h1>
        <p className="text-gray-500">Track your health goals and join wellness challenges</p>
      </div>

      <Tabs defaultValue="goals" className="space-y-8" onValueChange={(value) => {
        if (value === "active") {
          // Refresh active tracks
        }
      }}>
        <TabsList>
          <TabsTrigger value="goals">My Goals</TabsTrigger>
          <TabsTrigger value="active">Active Tracks</TabsTrigger>
          <TabsTrigger value="library">Track Library</TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <GoalTracker />
        </TabsContent>

        <TabsContent value="active">
          <ActiveTracks />
        </TabsContent>

        <TabsContent value="library">
          <TrackLibrary />
        </TabsContent>
      </Tabs>
    </div>
  )
}

