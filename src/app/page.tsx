"use client"

import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { HowItWorks } from "@/components/HowItWorks"
import { Pricing } from "@/components/Pricing"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ArrowUpRight, Globe, Star, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchProfilesByUserIds } from "@/lib/fetchProfilesByUserIds"
import Image from "next/image"

const FEATURE_CATEGORIES = ["Academic", "Legal", "Wellness", "Mental Health", "Plumbing", "Electrical", "Logistics", "Mechanics"] as const

/** Decorative header only — expert photos belong in the avatar tile, not full-bleed under the marketing hero. */
function featuredExpertHeaderGradient(category: string | null | undefined): string {
  switch (category) {
    case "Academic":
      return "bg-linear-to-br from-indigo-600/55 via-blue-900/45 to-slate-950"
    case "Legal":
      return "bg-linear-to-br from-slate-600/50 via-slate-800/60 to-slate-950"
    case "Wellness":
      return "bg-linear-to-br from-emerald-600/45 via-teal-800/40 to-slate-950"
    case "Mental Health":
      return "bg-linear-to-br from-rose-600/45 via-pink-900/35 to-slate-950"
    case "Plumbing":
      return "bg-linear-to-br from-sky-600/50 via-blue-900/45 to-slate-950"
    case "Electrical":
      return "bg-linear-to-br from-amber-600/50 via-yellow-900/40 to-slate-950"
    case "Logistics":
      return "bg-linear-to-br from-emerald-700/45 via-green-900/45 to-slate-950"
    case "Mechanics":
      return "bg-linear-to-br from-zinc-600/50 via-slate-900/55 to-slate-950"
    default:
      return "bg-linear-to-br from-slate-600/50 to-slate-950"
  }
}

function expertDisplayPhoto(expert: {
  profile_pic_url?: string | null
  profiles?: { avatar_url?: string | null } | null
}): string | null {
  const fromTeacher = expert.profile_pic_url?.trim()
  const fromProfile = expert.profiles?.avatar_url?.trim()
  return fromTeacher || fromProfile || null
}

export default function Home() {
  type FeaturedExpert = {
    id: string
    user_id: string
    category?: string | null
    qualifications?: string | null
    rating_avg?: number | null
    review_count?: number | null
    is_online?: boolean | null
    profile_pic_url?: string | null
    profiles?: { full_name?: string | null; avatar_url?: string | null } | null
  }

  const categories = FEATURE_CATEGORIES

  const [featuredByCategory, setFeaturedByCategory] = useState<Record<string, FeaturedExpert[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function attachDisplayNames(rows: Omit<FeaturedExpert, "profiles">[]): Promise<FeaturedExpert[]> {
      const ids = rows.map((r) => r.user_id).filter(Boolean)
      const map = await fetchProfilesByUserIds<{ full_name?: string | null; avatar_url?: string | null }>(
        supabase,
        ids,
        "id, full_name, avatar_url"
      )
      return rows.map((t) => {
        const p = map.get(t.user_id)
        return {
          ...t,
          profiles: p
            ? { full_name: p.full_name ?? null, avatar_url: p.avatar_url ?? null }
            : null,
        }
      })
    }

    async function loadFeaturedForCategory(category: (typeof FEATURE_CATEGORIES)[number]): Promise<FeaturedExpert[]> {
      const teacherCols =
        "id, user_id, category, qualifications, rating_avg, review_count, is_online, profile_pic_url"

      /** Must match /experts: RLS allows `is_public` true or null; `.eq(true)` alone hid legacy / edge rows. */
      const publicDirectoryOr = "is_public.eq.true,is_public.is.null"

      /**
       * Top up to 3 slots from the live directory so brand-new experts (0 reviews) still appear.
       * Rankings alone used to require review_count ≥ 3 and skipped everyone until they had reviews.
       */
      async function mergeWithDirectory(
        existing: Omit<FeaturedExpert, "profiles">[]
      ): Promise<Omit<FeaturedExpert, "profiles">[]> {
        const seen = new Set(existing.map((t) => t.id))
        const out = [...existing]
        if (out.length >= 3) return out.slice(0, 3)

        const { data: rows, error } = await supabase
          .from("teachers")
          .select(teacherCols)
          .eq("category", category)
          .or(publicDirectoryOr)
          .order("review_count", { ascending: false, nullsFirst: false })
          .order("rating_avg", { ascending: false, nullsFirst: false })
          .limit(24)

        if (error) {
          console.error("Featured experts directory merge failed", category, error.message)
          return out.slice(0, 3)
        }

        for (const row of rows ?? []) {
          if (out.length >= 3) break
          const id = row.id as string
          if (!seen.has(id)) {
            seen.add(id)
            out.push(row as Omit<FeaturedExpert, "profiles">)
          }
        }
        return out.slice(0, 3)
      }

      let ordered: Omit<FeaturedExpert, "profiles">[] = []

      const { data: ranked, error: rErr } = await supabase
        .from("teacher_rankings")
        .select("teacher_id, review_count, rating_avg, bayesian_score")
        .eq("category", category)
        .order("bayesian_score", { ascending: false })
        .limit(3)

      if (!rErr && ranked && ranked.length > 0) {
        const teacherIds = ranked.map((x) => x.teacher_id as string)
        const { data: teachers, error: tErr } = await supabase
          .from("teachers")
          .select(teacherCols)
          .in("id", teacherIds)
        if (!tErr && teachers && teachers.length > 0) {
          const byId = new Map((teachers as Omit<FeaturedExpert, "profiles">[]).map((t) => [t.id as string, t]))
          ordered = teacherIds
            .map((id) => byId.get(id))
            .filter(Boolean) as Omit<FeaturedExpert, "profiles">[]
        }
        if (tErr) console.warn("teacher_rankings ok but teachers fetch failed", tErr)
      } else if (rErr) {
        console.warn("teacher_rankings unavailable; filling from directory only", rErr.message)
      }

      const merged = await mergeWithDirectory(ordered)
      return attachDisplayNames(merged)
    }

    async function fetchFeatured() {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const list = await loadFeaturedForCategory(category)
            return [category, list] as const
          })
        )

        const grouped: Record<string, FeaturedExpert[]> = {}
        results.forEach(([cat, list]) => {
          grouped[cat] = list
        })
        setFeaturedByCategory(grouped)
      } catch (err) {
        console.error("Failed to fetch featured experts", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [categories])

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Dynamic Experts Preview (best per category) */}
      <section className="py-24 md:py-32 container mx-auto px-6 rounded-[3rem] bg-muted/50 dark:bg-muted/25 border border-border/60">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-6 font-black text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
                <Globe className="size-3" /> Professional Ecosystem
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-foreground">
              Connect with <br /> <span className="text-primary">top 1% globally.</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">From clinical specialists to legal counselors, access the world&apos;s most trusted minds.</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-6">
              Mix of Bayesian rankings and live directory members — new experts appear as soon as they go public.
            </p>
          </div>
          <Link href="/experts" className="group flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="font-black text-primary group-hover:underline uppercase tracking-widest text-xs sm:text-sm leading-snug max-w-[min(100%,14rem)] sm:max-w-none">
              Explore full directory
            </span>
            <div className="size-14 rounded-full border border-emerald-100 dark:border-slate-800 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight className="size-6" />
            </div>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <p className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground">
              Loading featured experts…
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="premium-card p-1 bg-card h-[400px] flex flex-col border-border animate-pulse"
                >
                  <div className="aspect-4/3 rounded-[2rem] bg-muted mb-8" />
                  <div className="p-8 pt-0 grow flex flex-col gap-4">
                    <div className="h-8 bg-muted rounded-lg w-3/4" />
                    <div className="h-4 bg-muted rounded-md w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((cat) => {
              const experts = featuredByCategory[cat] || []
              return (
                <div key={cat} className="space-y-8">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{cat}</p>
                      <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Top rated in {cat}</h3>
                    </div>
                    <Link href={`/experts?category=${encodeURIComponent(cat)}`} className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
                      View all
                    </Link>
                  </div>

                  {experts.length === 0 ? (
                    <div className="premium-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-inner">
                        <Star className="size-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Building Excellence</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                        No public experts in this category yet. Try the full directory — or check back as more professionals go live.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {experts.map((expert) => {
                        const photoUrl = expertDisplayPhoto(expert)
                        return (
                        <Link key={expert.id} href={`/book/${expert.id}`} className="group relative">
                          <div className="premium-card p-1 bg-card overflow-hidden h-full flex flex-col border-border">
                            <div className="aspect-4/3 rounded-[2rem] bg-muted mb-8 overflow-hidden relative shadow-inner isolate">
                              <div
                                className={`absolute inset-0 z-0 ${featuredExpertHeaderGradient(expert.category)}`}
                                aria-hidden
                              />
                              <div
                                className="absolute inset-0 z-1 opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_80%_20%,rgba(255,255,255,0.22),transparent_55%)]"
                                aria-hidden
                              />
                              <div className="absolute inset-0 z-2 bg-linear-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
                              <div className="absolute top-6 left-6 z-20">
                                <span className="px-3 py-1.5 rounded-xl glass border border-white/10 text-xs font-black uppercase tracking-widest text-white shadow-2xl">
                                  {expert.category}
                                </span>
                              </div>
                              {expert.is_online && (
                                <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/20 backdrop-blur-md">
                                  <div className="size-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                                  <span className="text-white text-xs font-black uppercase tracking-widest">Active Now</span>
                                </div>
                              )}
                              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
                                <div className="relative size-28 rounded-2xl ring-4 ring-card bg-card shadow-2xl overflow-hidden">
                                  {photoUrl ? (
                                    <Image
                                      src={photoUrl}
                                      alt={expert.profiles?.full_name ?? "Expert"}
                                      fill
                                      className="object-cover"
                                      sizes="112px"
                                    />
                                  ) : (
                                    <div className="flex h-full min-h-28 w-full items-center justify-center text-3xl font-black text-muted-foreground bg-muted">
                                      {expert.profiles?.full_name?.charAt(0) || "E"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="p-8 pt-0 grow flex flex-col">
                              <div className="grow">
                                <h3 className="font-black text-3xl tracking-tighter mb-2 text-foreground transition-colors group-hover:text-primary leading-tight">
                                  {expert.profiles?.full_name ?? "Expert"}
                                </h3>
                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
                                  <BriefcaseIcon className="size-3" />
                                  {expert.qualifications?.split(",")[0]}
                                </p>
                              </div>
                              <div className="flex items-center justify-between border-t border-border pt-6">
                                <div className="flex items-center gap-2 text-sm font-black text-foreground">
                                  <Star className="size-4 text-orange-500 fill-orange-500" />
                                  <span>{expert.rating_avg || "0.0"}</span>
                                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    ({expert.review_count || 0})
                                  </span>
                                </div>
                                <div className="px-6 h-12 rounded-xl bg-muted text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center transition-all">
                                  Initiate Session
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <HowItWorks />
      <Pricing />

      {/* Professional Call to Action */}
      <section className="py-32 container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[4rem] bg-slate-950 p-16 md:p-24 text-center text-white shadow-[0_40px_100px_-15px_rgba(16,185,129,0.2)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute top-0 right-0 size-[500px] bg-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] animate-pulse" />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 font-black text-xs uppercase tracking-[0.2em]">
                    <Zap className="size-4 text-primary" /> Professional Certification
                </div>
                <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] max-w-4xl">
                    Share your expertise <br /> with the <span className="text-primary">world.</span>
                </h2>
                <p className="text-slate-400 mb-14 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                    Join the top 1% of professionals. Set your own professional rates. 
                    Manage your professional empire. Experience escrow safety.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                    <Link href="/signup">
                        <button className="bg-primary hover:bg-emerald-700 text-white px-14 py-8 rounded-3xl font-black text-xl transition-all shadow-2xl hover:scale-[1.03] active:scale-95 border-t border-white/20">
                            Become an Expert
                        </button>
                    </Link>
                    <Link href="/experts">
                        <button className="bg-white/5 border border-white/10 text-white px-14 py-8 rounded-3xl font-black text-xl hover:bg-white/10 transition-all">
                            View Directory
                        </button>
                    </Link>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
    )
}
