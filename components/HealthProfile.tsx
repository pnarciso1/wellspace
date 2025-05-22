"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

type HealthProfile = {
  id: string
  user_id: string | null
  date_of_birth: string | null
  height: number | null
  weight: number | null
  blood_type: string | null
  allergies: string[] | null
}

export default function HealthProfile() {
  const [profile, setProfile] = useState<HealthProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchHealthProfile()
    }
  }, [user])

  const fetchHealthProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single()

      if (error) throw error

      // Convert the raw data into the expected HealthProfile shape
      const healthProfile: HealthProfile = {
        id: data.id,
        user_id: data.user_id,
        date_of_birth: data.date_of_birth,
        // Convert height from feet/inches to total inches
        height: data.height_feet && data.height_inches ? 
          data.height_feet * 12 + data.height_inches : null,
        weight: data.weight,
        blood_type: data.blood_type,
        allergies: data.allergies
      }

      setProfile(healthProfile)
    } catch (error) {
      console.error('Error fetching health profile:', error)
      toast({
        title: "Error",
        description: "Failed to fetch health profile",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your health profile",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData(event.currentTarget)
    const updatedProfile = {
      date_of_birth: formData.get('date_of_birth') as string || null,
      height: Number(formData.get('height')) || null,
      weight: Number(formData.get('weight')) || null,
      blood_type: formData.get('blood_type') as string || null,
      allergies: formData.get('allergies') ? (formData.get('allergies') as string).split(',').map(a => a.trim()) : null,
    }

    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .upsert({ 
          ...updatedProfile,
          user_id: user.id,
          name: user.email || 'Unknown', // Add required name field
          height_feet: updatedProfile.height ? Math.floor(updatedProfile.height / 12) : null, // Convert height to feet
          height_inches: updatedProfile.height ? updatedProfile.height % 12 : null, // Convert remaining inches
          weight: updatedProfile.weight // changed from weight_lbs
        })
        .select()
        .single()

      if (error) throw error

      // Convert the raw data into the expected HealthProfile shape before setting state
      const healthProfile: HealthProfile = {
        id: data.id,
        user_id: data.user_id,
        date_of_birth: data.date_of_birth,
        // Convert height from feet/inches to total inches
        height: data.height_feet && data.height_inches ? 
          data.height_feet * 12 + data.height_inches : null,
        weight: data.weight,
        blood_type: data.blood_type,
        allergies: data.allergies
      }

      setProfile(healthProfile)
      setIsEditing(false)
      toast({
        title: "Success", 
        description: "Health profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating health profile:', error)
      toast({
        title: "Error",
        description: "Failed to update health profile",
        variant: "destructive",
      })
    }
  }

  if (!profile) {
    return <div>Loading health profile...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={profile.date_of_birth || ''} />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" name="height" type="number" defaultValue={profile.height || ''} />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" defaultValue={profile.weight || ''} />
            </div>
            <div>
              <Label htmlFor="blood_type">Blood Type</Label>
              <Input id="blood_type" name="blood_type" defaultValue={profile.blood_type || ''} />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input id="allergies" name="allergies" defaultValue={profile.allergies ? profile.allergies.join(', ') : ''} />
            </div>
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </form>
        ) : (
          <div className="space-y-2">
            <p>Date of Birth: {profile.date_of_birth || 'Not set'}</p>
            <p>Height: {profile.height ? `${profile.height} cm` : 'Not set'}</p>
            <p>Weight: {profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
            <p>Blood Type: {profile.blood_type || 'Not set'}</p>
            <p>Allergies: {profile.allergies ? profile.allergies.join(', ') : 'None'}</p>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

