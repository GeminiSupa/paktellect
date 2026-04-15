"use client"

import { useEffect, useState } from "react"
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
  ArrowUpRight
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

  useEffect(() => {
    if (!user) {
        router.push("/login")
        return
    }

    async function loadBookings() {
      setIsLoading(true)
      try {
        const { data } = await supabase
          .from("bookings")
          .select("*, teachers!bookings_expert_id_fkey(category, user_id, profiles!teachers_user_id_fkey(full_name, avatar_url))")
          .eq("user_id", user?.id)
          .order("booking_date", { ascending: false })

        setBookings(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [user, router])

  const handleReview = async (bookingId: string, expertUserId?: string | null) => {
    if (!expertUserId) {
      toast.error("Couldn't find expert profile for this booking.")
      return
    }
    const rating = prompt("Rate your experience (1-5):", "5")
    const comment = prompt("Leave a short comment:")
    
    if (!rating || isNaN(Number(rating))) return

    try {
      const { error } = await supabase.from('reviews').insert([{
        booking_id: bookingId,
        expert_id: expertUserId,
        student_id: user?.id,
        rating: Number(rating),
        comment: comment
      }])

      if (error) throw error
      toast.success("Thank you for your review!")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit review"
      toast.error(message)
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
      
      {/* Dynamic Member Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-[480px] rounded-[3rem] overflow-hidden bg-slate-950 flex shadow-2xl shadow-emerald-900/40"
      >
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
              alt="Architecture"
              fill
              className="object-cover opacity-60"
              sizes="100vw"
              priority
            />
        </div>

        <div className="relative z-20 flex flex-col justify-center px-10 md:px-20 max-w-4xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 mb-8 self-start">
             <Zap className="size-3 text-primary fill-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Premium Member</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            Scale your <br /> <span className="text-primary">ambitions,</span> {user?.user_metadata?.full_name?.split(' ')[0] || 'Member'}.
          </h1>
          <p className="text-indigo-100/70 mb-12 text-xl max-w-lg font-medium">You have {bookings.filter(b => b.status === 'confirmed').length} elite professionals awaiting your next session.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/experts">
                <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-lg shadow-2xl shadow-emerald-500/20 border-t border-white/20 transition-all hover:scale-105">
                    Explore New Services
                    <ChevronRight className="size-6 ml-2" />
                </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 right-10 z-20 hidden lg:flex gap-4">
             <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Managed Capital</p>
                <p className="text-3xl font-black">$42,500.00</p>
             </div>
             <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Professional Network</p>
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="size-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">EX</div>
                    ))}
                </div>
             </div>
        </div>
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
                            className="premium-card p-10 hover:-translate-y-2 duration-500 group"
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
                                <Button onClick={() => handleReview(booking.id, booking.teachers?.user_id)} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-16 rounded-[1.5rem] font-black shadow-xl shadow-orange-500/20">
                                    Finalize: Leave Review
                                </Button>
                            ) : (
                                <Link href={`/dashboard/messages/${booking.id}`} className="flex-1">
                                <Button className="w-full bg-slate-950 hover:bg-slate-900 text-white h-16 rounded-[1.5rem] font-black shadow-2xl transition-all group-hover:shadow-emerald-500/10">
                                    Internal Secure Chat
                                </Button>
                                </Link>
                            )}
                            <Button variant="outline" className="size-[64px] rounded-[1.5rem] border-slate-200 dark:border-slate-800 flex items-center justify-center p-0 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all flex-shrink-0">
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
