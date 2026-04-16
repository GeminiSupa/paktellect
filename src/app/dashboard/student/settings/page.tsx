"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Shield, Key, User, Loader2, Camera, CheckCircle2, LogOut, Mail } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
      <div className="bg-white dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50">
        <div className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Account Settings</h1>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Manage your learning identity and security preferences.</p>
          </div>
          
          {/* Avatar */}
          <div className="flex items-center gap-6 group">
            <div className="relative size-24 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-primary transition-colors">
              {isUploading ? (
                <Loader2 className="animate-spin text-primary size-8" />
              ) : avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
              ) : (
                <User className="size-10 text-slate-300" />
              )}
              <label className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-[2px]">
                <Camera className="size-6 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} />
              </label>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Profile Photo</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">JPG, PNG or WEBP. Max 2MB.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Identity */}
          <div className="p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="size-5 text-primary" />
              </div>
              <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.2em] mb-2 block">Display Name</label>
                <div className="flex gap-3">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 h-12 px-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="Your full name"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="h-12 px-5 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingName ? <Loader2 className="animate-spin size-4" /> : <CheckCircle2 className="size-4" />}
                    Save
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.2em] mb-2 block">Email Address</label>
                <div className="h-12 px-5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <Mail className="size-4 text-slate-400 dark:text-slate-500" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Shield className="size-5 text-rose-500" />
              </div>
              <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Security</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePasswordReset}
                className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm font-black transition-all hover:border-primary group"
              >
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary">Change Password</span>
                <Key className="size-4 text-slate-400 group-hover:text-primary" />
              </button>
              <button className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm font-black transition-all hover:border-primary group">
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary">Email Alerts</span>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-primary text-[10px] uppercase tracking-widest">Active</span>
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
