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
  Activity
} from "lucide-react"
import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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

  useEffect(() => {
    async function loadDashboardData() {
        if (!user) return
        try {
            // 1. Get Teacher Info
            const { data: teacher } = await supabase
                .from('teachers')
                .select('id, category, is_online')
                .eq('user_id', user.id)
                .single()
            
            if (teacher) {
                setCategory(teacher.category)
                setIsOnline(teacher.is_online)

                // 2. Get Today's Sessions (Confirmed)
                const today = new Date().toISOString().split('T')[0]
                const { data: sessions } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('expert_id', teacher.id)
                    .eq('booking_date', today)
                    .eq('status', 'confirmed')
                    .order('booking_time', { ascending: true })
                
                setUpcomingSessions(sessions || [])

                // 3. Get Inquiries Count (Pending)
                const { count: inquiryCount } = await supabase
                    .from('bookings')
                    .select('*', { count: 'exact', head: true })
                    .eq('expert_id', teacher.id)
                    .eq('status', 'pending')
                
                setCounts(prev => ({ ...prev, inquiries: inquiryCount || 0 }))

                // 4. Get Unread Messages Count
                const { count: unreadCount } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_read', false)
                    .neq('sender_id', user.id)
                    .in('booking_id', (await supabase.from('bookings').select('id').eq('expert_id', teacher.id)).data?.map(b => b.id) || [])
                
                setCounts(prev => ({ ...prev, messages: unreadCount || 0 }))
            }
        } catch (err) {
            console.error("Dashboard load failed", err)
        } finally {}
    }
    loadDashboardData()
  }, [user])

  // Countdown Logic
  useEffect(() => {
    if (upcomingSessions.length === 0) return

    const timer = setInterval(() => {
        const now = new Date()
        const first = upcomingSessions[0]
        const [hours, minutes] = first.booking_time.split(':')
        const sessionDate = new Date(first.booking_date)
        sessionDate.setHours(parseInt(hours), parseInt(minutes), 0)

        const diff = sessionDate.getTime() - now.getTime()
        
        if (diff > 0 && diff < 3600000) { // Only show if within 1 hour
            const mins = Math.floor(diff / 60000)
            const secs = Math.floor((diff % 60000) / 1000)
            setNextSessionCountdown(`Starts in ${mins}:${secs < 10 ? '0' : ''}${secs}`)
        } else {
            setNextSessionCountdown(null)
        }
    }, 1000)

    return () => clearInterval(timer)
  }, [upcomingSessions])

  const getProfessionTheme = () => {
      switch(category) {
          case 'Legal': return { 
            consumer: 'Clients', 
            action: 'Consultations', 
            icon: <Scale className="size-6 text-orange-400" />,
            welcomeSub: "Your legal expertise is in high demand.",
            statSub: "Active Case Files",
            completionLabel: "Case Resolution",
            advisory: "Scale your legal practice and automate client intakes.",
            cta: "View Case Analytics",
            statusLabel: "Legal Compliance"
          }
          case 'Wellness': return { 
            consumer: 'Clients', 
            action: 'Wellness Checks', 
            icon: <Heart className="size-6 text-teal-400" />,
            welcomeSub: "Connecting you with wellness seekers.",
            statSub: "Active Vitality Plans",
            completionLabel: "Goal Achievement",
            advisory: "Reach more clients interested in holistic professional balance.",
            cta: "Wellness Hub",
            statusLabel: "Service Integrity"
          }
          case 'Mental Health': return { 
            consumer: 'Patients', 
            action: 'Therapy Sessions', 
            icon: <Brain className="size-6 text-rose-500" />,
            welcomeSub: "Your dedication to mental well-being changes lives.",
            statSub: "Ongoing Care Plans",
            completionLabel: "Treatment Adherence",
            advisory: "Scale your practice with secure, private sessions.",
            cta: "Clinical Insights",
            statusLabel: "Clinical Compliance"
          }
          default: return { 
            consumer: 'Students', 
            action: 'Lessons', 
            icon: <GraduationCap className="size-6 text-primary" />,
            welcomeSub: "Empowering the next generation of leaders.",
            statSub: "Active Learning Tracks",
            completionLabel: "Course Maturity",
            advisory: "Scale your teaching practice to a global classroom.",
            cta: "Pedagogy Analytics",
            statusLabel: "Academic Standing"
          }
      }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = getProfessionTheme()

  const toggleStatus = async () => {
      if (!user) return
      const newStatus = !isOnline
      setIsOnline(newStatus)
      try {
          const { error } = await supabase
              .from('teachers')
              .update({ is_online: newStatus })
              .eq('user_id', user.id)
          if (error) throw error
          toast.success(`You are now ${newStatus ? 'LIVE' : 'OFFLINE'}`)
      } catch (err) {
          console.error(err)
          setIsOnline(!newStatus)
          toast.error("Failed to update status")
      }
  }

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      
      {/* PROFESSIONAL HEADER / AGENDA HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Practice Overview</p>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Today&apos;s Agenda</h1>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                            <Calendar className="size-4 text-primary" />
                            <span className="text-xs font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    {upcomingSessions.length === 0 ? (
                        <div className="py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-center">
                            <Clock className="size-10 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">No sessions scheduled for today</p>
                            <Link href="/dashboard/teacher/bookings" className="text-primary text-[10px] font-black uppercase tracking-widest mt-4 block hover:underline">View Full Schedule</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcomingSessions.map((session, idx) => (
                                <div key={session.id} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="size-1.5 bg-primary rounded-full animate-pulse" />
                                        {session.booking_time}
                                        {idx === 0 && nextSessionCountdown && (
                                            <span className="ml-auto text-emerald-400 font-black animate-pulse">{nextSessionCountdown}</span>
                                        )}
                                    </p>
                                    <h4 className="text-xl font-black mb-6 tracking-tight line-clamp-1">{session.topic}</h4>
                                    <Button className="w-full h-14 bg-primary hover:bg-emerald-700 text-white font-black rounded-xl shadow-xl shadow-emerald-500/20 gap-2"
                                            onClick={() => session.session_url ? window.open(session.session_url, '_blank') : toast.info("Session link not set yet")}>
                                        <Video className="size-4" /> Join Session
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* QUICK STATUS & ACTIONS */}
        <div className="lg:col-span-4 space-y-6">
             <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between h-full">
                <div>
                   <h3 className="text-xl font-black tracking-tighter mb-8 px-1">Tasks & Requests</h3>
                   <div className="space-y-4">
                      <Link href="/dashboard/teacher/bookings?status=pending" className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 hover:border-primary transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                               <Users className="size-5 text-orange-600" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">New Inquiries</span>
                         </div>
                         <span className="text-lg font-black text-orange-600">{counts.inquiries}</span>
                      </Link>
                      <Link href="/dashboard/teacher/messages" className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 hover:border-primary transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                               <MessageCircle className="size-5 text-indigo-600" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Client Messages</span>
                         </div>
                         <span className="text-lg font-black text-indigo-600">{counts.messages}</span>
                      </Link>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-8">
                   <div className="flex items-center justify-between mb-4 px-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Practice Status</span>
                      <div className={`size-3 rounded-full ${isOnline ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
                   </div>
                   <button onClick={toggleStatus} className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isOnline ? 'bg-primary text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {isOnline ? 'Active & Visible' : 'Go Live'}
                   </button>
                </div>
             </div>
        </div>
      </section>

      {/* CORE PERFORMANCE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsModule 
                icon={<DollarSign className="size-6 text-slate-900 dark:text-white" />} 
                label="Career Earnings" 
                value="$12,450.00" 
                subValue="Verified Revenue"
            />
            <StatsModule 
                icon={<Star className="size-6 text-slate-900 dark:text-white" />} 
                label="Reputation" 
                value="4.96" 
                subValue="Based on 142 reviews"
            />
            <StatsModule 
                icon={<Activity className="size-6 text-slate-900 dark:text-white" />} 
                label="Reliability" 
                value="100%" 
                subValue="On-time completion"
            />
             <div className="rounded-[3rem] p-10 bg-primary text-white shadow-2xl shadow-emerald-500/20 flex flex-col justify-between group">
                <h4 className="text-xl font-black tracking-tight leading-tight mb-8">Increase your availability to reach more students.</h4>
                <Link href="/dashboard/teacher/availability">
                   <Button variant="outline" className="h-14 w-full bg-white/10 hover:bg-white text-white hover:text-primary border-white/20 font-black rounded-2xl group-hover:scale-[1.02] transition-all">
                      Open New Slots
                   </Button>
                </Link>
            </div>
      </div>
    </div>
  )
}

function StatsModule({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none group transition-all hover:border-primary">
            <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-white/5 mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                {icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{label}</p>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">{value}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{subValue}</p>
        </div>
    )
}

// (intentionally removed unused StatusLine helper)
