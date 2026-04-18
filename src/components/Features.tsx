"use client"

import { Globe, ShieldCheck, Lock, Monitor, Cpu } from "lucide-react"
import { motion } from "framer-motion"

export function Features() {
  const features = [
    {
      title: "Escrow Protocol",
      desc: "Funds are held in high-security trust and only released upon your satisfaction.",
      icon: <Lock className="size-6 text-primary" />,
      accent: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
      title: "Elite Vetting",
      desc: "Every professional undergoes a 5-step credential authentication process.",
      icon: <ShieldCheck className="size-6 text-emerald-600" />,
      accent: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
      title: "Command Center",
      desc: "A powerful dashboard to manage schedules, earnings, and secure consulting.",
      icon: <Monitor className="size-6 text-rose-600" />,
      accent: "bg-rose-50 dark:bg-rose-500/10"
    },
    {
      title: "Global Reach",
      desc: "Connect with the top 1% across legal, medical, and academic domains worldwide.",
      icon: <Globe className="size-6 text-teal-600" />,
      accent: "bg-teal-50 dark:bg-teal-500/10"
    }
  ]

  return (
    <section id="features" className="py-24 md:py-32 bg-background scroll-mt-32 md:scroll-mt-40">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 lg:gap-14 mb-20 md:mb-24">
          <div className="max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 font-black text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                <Cpu className="size-3" /> System Architecture
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.05] text-foreground">
                Engineered for <br />{" "}
                <span className="text-emerald-600 dark:text-emerald-300">Total Trust.</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Elite professional services require elite infrastructure. 
                We&apos;ve built the most secure platform for global expert consultations.
            </p>
          </div>
          <div className="w-full lg:flex-1 lg:max-w-xl rounded-[2.5rem] border border-border bg-muted/60 dark:bg-muted/40 shadow-lg px-4 py-8 sm:p-10 mt-2 lg:mt-0">
             <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10 text-foreground text-center sm:text-left">
                <span className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tight whitespace-nowrap">TRUST+</span>
                <span className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tight whitespace-nowrap">SECURE.</span>
                <span className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tight whitespace-nowrap">PAKTELLECT.</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="premium-card p-10 group"
            >
              <div className={`size-16 rounded-[1.5rem] ${f.accent} flex items-center justify-center mb-8 border border-white/50 dark:border-white/5 shadow-inner transition-transform duration-500 group-hover:rotate-6`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  )
}
