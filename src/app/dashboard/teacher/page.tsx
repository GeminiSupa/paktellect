"use client"

import { Button } from "@/components/ui/Button"
import Link from "next/link"
import {
  Calendar,
  Video,
  Clock,
  Star,
  DollarSign,
  Scale,
  Heart,
  Brain,
  GraduationCap,
  Users,
  MessageCircle,
  BadgeCheck,
  X,
  Sparkles,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  AlertCircle
} from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { validateExpertProfileBasics, ExpertProfileBasicsInput } from "@/lib/expertProfileBasics"

const AVAIL_TIP_KEY = "paktellect_dismiss_avail_tip_v1"

export default function TeacherOverview() {
  const { user } = useStore()
  const [category, setCategory] = useState<string>("Academic")
  const [isOnline, setIsOnline] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [checklist, setChecklist] = useState<{ ok: boolean; errors: string[] }>({ ok: true, errors: [] })
  
  type Session = {
    id: string
    booking_date: string
    booking_time: string
    topic: string
    session_url?: string | null
    status?: string | null
  }
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [counts, setCounts] = useState({ inquiries: 0, messages: 0 })
  const [nextSessionCountdown, setNextSessionCountdown] = useState<string | null>(null)
  const [availTipDismissed, setAvailTipDismissed] = useState(false)
  const [metrics, setMetrics] = useState({
    careerEarnings: 0,
    ratingAvg: 0,
    reviewCount: 0,
    reliability: 100
  })

  const messageLabel = useMemo(() => {
    if (counts.messages > 0) return `${counts.messages} unread`
    return "Inbox"
  }, [counts.messages])

  useEffect(() => {
    try {
      if (localStorage.getItem(AVAIL_TIP_KEY) === "1") setAvailTipDismissed(true)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return
      try {
        const { data: teacher } = await supabase
          .from("teachers")
          .select(`
            *,
            profiles:user_id(full_name, city, country)
          `)
          .eq("user_id", user.id)
          .single()

        if (teacher) {
          setCategory(teacher.category || "Academic")
          setIsOnline(teacher.is_online || false)
          setIsPublic(teacher.is_public || false)

          // Run checklist validation
          const validationInput: ExpertProfileBasicsInput = {
            displayNameFromAccount: teacher.profiles?.full_name || "",
            category: teacher.category || "Academic",
            headline: teacher.headline || "",
            specialty: teacher.specialty || "",
            rate: String(teacher.hourly_rate || ""),
            city: teacher.profiles?.city || "",
            country: teacher.profiles?.country || "",
            bio: teacher.bio || "",
            qualifications: teacher.qualifications || "",
            legalBarNumber: teacher.legal_bar_number || "",
            legalJurisdiction: teacher.legal_jurisdiction || "",
            legalPracticeAreas: (teacher.legal_practice_areas || []).join(", "),
            mentalLicenseNumber: teacher.mental_license_number || "",
            mentalLicenseType: teacher.mental_license_type || "",
            mentalModalities: (teacher.mental_modalities || []).join(", "),
            wellnessCertification: teacher.wellness_certification || "",
            wellnessSpecialties: (teacher.wellness_specialties || []).join(", "),
            wellnessApproach: teacher.wellness_approach || "",
            academicSubjects: (teacher.academic_subjects || []).join(", "),
            academicEducationLevel: teacher.academic_education_level || "",
            academicCredentials: teacher.academic_credentials || ""
          }

          setChecklist(validateExpertProfileBasics(validationInput))

          const today = new Date().toISOString().split("T")[0]
          const { data: sessions } = await supabase
            .from("bookings")
            .select("*")
            .eq("expert_id", teacher.id)
            .eq("booking_date", today)
            .eq("status", "confirmed")
            .order("booking_time", { ascending: true })

          setUpcomingSessions(sessions || [])

          const { count: inquiryCount } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("expert_id", teacher.id)
            .eq("status", "pending")

          setCounts((prev) => ({ ...prev, inquiries: inquiryCount || 0 }))

          const { data: bookingRows } = await supabase.from("bookings").select("id").eq("expert_id", teacher.id)
          const ids = bookingRows?.map((b) => b.id) || []
          let unread = 0
          if (ids.length > 0) {
            const { count } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("is_read", false)
              .neq("sender_id", user.id)
              .in("booking_id", ids)
            unread = count || 0
          }
          setCounts((prev) => ({ ...prev, messages: unread }))



          // Fetch career earnings from transactions
          const { data: txs } = await supabase
            .from("transactions")
            .select("amount")
            .eq("payee_id", user.id)
            .neq("status", "refunded")
          
          const totalEarnings = txs?.reduce((acc, t) => acc + Number(t.amount), 0) || 0

          setMetrics({
            careerEarnings: totalEarnings,
            ratingAvg: Number(teacher.rating_avg || 0),
            reviewCount: Number(teacher.review_count || 0),
            reliability: 100 // Default for now
          })
        }
      } catch (err) {
        console.error("Dashboard load failed", err)
      }
    }
    loadDashboardData()
  }, [user])

  useEffect(() => {
    if (upcomingSessions.length === 0) return

    const timer = setInterval(() => {
      const now = new Date()
      const first = upcomingSessions[0]
      const [hours, minutes] = first.booking_time.split(":")
      const sessionDate = new Date(first.booking_date)
      sessionDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0)

      const diff = sessionDate.getTime() - now.getTime()

      if (diff > 0 && diff < 3600000) {
        const mins = Math.floor(diff / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        setNextSessionCountdown(`Starts in ${mins}:${secs < 10 ? "0" : ""}${secs}`)
      } else {
        setNextSessionCountdown(null)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [upcomingSessions])

  const getProfessionTheme = () => {
    switch (category) {
      case "Legal":
        return {
          consumer: "Clients",
          icon: <Scale className="size-6 text-orange-400" />,
        }
      case "Wellness":
        return {
          consumer: "Clients",
          icon: <Heart className="size-6 text-teal-400" />,
        }
      case "Mental Health":
        return {
          consumer: "Patients",
          icon: <Brain className="size-6 text-rose-500" />,
        }
      default:
        return {
          consumer: "Students",
          icon: <GraduationCap className="size-6 text-primary" />,
        }
    }
  }

  const theme = getProfessionTheme()

  const toggleStatus = async () => {
    if (!user) return
    const newStatus = !isOnline
    setIsOnline(newStatus)
    try {
      const { error } = await supabase.from("teachers").update({ is_online: newStatus }).eq("user_id", user.id)
      if (error) throw error
      toast.success(newStatus ? "You show as available for new sessions." : "You appear offline to clients.")
    } catch (err) {
      console.error(err)
      setIsOnline(!newStatus)
      toast.error("Failed to update availability status")
    }
  }

  const dismissAvailTip = () => {
    try {
      localStorage.setItem(AVAIL_TIP_KEY, "1")
    } catch {
      /* ignore */
    }
    setAvailTipDismissed(true)
  }

  const showAvailTip = !availTipDismissed

  return (
    <div className="space-y-8 md:space-y-10 max-w-7xl mx-auto">
      {/* Workspace context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3 md:px-5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-foreground shrink-0" aria-hidden>
            {theme.icon}
          </span>
          <span className="truncate">
            <span className="font-semibold text-foreground">Expert workspace</span>
            {" · "}
            Serving {theme.consumer.toLowerCase()}
          </span>
        </div>
        <Link href="/manual/expert" className="text-primary font-semibold hover:underline shrink-0 text-sm">
          How this dashboard works →
        </Link>
      </div>

      {/* Visibility & Discovery Status Widget */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-[2rem] border p-8 flex flex-col justify-between transition-all duration-500 ${isPublic ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-orange-500/5 border-orange-500/20 shadow-lg shadow-orange-500/5'}`}>
          <div className="flex items-start justify-between mb-8">
            <div className={`p-4 rounded-2xl ${isPublic ? 'bg-emerald-500/20 text-emerald-600' : 'bg-orange-500/20 text-orange-600'}`}>
              {isPublic ? <Eye className="size-8" /> : <EyeOff className="size-8" />}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Directory Status</p>
              <h4 className={`text-xl font-black ${isPublic ? 'text-emerald-600' : 'text-orange-600'}`}>
                {isPublic ? 'Visible to Consumers' : 'Hidden from Directory'}
              </h4>
            </div>
          </div>
          
          {!isPublic && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/10 flex items-start gap-3">
                <AlertCircle className="size-5 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-orange-700 leading-relaxed">
                  Consumers cannot find you in the directory. You must complete your profile checklist and enable "Public Profile" in Settings.
                </p>
              </div>
              <div className="grid gap-2">
                {checklist.errors.slice(0, 3).map((err, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-600/70">
                    <div className="size-1 bg-orange-400 rounded-full" />
                    {err}
                  </div>
                ))}
                {checklist.errors.length > 3 && (
                  <p className="text-[10px] font-bold text-orange-500/60">+ {checklist.errors.length - 3} more requirements</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
             <Link href="/dashboard/teacher/profile" className="flex-1">
                <Button variant="outline" className={`w-full h-12 rounded-xl font-black text-xs border-current hover:bg-current hover:text-white transition-all ${isPublic ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {checklist.ok ? 'Refine Profile' : 'Complete Profile'}
                </Button>
             </Link>
             <Link href="/dashboard/teacher/settings" className="flex-1">
                <Button className={`w-full h-12 rounded-xl font-black text-xs text-white shadow-xl ${isPublic ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20'}`}>
                  {isPublic ? 'Sync Settings' : 'Go Public'}
                </Button>
             </Link>
          </div>
        </div>

        <div className={`rounded-[2rem] border p-8 flex flex-col justify-between transition-all duration-500 ${isOnline ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 'bg-slate-500/5 border-slate-500/20 shadow-lg shadow-slate-500/5'}`}>
          <div className="flex items-start justify-between mb-8">
            <div className={`p-4 rounded-2xl ${isOnline ? 'bg-primary/20 text-primary' : 'bg-slate-500/20 text-slate-500'}`}>
              <ShieldCheck className="size-8" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Session Status</p>
              <h4 className={`text-xl font-black ${isOnline ? 'text-primary' : 'text-slate-500'}`}>
                {isOnline ? 'Accepting Sessions' : 'Taking a Break'}
              </h4>
            </div>
          </div>

          <div className="space-y-4">
             <p className="text-xs font-bold text-muted-foreground leading-relaxed">
               {isOnline 
                 ? "You are currently marked as 'Online'. Your profile will show a green status badge and you can accept immediate session requests."
                 : "You are currently 'Offline'. Consumers can still message you, but they will see that you are currently unavailable."}
             </p>
             {!isOnline && isPublic && (
               <div className="p-4 rounded-xl bg-primary/10 border border-primary/10 flex items-center gap-3 animate-pulse">
                  <Zap className="size-5 text-primary shrink-0" />
                  <p className="text-xs font-bold text-primary">Go online to increase visibility by 3x</p>
               </div>
             )}
          </div>

          <button
            onClick={toggleStatus}
            className={`mt-8 w-full h-14 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 px-6 ${
              isOnline
                ? "bg-primary text-white shadow-xl shadow-primary/25 hover:scale-[1.02]"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary/40"
            }`}
          >
            <div className={`size-2.5 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            {isOnline ? "Switch to Offline Mode" : "Go Online Now"}
          </button>
        </div>
      </section>

      {/* Today's agenda + tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8">
          <div className="rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10 bg-[#111827] dark:bg-[#151b2b]">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1">Today</p>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">Sessions & schedule</h1>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10">
                  <Calendar className="size-4 text-primary shrink-0" aria-hidden />
                  <span className="text-xs font-bold text-slate-100">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {upcomingSessions.length === 0 ? (
                <div className="py-10 md:py-12 border-2 border-dashed border-white/15 rounded-2xl text-center">
                  <Clock className="size-9 text-slate-500 mx-auto mb-3" aria-hidden />
                  <p className="text-slate-300 font-semibold">No confirmed sessions today</p>
                  <Link
                    href="/dashboard/teacher/bookings"
                    className="text-primary text-xs font-bold uppercase tracking-widest mt-3 inline-block hover:underline"
                  >
                    Full schedule
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcomingSessions.map((session, idx) => (
                    <div
                      key={session.id}
                      className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/[0.07] transition-colors"
                    >
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2 flex-wrap">
                        <span className="size-1.5 bg-primary rounded-full animate-pulse shrink-0" aria-hidden />
                        {session.booking_time}
                        {idx === 0 && nextSessionCountdown ? (
                          <span className="text-emerald-300 font-black">{nextSessionCountdown}</span>
                        ) : null}
                      </p>
                      <h4 className="text-lg font-black mb-4 tracking-tight line-clamp-2 text-white">{session.topic}</h4>
                      <Button
                        className="w-full h-12 bg-primary hover:opacity-90 text-primary-foreground font-black rounded-xl gap-2"
                        onClick={() =>
                          session.session_url ? window.open(session.session_url, "_blank") : toast.info("Session link not set yet")
                        }
                      >
                        <Video className="size-4" /> Join
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-black tracking-tight text-foreground mb-6">Inbox & inquiries</h3>
            <div className="space-y-3 grow">
              <Link
                href="/dashboard/teacher/bookings?status=pending"
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/60 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                    <Users className="size-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground truncate">Pending inquiries</span>
                </div>
                <span className="text-lg font-black text-orange-600 dark:text-orange-400 tabular-nums">{counts.inquiries}</span>
              </Link>
              <Link
                href="/dashboard/teacher/messages"
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/60 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                    <MessageCircle className="size-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground truncate">Messages</span>
                </div>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{messageLabel}</span>
              </Link>
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Directory visibility</p>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {isOnline
                  ? "You appear as available for new bookings (separate from “public” listing in Settings)."
                  : "You appear offline. Clients may still message you from existing bookings."}
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={isOnline}
                onClick={toggleStatus}
                className={`w-full min-h-[48px] rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 px-3 ${
                  isOnline
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                <span className="size-2 rounded-full shrink-0 bg-current opacity-80" aria-hidden />
                {isOnline ? "Visible: open for sessions" : "Hidden: not taking new sessions"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="rounded-[2rem] border border-border bg-muted/30 p-4 md:p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">Quick actions</p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Link href="/dashboard/teacher/availability">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs border-border bg-card">
              Open slots
            </Button>
          </Link>
          <Link href="/dashboard/teacher/profile#reviews">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs border-border bg-card">
              Reviews
            </Button>
          </Link>
          <Link href="/dashboard/teacher/jobs">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs border-primary text-primary bg-primary/5">
              Marketplace
            </Button>
          </Link>
          <Link href="/dashboard/teacher/earnings">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs border-border bg-card">
              Withdraw / payouts
            </Button>
          </Link>
          <Link href="/dashboard/teacher/offers">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs border-border bg-card">
              Offers
            </Button>
          </Link>
        </div>
      </section>

      {/* Metrics — earnings hero */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="md:col-span-2 lg:col-span-2 order-first">
            <div className="h-full rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border-2 border-primary bg-linear-to-br from-primary/15 via-card to-card dark:from-primary/20 dark:via-card dark:to-card shadow-lg min-h-[200px] flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="size-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <DollarSign className="size-7" aria-hidden />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Primary</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Career earnings</p>
                <p className="text-3xl md:text-4xl font-black tabular-nums text-foreground tracking-tighter">
                  ${metrics.careerEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-2">Verified revenue across all sessions</p>
              </div>
              <Link href="/dashboard/teacher/earnings" className="mt-4 inline-flex">
                <span className="text-sm font-bold text-primary hover:underline">Open financials →</span>
              </Link>
            </div>
          </div>
          <StatsModule
            icon={<Star className="size-6 text-foreground" />}
            label="Reputation"
            value={metrics.ratingAvg > 0 ? metrics.ratingAvg.toFixed(2) : "New Pro"}
            subValue={metrics.reviewCount > 0 ? `Based on ${metrics.reviewCount} reviews` : "Awaiting first review"}
          />
          <StatsModule
            icon={<BadgeCheck className="size-6 text-foreground" />}
            label="Reliability"
            value={`${metrics.reliability}%`}
            subValue="On-time completion"
          />
        </div>

        {/* Compact availability tip */}
        {showAvailTip ? (
          <div className="relative rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <Sparkles className="size-5 text-primary shrink-0 hidden sm:block" aria-hidden />
            <div className="grow min-w-0">
              <p className="font-bold text-foreground text-sm">Grow your calendar</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add recurring slots for next week so {theme.consumer.toLowerCase()} can book you faster.
              </p>
              <Link href="/dashboard/teacher/availability" className="text-xs font-bold text-primary mt-2 inline-block hover:underline">
                Open availability →
              </Link>
            </div>
            <button
              type="button"
              onClick={dismissAvailTip}
              className="shrink-0 self-start sm:self-center p-2 rounded-xl hover:bg-background/80 text-muted-foreground"
              aria-label="Dismiss tip"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function StatsModule({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue: string }) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 shadow-sm min-w-0 transition-shadow hover:shadow-md">
      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center border border-border mb-5">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 truncate">{label}</p>
      <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground mb-2 tabular-nums wrap-break-word leading-tight">
        {value}
      </h3>
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide leading-snug">{subValue}</p>
    </div>
  )
}
