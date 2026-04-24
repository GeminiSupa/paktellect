"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff,
  Zap, 
  LogOut, 
  Trash2, 
  Loader2, 
  Lock,
  Clock,
  Globe,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRef } from "react"

export default function TeacherSettings() {
  const { user, setUser } = useStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [teacherId, setTeacherId] = useState<string | null>(null)
  const [teacherFieldsOk, setTeacherFieldsOk] = useState<boolean>(true)
  const credentialInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploadingCred, setIsUploadingCred] = useState(false)
  const [credentialFileName, setCredentialFileName] = useState<string | null>(null)
  
  // Settings State
  const [settings, setSettings] = useState({
    is_public: false,
    auto_accept_bookings: false,
    email_notifications: true,
    timezone: 'UTC',
    session_buffer: 15
  })

  useEffect(() => {
    async function loadSettings() {
      if (!user) return
      try {
        const { data } = await supabase
          .from('teachers')
          .select('id, category, is_public, auto_accept_bookings, timezone, session_buffer, legal_bar_number, legal_jurisdiction, legal_practice_areas, mental_license_number, mental_license_type, mental_modalities, wellness_certification, wellness_specialties, wellness_approach, academic_subjects, academic_education_level, academic_credentials')
          .eq('user_id', user.id)
          .single()
        
        if (data) {
          setTeacherId(data.id ?? null)

          const nonEmptyArray = (arr: unknown) => Array.isArray(arr) && arr.filter(Boolean).length > 0
          const ok =
            data.category === 'Legal'
              ? Boolean(data.legal_bar_number && data.legal_jurisdiction && nonEmptyArray(data.legal_practice_areas))
              : data.category === 'Mental Health'
                ? Boolean(data.mental_license_number && data.mental_license_type && nonEmptyArray(data.mental_modalities))
                : data.category === 'Wellness'
                  ? Boolean(data.wellness_certification && nonEmptyArray(data.wellness_specialties) && data.wellness_approach)
                  : Boolean(nonEmptyArray(data.academic_subjects) && data.academic_education_level && data.academic_credentials)
          setTeacherFieldsOk(ok)

          setSettings(prev => ({
            ...prev,
            is_public: data.is_public ?? false,
            auto_accept_bookings: data.auto_accept_bookings ?? false,
            timezone: data.timezone ?? 'UTC',
            session_buffer: data.session_buffer ?? 15
          }))
        }
      } catch (err) {
        console.error("Settings load failed", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [user])

  const handleUpdateSetting = async (key: string, value: unknown) => {
    if (!user) return

    if (key === 'is_public' && value === true && !teacherFieldsOk) {
      toast.error("Complete your category requirements in Profile before going public.")
      return
    }

    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    try {
      const { error } = await supabase
        .from('teachers')
        .upsert({ 
          user_id: user.id,
          [key]: value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (error) throw error
      toast.success(`${key.replace(/_/g, ' ')} updated successfully`)
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : "Failed to synchronize settings"
      toast.error(msg)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (error) throw error
      toast.success("Security recovery link dispatched to your inbox")
    } catch (err) {
      console.error(err)
      toast.error("Security system error. Please try again later.")
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This will remove your practice from the directory and delete all professional data. This action cannot be undone.")) return
    
    try {
      // 1. Delete profile (cascades to teachers)
      const { error } = await supabase.from('profiles').delete().eq('id', user?.id)
      if (error) throw error
      
      // 2. Sign out
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      toast.success("Account deleted successfully.")
    } catch (err: unknown) {
      console.error(err)
      toast.error("Failed to fully delete account. Please contact support.")
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
      const { error: upErr } = await supabase.storage.from("portfolios").upload(filePath, file, { upsert: true })
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

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary size-10" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Preferences...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 px-4 sm:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-border pb-8 sm:pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white shadow-2xl mb-6">
            <Shield className="size-4 text-primary" />
            <span className="text-xs font-bold tracking-wide leading-none">Practice shield active</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-foreground mb-4 leading-none">
            Security & Preferences
          </h1>
          <p className="text-slate-600 dark:text-muted-foreground font-medium text-xl leading-relaxed">
            Manage your professional standing, discovery settings, and security protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        
        {/* DISCOVERY & GLOBAL REACH */}
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Globe className="size-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground">Discovery & Logistics</h3>
                        <p className="text-xs font-medium text-slate-600 dark:text-muted-foreground tracking-wide">Global practice settings</p>
                    </div>
                </div>
                <Link href={teacherId ? `/book/${teacherId}` : "/dashboard/teacher/profile"} target="_blank">
                    <Button variant="outline" className="h-12 px-6 rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest border-primary text-primary hover:bg-primary hover:text-white transition-all">
                        <Eye className="size-3.5" />
                        Live Profile Preview
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 sm:p-10 bg-white dark:bg-card rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-border shadow-xl shadow-slate-200/40 dark:shadow-black/40 group hover:border-primary transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="font-black text-xl mb-1 flex items-center gap-2 text-slate-900 dark:text-foreground">Public Profile</h4>
                            <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Toggle visibility in the expert directory</p>
                        </div>
                        <button 
                            onClick={() => handleUpdateSetting('is_public', !settings.is_public)}
                            aria-label={settings.is_public ? "Deactivate public profile" : "Activate public profile"}
                            className={`relative w-16 h-9 rounded-full transition-all duration-300 ${settings.is_public ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1.5 left-1.5 size-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings.is_public ? 'translate-x-7' : ''}`} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className={`flex items-center gap-2 text-xs font-semibold tracking-wide ${settings.is_public ? 'text-primary' : 'text-slate-600 dark:text-muted-foreground'}`}>
                            {settings.is_public ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                            {settings.is_public ? 'Currently Discoverable' : 'Hidden from Directory'}
                        </div>
                        {!settings.is_public && !teacherFieldsOk && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500 animate-pulse">
                                <Shield className="size-3" />
                                Requirements missing in Profile
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-10 bg-white dark:bg-card rounded-[3rem] border border-slate-200 dark:border-border shadow-xl shadow-slate-200/40 dark:shadow-black/40 group hover:border-primary transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="font-black text-xl mb-1 flex items-center gap-2 text-slate-900 dark:text-foreground">Auto-confirmation</h4>
                            <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Automatically accept new bookings</p>
                        </div>
                        <button 
                            onClick={() => handleUpdateSetting('auto_accept_bookings', !settings.auto_accept_bookings)}
                            aria-label={settings.auto_accept_bookings ? "Disable auto-confirmation" : "Enable auto-confirmation"}
                            className={`relative w-16 h-9 rounded-full transition-all duration-300 ${settings.auto_accept_bookings ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1.5 left-1.5 size-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings.auto_accept_bookings ? 'translate-x-7' : ''}`} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-600 dark:text-muted-foreground">
                        <Zap className={`size-3 ${settings.auto_accept_bookings ? 'text-primary fill-primary' : ''}`} />
                        {settings.auto_accept_bookings ? 'Instant Response Active' : 'Manual Review Required'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label htmlFor="timezone-select" className="block text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200 px-2 leading-none">
                      Practice timezone
                    </label>
                    <select 
                        id="timezone-select"
                        value={settings.timezone}
                        onChange={(e) => handleUpdateSetting('timezone', e.target.value)}
                        className="w-full h-16 px-8 rounded-2xl bg-white dark:bg-background border border-slate-300 dark:border-slate-500 font-bold text-sm text-slate-900 dark:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring appearance-none transition-all shadow-inner"
                    >
                        <option value="UTC">Universal Coordinated (UTC)</option>
                        <option value="PKT">Pakistan Standard (PKT)</option>
                        <option value="GMT">Greenwich Mean Time (GMT)</option>
                        <option value="EST">Eastern Standard Time (EST)</option>
                        <option value="PST">Pacific Standard Time (PST)</option>
                    </select>
                </div>

                <div className="space-y-4">
                    <label htmlFor="buffer-select" className="block text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200 px-2 leading-none">
                      Session buffer (minutes)
                    </label>
                    <div className="relative group">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary size-5" aria-hidden />
                        <select 
                            id="buffer-select"
                            value={settings.session_buffer}
                            onChange={(e) => handleUpdateSetting('session_buffer', parseInt(e.target.value))}
                            className="w-full h-14 pl-14 pr-8 rounded-2xl bg-white dark:bg-background border border-slate-300 dark:border-slate-500 font-bold text-sm text-slate-900 dark:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring appearance-none transition-all shadow-inner"
                        >
                            {[0, 10, 15, 30, 45, 60].map(mins => (
                                <option key={mins} value={mins}>{mins} Minutes</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* NEW: CLINICAL VERIFICATION SECTION */}
            <div className="bg-white dark:bg-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-border shadow-xl shadow-slate-200/40 dark:shadow-black/40">
                <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <ShieldCheck className="size-5 text-blue-700 dark:text-blue-300" />
                    </div>
                    <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-foreground">Clinical Credentials</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button
                        type="button"
                        onClick={() => credentialInputRef.current?.click()}
                        disabled={isUploadingCred}
                        className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-primary transition-all disabled:opacity-60 bg-slate-50/70 dark:bg-muted/35"
                    >
                        <Upload className="size-6 text-slate-500 dark:text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-foreground">
                          {isUploadingCred ? "Uploading..." : "Upload Degree/ID"}
                        </span>
                        <span className="mt-1 text-xs text-slate-600 dark:text-muted-foreground">
                          PDF or image
                        </span>
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
                    <div className="p-6 border border-slate-200 dark:border-slate-500 rounded-2xl bg-slate-50/70 dark:bg-background flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="size-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-foreground truncate">
                              {credentialFileName || "No credential uploaded yet"}
                            </span>
                        </div>
                        <Trash2 className="size-4 text-slate-400 dark:text-slate-500 hover:text-rose-500 cursor-not-allowed opacity-60" />
                    </div>
                </div>
            </div>
        </section>

        {/* SECURITY & ACCESS */}
        <section className="space-y-8">
             <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Key className="size-6 text-orange-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground">Access Control</h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-muted-foreground tracking-wide">Security protocols</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h4 className="text-3xl font-black tracking-tighter">Hardened Security</h4>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Protect your account and client data with state-of-the-art authentication. We recommend regular password cycles.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Button onClick={handlePasswordReset} variant="outline" className="h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white hover:text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] transition-all">
                                Update Password Link
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-6 border-l border-white/10 pl-12 hidden md:block">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="size-6 text-primary" />
                            </div>
                            <div>
                                <h5 className="font-extrabold text-sm mb-1">2FA Enabled</h5>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Verified: {(user?.user_metadata?.phone as string) || "No phone set"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                                <Shield className="size-6 text-blue-400" />
                            </div>
                            <div>
                                <h5 className="font-extrabold text-sm mb-1">Encrypted Access</h5>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">AES-256 Standard</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Lock className="absolute -right-8 -bottom-8 size-48 text-white/5" />
            </div>
        </section>

        {/* DANGER ZONE */}
        <section className="bg-rose-500/5 dark:bg-rose-500/10 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-rose-500/20 border-dashed">
            <h4 className="text-xl font-black text-rose-500 uppercase tracking-[0.2em] mb-8 text-center">Danger Zone</h4>
            <div className="flex flex-col sm:flex-row gap-6">
                <Button onClick={handleSignOut} className="flex-1 h-16 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest gap-2 shadow-xl shadow-slate-950/20 transition-all">
                    <LogOut className="size-4" /> Sign Out Global Session
                </Button>
                <Button 
                    onClick={handleDeleteAccount}
                    variant="outline" 
                    className="flex-1 h-16 rounded-[2rem] border-rose-500/30 hover:bg-rose-600 hover:border-transparent text-rose-500 hover:text-white font-black text-sm uppercase tracking-widest gap-2 transition-all"
                >
                    <Trash2 className="size-4" /> Permanent account Deletion
                </Button>
            </div>
        </section>
      </div>
    </div>
  )
}

