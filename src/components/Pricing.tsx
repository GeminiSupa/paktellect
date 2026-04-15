"use client"

import { Button } from "./ui/Button"
import { Check, Lock } from "lucide-react"

export function Pricing() {
  const plans = [
    {
      name: "Standard",
      price: "0",
      desc: "For those exploring the ecosystem.",
      features: ["Access to all Categories", "Secure Escrow Protection", "Public Review History"],
      button: "Start Exploring",
      highlight: false
    },
    {
      name: "Premium",
      price: "29",
      desc: "For serious professionals and learners.",
      features: ["All Standard Features", "Priority Slot Matching", "Verified Credentials Badge", "Direct Encrypted Chat"],
      button: "Go Premium",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "99",
      desc: "Total professional management.",
      features: ["Unlimited Practice Hours", "Zero Commission Fees", "Advanced Career Analytics", "24/7 Priority Support"],
      button: "Upgrade Now",
      highlight: false
    }
  ]

  return (
    <section id="pricing" className="py-32 bg-slate-50 dark:bg-slate-950/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-widest text-primary">
             <Lock className="size-3" /> Secure Access
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-slate-900 dark:text-white">
            Transparent <br /> <span className="text-primary">professional scaling.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">No hidden tiers. Choose the level of engagement that fits your professional journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`premium-card p-12 flex flex-col transition-all duration-700 hover:-translate-y-4 group ${plan.highlight ? 'border-primary dark:border-primary bg-white dark:bg-slate-950 shadow-3xl shadow-emerald-500/10 scale-105' : 'bg-white/50 dark:bg-slate-900/50'}`}>
              {plan.highlight && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30">
                    Most Popular
                </div>
              )}
              
              <div className="mb-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">{plan.name} Plan</h3>
                <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-5xl font-black tracking-tighter text-slate-950 dark:text-white">${plan.price}</span>
                    <span className="text-slate-500 text-xs font-black uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">{plan.desc}</p>
              </div>
              
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-10" />

              <ul className="space-y-5 mb-12">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <div className="size-6 rounded-lg bg-emerald-500/5 flex items-center justify-center shrink-0 border border-emerald-500/10">
                        <Check className="size-3.5 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className={`mt-auto w-full h-16 text-lg font-black rounded-2xl transition-all duration-500 ${plan.highlight ? 'bg-primary hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                {plan.button}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

