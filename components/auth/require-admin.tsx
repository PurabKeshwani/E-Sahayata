"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // Get the current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.log("No active session, redirecting to login")
          router.push("/auth/login")
          return
        }

        // Get the user's profile from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError)
          router.push("/dashboard")
          return
        }
        
        console.log("User profile:", profile)
        
        // Check if user is admin based on profile role
        if (profile?.role !== 'admin') {
          console.log("User is not an admin, redirecting to dashboard")
          router.push("/dashboard")
          return
        }
        
        // User is an admin
        console.log("User is an admin, allowing access")
        setIsAdmin(true)
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/dashboard")
      }
    }
    
    checkAdminStatus()
  }, [router])

  // Show loading while checking
  if (isAdmin === null) {
    return <div className="flex items-center justify-center min-h-screen">Checking permissions...</div>
  }

  // If admin, show the children
  return <>{children}</>
}