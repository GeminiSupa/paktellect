"use client"

import { BlogLayout } from "@/components/BlogLayout"
import { 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Globe,
  Scale,
  Award
} from "lucide-react"
import Link from "next/link"

export default function LawyerBlogPost() {
  const sidebarLinks = [
    { href: "#need", label: "Digital Need" },
    { href: "#why", label: "Why Register" },
    { href: "#gap", label: "Bridging the Gap" },
    { href: "#practice", label: "Management" },
  ]

  return (
    <BlogLayout
      title={
        <>
          Why Every Lawyer in Pakistan Should Register on Online Tools Like <br />
          <span className="text-primary italic">Paktellect</span> in 2026
        </>
      }
      date="20 April, 2026"
      author="Paktellect Insights"
      category="Digital Growth"
      heroImage="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop"
      dir="ltr"
      accentIcon={<Scale className="size-4" />}
      accentLabel="Legal Excellence 2026"
      accentColorClass="emerald-500"
      sidebarLinks={sidebarLinks}
    >
      <div id="intro" className="premium-card bg-primary/5 border-primary/10">
          <p className="font-bold text-slate-900 dark:text-white leading-[1.8] italic">
          In today’s digital age, simply having a physical office or a traditional visiting card is no longer enough for lawyers in Pakistan. Potential clients increasingly search online for legal help using phrases like “best lawyer near me,” “family lawyer in Lahore,” or “criminal advocate in Karachi.”
          </p>
      </div>

      <section id="need" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-primary pl-6 mb-4">The Growing Need for Online Presence</h2>
          <p>
          Many advocates still rely solely on word-of-mouth referrals and court appearances. However, this approach limits reach, especially for new or solo practitioners. Most people now begin their search for legal help on Google or social media.
          </p>
          <p>
          Without an online profile, lawyers miss out on potential clients who need urgent help in areas such as family disputes, property matters, criminal cases, or corporate issues. Online tools solve this gap by making lawyers discoverable to a much wider audience across Pakistan.
          </p>
      </section>

      <section id="why" className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-6 mb-4">Why You Should Register</h2>
          <p>
          Paktellect is an emerging online platform designed to connect legal experts with people seeking professional advice. Here’s why registering makes strong business sense:
          </p>
          
          <div className="grid gap-4">
              {[
                { icon: <Globe className="size-5" />, title: "Increased Visibility", desc: "Appear in targeted searches when people look for lawyers in your specific city or practice area." },
                { icon: <ShieldCheck className="size-5" />, title: "Builds Credibility", desc: "Verified profiles with ratings and feedback make you look more professional and reliable." },
                { icon: <Zap className="size-5" />, title: "Cost-Effective Marketing", desc: "Consistent online exposure at a fraction of the cost of traditional billboard or newspaper ads." }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-6 p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-primary/20 group">
                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{benefit.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{benefit.desc}</p>
                    </div>
                </div>
              ))}
          </div>
      </section>

      <section id="gap" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-indigo-500 pl-6 mb-4">How Digital Tools Bridge the Gap</h2>
          <ul className="space-y-4">
              <li className="flex items-start gap-3 bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10">
                <CheckCircle2 className="size-5 text-indigo-500 shrink-0 mt-1" />
                <span><strong>Easy Discovery:</strong> Consumers can search by location, practice area, and instantly find suitable experts.</span>
              </li>
              <li className="flex items-start gap-3 bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10">
                <CheckCircle2 className="size-5 text-indigo-500 shrink-0 mt-1" />
                <span><strong>Transparent Information:</strong> Detailed profiles show experience, success stories, and fee structures.</span>
              </li>
          </ul>
      </section>

      <section id="practice" className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-primary pl-6">Practice Management & Visibility</h2>
          <p>
          For maximum efficiency, lawyers should combine online directory registration with strong internal tools like **Vakeel Diary**.
          </p>
          <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h4 className="text-lg font-black mb-4 text-primary flex items-center gap-2">
                <Zap className="size-5" /> Professional Synergy
              </h4>
              <p className="text-base font-bold italic leading-relaxed">
                When paired with platforms like Paktellect, you can handle increased client flow without getting overwhelmed by administrative work.
              </p>
          </div>
      </section>

      <div className="premium-card cinematic-surface text-white space-y-8 animate-float">
          <div className="flex items-center gap-3">
            <Award className="size-10 text-emerald-300 fill-emerald-300 shadow-lg shadow-emerald-500/50" />
            <h3 className="text-3xl font-black tracking-tight italic">Take the Digital Step Today</h3>
          </div>
          <div className="pt-4">
            <Link href="/signup">
              <button className="h-14 px-10 rounded-2xl bg-white text-primary font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/40">
                  Register Your Profile
              </button>
            </Link>
          </div>
      </div>
    </BlogLayout>
  )
}
