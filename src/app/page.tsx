"use client"

import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { HowItWorks } from "@/components/HowItWorks"
import { Pricing } from "@/components/Pricing"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ArrowUpRight, Globe, Star, Zap, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

export default function Home() {
  type FeaturedExpert = {
    id: string
    category?: string | null
    qualifications?: string | null
    rating_avg?: number | null
    is_online?: boolean | null
    profile_pic_url?: string | null
    profiles?: { full_name?: string | null } | null
  }

  const [featuredExperts, setFeaturedExperts] = useState<FeaturedExpert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data: teachers, error: tErr } = await supabase
          .from('teachers')
          .select('*, profiles(full_name)')
          .limit(3)
          .order('rating_avg', { ascending: false })
          
        if (!tErr && teachers) {
            setFeaturedExperts(teachers)
        }
      } catch (err) {
        console.error("Failed to fetch featured experts", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <main className="min-h-screen bg-[#fdfdfe] dark:bg-slate-950 selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Dynamic Experts Preview */}
      <section className="py-32 container mx-auto px-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-primary">
                <Globe className="size-3" /> Professional Ecosystem
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
              Connect with <br /> <span className="text-primary">top 1% globally.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">From clinical specialists to legal counselors, access the world&apos;s most trusted minds.</p>
          </div>
          <Link href="/experts" className="group flex items-center gap-4">
            <span className="text-lg font-black text-primary group-hover:underline uppercase tracking-widest text-[12px]">Explore Full Directory</span>
            <div className="size-14 rounded-full border border-emerald-100 dark:border-slate-800 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight className="size-6" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary/20 size-12" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Experts...</p>
            </div>
          ) : featuredExperts.map((expert) => (
            <Link key={expert.id} href={`/book/${expert.id}`} className="group relative">
               <div className="premium-card p-1 bg-white dark:bg-slate-900 overflow-hidden h-full flex flex-col">
                  <div className="aspect-[4/3] rounded-[2rem] bg-slate-50 dark:bg-slate-800 mb-8 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                    <div className="absolute top-6 left-6 z-20">
                        <span className="px-3 py-1.5 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl">
                            {expert.category}
                        </span>
                    </div>
                    {expert.is_online && (
                        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/20 backdrop-blur-md">
                            <div className="size-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Active Now</span>
                        </div>
                    )}
                    <div className="w-full h-full flex items-center justify-center text-8xl font-black text-slate-200 dark:text-slate-700 select-none group-hover:scale-110 transition-transform duration-1000">
                        {expert.profile_pic_url ? (
                            <Image src={expert.profile_pic_url} alt={expert.profiles?.full_name ?? "Expert"} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
                        ) : (
                            expert.profiles?.full_name?.charAt(0) || 'E'
                        )}
                    </div>
                  </div>
                  <div className="p-8 pt-0 flex-grow flex flex-col">
                    <div className="flex-grow">
                        <h3 className="font-black text-3xl tracking-tighter mb-2 text-slate-900 dark:text-white transition-colors group-hover:text-primary leading-tight">
                            {expert.profiles?.full_name}
                        </h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                           <BriefcaseIcon className="size-3" />
                           {expert.qualifications?.split(',')[0]}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                            <Star className="size-4 text-orange-500 fill-orange-500" />
                            <span>{expert.rating_avg || '5.0'}</span>
                        </div>
                        <div className="px-6 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:bg-primary group-hover:text-white flex items-center transition-all">
                            Initiate Session
                        </div>
                    </div>
                  </div>
               </div>
            </Link>
          ))}
        </div>
      </section>

      <HowItWorks />
      <Pricing />

      {/* Professional Call to Action */}
      <section className="py-32 container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[4rem] bg-slate-950 p-16 md:p-24 text-center text-white shadow-[0_40px_100px_-15px_rgba(16,185,129,0.2)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute top-0 right-0 size-[500px] bg-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] animate-pulse" />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Zap className="size-4 text-primary" /> Professional Certification
                </div>
                <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] max-w-4xl">
                    Share your expertise <br /> with the <span className="text-primary">world.</span>
                </h2>
                <p className="text-slate-400 mb-14 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                    Join the top 1% of professionals. Set your own clinical rates. 
                    Manage your coordinate practice. Experience escrow safety.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                    <Link href="/signup">
                        <button className="bg-primary hover:bg-emerald-700 text-white px-14 py-8 rounded-3xl font-black text-xl transition-all shadow-2xl hover:scale-[1.03] active:scale-95 border-t border-white/20">
                            Establish Practice
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
