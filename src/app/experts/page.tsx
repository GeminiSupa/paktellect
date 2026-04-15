"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { 
  Search, 
  Loader2, 
  Star, 
  ShieldCheck, 
  ExternalLink,
  GraduationCap,
  Scale,
  Heart,
  Brain,
  Globe
} from "lucide-react"
import { useEffect, useMemo, useState, Suspense } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

function ExpertsContent() {
  type ExpertCard = {
    id: string
    name: string
    role: string
    company: string
    rating: number
    reviews: number
    rate: number
    image?: string | null
    isVerified: boolean
    category: string
    specialty?: string | null
    isOnline: boolean
    colorClass: string
  }

  const [experts, setExperts] = useState<ExpertCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeExperts, setActiveExperts] = useState<ExpertCard[]>([])
  
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const categories = useMemo(() => ["All", "Academic", "Legal", "Wellness", "Mental Health"], [])

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
        setSelectedCategory(categoryParam)
    }
  }, [categoryParam, categories])

  useEffect(() => {
    async function fetchExperts() {
      setIsLoading(true)
      try {
        const { data: teachers, error: tErr } = await supabase.from('teachers').select('*, is_online')
        if (tErr) throw tErr

        if (teachers && teachers.length > 0) {
           const userIds = teachers.map(t => t.user_id)
           const { data: profiles, error: pErr } = await supabase
             .from('profiles')
             .select('id, full_name')
             .in('id', userIds)
             
           if (pErr) throw pErr

           const combined = teachers.map((t) => {
               const profile = profiles?.find(p => p.id === t.user_id)
               const colors: Record<string, string> = {
                 'Academic': 'accent-blue',
                 'Legal': 'accent-orange',
                 'Wellness': 'accent-teal',
                 'Mental Health': 'accent-pink'
               }
               return {
                   id: t.id,
                   name: profile?.full_name || "Anonymous Expert",
                   role: t.qualifications?.split(',')[0] || "Professional Expert",
                   company: t.qualifications?.split(',')[1]?.trim() || "Independent Practice",
                   rating: t.rating_avg || 5.0,
                   reviews: t.review_count || 0,
                   rate: t.hourly_rate || 50,
                   image: t.profile_pic_url,
                   isVerified: t.is_verified || true,
                   category: t.category || 'Academic',
                   specialty: t.specialty,
                   isOnline: t.is_online || false,
                   colorClass: colors[t.category] || 'accent-blue'
               }
           })
           setExperts(combined)
        }
      } catch (err: unknown) {
        console.error(err)
        toast.error("Failed to load experts.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchExperts()
  }, [])

  useEffect(() => {
    let filtered = experts

    if (selectedCategory !== "All") {
        filtered = filtered.filter(exp => exp.category === selectedCategory)
    }

    if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(exp => 
            exp.name.toLowerCase().includes(term) || 
            exp.role.toLowerCase().includes(term) || 
            exp.company.toLowerCase().includes(term) ||
            exp.specialty?.toLowerCase().includes(term)
        )
    }

    setActiveExperts(filtered)
  }, [searchTerm, selectedCategory, experts])

  const getCategoryIcon = (category: string) => {
      switch(category) {
          case 'Academic': return <GraduationCap className="size-5" />
          case 'Legal': return <Scale className="size-5" />
          case 'Wellness': return <Heart className="size-5" />
          case 'Mental Health': return <Brain className="size-5" />
          default: return <Star className="size-5" />
      }
  }

  return (
    <div className="container mx-auto px-6 pt-48 pb-32 grow">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-slate-200/50 dark:border-white/5">
            <Globe className="size-3 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Verified Global Expert Directory
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-slate-950 dark:text-white leading-[0.85]">
            World-class talent, <br /> <span className="text-primary">vetted for you.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
            Book 1:1 sessions with industry leaders in law, medicine, and technology. 
            Experience the standard of excellence.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="sticky top-28 z-40 mb-20">
            <div className="glass p-3 rounded-[2.5rem] border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-emerald-950/5 flex flex-col md:flex-row gap-4">
                <div className="flex flex-wrap gap-2 p-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                selectedCategory === cat 
                                    ? "bg-slate-950 text-white shadow-xl translate-y-[-2px]" 
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block self-center mx-2" />
                <div className="relative grow">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                    <input 
                        type="text" 
                        placeholder="Search by legal specialty, medical domain, or academic topic..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 pl-14 pr-8 rounded-2xl border-0 bg-transparent focus:ring-0 font-bold text-sm text-slate-900 dark:text-white"
                    />
                </div>
                <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/20">
                    {activeExperts.length} Available
                </Button>
            </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-40 min-h-[40vh]"><Loader2 className="animate-spin size-12 text-primary" /></div>
        ) : activeExperts.length === 0 ? (
          <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
            <div className="size-24 rounded-full bg-slate-50 dark:bg-slate-950 mx-auto flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800">
              <Search className="size-10 text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">No experts found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">We couldn&apos;t find a match for your search. Try broadening your criteria or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode='popLayout'>
                {activeExperts.map((expert, idx) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        key={expert.id} 
                        className="group relative h-full flex flex-col"
                    >
                        <div className="premium-card p-10 flex flex-col h-full hover:-translate-y-4 duration-700">
                            <div className="flex justify-between items-start mb-10">
                                <div className={`size-20 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl border border-white/50 dark:border-white/5 ${expert.colorClass}`}>
                                    {expert.image ? (
                                        <Image src={expert.image} alt={expert.name} fill className="object-cover rounded-[2rem]" sizes="80px" />
                                    ) : (
                                        expert.name.charAt(0)
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="bg-slate-950 dark:bg-primary text-white px-6 py-3 rounded-2xl text-lg font-black shadow-2xl shadow-emerald-500/20">
                                        ${expert.rate}<span className="text-[10px] opacity-70 ml-1">/hr</span>
                                    </div>
                                    {expert.isVerified && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest shadow-sm shadow-emerald-500/10">
                                            <ShieldCheck className="size-3" />
                                            Elite Vetted
                                        </div>
                                    )}
                                    {expert.isOnline && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-700">
                                            <div className="size-1.5 bg-primary rounded-full animate-pulse" />
                                            Active Now
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grow">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 rounded-lg glass border border-slate-100 dark:border-white/5 opacity-60">
                                        {getCategoryIcon(expert.category)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{expert.category}</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter mb-2 group-hover:text-primary transition-colors duration-500">{expert.name}</h3>
                                <div className="space-y-1 mb-10">
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic group-hover:not-italic transition-all duration-500">
                                        {expert.role}
                                    </p>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{expert.company}</p>
                                    {expert.specialty && (
                                        <p className="inline-block mt-4 px-3 py-1 bg-emerald-500/5 dark:bg-emerald-500/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {expert.specialty}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between py-6 border-t border-slate-100 dark:border-white/5 text-xs font-black uppercase tracking-widest text-slate-400 mb-8">
                                    <div className="flex items-center gap-2">
                                        <Star className="size-4 text-orange-400 fill-orange-400" />
                                        <span className="text-slate-950 dark:text-white">{expert.rating}</span>
                                        <span className="opacity-50">({expert.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="size-4" />
                                        <span>London, UK</span>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/book/${expert.id}`}>
                                <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-lg transition-all group-hover:scale-[1.02] shadow-xl shadow-emerald-500/20 group-hover:shadow-emerald-500/40">
                                    Initiate Session
                                    <ExternalLink className="size-5 ml-3 opacity-50" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
    </div>
  )
}

export default function ExpertsDirectory() {
  return (
    <main className="min-h-screen bg-[#fdfdfe] dark:bg-card-foreground flex flex-col font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin size-20 text-primary/20" /></div>}>
        <ExpertsContent />
      </Suspense>
      <Footer />
    </main>
  )
}
