"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Loader2, Handshake, ArrowUpRight, Clock, BadgeDollarSign, CalendarClock } from "lucide-react"

type OfferRow = {
  id: string
  status: "proposed" | "countered" | "accepted" | "rejected" | "expired" | "cancelled"
  proposed_start: string
  duration_minutes: number
  proposed_hourly_rate: number
  currency: string
  message?: string | null
  expert_teacher_id: string
  expert_user_id: string
  student_user_id: string
  booking_id?: string | null
  created_at: string
  updated_at: string
}

function StudentOffersContent() {
  const { user } = useStore()
  const searchParams = useSearchParams()
  const expertTeacherId = searchParams.get("expertId")

  const [isLoading, setIsLoading] = useState(true)
  const [offers, setOffers] = useState<OfferRow[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proposedStart, setProposedStart] = useState("")
  const [durationMinutes, setDurationMinutes] = useState("60")
  const [rate, setRate] = useState("")
  const [currency, setCurrency] = useState("PKR")
  const [message, setMessage] = useState("")

  const mode = useMemo(() => (expertTeacherId ? "create" : "list"), [expertTeacherId])

  useEffect(() => {
    async function loadOffers() {
      if (!user) return
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("booking_offers")
          .select("*")
          .eq("student_user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50)
        if (error) throw error
        setOffers((data || []) as OfferRow[])
      } catch (err: unknown) {
        console.error(err)
        toast.error("Failed to load offers")
      } finally {
        setIsLoading(false)
      }
    }

    if (mode === "list") {
      void loadOffers()
    } else {
      setIsLoading(false)
    }
  }, [user, mode])

  const submitOffer = async () => {
    if (!user) {
      toast.error("Please sign in first")
      return
    }
    if (!expertTeacherId) {
      toast.error("Missing expert")
      return
    }
    if (!proposedStart) {
      toast.error("Select a date/time")
      return
    }
    const mins = Number(durationMinutes)
    if (!Number.isFinite(mins) || mins <= 0) {
      toast.error("Enter valid duration")
      return
    }
    const numericRate = Number(rate)
    if (!Number.isFinite(numericRate) || numericRate < 0) {
      toast.error("Enter valid price")
      return
    }

    setIsSubmitting(true)
    try {
      // We need expert_user_id to satisfy the row shape.
      const { data: t, error: tErr } = await supabase
        .from("teachers")
        .select("id, user_id")
        .eq("id", expertTeacherId)
        .single()
      if (tErr) throw tErr

      const { error } = await supabase.from("booking_offers").insert({
        expert_teacher_id: t.id,
        expert_user_id: t.user_id,
        student_user_id: user.id,
        status: "proposed",
        proposed_start: new Date(proposedStart).toISOString(),
        duration_minutes: mins,
        proposed_hourly_rate: numericRate,
        currency,
        message: message.trim() ? message.trim() : null,
        last_actor_id: user.id,
      })
      if (error) throw error

      toast.success("Offer sent")
      // go back to list
      window.location.href = "/dashboard/student/offers"
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : "Failed to send offer"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary size-10" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
          Loading Offers...
        </p>
      </div>
    )
  }

  if (mode === "create") {
    return (
      <div className="max-w-3xl space-y-8 pb-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 text-primary text-[10px] font-black uppercase tracking-widest">
              <Handshake className="size-3" />
              Offer / Negotiation
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Send an offer
            </h1>
            <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">
              Propose a time and price. The expert can counter or accept.
            </p>
          </div>
          <Link href="/dashboard/student/offers">
            <Button variant="outline" className="h-12 px-6 rounded-2xl font-black">
              Back
            </Button>
          </Link>
        </div>

        <div className="premium-card p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" /> Proposed date/time
              </label>
              <Input
                type="datetime-local"
                value={proposedStart}
                onChange={(e) => setProposedStart(e.target.value)}
                className="h-14 rounded-2xl bg-white dark:bg-slate-950"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                <Clock className="size-4 text-orange-500" /> Duration (minutes)
              </label>
              <Input
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="h-14 rounded-2xl bg-white dark:bg-slate-950"
                disabled={isSubmitting}
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                <BadgeDollarSign className="size-4 text-emerald-600" /> Proposed hourly rate
              </label>
              <Input
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="h-14 rounded-2xl bg-white dark:bg-slate-950"
                disabled={isSubmitting}
                inputMode="decimal"
                placeholder="e.g. 5000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-background border border-border text-foreground text-sm font-bold"
                disabled={isSubmitting}
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[140px] w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                placeholder="Explain your goal, constraints, and preferred format."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              onClick={submitOffer}
              className="h-14 px-8 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <ArrowUpRight className="size-4" />}
              Send Offer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 text-primary text-[10px] font-black uppercase tracking-widest">
            <Handshake className="size-3" />
            Negotiations
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Your offers
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">
            Track proposals, counters, and accepted bookings.
          </p>
        </div>
        <Link href="/experts">
          <Button variant="outline" className="h-12 px-6 rounded-2xl font-black">
            Find experts
          </Button>
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="premium-card p-12 text-center">
          <p className="text-slate-900 dark:text-white font-black text-2xl tracking-tight mb-2">No offers yet</p>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Browse the directory and send an offer to negotiate time and price.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((o) => (
            <div key={o.id} className="premium-card p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                    Status: <span className="text-primary">{o.status}</span>
                  </p>
                  <p className="text-slate-900 dark:text-white font-black text-xl tracking-tight">
                    {new Date(o.proposed_start).toLocaleString()}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-bold text-sm">
                    {o.duration_minutes} mins • {o.currency} {o.proposed_hourly_rate}/hr
                  </p>
                  {o.message ? (
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mt-3">
                      {o.message}
                    </p>
                  ) : null}
                </div>
                {o.booking_id ? (
                  <Link href="/dashboard/student">
                    <Button className="h-12 px-6 rounded-2xl bg-primary text-white font-black">
                      View booking <ArrowUpRight className="size-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/dashboard/messages/${o.expert_teacher_id}`}>
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black">
                      Open chat
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StudentOffersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary size-10" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
            Loading Offers...
          </p>
        </div>
      }
    >
      <StudentOffersContent />
    </Suspense>
  )
}

