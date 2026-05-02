"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { ensureExpertTeacherRow } from "@/lib/ensureExpertTeacher"

const SESSION_INIT_MS = 12_000
const PROVISION_MS = 10_000

function withTimeout<T>(promise: Promise<T>, ms: number, onTimeout: () => T): Promise<T> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(onTimeout()), ms)
    promise
      .then((v) => {
        clearTimeout(t)
        resolve(v)
      })
      .catch(() => {
        clearTimeout(t)
        resolve(onTimeout())
      })
  })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useStore()

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true)
      try {
        const sessionResult = await withTimeout(
          supabase.auth.getSession(),
          SESSION_INIT_MS,
          () => ({ data: { session: null }, error: null } as const)
        )

        const session = sessionResult.data.session

        if (session?.user) {
          const ensured = await withTimeout(
            ensureExpertTeacherRow(session.user),
            PROVISION_MS,
            () => ({ status: "skipped" as const })
          )
          if (ensured.status === "error") {
            console.error("Expert profile provisioning failed:", ensured.message)
          }
          setUser({
            id: session.user.id,
            email: session.user.email!,
            user_metadata: session.user.user_metadata as Record<string, unknown>,
          })
        } else {
          setUser(null)
        }
      } catch (e) {
        console.error("Auth session check failed:", e)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const ensured = await withTimeout(
            ensureExpertTeacherRow(session.user),
            PROVISION_MS,
            () => ({ status: "skipped" as const })
          )
          if (ensured.status === "error") {
            console.error("Expert profile provisioning failed:", ensured.message)
          }
        } catch (e) {
          console.error("Expert provisioning on auth change:", e)
        }
        setUser({
          id: session.user.id,
          email: session.user.email!,
          user_metadata: session.user.user_metadata as Record<string, unknown>,
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
