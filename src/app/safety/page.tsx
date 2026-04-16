"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ShieldCheck, Lock, MessageSquareWarning, BadgeCheck, Wallet } from "lucide-react"

export default function SafetyProtocolPage() {
  return (
    <main className="min-h-screen bg-[#fdfdfe] dark:bg-slate-950 selection:bg-primary selection:text-white">
      <Navbar />

      <section className="container mx-auto px-6 pt-40 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-primary">
            <ShieldCheck className="size-3" /> Safety Protocol
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-6">
            Trust-first rules for secure professional sessions.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            These guidelines support safer usage in Pakistan and reduce risk of fraud, harassment, and off-platform disputes.
          </p>

          <div className="grid grid-cols-1 gap-6 mt-14">
            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Lock className="size-6 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Keep sessions on-platform</h2>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <li>
                  - Use PAKTELLECT chat for coordination. Off-platform coordination can reduce evidence trails for dispute handling.
                </li>
                <li>
                  - Avoid sharing external payment links, bank details, or phone numbers in early-stage conversations.
                </li>
              </ul>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <Wallet className="size-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Escrow and release rules</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Funds may be held in escrow and released based on session status and the platform’s dispute workflow.
                Learn the details on the escrow page.
              </p>
              <div className="pt-6">
                <Link href="/escrow-protection" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                  Escrow protection
                </Link>
              </div>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <BadgeCheck className="size-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Professional verification</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Experts should provide accurate credentials and category-specific details before public listing.
                False claims can lead to removal and reporting where appropriate.
              </p>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <MessageSquareWarning className="size-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Abuse, harassment, and illegal content</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Do not use the platform to facilitate unlawful activity, harassment, threats, or the sharing of non-consensual content.
                We may restrict accounts and cooperate with lawful requests consistent with applicable regulations.
              </p>
            </div>
          </div>

          <div className="mt-16 premium-card p-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Important notices</h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              <li>- PAKTELLECT does not provide medical or legal services. Experts provide their own professional services.</li>
              <li>- If you believe there is immediate danger, contact local emergency services.</li>
              <li>
                - Our policies are designed with Pakistan usage in mind, including responsible handling of online abuse reports
                and compliance-minded content restrictions.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

