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
} from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const AVAIL_TIP_KEY = "paktellect_dismiss_avail_tip_v1"

export default function TeacherOverview() {
  const { user } = useStore()
  const [category, setCategory] = useState<string>("Academic")
  const [isOnline, setIsOnline] = useState(false)
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
          .select("id, category, is_online")
          .eq("user_id", user.id)
          .single()

        if (teacher) {
          setCategory(teacher.category)
          setIsOnline(teacher.is_online)

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
                <p className="text-3xl md:text-4xl font-black tabular-nums text-foreground tracking-tighter">$12,450.00</p>
                <p className="text-xs font-semibold text-muted-foreground mt-2">Verified revenue (demo figure — wire to live totals in Financials)</p>
              </div>
              <Link href="/dashboard/teacher/earnings" className="mt-4 inline-flex">
                <span className="text-sm font-bold text-primary hover:underline">Open financials →</span>
              </Link>
            </div>
          </div>
          <StatsModule
            icon={<Star className="size-6 text-foreground" />}
            label="Reputation"
            value="4.96"
            subValue="Based on 142 reviews"
          />
          <StatsModule
            icon={<BadgeCheck className="size-6 text-foreground" />}
            label="Reliability"
            value="100%"
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
