"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { LifeBuoy, MessageSquare, ShieldCheck, Wallet } from "lucide-react"

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[#fdfdfe] dark:bg-slate-950 selection:bg-primary selection:text-white">
      <Navbar />

      <section className="container mx-auto px-6 pt-40 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-primary">
            <LifeBuoy className="size-3" /> Help Center
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-6">
            Support that protects your sessions.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Quick answers, safety guidance, and escrow rules—written for Pakistan-based professionals and clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            <div className="premium-card p-10">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Safety Protocol</h2>
              <p className="text-slate-500 font-medium mb-6">
                Keep communications on-platform, avoid external payment links, and follow verification standards.
              </p>
              <Link href="/safety" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                Read safety protocol
              </Link>
            </div>

            <div className="premium-card p-10">
              <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                <Wallet className="size-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Escrow Protection</h2>
              <p className="text-slate-500 font-medium mb-6">
                Learn when funds are held, when they are released, and what happens during disputes.
              </p>
              <Link href="/escrow-protection" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                View escrow rules
              </Link>
            </div>

            <div className="premium-card p-10">
              <div className="size-12 rounded-2xl bg-slate-900/10 flex items-center justify-center mb-6">
                <MessageSquare className="size-6 text-slate-900 dark:text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Disputes & moderation</h2>
              <p className="text-slate-500 font-medium mb-6">
                If something goes wrong, we keep a record trail to protect both sides and resolve fairly.
              </p>
              <Link href="/terms" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                Terms & dispute process
              </Link>
            </div>

            <div className="premium-card p-10">
              <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="size-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Privacy</h2>
              <p className="text-slate-500 font-medium mb-6">
                How we handle account data, files, and logs, and how you can request changes.
              </p>
              <Link href="/privacy" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                Privacy policy
              </Link>
            </div>
          </div>

          <div className="mt-16 text-[10px] font-black uppercase tracking-widest text-slate-400">
            For urgent medical emergencies, contact local emergency services. PAKTELLECT is not an emergency service.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

