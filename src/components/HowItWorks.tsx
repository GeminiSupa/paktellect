"use client"

import { motion } from "framer-motion"
import { Search, CalendarDays, Video } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "Find an Expert",
      desc: "Browse through our curated list of elite professionals in various fields.",
      icon: <Search className="size-8" />,
      color: "from-blue-600/20 to-cyan-600/20",
      iconColor: "text-blue-500",
    },
    {
      title: "Book a Session",
      desc: "Choose a time that works for you and securely lock in your appointment.",
      icon: <CalendarDays className="size-8" />,
      color: "from-emerald-600/20 to-teal-600/20",
      iconColor: "text-emerald-500",
    },
    {
      title: "Get 1:1 Advice",
      desc: "Join the encrypted high-quality video call and get personalized guidance.",
      icon: <Video className="size-8" />,
      color: "from-rose-600/20 to-pink-600/20",
      iconColor: "text-rose-500",
    }
  ]

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950/50 scroll-mt-32 md:scroll-mt-40 relative overflow-hidden">
      <div className="absolute top-0 right-0 size-[500px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 mb-6 font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
            How it <span className="text-primary">Works</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Three simple steps to connect with the best minds in the industry. Experience seamless, secure consulting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="relative mb-8">
                <div className={`size-32 rounded-[2rem] bg-gradient-to-br ${step.color} flex items-center justify-center border border-white/50 dark:border-white/5 shadow-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 backdrop-blur-md`}>
                  <div className={`size-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-inner ${step.iconColor}`}>
                    {step.icon}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 size-10 rounded-full bg-primary text-white font-black flex items-center justify-center text-lg border-4 border-slate-50 dark:border-slate-950 shadow-lg">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium px-4">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

