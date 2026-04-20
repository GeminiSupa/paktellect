"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { 
  ArrowLeft, 
  Share2, 
  Calendar, 
  User, 
  CheckCircle2, 
  BookOpen,
  Brain,
  Scale,
  Sparkles,
  History,
  MessageCircle
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function IqbalKhudiBlogPostPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 sm:pt-48 pb-20 overflow-hidden isolate">
        <div className="absolute inset-0 -z-10">
          <Image 
            src="https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?q=80&w=2069&auto=format&fit=crop" 
            alt="Philosophical books and calligraphy" 
            fill 
            className="object-cover opacity-20 saturate-[0.5]" 
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
        </div>

        <article className="container mx-auto px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8"
            >
              <Brain className="size-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Philosophical Review 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-7xl font-black tracking-tighter mb-8 leading-[1.1]" 
            >
              Allama Iqbal’s Concept of Khudi and Its <br />
              <span className="text-primary italic">Philosophical Review</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-y border-border py-6 mb-12"
            >
              <div className="flex items-center gap-2 italic">
                <Calendar className="size-4 text-primary" />
                <span>21 April, 2026</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 italic">
                <User className="size-4 text-primary" />
                <span>Paktellect Legal Intelligence</span>
              </div>
            </motion.div>
        </article>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar / Table of Contents */}
            <aside className="lg:col-span-1 border-r border-border pr-8 hidden lg:block">
               <div className="sticky top-40 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Jump to section</h4>
                    <nav className="flex flex-col gap-3">
                       <a href="#what-is-khudi" className="text-sm font-bold hover:text-primary transition-colors">What is Khudi?</a>
                       <a href="#barelvi-thought" className="text-sm font-bold hover:text-primary transition-colors">Barelvi Thought</a>
                       <a href="#contradictions" className="text-sm font-bold hover:text-primary transition-colors">Contradictions</a>
                       <a href="#iqbal-lawyer" className="text-sm font-bold hover:text-primary transition-colors">Iqbal as a Lawyer</a>
                       <a href="#relevance" className="text-sm font-bold hover:text-primary transition-colors">Legal Relevance</a>
                    </nav>
                  </div>
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <History className="size-5 text-primary mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">History & Law</p>
                    <p className="text-xs font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">Understanding the legacy of Pakistan's spiritual founder.</p>
                  </div>
               </div>
            </aside>

            {/* Content Body */}
            <div className="lg:col-span-3 space-y-12 text-lg leading-[1.8] font-medium text-slate-700 dark:text-slate-300">
               <div id="intro" className="premium-card bg-primary/5 border-primary/10 border-none shadow-none p-0">
                  <p className="font-bold text-slate-900 dark:text-white leading-[1.8] mb-8">
                    In an era when Muslim youth are searching for identity, self-confidence, and a renewed understanding of faith, Allama Muhammad Iqbal’s philosophy of Khudi (Selfhood or Ego) emerges as a powerful guiding force. However, this philosophy also creates tensions with certain traditional religious circles, particularly the Barelvi school of thought.
                  </p>
               </div>

               <section id="what-is-khudi" className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-primary pl-6 mb-4">What is Iqbal’s Philosophy of Khudi?</h2>
                  <p>
                    In his famous Persian work *Asrar-i-Khudi* (Secrets of the Self, 1915), Iqbal presents Khudi not as mere selfishness or egoism, but as a dynamic process of self-awareness, self-reliance, and self-strengthening. Iqbal argued that the decline of Muslims stemmed from philosophies that promoted self-negation (fana) and viewing the world as an illusion.
                  </p>
                  <blockquote className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border-r-4 border-primary text-center italic font-bold text-xl text-slate-800 dark:text-slate-200" dir="rtl">
                    “Khudi ko kar buland itna ke har taqdeer se pehle<br />
                    Khuda bande se khud poochhe, bata teri raza kya hai?”
                  </blockquote>
                  <p>According to Iqbal, Khudi passes through three stages:</p>
                  <ul className="grid sm:grid-cols-3 gap-4">
                    <li className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center">
                        <span className="text-primary font-black mb-2 text-2xl">01</span>
                        <span className="text-sm font-black uppercase tracking-widest">Obedience</span>
                    </li>
                    <li className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center">
                        <span className="text-primary font-black mb-2 text-2xl">02</span>
                        <span className="text-sm font-black uppercase tracking-widest">Self-control</span>
                    </li>
                    <li className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center">
                        <span className="text-primary font-black mb-2 text-2xl">03</span>
                        <span className="text-sm font-black uppercase tracking-widest">Vicegerency</span>
                    </li>
                  </ul>
               </section>

               <section id="barelvi-thought" className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-emerald-500 pl-6 mb-4">Core Concepts of Barelvi Thought</h2>
                  <p>
                    The Barelvi school, founded by Imam Ahmad Raza Khan Barelvi, represents a major strand of Sunni Islam in South Asia. Its key features include:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Veneration of Prophet Muhammad ﷺ (Hazir-o-Nazir)",
                      "Emphasis on intercession (wasila) and shrines",
                      "Strong adherence to Sufi pir-muridi system",
                      "Focus on devotional practices and Mawlid"
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
                      { title: "Self-Affirmation vs. Self-Negation", desc: "Iqbal promoted strengthening the individual self (Khudi), while Barelvi thought often celebrates devotional surrender and self-effacement in Sufi traditions." },
                      { title: "Ijtihad vs. Taqlid", desc: "Iqbal called for Rethinking outdated metaphysics and encouraged independent reasoning (Ijtihad). Barelvi scholarship tends to stress adherence to established authorities (Taqlid)." },
                      { title: "Active Engagement vs. Devotional Mysticism", desc: "Iqbal criticized escapism in mysticism, calling for active world-engagement. Barelvi practice values communal devotional acts that foster emotional connection." }
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
                  <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1">
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-primary pl-6 mb-6">Allama Iqbal Was Indeed a Lawyer</h2>
                      <p className="mb-4">
                        He qualified as a barrister from Lincoln’s Inn, London, in 1906–1908, and practiced law at the Lahore High Court for many years. He handled numerous civil and criminal cases and earned his livelihood through legal practice.
                      </p>
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 italic text-sm font-medium">
                        "The legal profession thrives on the very qualities Iqbal celebrated in Khudi: self-awareness, courage, intellectual independence, and purposeful action."
                      </div>
                    </div>
                  </div>
               </section>

               <section id="relevance" className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-indigo-500 pl-6 mb-8">Khudi’s Relevance to the Legal Profession</h2>
                  <div className="grid gap-6">
                    {[
                      { icon: <Scale className="size-5" />, title: "Struggle for Justice", text: "Lawyers stand up for the weak, mirroring Iqbal’s call to actively shape reality instead of passively accepting fate." },
                      { icon: <BookOpen className="size-5" />, title: "Creative Reasoning", text: "Modern lawyers must adapt to new tools and technologies, reflecting Iqbal’s emphasis on reconstruction and evolution of thought." },
                      { icon: <Sparkles className="size-5" />, title: "Moral Courage", text: "Khudi demands ethical strength. In the courtroom, a lawyer’s 'self' is constantly tested through commitment to truth." }
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
                      <h3 className="text-3xl font-black tracking-tighter">Conclusion</h3>
                    </div>
                    <p className="text-xl font-medium leading-relaxed max-w-2xl text-slate-300">
                      Today’s professionals can benefit from both: **Khudi** gives us self-confidence and dynamism, while **spirituality** offers emotional connection and reverence.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <Link href="/experts">
                        <button className="h-14 px-10 rounded-2xl bg-primary text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20">
                          Find Legal Experts
                        </button>
                      </Link>
                      <button className="h-14 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all flex items-center gap-2">
                        <MessageCircle className="size-5" />
                        Join Conversation
                      </button>
                    </div>
                  </div>
               </div>

               <div className="pt-20 border-t border-border flex flex-col items-center text-center gap-8">
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Share this philosophical review</p>
                  <div className="flex gap-4">
                     <button className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:rotate-12 duration-500">
                        <Share2 className="size-6" />
                     </button>
                     <Link href="/blog">
                        <button className="h-14 px-10 rounded-2xl border border-border hover:bg-muted font-bold flex items-center gap-4 group transition-all">
                           <ArrowLeft className="size-5 group-hover:-translate-x-1 duration-300" />
                           <span>Back to Blog</span>
                        </button>
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
