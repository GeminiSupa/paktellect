"use client"

import { useEffect, useMemo, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { FileText, Scale, Plus, Loader2, Clock, PenLine, ExternalLink, Eye, MessageSquare, Search } from "lucide-react"
import { ChamberLedger } from "@/components/ChamberLedger"

type TeacherRow = {
  id: string
  category: string
}

type BookingRow = {
  id: string
  topic: string
  booking_date: string
  status: string
  user_id: string
  profiles?: { full_name?: string | null } | null
}

type MatterRow = {
  id: string
  title: string
  status: string
  created_at: string
  booking_id?: string | null
  client_id?: string
  client?: { full_name?: string | null } | null
  booking?: { topic?: string | null; booking_date?: string | null } | null
}

export default function LegalDashboard() {
  const { user } = useStore()

  const [isLoading, setIsLoading] = useState(true)
  const [teacher, setTeacher] = useState<TeacherRow | null>(null)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [matters, setMatters] = useState<MatterRow[]>([])

  const [isCreating, setIsCreating] = useState(false)
  const [newBookingId, setNewBookingId] = useState<string>("")
  const [newTitle, setNewTitle] = useState<string>("")

  const eligibleBookings = useMemo(
    () => bookings.filter((b) => ["pending", "confirmed", "completed"].includes(b.status)),
    [bookings]
  )

  useEffect(() => {
    async function load() {
      if (!user) return
      setIsLoading(true)
      try {
        const { data: t, error: tErr } = await supabase
          .from("teachers")
          .select("id, category")
          .eq("user_id", user.id)
          .single()
        if (tErr) throw tErr
        setTeacher(t)

        const { data: b, error: bErr } = await supabase
          .from("bookings")
          .select("id, topic, booking_date, status, user_id, profiles!bookings_user_id_fkey(full_name)")
          .eq("expert_id", t.id)
          .order("created_at", { ascending: false })
        if (bErr) throw bErr
        setBookings((b || []) as BookingRow[])

        const { data: m, error: mErr } = await supabase
          .from("matters")
          .select(
            "id, title, status, created_at, booking_id, client_id, client:profiles!matters_client_id_fkey(full_name), booking:bookings(topic, booking_date)"
          )
          .eq("teacher_id", t.id)
          .order("created_at", { ascending: false })
        if (mErr) throw mErr
        setMatters((m || []) as MatterRow[])
      } catch (err) {
        console.error(err)
        toast.error("Failed to load legal dashboard")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user])

  const createMatterFromBooking = async () => {
    if (!teacher) return
    if (!newBookingId || !newTitle.trim()) {
      toast.error("Select a booking and enter a title")
      return
    }
    const booking = bookings.find((b) => b.id === newBookingId)
    if (!booking) {
      toast.error("Booking not found")
      return
    }

    setIsCreating(true)
    try {
      const { data, error } = await supabase
        .from("matters")
        .insert({
          teacher_id: teacher.id,
          client_id: booking.user_id,
          booking_id: booking.id,
          title: newTitle.trim(),
          status: "open",
        })
        .select(
          "id, title, status, created_at, booking_id, client_id, client:profiles!matters_client_id_fkey(full_name), booking:bookings(topic, booking_date)"
        )
        .single()
      if (error) throw error
      setMatters((prev) => [data as MatterRow, ...prev])
      setNewTitle("")
      toast.success("Matter created")
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to create matter"
      toast.error(message)
    } finally {
      setIsCreating(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-bold text-slate-500">Please sign in.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (teacher?.category !== "Legal") {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="size-6 text-orange-500" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Legal Workspace</h1>
          </div>
          <p className="text-slate-500 font-medium">
            This workspace is available for Legal experts only. Update your category in Profile if needed.
          </p>
          <div className="pt-6">
            <Link href="/dashboard/teacher/profile">
              <Button className="h-12 px-6 rounded-2xl bg-primary text-white font-black">Open Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 mb-6 text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em]">
            <Scale className="size-3.5" /> Legal Practice Excellence
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-slate-900 dark:text-[#f0f6fc] leading-[0.9] mb-6">
            Case <span className="italic text-[#c5a059]">Management</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-[#8b949e] font-medium leading-relaxed">
            From first filing to final judgement — one system for your entire chamber.
          </p>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="flex gap-4">
           {[
             { label: 'Active', val: matters.length },
             { label: 'Files', val: matters.filter(m => m.status === 'open').length }
           ].map((stat, i) => (
             <div key={i} className="px-6 py-4 rounded-3xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] shadow-sm">
                <div className="text-2xl font-serif text-[#c5a059]">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CREATE MATTER SECTION */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-[#161b22] rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-[#30363d] shadow-2xl shadow-slate-200/40 dark:shadow-none">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-serif text-slate-900 dark:text-[#f0f6fc]">Initiate New Matter</h2>
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-[#ff5f56]" />
                <div className="size-3 rounded-full bg-[#ffbd2e]" />
                <div className="size-3 rounded-full bg-[#27c93f]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] ml-1">Select Client Booking</label>
                <div className="relative">
                  <select
                    value={newBookingId}
                    onChange={(e) => setNewBookingId(e.target.value)}
                    className="w-full h-16 pl-6 pr-12 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] font-bold text-sm text-foreground appearance-none focus:ring-2 focus:ring-[#c5a059]/50 transition-all outline-none"
                  >
                    <option value="">Choose a session...</option>
                    {eligibleBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.profiles?.full_name || "Client"} — {b.topic} ({b.booking_date})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#c5a059]">
                    <Search className="size-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] ml-1">Matter Reference Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. State v. Rehman"
                  className="w-full h-16 px-6 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] font-bold text-sm focus:ring-2 focus:ring-[#c5a059]/50 transition-all outline-none"
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
              <Button 
                onClick={createMatterFromBooking} 
                disabled={isCreating} 
                className="h-16 px-12 rounded-2xl bg-[#c5a059] hover:bg-[#b08d4a] text-white font-black text-lg transition-all shadow-xl shadow-[#c5a059]/20"
              >
                {isCreating ? <Loader2 className="size-5 mr-3 animate-spin" /> : <Plus className="size-5 mr-3" />}
                Archive to Ledger
              </Button>
              <p className="text-xs font-medium text-slate-400 max-w-xs">
                Creating a matter associates all future logs, documents and messages with this legal reference.
              </p>
            </div>
          </div>

          {/* MATTERS LIST / CHAMBER LEDGER */}
          <div className="rounded-[3rem] bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-[#30363d]/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="size-10 rounded-xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]">
                    <Scale className="size-6" />
                 </div>
                 <h2 className="text-2xl font-serif text-slate-900 dark:text-[#f0f6fc]">Chamber Ledger</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">{matters.length} Files Total</span>
            </div>

            {matters.length === 0 ? (
              <div className="py-24 text-center">
                <div className="size-20 rounded-full bg-slate-50 dark:bg-[#161b22] flex items-center justify-center mx-auto mb-6 border border-dashed border-slate-300 dark:border-[#30363d]">
                  <FileText className="size-8 text-slate-300 dark:text-[#8b949e]" />
                </div>
                <h3 className="text-xl font-serif text-slate-900 dark:text-[#f0f6fc]">No matters archived</h3>
                <p className="text-slate-500 dark:text-[#8b949e] font-medium mt-3 max-w-sm mx-auto">
                  Begin by initiating a new matter from your confirmed bookings to start tracking activity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-[#30363d]/50">
                {matters.map((m) => (
                  <div key={m.id} className="px-10 py-10 group hover:bg-slate-50 dark:hover:bg-[#161b22] transition-all cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest ${
                              m.status === 'closed' ? 'bg-[#6e76811a] text-[#8b949e]' :
                              m.status === 'pending' ? 'bg-[#bb80091a] text-[#d29922]' :
                              'bg-[#388bfd1a] text-[#58a6ff]'
                            }`}>
                              {m.status === 'open' ? 'ACTIVE' : m.status.toUpperCase()}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">
                              Client: {m.client?.full_name || "Anonymous"}
                            </span>
                          </div>
                          
                          <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-[#f0f6fc] group-hover:text-[#c5a059] transition-colors">
                            {m.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                               <Clock className="size-3.5" />
                               <span>{new Date(m.created_at).toLocaleDateString()}</span>
                            </div>
                            {m.booking && (
                              <div className="flex items-center gap-2 text-[#c5a059]">
                                  <Scale className="size-3.5" />
                                  <span>{m.booking.topic}</span>
                              </div>
                            )}
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <Link href={`/dashboard/messages/${m.booking_id || ''}`} className={!m.booking_id ? 'pointer-events-none' : ''}>
                             <button 
                                disabled={!m.booking_id}
                                className="size-14 rounded-2xl border border-slate-200 dark:border-[#30363d] flex items-center justify-center hover:bg-[#c5a059] hover:border-[#c5a059] hover:text-white transition-all disabled:opacity-30"
                             >
                                <MessageSquare className="size-6" />
                             </button>
                          </Link>
                          <Link href={`/dashboard/teacher/legal/${m.id}`}>
                             <button className="h-14 px-8 rounded-2xl bg-slate-900 dark:bg-[#161b22] dark:border dark:border-[#30363d] text-white dark:text-[#f0f6fc] font-black group-hover:bg-[#c5a059] group-hover:border-[#c5a059] transition-all flex items-center gap-3">
                                <Eye className="size-5" /> Detailed View
                             </button>
                          </Link>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Ledger Ribbon */}
            <div className="px-10 py-6 bg-slate-50 dark:bg-[#161b22]/50 border-t border-slate-100 dark:border-[#30363d]/50 flex items-center justify-between">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                  <Clock className="size-3.5 text-[#c5a059]" />
                  <span>Next scheduled briefing: 14:00 (GST)</span>
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-[#c5a059]">
                 Sync Status: Real-time Ledger
               </div>
            </div>
          </div>
        </div>

        {/* WORKFLOW SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 size-40 bg-[#c5a059]/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
              
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] mb-6">Workflow Audit</p>
              <ul className="space-y-8">
                {[
                  { icon: FileText, title: 'Document Vault', desc: 'Secure cloud storage for filings' },
                  { icon: ExternalLink, title: 'Digital Signature', desc: 'Legally binding e-signatures' },
                  { icon: Clock, title: 'Time Tracking', desc: 'Automated billable hour logs' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-5">
                    <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#c5a059]">
                       <item.icon className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-12 border-t border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                   Future Expansion: blockchain-verified audit trails & automated legal discovery.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

