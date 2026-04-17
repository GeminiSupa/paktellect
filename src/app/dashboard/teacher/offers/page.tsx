"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Loader2, Handshake, ArrowUpRight, Clock, BadgeDollarSign, CalendarClock, X, Check } from "lucide-react"

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

export default function TeacherOffersPage() {
  const { user } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [offers, setOffers] = useState<OfferRow[]>([])

  const [actingId, setActingId] = useState<string | null>(null)
  const [counterDraft, setCounterDraft] = useState<Record<string, { start: string; mins: string; rate: string; currency: string }>>({})

  const loadOffers = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("booking_offers")
        .select("*")
        .eq("expert_user_id", user.id)
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

  useEffect(() => {
    void loadOffers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const setCounterDefault = (o: OfferRow) => {
    setCounterDraft((prev) => ({
      ...prev,
      [o.id]: prev[o.id] ?? {
        start: new Date(o.proposed_start).toISOString().slice(0, 16),
        mins: String(o.duration_minutes),
        rate: String(o.proposed_hourly_rate),
        currency: o.currency || "PKR",
      },
    }))
  }

  const counterOffer = async (offerId: string) => {
    if (!user) return
    const d = counterDraft[offerId]
    if (!d?.start) return toast.error("Select a date/time")
    const mins = Number(d.mins)
    const rate = Number(d.rate)
    if (!Number.isFinite(mins) || mins <= 0) return toast.error("Enter valid duration")
    if (!Number.isFinite(rate) || rate < 0) return toast.error("Enter valid price")

    setActingId(offerId)
    try {
      const { error } = await supabase
        .from("booking_offers")
        .update({
          status: "countered",
          proposed_start: new Date(d.start).toISOString(),
          duration_minutes: mins,
          proposed_hourly_rate: rate,
          currency: d.currency,
          last_actor_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", offerId)
      if (error) throw error

      await supabase.from("booking_offer_events").insert({
        offer_id: offerId,
        actor_id: user.id,
        event_type: "countered",
        meta: { proposed_start: new Date(d.start).toISOString(), duration_minutes: mins, proposed_hourly_rate: rate, currency: d.currency },
      })

      toast.success("Counter sent")
      await loadOffers()
    } catch (err: unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to counter")
    } finally {
      setActingId(null)
    }
  }

  const rejectOffer = async (offerId: string) => {
    if (!user) return
    setActingId(offerId)
    try {
      const { error } = await supabase
        .from("booking_offers")
        .update({ status: "rejected", last_actor_id: user.id, updated_at: new Date().toISOString() })
        .eq("id", offerId)
      if (error) throw error

      await supabase.from("booking_offer_events").insert({
        offer_id: offerId,
        actor_id: user.id,
        event_type: "rejected",
      })

      toast.success("Offer rejected")
      await loadOffers()
    } catch (err: unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to reject")
    } finally {
      setActingId(null)
    }
  }

  const acceptOffer = async (offerId: string) => {
    setActingId(offerId)
    try {
      // SECURITY DEFINER RPC validates expert ownership.
      const { data, error } = await supabase.rpc("accept_booking_offer", { p_offer_id: offerId })
      if (error) throw error
      toast.success("Offer accepted — booking created")
      await loadOffers()
      if (data) {
        // route to bookings list
        window.location.href = "/dashboard/teacher/bookings"
      }
    } catch (err: unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to accept offer")
    } finally {
      setActingId(null)
    }
  }

  const pendingOffers = useMemo(
    () => offers.filter((o) => o.status === "proposed" || o.status === "countered"),
    [offers]
  )

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

  return (
    <div className="max-w-5xl space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 text-primary text-[10px] font-black uppercase tracking-widest">
            <Handshake className="size-3" />
            Negotiations
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Incoming offers
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">
            Accept, counter, or reject proposals from students.
          </p>
        </div>
        <Link href="/dashboard/teacher/bookings">
          <Button variant="outline" className="h-12 px-6 rounded-2xl font-black">
            View bookings
          </Button>
        </Link>
      </div>

      {pendingOffers.length === 0 ? (
        <div className="premium-card p-12 text-center">
          <p className="text-slate-900 dark:text-white font-black text-2xl tracking-tight mb-2">No active offers</p>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            When students negotiate time and price, offers will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOffers.map((o) => (
            <div key={o.id} className="premium-card p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="space-y-2">
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

                <div className="space-y-4 w-full lg:w-[420px]">
                  <div className="p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-slate-900 dark:text-white font-black">Counter offer</p>
                      <Button
                        variant="outline"
                        className="h-9 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                        onClick={() => setCounterDefault(o)}
                      >
                        Load current
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                          <CalendarClock className="size-4 text-primary" /> Proposed date/time
                        </label>
                        <Input
                          type="datetime-local"
                          value={counterDraft[o.id]?.start ?? ""}
                          onChange={(e) =>
                            setCounterDraft((prev) => ({
                              ...prev,
                              [o.id]: { ...(prev[o.id] ?? { start: "", mins: "60", rate: String(o.proposed_hourly_rate), currency: o.currency }), start: e.target.value },
                            }))
                          }
                          className="h-12 rounded-2xl bg-white dark:bg-slate-950"
                          disabled={actingId === o.id}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                          <Clock className="size-4 text-orange-500" /> Minutes
                        </label>
                        <Input
                          value={counterDraft[o.id]?.mins ?? ""}
                          onChange={(e) =>
                            setCounterDraft((prev) => ({
                              ...prev,
                              [o.id]: { ...(prev[o.id] ?? { start: "", mins: "", rate: String(o.proposed_hourly_rate), currency: o.currency }), mins: e.target.value },
                            }))
                          }
                          className="h-12 rounded-2xl bg-white dark:bg-slate-950"
                          disabled={actingId === o.id}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                          <BadgeDollarSign className="size-4 text-emerald-600" /> Rate
                        </label>
                        <Input
                          value={counterDraft[o.id]?.rate ?? ""}
                          onChange={(e) =>
                            setCounterDraft((prev) => ({
                              ...prev,
                              [o.id]: { ...(prev[o.id] ?? { start: "", mins: "60", rate: "", currency: o.currency }), rate: e.target.value },
                            }))
                          }
                          className="h-12 rounded-2xl bg-white dark:bg-slate-950"
                          disabled={actingId === o.id}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                      onClick={() => rejectOffer(o.id)}
                      variant="outline"
                      className="h-12 px-5 rounded-2xl font-black text-rose-600 border-rose-200 hover:bg-rose-50"
                      disabled={actingId === o.id}
                    >
                      <X className="size-4" /> Reject
                    </Button>
                    <Button
                      onClick={() => counterOffer(o.id)}
                      variant="outline"
                      className="h-12 px-5 rounded-2xl font-black"
                      disabled={actingId === o.id}
                    >
                      <ArrowUpRight className="size-4" /> Counter
                    </Button>
                    <Button
                      onClick={() => acceptOffer(o.id)}
                      className="h-12 px-5 rounded-2xl bg-primary text-white font-black"
                      disabled={actingId === o.id}
                    >
                      <Check className="size-4" /> Accept
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

