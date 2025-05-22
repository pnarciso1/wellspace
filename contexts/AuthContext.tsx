'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from 'wellspace/types/supabase'

// Define the HealthProfile type using the Database type
export type HealthProfile = Database['public']['Tables']['health_profiles']['Row']

export type UpdateHealthProfileInput = {
  name?: string | null
  date_of_birth?: string | null
  height_feet?: number | null
  height_inches?: number | null
  weight?: number | null
  blood_type?: string | null
  allergies?: string[] | null
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  getHealthProfile: () => Promise<HealthProfile | null>
  updateHealthProfile: (data: UpdateHealthProfileInput) => Promise<HealthProfile>
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session) {
          setUser(session.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user)
        setIsAuthenticated(true)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      if (data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        return { user: data.user, error: null }
      }
      return { user: null, error: new Error('No user data returned') }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const getHealthProfile = async (): Promise<HealthProfile | null> => {
    if (!user) return null
    const { data, error } = await supabase
      .from('health_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  }

  const updateHealthProfile = async (data: UpdateHealthProfileInput): Promise<HealthProfile> => {
    if (!user) throw new Error('No authenticated user')

    const { data: profile, error } = await supabase
      .from('health_profiles')
      .upsert({
        user_id: user.id,
        ...data,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return profile
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (signUpError) throw signUpError
    return { user: data.user }
  }

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    if (error) throw error
    if (session?.user) {
      setUser(session.user)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signOut,
    resetPassword,
    getHealthProfile,
    updateHealthProfile,
    signUp,
    refreshSession
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}




































