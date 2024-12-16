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
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSidebar, setShowSidebar] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true'
    }
    return false
  })

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Check auth status when page becomes visible
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          setIsAuthenticated(true)
          setShowSidebar(true)
          localStorage.setItem('isAuthenticated', 'true')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Main auth effect
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          setIsAuthenticated(true)
          setShowSidebar(true)
          localStorage.setItem('isAuthenticated', 'true')
        }
      } catch (error) {
        console.error('Error checking user:', error)
        setUser(null)
        setIsAuthenticated(false)
        setShowSidebar(false)
        localStorage.setItem('isAuthenticated', 'false')
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
          setShowSidebar(true)
          localStorage.setItem('isAuthenticated', 'true')
        } else {
          setUser(null)
          setIsAuthenticated(false)
          setShowSidebar(false)
          localStorage.setItem('isAuthenticated', 'false')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
      localStorage.setItem('isAuthenticated', 'false')
    } catch (error) {
      console.error('Error signing out:', error)
      // Force clean state even if there's an error
      setUser(null)
      setIsAuthenticated(false)
      setShowSidebar(false)
      localStorage.setItem('isAuthenticated', 'false')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
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
      refreshSession,
      resetPassword,
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




































