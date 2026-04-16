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
    <section id="features" className="py-32 bg-[#fdfdfe] dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-widest text-primary">
                <Cpu className="size-3" /> System Architecture
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-slate-950 dark:text-white">
                Engineered for <br /> <span className="text-primary">Total Trust.</span>
            </h2>
            <p className="text-xl text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                Elite professional services require elite infrastructure. 
                We&apos;ve built the most secure platform for global expert consultations.
            </p>
          </div>
          <div className="flex-1 w-full lg:w-auto h-40 glass rounded-[2.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-8">
             <div className="flex items-center gap-12 text-slate-900 dark:text-white">
                <span className="font-black text-4xl tracking-tighter">TRUST+</span>
                <span className="font-black text-4xl tracking-tighter">SECURE.</span>
                <span className="font-black text-4xl tracking-tighter">PAKTELLECT.</span>
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
