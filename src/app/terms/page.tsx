"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Scale, ShieldCheck, BadgeCheck, AlertTriangle } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fdfdfe] dark:bg-slate-950 selection:bg-primary selection:text-white">
      <Navbar />

      <section className="container mx-auto px-6 pt-40 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-primary">
            <Scale className="size-3" /> Terms of Service
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-6">
            Transparent rules. Safer outcomes.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            This page summarizes key platform rules, including Pakistan-focused safety and compliance expectations.
            It is not legal advice.
          </p>

          <div className="grid grid-cols-1 gap-6 mt-14">
            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Platform role</h2>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <li>- PAKTELLECT is a booking, messaging, and escrow-style workflow platform.</li>
                <li>- Experts provide their own services and are responsible for professional compliance and quality.</li>
                <li>- We may enforce safety rules, verification requirements, and content restrictions.</li>
              </ul>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <BadgeCheck className="size-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Expert accuracy & ethics</h2>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <li>- Do not misrepresent qualifications, licensing, affiliations, or jurisdiction.</li>
                <li>- Follow your profession’s code of conduct and confidentiality standards.</li>
                <li>- No discrimination, harassment, threats, or coercion.</li>
              </ul>
            </div>

            <div className="premium-card p-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Pakistan-focused compliance expectations</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Users must not use the platform to facilitate unlawful activity, fraud, harassment, or abusive content.
                We aim to operate in a compliance-minded manner for Pakistan-based usage, including responsible handling of online abuse
                and cooperation with lawful requests when required.
              </p>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <AlertTriangle className="size-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Disputes & escrow</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Disputes may be reviewed using booking metadata and on-platform records. Keep coordination on-platform.
                See escrow details for the workflow.
              </p>
              <div className="pt-6">
                <Link href="/escrow-protection" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                  Escrow protection
                </Link>
              </div>
            </div>

            <div className="premium-card p-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Governing law & jurisdiction</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Unless otherwise required by applicable law, disputes relating to platform use are intended to be handled under
                Pakistan-focused terms and processes. Specifics may be updated as the product matures.
              </p>
            </div>
          </div>

          <div className="mt-16 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Also see <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and{" "}
            <Link href="/safety" className="text-primary hover:underline">Safety Protocol</Link>.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

