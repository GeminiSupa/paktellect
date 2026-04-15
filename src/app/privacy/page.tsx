"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ShieldCheck, Database, FileLock2, UserRoundCog } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fdfdfe] dark:bg-slate-950 selection:bg-primary selection:text-white">
      <Navbar />

      <section className="container mx-auto px-6 pt-40 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-primary">
            <ShieldCheck className="size-3" /> Privacy Policy
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-6">
            Privacy, by default.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            We collect only what’s needed to operate the platform, protect users, and improve reliability.
          </p>

          <div className="grid grid-cols-1 gap-6 mt-14">
            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Database className="size-6 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">What we store</h2>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <li>- Account identifiers and basic profile information you provide.</li>
                <li>- Booking and payment metadata required to operate escrow workflows.</li>
                <li>- On-platform messages and logs needed for safety and dispute resolution.</li>
              </ul>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <FileLock2 className="size-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Files and private documents</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Where supported, sensitive uploads are stored in private storage with access controls.
                Do not upload content you do not have rights to share.
              </p>
            </div>

            <div className="premium-card p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <UserRoundCog className="size-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Your controls</h2>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <li>- Update profile fields from your dashboard settings.</li>
                <li>- Request account deletion by contacting support (availability may depend on legal and safety retention needs).</li>
                <li>- You can choose what you publish publicly as an expert, subject to verification requirements.</li>
              </ul>
            </div>

            <div className="premium-card p-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Pakistan-relevant notice</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                We aim to operate in a compliance-minded manner for Pakistan-based usage. We respond to lawful requests when required,
                and we apply access controls to reduce misuse.
              </p>
            </div>
          </div>

          <div className="mt-16 text-[10px] font-black uppercase tracking-widest text-slate-400">
            This policy is informational and may be updated as the platform evolves.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

