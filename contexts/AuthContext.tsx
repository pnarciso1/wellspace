'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Create single supabase instance
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Add types for health profile
export type HealthProfile = {
  id?: string
  user_id?: string
  height_feet: number | null
  height_inches: number | null
  weight_lbs: number | null
  name: string | null
  date_of_birth: string | null
  blood_type: string | null
  allergies: string[] | null
  // Add any other fields your health profile needs
}

export type UpdateHealthProfileInput = {
  name?: string | null
  date_of_birth?: string | null
  height_feet?: number | null
  height_inches?: number | null
  weight_lbs?: number | null
  blood_type?: string | null
  allergies?: string[] | null
}

type AuthContextType = {
  user: User | null
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  showSidebar: boolean
  getHealthProfile: () => Promise<HealthProfile | null>
  updateHealthProfile: (data: UpdateHealthProfileInput) => Promise<HealthProfile>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const getHealthProfile = async () => {
    if (!user) return null;

    try {
      // First attempt to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If profile exists, return it
      if (existingProfile) return existingProfile;

      // If no profile exists, create a new one with default values
      const { data: newProfile, error: createError } = await supabase
        .from('health_profiles')
        .insert([{ 
          user_id: user.id,
          // Add default values for required fields
          name: user.user_metadata?.name || '',
          height_feet: null,
          height_inches: null,
          weight_lbs: null,
          date_of_birth: null,
          blood_type: null,
          allergies: []
        }])
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;

    } catch (error) {
      console.error('Error in getHealthProfile:', error);
      throw error; // Let the UI handle the error
    }
  };

  const updateHealthProfile = async (data: UpdateHealthProfileInput): Promise<HealthProfile> => {
    if (!user) throw new Error('No user authenticated');

    try {
      // First check if profile exists
      const existingProfile = await getHealthProfile();
      
      if (!existingProfile) {
        // Create new profile with provided data
        const { data: newProfile, error: createError } = await supabase
          .from('health_profiles')
          .insert([{ ...data, user_id: user.id }])
          .select()
          .single();

        if (createError) throw createError;
        return newProfile;
      }

      // Update existing profile
      const { data: updatedProfile, error } = await supabase
        .from('health_profiles')
        .update(data)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return updatedProfile;
    } catch (error) {
      console.error('Error updating health profile:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    // Implement your session refresh logic
  }

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setIsAuthenticated(!!user)
        setShowSidebar(!!user?.email_confirmed_at)
      } catch (error) {
        const err = error as Error
        // Silently handle refresh token errors for non-authenticated users
        if (err.message?.includes('Refresh Token Not Found')) {
          setUser(null)
          setIsAuthenticated(false)
          setShowSidebar(false)
          return
        }
        console.error('Error checking user:', error)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        setUser(session?.user ?? null)
        setIsAuthenticated(!!session?.user)
        setShowSidebar(!!session?.user?.email_confirmed_at)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
    setUser(data.user)
    setIsAuthenticated(!!data.user)
    setShowSidebar(!!data.user?.email_confirmed_at)
    return { user: data.user, error }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setIsAuthenticated(false)
      setShowSidebar(false)
    } catch (error) {
      console.error('Error signing out:', error)
      // Optionally force a clean state even if there's an error
      setUser(null)
      setIsAuthenticated(false)
      setShowSidebar(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      signUp: async (email: string, password: string, name: string) => {
        try {
          const data = await signUp(email, password, name);
          return { user: data.user, error: null };
        } catch (error) {
          return { user: null, error: error as Error };
        }
      },
      signIn, 
      signOut, 
      isAuthenticated,
      showSidebar,
      getHealthProfile,
      updateHealthProfile,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}




































