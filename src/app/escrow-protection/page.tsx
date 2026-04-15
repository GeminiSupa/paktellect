"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ShieldCheck, Wallet, Scale, CheckCircle2, AlertTriangle } from "lucide-react"

export default function EscrowProtectionPage() {
  return (
    <main className="min-h-screen bg-[#fdfdfe] dark:bg-slate-950 selection:bg-primary selection:text-white">
      <Navbar />

      <section className="container mx-auto px-6 pt-40 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-primary">
            <Wallet className="size-3" /> Escrow Protection
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-6">
            Hold funds safely. Release fairly.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            A clear workflow that helps reduce fraud and creates an evidence trail for dispute resolution.
          </p>

          <div className="grid grid-cols-1 gap-6 mt-14">
            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">How escrow works</h2>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <li>- The client pays through the platform. Funds may be held until the session is completed.</li>
                <li>- Experts should deliver the session through the agreed booking details.</li>
                <li>- The platform records booking status changes and relevant logs.</li>
              </ul>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="size-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Release triggers</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Release typically occurs when the session is marked completed, subject to the dispute window and platform rules.
                Exact timing may vary based on payment rails and platform configuration.
              </p>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <AlertTriangle className="size-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Disputes</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                If a dispute is raised, we review relevant booking metadata and on-platform messages where applicable.
                We may request additional information from both parties.
              </p>
              <div className="pt-6">
                <Link href="/terms" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                  Terms (dispute process)
                </Link>
              </div>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-slate-900/10 flex items-center justify-center">
                  <Scale className="size-6 text-slate-900 dark:text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Compliance-minded usage (Pakistan)</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Escrow flows are designed to reduce abuse and support record-keeping for legitimate service transactions.
                Users must not use the platform for unlawful activity or to circumvent controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

