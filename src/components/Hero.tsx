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
      
      {/* Cinematic Background Image with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/55 via-slate-950/85 to-slate-950" />
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2400&auto=format&fit=crop"
          alt="Professional Excellence"
          fill
          priority
          className="object-cover scale-110"
          sizes="100vw"
        />
      </motion.div>

      {/* Floating Light Accents */}
      <div className="absolute top-1/4 left-1/4 z-0 pointer-events-none size-[500px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 z-0 pointer-events-none size-[400px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 relative z-10 pt-36 sm:pt-40 md:pt-44 pb-16">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative z-20 inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full glass-pill mb-10 border border-white/10 shadow-2xl max-w-88 sm:max-w-none">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-emerald-200 text-balance whitespace-normal text-center">
                Pakistan&apos;s Premium Professional Hub
              </span>
            </div>
            
            <h1 className="text-6xl md:text-[7.5rem] font-black tracking-tighter mb-12 leading-[0.85] text-white">
              Professional excellence, <br /> 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400">within your reach.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
              Access top-tier Lawyers, Doctors, and Tutors through our high-security 
              escrow ecosystem. Professionalism, protected.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-8 justify-center items-center">
              {user ? (
                <Link href={dashboardHref}>
                   <Button className="h-20 px-12 rounded-[2rem] bg-primary hover:bg-emerald-700 text-white font-black text-xl shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105">
                    Enter Dashboard
                    <ArrowRight className="size-6 ml-3" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className="h-20 px-12 rounded-[2rem] bg-white hover:bg-slate-50 text-slate-950 font-black text-xl shadow-2xl transition-all hover:scale-105">
                    Start Your Session
                    <ArrowRight className="size-6 ml-3" />
                  </Button>
                </Link>
              )}
              <Link href="/experts">
                <Button variant="ghost" className="h-20 px-10 rounded-[2rem] text-white font-black text-xl flex items-center gap-4 hover:bg-white/5 transition-all">
                  <div className="size-12 rounded-full border border-white/20 flex items-center justify-center">
                    <Play className="size-5 fill-white" />
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
              color="from-indigo-600/20 to-blue-600/20"
              borderColor="group-hover:border-indigo-500/50"
              href="/experts?category=Academic"
            />
            <CategoryCard 
              icon={<Scale className="size-8" />} 
              label="Legal" 
              count="450+ Lawyers"
              color="from-slate-700/40 to-slate-900/40"
              borderColor="group-hover:border-slate-500/50"
              href="/experts?category=Legal"
            />
            <CategoryCard 
              icon={<Heart className="size-8" />} 
              label="Wellness" 
              count="800+ Coaches"
              color="from-emerald-600/20 to-teal-600/20"
              borderColor="group-hover:border-emerald-500/50"
              href="/experts?category=Wellness"
            />
            <CategoryCard 
              icon={<Brain className="size-8" />} 
              label="Mental Health" 
              count="300+ Doctors"
              color="from-rose-600/20 to-pink-600/20"
              borderColor="group-hover:border-rose-500/50"
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
  borderColor,
  href 
}: { 
  icon: React.ReactNode, 
  label: string, 
  count: string, 
  color: string,
  borderColor: string,
  href: string
}) {
  return (
    <Link href={href} className="group">
        <div className={`h-full p-8 rounded-[2.5rem] glass border border-white/10 transition-all duration-500 group-hover:-translate-y-3 group-hover:bg-white/10 ${borderColor}`}>
            <div className={`size-16 rounded-[1.8rem] bg-linear-to-br ${color} flex items-center justify-center text-white mb-6 shadow-inner border border-white/10 transition-transform duration-500 group-hover:rotate-6`}>
                {icon}
            </div>
            <h3 className="font-black text-2xl text-white mb-2 tracking-tight">{label}</h3>
            <p className="text-[10px] font-black text-slate-200/90 uppercase tracking-widest leading-none">{count}</p>
        </div>
    </Link>
  )
}
