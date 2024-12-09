'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import type { HealthProfile, UpdateHealthProfileInput } from '@/contexts/AuthContext'

export default function HealthProfilePage() {
  const [profile, setProfile] = useState<HealthProfile | null>(null)
  const [heightFeet, setHeightFeet] = useState<string>('')
  const [heightInches, setHeightInches] = useState<string>('')
  const [weightLbs, setWeightLbs] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { user, getHealthProfile, updateHealthProfile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleHeightFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeightFeet(value);
  };

  const handleHeightInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeightInches(value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeightLbs(value);
  };

  const fetchHealthProfile = useCallback(async () => {
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login')
      return
    }

    try {
      console.log('Fetching health profile for user:', user.id);
      const data = await getHealthProfile()
      console.log('Health profile data received:', data);
      
      if (data) {
        setProfile(data)
        setHeightFeet(data.height_feet?.toString() ?? '')
        setHeightInches(data.height_inches?.toString() ?? '')
        setWeightLbs(data.weight_lbs?.toString() ?? '')
      }
    } catch (error) {
      console.error('Error fetching health profile:', error)
      setError(error instanceof Error ? error.message : "Failed to fetch health profile")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch health profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, getHealthProfile, router, toast])

  useEffect(() => {
    fetchHealthProfile()
  }, []) // Removed fetchHealthProfile from dependency array

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to update your health profile",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    
    try {
      const formData = new FormData(event.currentTarget)
      const updateData: UpdateHealthProfileInput = {
        name: profile.name,
        date_of_birth: formData.get('date_of_birth') as string || null,
        height_feet: heightFeet ? parseFloat(heightFeet) : null,
        height_inches: heightInches ? parseFloat(heightInches) : null,
        weight_lbs: weightLbs ? parseFloat(weightLbs) : null,
        blood_type: formData.get('blood_type') as string || null,
        allergies: formData.get('allergies') ? (formData.get('allergies') as string).split(',').map(a => a.trim()) : null,
      }

      const updatedProfile = await updateHealthProfile(updateData)
      setProfile(updatedProfile)
      
      toast({
        title: "Success",
        description: "Health profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating health profile:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update health profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="flex items-center justify-center p-8">
            <p>Loading health profile... Please wait.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-8">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-8">
            <p className="mb-4">No health profile found. Please try refreshing the page.</p>
            <Button onClick={fetchHealthProfile}>Retry</Button>
            <Button variant="outline" className="ml-2" onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Health Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input 
                id="date_of_birth" 
                name="date_of_birth" 
                type="date" 
                defaultValue={profile.date_of_birth || ''} 
              />
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <Label htmlFor="height_feet">Feet</Label>
                  <Input 
                    id="height_feet" 
                    name="height_feet" 
                    type="number" 
                    defaultValue={heightFeet}
                    onChange={handleHeightFeetChange}
                    min="0"
                    max="8"
                    step="1"
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="height_inches">Inches</Label>
                  <Input 
                    id="height_inches" 
                    name="height_inches" 
                    type="number" 
                    defaultValue={heightInches}
                    onChange={handleHeightInchesChange}
                    min="0"
                    max="11"
                    step="1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input 
                id="weight" 
                name="weight" 
                type="number" 
                defaultValue={weightLbs}
                onChange={handleWeightChange}
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blood_type">Blood Type</Label>
              <Input 
                id="blood_type" 
                name="blood_type" 
                defaultValue={profile.blood_type || ''} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input 
                id="allergies" 
                name="allergies" 
                defaultValue={profile.allergies ? profile.allergies.join(', ') : ''} 
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}














