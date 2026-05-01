"use client"

import { useState, useEffect, useRef } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import {
  Shield,
  Key,
  LogOut,
  Trash2,
  Loader2,
  Lock,
  Upload,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function TeacherSettings() {
  const { user, setUser } = useStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const credentialInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploadingCred, setIsUploadingCred] = useState(false)
  const [credentialFileName, setCredentialFileName] = useState<string | null>(null)

  // Lightweight ping just to know the user has a teacher row before we render — keeps the page snappy.
  useEffect(() => {
    let cancelled = false
    async function ping() {
      if (!user) return
      try {
        await supabase.from("teachers").select("id").eq("user_id", user.id).maybeSingle()
      } catch (err) {
        console.error("Settings load failed", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    ping()
    return () => {
      cancelled = true
    }
  }, [user])

  const handlePasswordReset = async () => {
    if (!user?.email) return
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (error) throw error
      toast.success("Password reset link sent — check your inbox.")
    } catch (err) {
      console.error(err)
      toast.error("Couldn't send reset email. Try again in a moment.")
    }
  }

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Permanently delete your account? This removes your listing from the directory and erases your professional data. This cannot be undone."
      )
    )
      return

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", user?.id)
      if (error) throw error

      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      toast.success("Account deleted.")
    } catch (err: unknown) {
      console.error(err)
      toast.error("Couldn't fully delete the account. Please contact support.")
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" })
      if (error) throw error
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      console.error(err)
      toast.error("Failed to sign out. Please try again.")
    }
  }

  const uploadCredential = async (file: File) => {
    if (!user) return
    setIsUploadingCred(true)
    try {
      const ext = file.name.split(".").pop() || "pdf"
      const filePath = `${user.id}/credential-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from("portfolios")
        .upload(filePath, file, { upsert: true })
      if (upErr) throw upErr
      setCredentialFileName(file.name)
      toast.success("Credential uploaded")
    } catch (err: unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to upload credential")
    } finally {
      setIsUploadingCred(false)
    }
  }

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary size-10" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading…</p>
      </div>
    )

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32 px-3 sm:px-0">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-border pb-6 sm:pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white shadow mb-4">
          <Shield className="size-3.5 text-primary" />
          <span className="text-[11px] font-bold tracking-wide leading-none">Account & security</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-foreground mb-2 leading-none">
          Account & Security
        </h1>
        <p className="text-slate-600 dark:text-muted-foreground font-medium text-base leading-relaxed">
          Reset your password, upload credentials, and manage your account. Directory visibility lives on the dashboard.
        </p>
      </div>

      {/* CREDENTIALS */}
      <section className="bg-white dark:bg-card p-5 sm:p-8 md:p-10 rounded-2xl border border-slate-200 dark:border-border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <ShieldCheck className="size-5 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-foreground">
              Credentials
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-muted-foreground">
              Optional. Speeds up trust verification later.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => credentialInputRef.current?.click()}
            disabled={isUploadingCred}
            className="p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-primary transition-all disabled:opacity-60 bg-slate-50/70 dark:bg-muted/40"
          >
            <Upload className="size-5 text-slate-500 dark:text-slate-300 mb-1.5 group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-foreground">
              {isUploadingCred ? "Uploading…" : "Upload degree / ID"}
            </span>
            <span className="mt-0.5 text-[11px] text-slate-500 dark:text-muted-foreground">PDF or image</span>
            <input
              ref={credentialInputRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void uploadCredential(f)
              }}
            />
          </button>
          <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/70 dark:bg-background flex items-center gap-3 min-w-0">
            <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-foreground truncate">
              {credentialFileName || "No credential uploaded yet"}
            </span>
          </div>
        </div>
      </section>

      {/* PASSWORD */}
      <section className="bg-slate-900 rounded-2xl p-5 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Key className="size-4 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Password</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">Reset your password</h2>
            <p className="text-slate-400 font-medium leading-relaxed text-sm">
              We&apos;ll email you a secure link. The link expires in an hour for safety.
            </p>
            <Button
              onClick={handlePasswordReset}
              className="h-12 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-xs uppercase tracking-widest"
            >
              Send password reset email
            </Button>
          </div>

          <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">Email verified</h3>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Shield className="size-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">Encrypted at rest</h3>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Industry standard</p>
              </div>
            </div>
          </div>
        </div>
        <Lock className="absolute -right-8 -bottom-8 size-40 text-white/5" />
      </section>

      {/* DANGER ZONE */}
      <section className="bg-rose-500/5 dark:bg-rose-500/10 p-5 sm:p-8 md:p-10 rounded-2xl border border-rose-500/20 border-dashed">
        <h2 className="text-base font-black text-rose-600 uppercase tracking-[0.2em] mb-5 text-center">Danger zone</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSignOut}
            className="flex-1 h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest gap-2 shadow"
          >
            <LogOut className="size-4" /> Sign out everywhere
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="outline"
            className="flex-1 h-12 rounded-2xl border-rose-500/40 hover:bg-rose-600 hover:border-transparent text-rose-600 hover:text-white font-black text-xs uppercase tracking-widest gap-2"
          >
            <Trash2 className="size-4" /> Delete account
          </Button>
        </div>
      </section>
    </div>
  )
}
