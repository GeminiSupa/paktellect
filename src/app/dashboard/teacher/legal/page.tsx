"use client"

import { useEffect, useMemo, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { FileText, Scale, Plus, Loader2, Clock, PenLine, ExternalLink, Eye, MessageSquare } from "lucide-react"

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
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 text-orange-600 text-[10px] font-black uppercase tracking-widest">
            <Scale className="size-3" /> Legal Practice
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">Case Files</h1>
          <p className="text-slate-500 font-medium">Create matters, attach documents, request signatures, and log billable time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Create Matter</h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <PenLine className="size-3" /> From Booking
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Booking</label>
              <select
                value={newBookingId}
                onChange={(e) => setNewBookingId(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm text-foreground"
              >
                <option value="">Select a booking…</option>
                {eligibleBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.booking_date} — {b.profiles?.full_name || "Client"} — {b.topic}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Matter Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Contract Review (NDA)"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          <div className="pt-6">
            <Button onClick={createMatterFromBooking} disabled={isCreating} className="h-14 px-8 rounded-2xl bg-primary text-white font-black">
              {isCreating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
              Create Matter
            </Button>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Workflow</p>
          <ul className="space-y-4 text-sm font-bold text-slate-200">
            <li className="flex items-center gap-3">
              <FileText className="size-5 text-orange-400" /> Attach docs (links for now)
            </li>
            <li className="flex items-center gap-3">
              <ExternalLink className="size-5 text-orange-400" /> Request signatures (status tracking)
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-5 text-orange-400" /> Log billable minutes
            </li>
          </ul>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-8">
            Next: full document storage + audit trail
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Matters</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{matters.length} total</span>
        </div>

        {matters.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No matters yet</h3>
            <p className="text-slate-500 font-medium mt-2">Create your first matter from a booking above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {matters.map((m) => (
              <div key={m.id} className="px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        m.status === "closed"
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : m.status === "pending"
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {m.status}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Client: {m.client?.full_name || "Client"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">{m.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                    {m.booking?.booking_date ? `${m.booking.booking_date} — ${m.booking?.topic || "Consultation"}` : "No linked booking"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {m.booking_id ? (
                    <Link href={`/dashboard/messages/${m.booking_id}`}>
                      <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 font-black gap-2">
                        <MessageSquare className="size-4" /> Messages
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 font-black gap-2 opacity-50 cursor-not-allowed" disabled>
                      <MessageSquare className="size-4" /> Messages
                    </Button>
                  )}
                  <Link href={`/dashboard/teacher/legal/${m.id}`}>
                    <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 font-black gap-2">
                      <Eye className="size-4" /> View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

