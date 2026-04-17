"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Shield, Key, User, Loader2, Camera, CheckCircle2, LogOut, Mail } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/Input"

export default function StudentSettings() {
  const { user, setUser } = useStore()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)
  const [displayName, setDisplayName] = useState(
    (user?.user_metadata?.full_name as string | undefined) ?? ""
  )
  
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? null

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return
    setIsUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    // Must use user.id as root folder to match storage RLS policy
    const filePath = `${user.id}/avatar.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
      setUser({ ...user, user_metadata: { ...user.user_metadata, avatar_url: publicUrl } })
      toast.success("Profile photo updated!")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to upload photo"
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return
    setIsSavingName(true)
    try {
      await supabase.from('profiles').update({ full_name: displayName }).eq('id', user.id)
      await supabase.auth.updateUser({ data: { full_name: displayName } })
      setUser({ ...user, user_metadata: { ...user.user_metadata, full_name: displayName } })
      toast.success("Display name updated!")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update name"
      toast.error(message)
    } finally {
      setIsSavingName(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email)
      if (error) throw error
      toast.success("Password reset link sent to your email!")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset email"
      toast.error(message)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" })
      if (error) throw error
      setUser(null)
      router.push("/login")
      router.refresh()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to sign out"
      toast.error(message)
    }
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="bg-white dark:bg-card p-6 sm:p-10 rounded-[2.5rem] border border-slate-200 dark:border-border shadow-xl shadow-slate-200/50 dark:shadow-black/40">
        <div className="mb-10 border-b border-slate-200 dark:border-border pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-foreground mb-2 tracking-tight">Account Settings</h1>
            <p className="text-slate-600 dark:text-muted-foreground font-medium leading-relaxed">
              Manage your learning identity and security preferences.
            </p>
          </div>
          
          {/* Avatar */}
          <div className="flex items-center gap-6 group w-full md:w-auto min-w-0">
            <div className="relative size-24 shrink-0 rounded-[2rem] bg-slate-50 dark:bg-muted border-2 border-dashed border-slate-300 dark:border-slate-500 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-primary transition-colors">
              {isUploading ? (
                <Loader2 className="animate-spin text-primary size-8" />
              ) : avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
              ) : (
                <User className="size-10 text-slate-400 dark:text-muted-foreground" />
              )}
              <label className="absolute inset-0 bg-slate-950/50 dark:bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-[2px]">
                <Camera className="size-6 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} />
              </label>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-foreground mb-1.5 tracking-tight">
                Profile photo
              </p>
              <p className="text-xs font-medium text-slate-600 dark:text-muted-foreground leading-snug">
                JPG, PNG, or WebP · max 2&nbsp;MB
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Identity */}
          <div className="p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-border bg-slate-50/80 dark:bg-muted/40">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="size-10 rounded-xl flex items-center justify-center border border-teal-500/35 bg-teal-500/15 dark:bg-teal-400/20 dark:border-teal-400/40"
                aria-hidden
              >
                <User className="size-5 text-teal-700 dark:text-teal-300" />
              </div>
              <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-foreground">Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label
                  htmlFor="student-display-name"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block"
                >
                  Display name
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    id="student-display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 h-12 px-5 rounded-xl text-sm font-semibold border-slate-300 dark:border-slate-500 bg-white dark:bg-background"
                    placeholder="Your full name"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="h-12 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    {isSavingName ? <Loader2 className="animate-spin size-4" /> : <CheckCircle2 className="size-4" />}
                    Save
                  </button>
                </div>
              </div>
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block">
                  Email address
                </span>
                <div
                  className="min-h-12 px-5 py-3 rounded-xl bg-slate-100 dark:bg-background border border-slate-300 dark:border-slate-500 flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-foreground"
                  role="group"
                  aria-label="Account email (read only)"
                >
                  <Mail className="size-4 shrink-0 text-slate-600 dark:text-slate-300" />
                  <span className="truncate [text-decoration:none] underline-offset-0 decoration-transparent select-text">
                    {user?.email ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-border bg-slate-50/80 dark:bg-muted/40">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="size-10 rounded-xl flex items-center justify-center border border-rose-500/35 bg-rose-500/12 dark:bg-rose-500/20"
                aria-hidden
              >
                <Shield className="size-5 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-foreground">Security</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="h-14 px-6 rounded-2xl bg-white dark:bg-background border border-slate-200 dark:border-slate-500 flex items-center justify-between text-sm font-bold transition-all hover:border-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring group"
              >
                <span className="text-slate-800 dark:text-slate-100 group-hover:text-primary">Change password</span>
                <Key className="size-4 text-slate-600 dark:text-slate-300 group-hover:text-primary shrink-0" />
              </button>
              <button
                type="button"
                className="h-14 px-6 rounded-2xl bg-white dark:bg-background border border-slate-200 dark:border-slate-500 flex items-center justify-between text-sm font-bold transition-all hover:border-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring group"
              >
                <span className="text-slate-800 dark:text-slate-100 group-hover:text-primary">Email alerts</span>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="size-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-primary text-xs font-semibold">Active</span>
                </div>
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 h-12 px-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-rose-500 hover:text-rose-500 transition-all"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
