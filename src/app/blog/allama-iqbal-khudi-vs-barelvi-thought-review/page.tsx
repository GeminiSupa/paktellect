"use client"

import { BlogLayout } from "@/components/BlogLayout"
import { 
  CheckCircle2, 
  BookOpen,
  Brain,
  Scale,
  Sparkles,
  User,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

export default function IqbalKhudiBlogPost() {
  const sidebarLinks = [
    { href: "#what-is-khudi", label: "What is Khudi?" },
    { href: "#barelvi-thought", label: "Barelvi Thought" },
    { href: "#contradictions", label: "Contradictions" },
    { href: "#iqbal-lawyer", label: "Iqbal as a Lawyer" },
    { href: "#relevance", label: "Legal Relevance" },
  ]

  return (
    <BlogLayout
      title={
        <>
          Allama Iqbal’s Concept of Khudi and Its <br />
          <span className="text-primary italic">Philosophical Review</span>
        </>
      }
      date="21 April, 2026"
      author="Paktellect Legal Intelligence"
      category="Philosophy"
      heroImage="https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?q=80&w=2069&auto=format&fit=crop"
      dir="ltr"
      accentIcon={<Brain className="size-4" />}
      accentLabel="Philosophical Review 2026"
      accentColorClass="primary"
      sidebarLinks={sidebarLinks}
    >
      <div id="intro" className="premium-card bg-primary/5 border-primary/10 border-none shadow-none p-0">
          <p className="font-bold text-slate-900 dark:text-white leading-[1.8] mb-8">
            In an era when Muslim youth are searching for identity, self-confidence, and a renewed understanding of faith, Allama Muhammad Iqbal’s philosophy of Khudi (Selfhood or Ego) emerges as a powerful guiding force. However, this philosophy also creates tensions with certain traditional religious circles, particularly the Barelvi school of thought.
          </p>
      </div>

      <section id="what-is-khudi" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-primary pl-6 mb-4">What is Iqbal’s Philosophy of Khudi?</h2>
          <p>
            In his famous Persian work *Asrar-i-Khudi* (Secrets of the Self, 1915), Iqbal presents Khudi not as mere selfishness or egoism, but as a dynamic process of self-awareness, self-reliance, and self-strengthening.
          </p>
          <blockquote className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border-r-4 border-primary text-center italic font-bold text-xl text-slate-800 dark:text-slate-200" dir="rtl">
            “Khudi ko kar buland itna ke har taqdeer se pehle<br />
            Khuda bande se khud poochhe, bata teri raza kya hai?”
          </blockquote>
          <div className="grid sm:grid-cols-3 gap-4 py-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center">
                <span className="text-primary font-black mb-2 text-2xl">01</span>
                <span className="text-sm font-black uppercase tracking-widest">Obedience</span>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center">
                <span className="text-primary font-black mb-2 text-2xl">02</span>
                <span className="text-sm font-black uppercase tracking-widest">Self-control</span>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center">
                <span className="text-primary font-black mb-2 text-2xl">03</span>
                <span className="text-sm font-black uppercase tracking-widest">Vicegerency</span>
            </div>
          </div>
      </section>

      <section id="barelvi-thought" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-6 mb-4">Core Concepts of Barelvi Thought</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Veneration of Prophet Muhammad ﷺ",
              "Emphasis on intercession (wasila)",
              "Strong adherence to Sufi systems",
              "Focus on devotional Mawlid"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-sm font-bold">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
      </section>

      <section id="contradictions" className="space-y-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-rose-500 pl-6 mb-4">Key Philosophical Contradictions</h2>
          <div className="space-y-8">
            {[
              { title: "Self-Affirmation vs. Self-Negation", desc: "Iqbal promoted strengthening the individual self (Khudi), while Barelvi thought often celebrates devotional surrender." },
              { title: "Ijtihad vs. Taqlid", desc: "Iqbal encouraged independent reasoning (Ijtihad). Barelvi scholarship tends to stress adherence to established authorities (Taqlid)." }
            ].map((point, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:border-rose-500/20">
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm">{i+1}</span>
                  {point.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
      </section>

      <section id="iqbal-lawyer" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-primary pl-6 mb-6">Allama Iqbal Was Indeed a Lawyer</h2>
          <p>
            He qualified as a barrister from Lincoln’s Inn, London, and practiced law at the Lahore High Court for many years. He handled numerous civil and criminal cases and earned his livelihood through legal practice.
          </p>
      </section>

      <section id="relevance" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-indigo-500 pl-6 mb-8">Khudi’s Relevance to the Legal Profession</h2>
          <div className="grid gap-6">
            {[
              { icon: <Scale className="size-5" />, title: "Struggle for Justice", text: "Lawyers stand up for the weak, mirroring Iqbal’s call to actively shape reality." },
              { icon: <BookOpen className="size-5" />, title: "Creative Reasoning", text: "Modern lawyers must adapt to new tools, reflecting Iqbal’s emphasis on evolution of thought." },
              { icon: <Sparkles className="size-5" />, title: "Moral Courage", text: "Khudi demands ethical strength. A lawyer’s 'self' is constantly tested through commitment to truth." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                <div className="size-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
      </section>

      <div className="premium-card bg-[#111827] text-white space-y-10 py-16 px-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
            <Scale className="size-64" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary flex items-center justify-center">
                <User className="size-6 text-white" />
              </div>
              <h3 className="text-3xl font-black tracking-tighter">Professional Synthesis</h3>
            </div>
            <p className="text-xl font-medium leading-relaxed max-w-2xl text-slate-300">
              Khudi gives us dynamism, while spirituality offers emotional connection. For lawyers, strengthening Khudi means rejecting mediocrity.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href="/experts">
                <button className="h-14 px-10 rounded-2xl bg-primary text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20">
                  Find Legal Experts
                </button>
              </Link>
            </div>
          </div>
      </div>
    </BlogLayout>
  )
}
