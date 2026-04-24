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
  Globe,
  Zap,
  Wrench,
  Truck,
  Droplets
} from "lucide-react"
import { useEffect, useMemo, useState, Suspense } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useStore } from "@/store/useStore"
import { detectLocation, sortExpertsByRelevance, UserLocation } from "@/lib/location"

function ExpertsContent() {
  type ExpertCard = {
    id: string
    name: string
    headline?: string | null
    rating: number | null
    reviews: number
    rate: number | null
    image?: string | null
    isVerified: boolean
    category: string
    specialty?: string | null
    isOnline: boolean
    colorClass: string
    locationLabel?: string | null
    tags?: string[]
  }

  const [experts, setExperts] = useState<ExpertCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeExperts, setActiveExperts] = useState<ExpertCard[]>([])
  const { user } = useStore()
  const [userLoc, setUserLoc] = useState<UserLocation>({ city: null, country: null })
  
  useEffect(() => {
    async function getLoc() {
      const loc = await detectLocation(user?.id)
      setUserLoc(loc)
    }
    getLoc()
  }, [user])
  
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const categories = useMemo(() => ["All", "Academic", "Legal", "Wellness", "Mental Health", "Plumbing", "Electrical", "Logistics", "Mechanics"], [])

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
        setSelectedCategory(categoryParam)
    }
  }, [categoryParam, categories])

  useEffect(() => {
    type ProfileEmbed = { full_name?: string | null; city?: string | null; country?: string | null } | null
    type TeacherRow = {
      id: string
      user_id: string
      category?: string | null
      specialty?: string | null
      headline?: string | null
      hourly_rate?: number | null
      rating_avg?: number | null
      review_count?: number | null
      is_online?: boolean | null
      is_verified?: boolean | null
      profile_pic_url?: string | null
      academic_subjects?: unknown
      legal_practice_areas?: unknown
      mental_modalities?: unknown
      wellness_specialties?: unknown
      is_public?: boolean | null
      profiles?: ProfileEmbed
    }

    const colors: Record<string, string> = {
      Academic: "accent-blue",
      Legal: "accent-orange",
      Wellness: "accent-teal",
      "Mental Health": "accent-pink",
      Plumbing: "accent-sky",
      Electrical: "accent-amber",
      Logistics: "accent-emerald",
      Mechanics: "accent-slate",
    }

    function mapTeacherToCard(t: TeacherRow, profile: ProfileEmbed | undefined): ExpertCard {
      const p = profile ?? t.profiles
      const locationLabel = [p?.city, p?.country].filter(Boolean).join(", ") || null
      return {
        id: t.id,
        name: p?.full_name || "Unnamed Expert",
        headline: t.headline ?? null,
        rating: t.rating_avg ?? null,
        reviews: t.review_count ?? 0,
        rate: t.hourly_rate ?? null,
        image: t.profile_pic_url,
        isVerified: Boolean(t.is_verified),
        category: t.category || "Academic",
        specialty: t.specialty,
        isOnline: Boolean(t.is_online),
        colorClass: colors[t.category || "Academic"] || "accent-blue",
        locationLabel,
        tags: (
          t.category === "Legal"
            ? (Array.isArray(t.legal_practice_areas) ? t.legal_practice_areas : [])
            : t.category === "Mental Health"
              ? (Array.isArray(t.mental_modalities) ? t.mental_modalities : [])
              : t.category === "Wellness"
                ? (Array.isArray(t.wellness_specialties) ? t.wellness_specialties : [])
                : Array.isArray(t.academic_subjects)
                  ? t.academic_subjects
                  : []
        )
          .filter(Boolean)
          .slice(0, 3) as string[],
      }
    }

    async function loadProfilesByUserIds(userIds: string[]): Promise<Map<string, ProfileEmbed>> {
      const profileById = new Map<string, ProfileEmbed>()
      const unique = [...new Set(userIds)].filter(Boolean)
      const CHUNK = 120
      for (let i = 0; i < unique.length; i += CHUNK) {
        const chunk = unique.slice(i, i + CHUNK)
        const { data: profs, error: pErr } = await supabase
          .from("profiles")
          .select("id, full_name, city, country")
          .in("id", chunk)
        if (pErr) throw pErr
        for (const row of profs ?? []) {
          profileById.set(row.id as string, {
            full_name: row.full_name as string | null,
            city: row.city as string | null,
            country: row.country as string | null,
          })
        }
      }
      return profileById
    }

    /** Avoid PostgREST resource-embed (`profiles!fk`) — it breaks if FK name / cache differs. */
    async function fetchExperts() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const fullCols =
          "id, user_id, category, specialty, headline, hourly_rate, rating_avg, review_count, is_online, is_verified, profile_pic_url, academic_subjects, legal_practice_areas, mental_modalities, wellness_specialties, is_public"

        const slimCols =
          "id, user_id, category, specialty, hourly_rate, rating_avg, review_count, is_verified, profile_pic_url, academic_subjects, legal_practice_areas, mental_modalities, wellness_specialties, is_public"

        const microCols = "id, user_id, category, hourly_rate, profile_pic_url, is_public"

        let teachers: TeacherRow[] = []
        let lastErr: { message?: string } | null = null
        let hasFetchedAny = false

        for (const cols of [fullCols, slimCols, microCols]) {
          // Attempt 1: Targeted public filter
          const { data: pubData, error: pubErr } = await supabase
            .from("teachers")
            .select(cols)
            .eq("is_public", true)

          if (!pubErr && pubData) {
            teachers = pubData as unknown as TeacherRow[]
            hasFetchedAny = true
            break
          }

          // Attempt 2: Fallback to all then filter (defense against specific PostgREST filter failures)
          const { data: allData, error: allErr } = await supabase
            .from("teachers")
            .select(cols)
          
          if (!allErr && allData) {
            const filtered = (allData as unknown as TeacherRow[]).filter((t) => t.is_public === true)
            teachers = filtered
            hasFetchedAny = true
            break
          }

          lastErr = pubErr || allErr || { message: "No public experts found." }
        }

        if (!hasFetchedAny && lastErr) {
          throw new Error(lastErr.message || "Connection error.")
        }

        const profileById = await loadProfilesByUserIds(teachers.map((t) => t.user_id))
        const rows = teachers.map((t) => ({
          ...t,
          profiles: profileById.get(t.user_id) ?? null,
        }))

        setExperts(rows.map((t) => mapTeacherToCard(t, t.profiles ?? undefined)))
      } catch (err: unknown) {
        console.error(err)
        const message =
          err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string"
            ? (err as { message: string }).message
            : "Failed to load experts."
        setLoadError(message)
        toast.error("Could not load the expert directory. Please refresh.")
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
            (exp.headline || "").toLowerCase().includes(term) ||
            (exp.specialty || "").toLowerCase().includes(term) ||
            (exp.locationLabel || "").toLowerCase().includes(term) ||
            (exp.tags || []).some((t) => t.toLowerCase().includes(term))
        )
    }

    // Sort by location relevance
    filtered = sortExpertsByRelevance(filtered, userLoc)

    setActiveExperts(filtered)
  }, [searchTerm, selectedCategory, experts, userLoc])

  const getCategoryIcon = (category: string) => {
      switch(category) {
          case 'Academic': return <GraduationCap className="size-5" />
          case 'Legal': return <Scale className="size-5" />
          case 'Wellness': return <Heart className="size-5" />
          case 'Mental Health': return <Brain className="size-5" />
          case 'Plumbing': return <Wrench className="size-5" />
          case 'Electrical': return <Zap className="size-5" />
          case 'Logistics': return <Truck className="size-5" />
          case 'Mechanics': return <Wrench className="size-5" />
          default: return <Star className="size-5" />
      }
  }

  return (
    <div className="container mx-auto px-6 pt-48 pb-32 grow">
        {loadError && !isLoading && (
          <div
            role="alert"
            className="mb-10 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-foreground"
          >
            <p className="font-semibold mb-1">We couldn&apos;t load the directory</p>
            <p className="text-muted-foreground mb-3">{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm font-bold text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-slate-200/50 dark:border-white/5">
            <Globe className="size-3 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-200">
                Verified Global Expert Directory
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[0.85]">
            World-class talent, <br /> <span className="text-primary">vetted for you.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-medium">
            Book 1:1 sessions with industry leaders in law, medicine, and technology. 
            Experience the standard of excellence.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="sticky top-32 z-40 mb-20">
            <div className="glass p-3 rounded-[2.5rem] border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-emerald-950/5 flex flex-col md:flex-row gap-4">
                <div className="flex flex-wrap gap-2 p-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                selectedCategory === cat 
                                    ? "bg-slate-950 text-white shadow-xl translate-y-[-2px]" 
                                    : "text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
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
                        aria-label="Search expert directory"
                        className="w-full h-14 pl-14 pr-8 rounded-2xl border-0 bg-transparent focus:ring-0 font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
                        <div className="premium-card p-10 flex flex-col min-h-[580px] hover:-translate-y-4 hover:shadow-[0_40px_100px_-15px_rgba(16,185,129,0.15)] transition-all duration-700">
                            <div className="flex justify-between items-start mb-10">
                                <div className={`size-20 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl border border-white/50 dark:border-white/5 ${expert.colorClass}`}>
                                    {expert.image ? (
                                        <Image src={expert.image} alt={expert.name} fill className="object-cover rounded-[2rem]" sizes="80px" />
                                    ) : (
                                        expert.name.charAt(0)
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    {typeof expert.rate === "number" && expert.rate > 0 ? (
                                      <div className="bg-slate-950 dark:bg-primary text-white px-6 py-3 rounded-2xl text-lg font-black shadow-2xl shadow-emerald-500/20">
                                          ${expert.rate}<span className="text-[10px] opacity-70 ml-1">/hr</span>
                                      </div>
                                    ) : (
                                      <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                        Rate not set
                                      </div>
                                    )}
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
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 truncate">{expert.category}</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter mb-2 group-hover:text-primary transition-colors duration-500 line-clamp-1">{expert.name}</h3>
                                <div className="space-y-1 mb-10">
                                    {expert.headline ? (
                                      <p className="text-slate-600 dark:text-slate-300 font-bold text-sm italic group-hover:not-italic transition-all duration-500 line-clamp-2 min-h-[40px]">
                                          {expert.headline}
                                      </p>
                                    ) : (
                                      <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                                          Profile headline not set
                                      </p>
                                    )}
                                    {expert.specialty && (
                                        <p className="inline-block mt-4 px-3 py-1 bg-emerald-500/5 dark:bg-emerald-500/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {expert.specialty}
                                        </p>
                                    )}
                                    {expert.tags && expert.tags.length > 0 ? (
                                      <div className="mt-4 flex flex-wrap gap-2">
                                        {expert.tags.map((t) => (
                                          <span
                                            key={t}
                                            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700"
                                          >
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                    ) : null}
                                </div>
                                
                                <div className="flex items-center justify-between py-6 border-t border-slate-100 dark:border-white/5 text-xs font-black uppercase tracking-widest text-slate-400 mb-8">
                                    <div className="flex items-center gap-2">
                                        <Star className="size-4 text-orange-400 fill-orange-400" />
                                        {typeof expert.rating === "number" && expert.reviews > 0 ? (
                                          <>
                                            <span className="text-slate-950 dark:text-white">{expert.rating.toFixed(1)}</span>
                                            <span className="opacity-50">({expert.reviews})</span>
                                          </>
                                        ) : (
                                          <span className="text-slate-600 dark:text-slate-300">New</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="size-4" />
                                        <span className="text-slate-600 dark:text-slate-300">{expert.locationLabel || "Remote"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Link href={`/book/${expert.id}`}>
                                  <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-[12px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40">
                                      Book
                                      <ExternalLink className="size-5 ml-2 opacity-50" />
                                  </Button>
                              </Link>
                              <Link href={`/dashboard/student/offers?expertId=${encodeURIComponent(expert.id)}`}>
                                  <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all">
                                      Send Offer
                                  </Button>
                              </Link>
                            </div>
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
    <main className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin size-20 text-primary/20" /></div>}>
        <ExpertsContent />
      </Suspense>
      <Footer />
    </main>
  )
}
