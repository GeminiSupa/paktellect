"use client"

import { Button } from "./ui/Button"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  ArrowRight, 
  Scale, 
  Heart, 
  Brain, 
  GraduationCap,
  Play
} from "lucide-react"
import Link from "next/link"
import { useStore } from "@/store/useStore"
import { useRef } from "react"
import Image from "next/image"

export function Hero() {
  const { user } = useStore()
  const dashboardHref = user?.user_metadata?.role === 'expert' ? "/dashboard/teacher" : "/dashboard/student"
  const targetRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={targetRef} className="relative isolate min-h-screen overflow-hidden bg-slate-950">
      {/* Image + scrims (aligned with student dashboard hero: scrims above photo for legibility) */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover object-center scale-110 opacity-55 saturate-[0.85]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 z-10 bg-linear-to-br from-slate-950 via-slate-950/92 to-slate-950/75"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-11 bg-linear-to-t from-black/55 via-transparent to-black/25"
          aria-hidden
        />
      </motion.div>

      {/* Floating Light Accents */}
      <div className="absolute top-1/4 left-1/4 z-0 pointer-events-none size-[500px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 z-0 pointer-events-none size-[400px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="container mx-auto px-6 sm:px-8 relative z-10 pt-36 sm:pt-40 md:pt-44 pb-16 md:pb-20">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative z-20 inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20 mb-8 sm:mb-10 max-w-88 sm:max-w-none">
              <span className="size-2 rounded-full bg-teal-400 animate-ping shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white/95 text-balance whitespace-normal text-center">
                Pakistan&apos;s Premium Professional Hub
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter mb-10 sm:mb-12 leading-[1.05] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
              Professional excellence, <br />
              <span className="text-teal-300 [text-shadow:0_1px_18px_rgba(20,184,166,0.35)]">within your reach.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-14 sm:mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
              Access top-tier Lawyers, Doctors, and Tutors through our high-security escrow ecosystem.
              Professionalism, protected.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 w-full sm:w-auto mt-2 justify-center items-center">
              {user ? (
                <Link href={dashboardHref}>
                   <Button className="h-16 sm:h-20 px-10 sm:px-12 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg sm:text-xl shadow-2xl shadow-black/30 border border-white/10 transition-all hover:scale-[1.02]">
                    Enter Dashboard
                    <ArrowRight className="size-6 ml-3" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className="h-16 sm:h-20 px-10 sm:px-12 rounded-[2rem] bg-white hover:bg-slate-50 text-slate-950 font-black text-lg sm:text-xl shadow-2xl shadow-black/20 transition-all hover:scale-[1.02] ring-1 ring-white/20 hover:ring-teal-400/40">
                    Start Your Session
                    <ArrowRight className="size-6 ml-3" />
                  </Button>
                </Link>
              )}
              <Link href="/experts" className="group w-full sm:w-auto">
                <Button
                  variant="ghost"
                  className="h-16 sm:h-20 w-full sm:w-auto px-8 sm:px-10 rounded-[2rem] text-teal-100 font-black text-lg sm:text-xl flex items-center justify-center gap-4 border border-white/12 bg-white/5 backdrop-blur-sm hover:bg-emerald-500/15 hover:border-teal-400/45 hover:text-white transition-all hover:scale-[1.02] hover:shadow-[0_16px_40px_-12px_rgba(20,184,166,0.2)]"
                >
                  <div className="size-11 sm:size-12 rounded-full border border-teal-400/35 bg-teal-500/15 flex items-center justify-center shadow-inner transition-colors group-hover:border-teal-300/55 group-hover:bg-teal-500/25">
                    <Play className="size-5 fill-teal-100 text-teal-100 transition-colors group-hover:fill-white group-hover:text-white" />
                  </div>
                  Browse Directory
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Interactive Domain Grid */}
          <motion.div 
            className="mt-20 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <CategoryCard 
              icon={<GraduationCap className="size-8" />} 
              label="Academic" 
              count="1.2k+ Experts"
              color="from-indigo-600/25 to-blue-600/25"
              href="/experts?category=Academic"
            />
            <CategoryCard 
              icon={<Scale className="size-8" />} 
              label="Legal" 
              count="450+ Lawyers"
              color="from-slate-600/35 to-slate-900/50"
              href="/experts?category=Legal"
            />
            <CategoryCard 
              icon={<Heart className="size-8" />} 
              label="Wellness" 
              count="800+ Coaches"
              color="from-emerald-600/30 to-teal-600/30"
              href="/experts?category=Wellness"
            />
            <CategoryCard 
              icon={<Brain className="size-8" />} 
              label="Mental Health" 
              count="300+ Doctors"
              color="from-rose-600/25 to-pink-600/25"
              href="/experts?category=Mental%20Health"
            />
          </motion.div>
        </div>
      </div>
    </section>

  )
}

function CategoryCard({
  icon,
  label,
  count,
  color,
  href,
}: {
  icon: React.ReactNode
  label: string
  count: string
  color: string
  href: string
}) {
  return (
    <Link href={href} className="group block">
      <div className="h-full p-6 sm:p-8 rounded-[2.5rem] border border-white/12 bg-white/6 backdrop-blur-xl shadow-lg shadow-black/25 transition-all duration-500 group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:border-teal-400/40 group-hover:bg-emerald-500/9 group-hover:shadow-[0_24px_48px_-12px_rgba(20,184,166,0.22)]">
        <div
          className={`size-14 sm:size-16 rounded-[1.8rem] bg-linear-to-br ${color} flex items-center justify-center text-white mb-5 sm:mb-6 shadow-inner border border-white/15 ring-1 ring-white/10 transition-all duration-500 group-hover:rotate-6 group-hover:ring-teal-400/40`}
        >
          {icon}
        </div>
        <h3 className="font-black text-xl sm:text-2xl text-white mb-2 tracking-tight transition-colors group-hover:text-teal-50">
          {label}
        </h3>
        <p className="text-[10px] font-black text-teal-100/80 uppercase tracking-widest leading-none transition-colors group-hover:text-teal-200">
          {count}
        </p>
      </div>
    </Link>
  )
}
