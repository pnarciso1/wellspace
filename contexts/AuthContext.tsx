'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { User, Session } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

type HealthProfile = Database['public']['Tables']['health_profiles']['Row']
type MedicalRecord = Database['public']['Tables']['medical_records']['Row']

export interface UpdateHealthProfileInput {
  name?: string;
  date_of_birth?: string | null;
  height_feet?: number | null;
  height_inches?: number | null;
  weight_lbs?: number | null;
  blood_type?: string | null;
  allergies?: string[] | null;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; session: Session | null }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getHealthProfile: () => Promise<HealthProfile | null>;
  updateHealthProfile: (profile: UpdateHealthProfileInput) => Promise<HealthProfile>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    setData()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setSession(data.session)
    setUser(data.user)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
    router.push('/login')
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

  const updateHealthProfile = async (profile: UpdateHealthProfileInput): Promise<HealthProfile> => {
    if (!user) throw new Error('No user logged in')
    const { data, error } = await supabase
      .from('health_profiles')
      .update(profile)
      .eq('user_id', user.id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const refreshSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
        setUser(session.user)
      } else {
        setUser(null)
        setSession(null)
        router.push('/login')
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      router.push('/login')
    }
  }

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    getHealthProfile,
    updateHealthProfile,
    refreshSession
  }), [user, session, loading])

  if (loading) {
    return <div>Loading...</div>
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

export type { HealthProfile, MedicalRecord }





































