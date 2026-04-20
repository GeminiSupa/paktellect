"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Loader2, Calendar, MessageSquare, Video, CheckCircle2, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

export default function TeacherBookings() {
  const { user } = useStore()
  type Booking = {
    id: string
    booking_date: string
    booking_time: string
    topic: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | string
  }
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBookings() {
      if (!user) return
      setIsLoading(true)
      try {
        const { data: teacherData } = await supabase.from('teachers').select('id').eq('user_id', user.id).single()
        
        if (teacherData) {
            const { data, error } = await supabase
              .from("bookings")
              .select("*")
              .eq("expert_id", teacherData.id)
              .order("created_at", { ascending: false })

            if (!error) {
                setBookings(data || [])
            }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadBookings()
  }, [user])

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
        const { error } = await supabase
          .from("bookings")
          .update({ status: newStatus })
          .eq("id", id)

        if (error) {
          console.error("Booking update error:", error)
          toast.error(error.message || "Failed to update status")
          return
        }
        
        if (newStatus === 'completed') {
           const { error: txError } = await supabase
             .from("transactions")
             .update({ status: 'released' })
             .eq("booking_id", id)
           if (txError) console.warn("Transaction release error:", txError)
           toast.success("Session complete — funds released to your wallet!")
        } else if (newStatus === 'confirmed') {
           toast.success("Session approved!")
        } else if (newStatus === 'cancelled') {
           toast.info("Session declined.")
        }
        
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch (err: unknown) {
        console.error("Unexpected error:", err)
        const message = err instanceof Error ? err.message : "Failed to update status"
        toast.error(message)
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-emerald-500/5 dark:shadow-none mx-4 sm:mx-0">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 leading-none">My Sessions</h1>
          <p className="text-slate-500 font-medium">Approve requests, manage session links, and track your service lifecycle.</p>
        </div>

        {isLoading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Calendar className="size-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Empty Queue</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">When students book a session, their requests will appear here for your approval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-white/5 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all hover:border-primary/30 group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-1 text-[10px] font-black rounded-lg uppercase tracking-[0.2em] border ${
                      booking.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' :
                      booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                      'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {booking.id.substring(0,8)}</p>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{booking.topic}</h3>
                  
                  <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-2"><Calendar className="size-4 text-primary" /> {booking.booking_date}</div>
                    <div className="flex items-center gap-2"><Clock className="size-4 text-orange-500" /> {booking.booking_time}</div>
                    <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white"><Video className="size-4" /> Secure Link</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 shrink-0">
                  {booking.status === 'pending' && (
                    <>
                      <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="flex items-center justify-center gap-2 h-14 px-8 bg-primary hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                        <CheckCircle2 className="size-4" /> Approve Session
                      </button>
                      <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="flex items-center justify-center gap-2 h-14 px-8 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 transition-all hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-95">
                        <XCircle className="size-4" /> Decline
                      </button>
                    </>
                  )}

                  {booking.status === 'confirmed' && (
                    <button onClick={() => updateBookingStatus(booking.id, 'completed')} className="flex items-center justify-center gap-2 h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                      <CheckCircle2 className="size-4" /> Complete Session
                    </button>
                  )}
                  
                  <Link href={`/dashboard/messages/${booking.id}`}>
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200 gap-2" aria-label="Open messages">
                      <MessageSquare className="size-5" />
                      <span className="hidden sm:inline font-black text-[10px] uppercase tracking-widest">Chat</span>
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
