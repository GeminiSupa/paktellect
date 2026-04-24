"use client"

import { Button } from "./ui/Button"
import { Check, Globe, Sparkles } from "lucide-react"
import Link from "next/link"

export function Pricing() {
  const universalFeatures = [
    "Access to All Professional Categories",
    "Priority Slot Matching & Discovery",
    "Verified Credentials Badge for Experts",
    "Direct Encrypted Chat & Video Interface",
    "Zero Platform Commission Fees",
    "Secure Escrow Protection for All Sessions",
    "Advanced Career & Practice Analytics",
    "24/7 Priority Ecosystem Support"
  ]

  return (
    <section id="pricing" className="py-32 bg-slate-50 dark:bg-slate-950/50 overflow-hidden scroll-mt-32 md:scroll-mt-40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-primary">
             <Sparkles className="size-4" /> Community Commitment
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
            World-class expertise, <br /> <span className="text-primary">free for everyone.</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            We believe professional guidance should be accessible, not gated. Our ecosystem is built on transparency, security, and zero commission fees.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-emerald-600 rounded-[3.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative premium-card p-10 md:p-16 bg-white dark:bg-slate-900 border-none shadow-3xl overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                    <Globe className="size-64 -translate-y-1/4 translate-x-1/4 rotate-12" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
                            One Unified Experience
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white mb-6">
                            Universal Professional Access
                        </h3>
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
                            Whether you are established as an expert or seeking top-tier advice, every platform tool is available to you without subscription tiers or gatekeeping.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/signup" className="flex-1">
                                <Button className="w-full h-18 text-lg font-black rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-emerald-500/20">
                                    Become an Expert
                                </Button>
                            </Link>
                            <Link href="/experts" className="flex-1">
                                <Button variant="outline" className="w-full h-18 text-lg font-black rounded-2xl border-2">
                                    Find Expert
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Everything Included</p>
                        <ul className="grid grid-cols-1 gap-5">
                            {universalFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-700 dark:text-slate-200">
                                    <div className="size-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5">
                                        <Check className="size-3.5 text-primary" />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
          </div>
          
          <p className="text-center mt-12 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
            No Commission • No Gatekeeping • No Tiers
            <span className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
          </p>
        </div>
      </div>
    </section>
  )
}
