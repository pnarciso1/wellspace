'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoalTracker } from '@/app/(authenticated)/health-tracks/components/GoalTracker'
import ActiveTracks from '@/app/(authenticated)/health-tracks/components/ActiveTracks'
import TrackLibrary from '@/app/(authenticated)/health-tracks/components/TrackLibrary'

export default function HealthTracksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Health Tracks</h1>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Tracks</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="library">Track Library</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ActiveTracks />
        </TabsContent>

        <TabsContent value="goals">
          <GoalTracker />
        </TabsContent>

        <TabsContent value="library">
          <TrackLibrary />
        </TabsContent>
      </Tabs>
    </div>
  )
}
