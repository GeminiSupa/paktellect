"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Lock, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { supabase } from "@/lib/supabase"

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string().min(8, "Use at least 8 characters."),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  })

type FormValues = z.infer<typeof schema>

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    let active = true
    // Supabase fires PASSWORD_RECOVERY when the recovery deep link is processed.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setHasRecoverySession(true)
      }
    })

    // Also check current session in case the listener missed the event.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) setHasRecoverySession(true)
      else setHasRecoverySession((prev) => (prev === null ? false : prev))
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password })
      if (error) throw error
      toast.success("Password updated. Sign in with your new password.")
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Couldn't update password"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
          <div className="p-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-3">
              <ShieldCheck className="size-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Reset</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Choose a new password</h1>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              Pick something strong and unique. You&apos;ll be signed out everywhere afterward.
            </p>
          </div>

          {hasRecoverySession === false ? (
            <div className="p-8 space-y-4">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
                This password reset link is invalid or has expired. Please request a fresh link.
              </div>
              <Link href="/forgot-password" className="block">
                <Button className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest" variant="premium">
                  Request a new link
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              <div className="grid gap-2">
                <label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300"
                >
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" aria-hidden />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="h-14 pl-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary"
                    disabled={isSubmitting || !hasRecoverySession}
                    {...register("password")}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>}
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="confirm"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" aria-hidden />
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Type it again"
                    className="h-14 pl-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary"
                    disabled={isSubmitting || !hasRecoverySession}
                    {...register("confirm")}
                  />
                </div>
                {errors.confirm && <p className="text-xs text-red-500 font-bold">{errors.confirm.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !hasRecoverySession}
                className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest"
                variant="premium"
              >
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {hasRecoverySession === null ? "Verifying link…" : "Update password"}
              </Button>

              <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
