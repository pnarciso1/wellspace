'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type HealthProfile = {
  id: string
  user_id: string
  name: string | null
  date_of_birth: string | null
  blood_type: string | null
  allergies: string[] | null
  height_feet: number | null
  height_inches: number | null
  weight_lbs: number | null
  gender: string | null
  chronic_conditions: string | null
  past_surgeries: string | null
  family_history: string | null
  primary_physician: {
    name: string
    phone: string
    address: string
  } | null
  stress_level: number | null
  sleep_hours: string | null
  exercise_frequency: string | null
  dietary_restrictions: string | null
  emergency_contact: {
    name: string
    relationship: string
    phone: string
  } | null
  additional_notes: string | null
  medications: string | null
  created_at?: string
  updated_at?: string
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const exerciseFrequencies = [
  'Sedentary',
  '1-2 times per week',
  '3-4 times per week',
  '5+ times per week'
]
const sleepHours = [
  'Less than 6 hours',
  '6-7 hours',
  '7-8 hours',
  '8-9 hours',
  'More than 9 hours'
]

export default function HealthProfilePage() {
  const { user, getHealthProfile, updateHealthProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Partial<HealthProfile>>({
    primary_physician: null,
    emergency_contact: null,
    allergies: null
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    calculateProgress()
  }, [profile])

  const loadProfile = async () => {
    try {
      const data = await getHealthProfile()
      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = () => {
    // Define all main fields we want to track
    const mainFields = [
      'name',
      'date_of_birth',
      'blood_type',
      'gender',
      'height_feet',
      'weight_lbs',
      'allergies',
      'medications',
      'chronic_conditions',
      'past_surgeries',
      'family_history',
      'primary_physician',
      'emergency_contact',
      'exercise_frequency',
      'sleep_hours',
      'dietary_restrictions',
      'stress_level',
      'additional_notes'
    ]

    // Count completed fields
    const completedFields = mainFields.filter(field => {
      const value = profile[field as keyof HealthProfile]
      
      // Handle nested objects (physician and emergency contact)
      if (field === 'primary_physician' || field === 'emergency_contact') {
        const nestedObj = value as Record<string, string> | null
        return nestedObj && Object.values(nestedObj).some(v => v)
      }
      
      // Handle arrays
      if (Array.isArray(value)) {
        return value.length > 0
      }
      
      // Handle regular fields
      return value !== null && value !== undefined && value !== ''
    }).length

    // Calculate percentage (0-100)
    const percentage = (completedFields / mainFields.length) * 100
    setProgress(Math.min(100, Math.max(0, percentage)))
  }

  const handleChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent: keyof HealthProfile, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...((prev[parent] as any) ?? {}),
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateHealthProfile(profile)
      toast({
        title: "Success",
        description: "Health profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update health profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Health Profile</h1>
        <p className="text-gray-600 mb-4">Complete your health profile to help us provide better care</p>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profile.date_of_birth || ''}
                  onChange={e => handleChange('date_of_birth', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={profile.gender || ''}
                  onChange={e => handleChange('gender', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="blood_type">Blood Type</Label>
                <Select
                  value={profile.blood_type || ''}
                  onValueChange={value => handleChange('blood_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Measurements */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Measurements</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="height_feet">Height (Feet)</Label>
                <Input
                  id="height_feet"
                  type="number"
                  min="0"
                  max="8"
                  value={profile.height_feet || ''}
                  onChange={e => handleChange('height_feet', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="height_inches">Height (Inches)</Label>
                <Input
                  id="height_inches"
                  type="number"
                  min="0"
                  max="11"
                  value={profile.height_inches || ''}
                  onChange={e => handleChange('height_inches', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight_lbs || ''}
                  onChange={e => handleChange('weight_lbs', Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="allergies">Allergies (separate with commas)</Label>
              <Input
                id="allergies"
                value={profile.allergies?.join(', ') || ''}
                onChange={e => handleChange('allergies', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>
            <div>
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={profile.medications || ''}
                onChange={e => handleChange('medications', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
              <Textarea
                id="chronic_conditions"
                value={profile.chronic_conditions || ''}
                onChange={e => handleChange('chronic_conditions', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="past_surgeries">Past Surgeries</Label>
              <Textarea
                id="past_surgeries"
                value={profile.past_surgeries || ''}
                onChange={e => handleChange('past_surgeries', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="family_history">Family Medical History</Label>
              <Textarea
                id="family_history"
                value={profile.family_history || ''}
                onChange={e => handleChange('family_history', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle */}
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exercise_frequency">Exercise Frequency</Label>
                <Select
                  value={profile.exercise_frequency || ''}
                  onValueChange={value => handleChange('exercise_frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseFrequencies.map(freq => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sleep_hours">Average Sleep</Label>
                <Select
                  value={profile.sleep_hours || ''}
                  onValueChange={value => handleChange('sleep_hours', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {sleepHours.map(hours => (
                      <SelectItem key={hours} value={hours}>{hours}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietary_restrictions"
                value={profile.dietary_restrictions || ''}
                onChange={e => handleChange('dietary_restrictions', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="stress_level">Stress Level (1-10)</Label>
              <Input
                id="stress_level"
                type="number"
                min="1"
                max="10"
                value={profile.stress_level || ''}
                onChange={e => handleChange('stress_level', Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4">
              <h3 className="font-medium">Primary Physician</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="physician_name">Name</Label>
                  <Input
                    id="physician_name"
                    value={profile.primary_physician?.name ?? ''}
                    onChange={e => handleNestedChange('primary_physician', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="physician_phone">Phone</Label>
                  <Input
                    id="physician_phone"
                    value={profile.primary_physician?.phone ?? ''}
                    onChange={e => handleNestedChange('primary_physician', 'phone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="physician_address">Address</Label>
                <Input
                  id="physician_address"
                  value={profile.primary_physician?.address ?? ''}
                  onChange={e => handleNestedChange('primary_physician', 'address', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-4">
              <h3 className="font-medium">Emergency Contact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergency_name">Name</Label>
                  <Input
                    id="emergency_name"
                    value={profile.emergency_contact?.name ?? ''}
                    onChange={e => handleNestedChange('emergency_contact', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_relationship">Relationship</Label>
                  <Input
                    id="emergency_relationship"
                    value={profile.emergency_contact?.relationship ?? ''}
                    onChange={e => handleNestedChange('emergency_contact', 'relationship', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_phone">Phone</Label>
                  <Input
                    id="emergency_phone"
                    value={profile.emergency_contact?.phone ?? ''}
                    onChange={e => handleNestedChange('emergency_contact', 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="additional_notes"
              value={profile.additional_notes ?? ''}
              onChange={e => handleChange('additional_notes', e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  )
}














