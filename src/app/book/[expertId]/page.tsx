"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Loader2, Calendar, Video, Clock, ShieldCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

const bookingSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  videoLink: z.string().url("Please enter a valid Zoom or Google Meet URL"),
  topic: z.string().min(5, "Topic must be at least 5 characters"),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [expert, setExpert] = useState<{
    id: string
    user_id: string
    name: string
    role: string
    company: string
    rate: number
  } | null>(null)
  const params = useParams()
  const router = useRouter()
  const expertId = params.expertId

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  })

  // Fetch real expert from db
  useEffect(() => {
    async function loadExpert() {
      if (!expertId) return
      
      try {
        const { data: teacher, error: tErr } = await supabase
            .from('teachers')
            .select('id, user_id, qualifications, hourly_rate')
            .eq('id', expertId)
            .single()
            
        if (tErr) throw tErr
        
        if (teacher) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', teacher.user_id)
                .single()
                
            setExpert({
                id: teacher.id,
                user_id: teacher.user_id,
                name: profile?.full_name || "Expert",
                role: teacher.qualifications?.split(',')[0] || "Consultant",
                company: teacher.qualifications?.split(',')[1]?.trim() || "Independent",
                rate: teacher.hourly_rate ?? 0,
            })
        } else {
            toast.error("Expert not found.")
            router.push('/experts')
        }
      } catch (err) {
        console.error(err)
        toast.error("Error loading expert")
        router.push('/experts')
      }
    }
    loadExpert()
  }, [expertId, router])

  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error("Please sign in to book a session")
        router.push("/login")
        return
      }
      if (!expert) {
        toast.error("Expert data not loaded yet. Please try again.")
        return
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([
          { 
            expert_id: expertId,
            user_id: user.id,
            booking_date: data.date,
            booking_time: data.time,
            video_link: data.videoLink,
            topic: data.topic,
            status: 'pending'
          }
        ])
        .select()
        .single()

      if (error) throw error

      if (booking) {
        // Create Escrow Transaction (Simulation)
        await supabase.from('transactions').insert([{
           booking_id: booking.id,
           payer_id: user.id,
           payee_id: expert.user_id,
           amount: expert.rate || 0,
           status: 'held'
        }])
      }

      toast.success("Booking submitted! Funds are held safely in escrow.")
      router.push("/dashboard/student")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!expert) return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]"><Loader2 className="animate-spin text-primary size-10" /></div>

  const rateIsSet = typeof expert.rate === "number" && expert.rate > 0

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sidebar: Expert Summary */}
          <div className="lg:col-span-1">
             <div className="bg-[#0f172a] text-white rounded-[2.5rem] p-8 sticky top-40 shadow-2xl">
                <div className="size-24 rounded-3xl bg-primary flex items-center justify-center text-3xl font-black mb-6 shadow-xl shadow-emerald-500/20">
                    {expert.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">{expert.name}</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">{expert.role}</p>
                
                <div className="space-y-4 pt-6 border-t border-white/10 text-sm">
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400">Hourly Rate</span>
                      {rateIsSet ? (
                        <span className="font-black text-xl text-primary">${expert.rate}/hr</span>
                      ) : (
                        <span className="font-black text-xs text-slate-300 uppercase tracking-widest">Not set</span>
                      )}
                   </div>
                   <div className="flex justify-between items-center text-green-400 bg-green-400/10 p-4 rounded-2xl border border-green-400/20">
                      <span className="text-xs font-black uppercase tracking-widest">Escrow Protected</span>
                      <ShieldCheck className="size-4" />
                   </div>
                </div>
             </div>
          </div>

          {/* Main: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-14 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Schedule your session</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Pick a time and tell us what you&apos;d like to achieve.
                </p>
              </div>

              <div className="premium-card p-10 mb-10">
                <p className="text-slate-900 dark:text-white font-black text-2xl tracking-tight mb-2">
                  Negotiate time and price
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-6">
                  Prefer a different schedule or budget? Send an offer. If the expert accepts, a booking will be created automatically.
                </p>
                <Link href={`/dashboard/student/offers?expertId=${encodeURIComponent(String(expertId))}`}>
                  <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black">
                    Send offer
                  </Button>
                </Link>
              </div>

              {!rateIsSet ? (
                <div className="premium-card p-10 mb-10">
                  <p className="text-slate-900 dark:text-white font-black text-2xl tracking-tight mb-2">
                    This expert hasn&apos;t set a rate yet.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mb-6">
                    Send an offer to negotiate time and price. If accepted, a booking will be created automatically.
                  </p>
                  <Link href={`/dashboard/student/offers?expertId=${encodeURIComponent(String(expertId))}`}>
                    <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black">
                      Send offer
                    </Button>
                  </Link>
                </div>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <fieldset disabled={!rateIsSet || isLoading} className={!rateIsSet ? "opacity-60 pointer-events-none" : ""}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Calendar className="size-4 text-primary" /> Select Date
                        </label>
                        <Input type="date" className="h-16 rounded-2xl border-slate-200 focus:ring-primary bg-slate-50 dark:bg-slate-950" disabled={isLoading} {...register("date")} />
                        {errors.date && <p className="text-xs text-red-500 font-bold">{errors.date.message}</p>}
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Clock className="size-4 text-orange-500" /> Select Time
                        </label>
                        <Input type="time" className="h-16 rounded-2xl border-slate-200 focus:ring-primary bg-slate-50 dark:bg-slate-950" disabled={isLoading} {...register("time")} />
                        {errors.time && <p className="text-xs text-red-500 font-bold">{errors.time.message}</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Video className="size-4 text-purple-500" /> Meeting Link (Zoom/Meet)
                    </label>
                    <Input 
                        placeholder="https://zoom.us/j/..." 
                        className="h-16 rounded-2xl border-slate-200 focus:ring-primary bg-slate-50 dark:bg-slate-950"
                        disabled={isLoading} 
                        {...register("videoLink")} 
                    />
                    {errors.videoLink && <p className="text-xs text-red-500 font-bold">{errors.videoLink.message}</p>}
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Project / Topic Description</label>
                    <textarea 
                        className="flex min-h-[160px] w-full rounded-3xl border border-slate-200 bg-slate-50 dark:bg-slate-950 px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                        placeholder="Describe what you need help with in detail..."
                        disabled={isLoading}
                        {...register("topic")}
                    ></textarea>
                    {errors.topic && <p className="text-xs text-red-500 font-bold">{errors.topic.message}</p>}
                </div>

                <div className="pt-6">
                    <Button type="submit" className="w-full h-20 text-xl font-black bg-primary hover:bg-emerald-700 text-white rounded-[2rem] shadow-2xl shadow-emerald-500/30 transition-all hover:scale-[1.02]" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Confirm and Hold Funds"}
                    </Button>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
                        No money is released until the session ends
                    </p>
                </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
