"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { ensureExpertTeacherRow } from "@/lib/ensureExpertTeacher"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useStore()

  useEffect(() => {
    // Check active session on mount
    const checkUser = async () => {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const ensured = await ensureExpertTeacherRow(session.user)
        if (ensured.status === "error") {
          console.error("Expert profile provisioning failed:", ensured.message)
        }
        setUser({
          id: session.user.id,
          email: session.user.email!,
          user_metadata: session.user.user_metadata as Record<string, unknown>
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }

    checkUser()

    // Listen to Auth State Changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const ensured = await ensureExpertTeacherRow(session.user)
        if (ensured.status === "error") {
          console.error("Expert profile provisioning failed:", ensured.message)
        }
        setUser({
          id: session.user.id,
          email: session.user.email!,
          user_metadata: session.user.user_metadata as Record<string, unknown>
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [setUser, setIsLoading])

  return <>{children}</>
}
