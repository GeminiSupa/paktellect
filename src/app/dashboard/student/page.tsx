"use client"

import { useEffect, useMemo, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { 
  Loader2, 
  Calendar, 
  Video, 
  ArrowRight, 
  Star,
  GraduationCap,
  Scale,
  Heart,
  Brain,
  Zap,
  ChevronRight,
  Layout,
  ArrowUpRight,
  X,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function StudentDashboard() {
  const { user } = useStore()
  const router = useRouter()
  type Booking = {
    id: string
    topic: string
    booking_date: string
    booking_time: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | string
    teachers?: {
      category?: string | null
      user_id?: string | null
      profiles?: {
        full_name?: string | null
        avatar_url?: string | null
      } | null
    } | null
  }

  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reviewedBookingIds, setReviewedBookingIds] = useState<Set<string>>(new Set())

  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null)
  const [reviewExpertId, setReviewExpertId] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState<string>("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const bookingById = useMemo(() => {
    const map = new Map<string, Booking>()
    bookings.forEach((b) => map.set(b.id, b))
    return map
  }, [bookings])

  const confirmedBookingCount = useMemo(
    () => bookings.filter((b) => b.status === "confirmed").length,
    [bookings]
  )

  useEffect(() => {
    const userId = user?.id
    if (!userId) {
        router.push("/login")
        return
    }

    async function loadBookings(currentUserId: string) {
      setIsLoading(true)
      try {
        const { data } = await supabase
          .from("bookings")
          .select("*, teachers!bookings_expert_id_fkey(category, user_id, profiles!teachers_user_id_fkey(full_name, avatar_url))")
          .eq("user_id", currentUserId)
          .order("booking_date", { ascending: false })

        setBookings(data || [])

        const { data: r, error: rErr } = await supabase
          .from("reviews")
          .select("booking_id")
          .eq("student_id", currentUserId)
        if (!rErr && r) {
          setReviewedBookingIds(new Set(r.map((x) => x.booking_id as string)))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings(userId)
  }, [user, router])

  const openReview = (bookingId: string, expertUserId?: string | null) => {
    if (!expertUserId) {
      toast.error("Couldn't find expert profile for this booking.")
      return
    }
    const booking = bookingById.get(bookingId)
    if (!booking || booking.status !== "completed") {
      toast.error("You can only review after the service is completed.")
      return
    }
    if (reviewedBookingIds.has(bookingId)) {
      toast.info("You already reviewed this booking.")
      return
    }
    setReviewBookingId(bookingId)
    setReviewExpertId(expertUserId)
    setReviewRating(5)
    setReviewComment("")
    setIsReviewOpen(true)
  }

  const submitReview = async () => {
    if (!user || !reviewBookingId || !reviewExpertId) return
    const booking = bookingById.get(reviewBookingId)
    if (!booking || booking.status !== "completed") {
      toast.error("You can only review after the service is completed.")
      return
    }
    if (reviewedBookingIds.has(reviewBookingId)) {
      toast.info("You already reviewed this booking.")
      return
    }
    if (!Number.isFinite(reviewRating) || reviewRating < 1 || reviewRating > 5) {
      toast.error("Select a rating from 1 to 5.")
      return
    }
    setIsSubmittingReview(true)
    try {
      const { error } = await supabase.from("reviews").insert({
        booking_id: reviewBookingId,
        expert_id: reviewExpertId,
        student_id: user.id,
        rating: reviewRating,
        comment: reviewComment.trim() ? reviewComment.trim() : null,
      })
      if (error) throw error
      setReviewedBookingIds((prev) => new Set([...prev, reviewBookingId]))
      toast.success("Thank you for your review!")
      setIsReviewOpen(false)
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to submit review"
      toast.error(message)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const getCategoryTheme = (category?: string | null) => {
    switch(category) {
        case 'Academic': return { icon: <GraduationCap className="size-6 text-primary" />, color: 'bg-emerald-500/10 border-emerald-500/20' }
        case 'Legal': return { icon: <Scale className="size-6 text-orange-500" />, color: 'bg-orange-500/10 border-orange-500/20' }
        case 'Wellness': return { icon: <Heart className="size-6 text-teal-500" />, color: 'bg-teal-500/10 border-teal-500/20' }
        case 'Mental Health': return { icon: <Brain className="size-6 text-rose-500" />, color: 'bg-rose-500/10 border-rose-500/20' }
        default: return { icon: <Star className="size-6 text-slate-400" />, color: 'bg-slate-500/10 border-slate-500/20' }
    }
  }

  return (
    <div className="space-y-12 pb-20">
      {isReviewOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => (isSubmittingReview ? null : setIsReviewOpen(false))}
          />
          <div className="absolute inset-x-0 top-24 mx-auto w-[92%] max-w-lg">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Review</p>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Rate your session</h3>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">Only verified bookings can be reviewed.</p>
                </div>
                <button
                  className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50"
                  onClick={() => setIsReviewOpen(false)}
                  disabled={isSubmittingReview}
                  aria-label="Close review dialog"
                >
                  <X className="size-5 text-slate-500" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewRating(n)}
                        className={`size-12 rounded-2xl border transition-all flex items-center justify-center ${
                          reviewRating >= n
                            ? "bg-orange-500/10 border-orange-500/20 text-orange-600"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400"
                        }`}
                        aria-label={`Set rating ${n}`}
                      >
                        <Star className={`size-5 ${reviewRating >= n ? "fill-orange-500 text-orange-500" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Comment (optional)</p>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full min-h-[120px] rounded-[1.6rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Share what went well and what could be improved…"
                    disabled={isSubmittingReview}
                  />
                </div>
              </div>

              <div className="p-8 pt-0 flex gap-3">
                <Button
                  variant="outline"
                  className="h-14 px-6 rounded-2xl border-slate-200 font-black"
                  onClick={() => setIsReviewOpen(false)}
                  disabled={isSubmittingReview}
                >
                  Cancel
                </Button>
                <Button
                  className="h-14 px-6 rounded-2xl bg-primary text-white font-black grow"
                  onClick={submitReview}
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? <Loader2 className="size-4 animate-spin" /> : null}
                  Submit review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dynamic Member Header — colors are fixed for this dark photo surface; do not use text-primary (theme primary is dark in light mode). */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative min-h-[min(100vw,520px)] sm:min-h-[440px] md:h-[480px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-950 flex shadow-2xl shadow-emerald-900/40 isolate"
      >
        <div className="absolute inset-0 z-0">
            {/* Strong scrim so copy stays readable if the image is bright or fails to load */}
            <div
              className="absolute inset-0 z-10 bg-linear-to-br from-slate-950 via-slate-950/92 to-slate-950/75"
              aria-hidden
            />
            <div className="absolute inset-0 z-11 bg-linear-to-t from-black/55 via-transparent to-black/25 pointer-events-none" aria-hidden />
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover object-center opacity-55 saturate-[0.85]"
              sizes="(max-width: 768px) 100vw, min(896px, 70vw)"
              priority
            />
        </div>

        <div className="relative z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 py-12 md:py-0 max-w-4xl text-white w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 sm:mb-8 self-start shadow-lg shadow-black/20">
             <Zap className="size-3.5 text-teal-300 fill-teal-300 shrink-0" aria-hidden />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/95">Member</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 md:mb-6 tracking-tighter leading-[1.05] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
            Scale your{" "}
            <span className="text-teal-300 [text-shadow:0_1px_18px_rgba(20,184,166,0.35)]">ambitions,</span>
            <br className="sm:hidden" />
            <span className="sm:ml-1"> {user?.user_metadata?.full_name?.split(' ')[0] || "Member"}.</span>
          </h1>
          <p className="text-white/90 mb-10 md:mb-12 text-lg sm:text-xl max-w-xl font-medium leading-relaxed">
            You have {confirmedBookingCount} elite{" "}
            {confirmedBookingCount === 1 ? "professional" : "professionals"} awaiting your next session.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/experts">
                <Button className="h-14 sm:h-16 px-8 sm:px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg shadow-2xl shadow-black/30 border border-white/10 transition-all hover:scale-[1.02]">
                    Explore New Services
                    <ChevronRight className="size-5 sm:size-6 ml-2" />
                </Button>
            </Link>
            <Link href="/dashboard/student/jobs">
                <Button variant="outline" className="h-14 sm:h-16 px-8 sm:px-10 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-black text-base sm:text-lg backdrop-blur-xl transition-all">
                    Active Mandates
                    <Briefcase className="size-5 ml-2" />
                </Button>
            </Link>
          </div>
        </div>
        
        {/* Removed hardcoded “capital/network” demo widgets; we only show real user data. */}
      </motion.div>

      {/* Wellness & Service Timeline */}
      <div>
        <div className="flex items-center justify-between mb-12">
           <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">Your Active Engagement</h2>
           <Link href="/experts" className="flex items-center gap-2 group">
              <span className="text-sm font-black uppercase tracking-widest text-primary group-hover:underline">Browse Market</span>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
           </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="size-12 animate-spin text-primary/50" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing secure data...</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-40 premium-card bg-white dark:bg-slate-900 border-none shadow-2xl"
          >
            <div className="size-24 rounded-[2rem] bg-slate-100 dark:bg-slate-950 mx-auto flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-800">
                <Layout className="size-10 text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">No active records</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium mb-12 italic">You haven&apos;t initiated any professional sessions yet. Our network of vetted experts is ready when you are.</p>
            <Link href="/experts">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/30">Connect with an Expert</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            <AnimatePresence mode='popLayout'>
                {bookings.map((booking, idx) => {
                    const theme = getCategoryTheme(booking.teachers?.category)
                    return (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                key={booking.id} 
                                className="premium-card p-6 sm:p-10 hover:-translate-y-2 duration-500 group mx-4 sm:mx-0"
                            >
                            <div className="flex justify-between items-start mb-10">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-[1.8rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-slate-300 border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500">
                                    {booking.teachers?.profiles?.full_name?.charAt(0) || 'E'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-lg ${theme.color} border`}>
                                            {theme.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{booking.teachers?.category}</span>
                                    </div>
                                    <h3 className="font-black text-2xl text-slate-950 dark:text-white tracking-tighter line-clamp-1 group-hover:text-primary transition-colors duration-500">{booking.topic}</h3>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Expert: {booking.teachers?.profiles?.full_name || 'Verified Pro'}</p>
                                </div>
                            </div>
                            <span className={`px-5 py-2 text-[10px] font-black rounded-full border uppercase tracking-widest shadow-lg shadow-current/5 ${
                                booking.status === 'completed' ? 'bg-emerald-50 text-primary border-emerald-100' :
                                booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>
                                {booking.status}
                            </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 group-hover:border-primary/20 transition-colors">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sync Schedule</p>
                                <div className="flex items-center text-sm font-black gap-3 text-slate-950 dark:text-white">
                                <Calendar className="size-5 text-primary" />
                                <span>{booking.booking_date}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 group-hover:border-purple-500/20 transition-colors">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Channel</p>
                                <div className="flex items-center text-sm font-black gap-3 text-slate-950 dark:text-white">
                                <Video className="size-5 text-purple-500" />
                                <span className="truncate">Encrypted Video</span>
                                </div>
                            </div>
                            </div>
                            
                            <div className="flex gap-4">
                            {booking.status === 'completed' ? (
                                <Button
                                  onClick={() => openReview(booking.id, booking.teachers?.user_id)}
                                  disabled={reviewedBookingIds.has(booking.id)}
                                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-16 rounded-[1.5rem] font-black shadow-xl shadow-orange-500/20 disabled:opacity-60"
                                >
                                    {reviewedBookingIds.has(booking.id) ? "Reviewed" : "Leave Review"}
                                </Button>
                            ) : (
                                <Link href={`/dashboard/messages/${booking.id}`} className="flex-1">
                                <Button className="w-full bg-slate-950 hover:bg-slate-900 text-white h-16 rounded-[1.5rem] font-black shadow-2xl transition-all group-hover:shadow-emerald-500/10">
                                    Internal Secure Chat
                                </Button>
                                </Link>
                            )}
                            <Button variant="outline" className="size-[64px] rounded-[1.5rem] border-slate-200 dark:border-slate-800 flex items-center justify-center p-0 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all shrink-0">
                                <ArrowUpRight className="size-6 text-slate-400 transition-transform group-hover:rotate-45" />
                            </Button>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
