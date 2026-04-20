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
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Scale,
  Award,
  Users
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function LawyerBlogPostPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 sm:pt-48 pb-20 overflow-hidden isolate">
        <div className="absolute inset-0 -z-10">
          <Image 
            src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop" 
            alt="Lawyer using digital tools" 
            fill 
            className="object-cover opacity-20 saturate-[0.8]" 
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
        </div>

        <article className="container mx-auto px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8"
            >
              <Scale className="size-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Legal Excellence 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-7xl font-black tracking-tighter mb-8 leading-[1.1]" 
            >
              Why Every Lawyer in Pakistan Should Register on Online Tools Like <br />
              <span className="text-primary italic">Paktellect.vercel.app</span> in 2026
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-y border-border py-6 mb-12"
            >
              <div className="flex items-center gap-2 italic">
                <Calendar className="size-4 text-primary" />
                <span>20 April, 2026</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 italic">
                <User className="size-4 text-primary" />
                <span>Paktellect Insights</span>
              </div>
            </motion.div>
        </article>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar / Table of Contents */}
            <aside className="lg:col-span-1 border-l border-border pl-8 hidden lg:block order-last">
               <div className="sticky top-40 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">On this page</h4>
                    <nav className="flex flex-col gap-3">
                       <a href="#need" className="text-sm font-bold hover:text-primary transition-colors">Digital Need</a>
                       <a href="#why" className="text-sm font-bold hover:text-primary transition-colors">Why Register</a>
                       <a href="#gap" className="text-sm font-bold hover:text-primary transition-colors">Bridging the Gap</a>
                       <a href="#practice" className="text-sm font-bold hover:text-primary transition-colors">Management</a>
                    </nav>
                  </div>
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                    <Zap className="size-5 text-primary mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Lawyer Tools</p>
                    <p className="text-xs font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">Join the top 1% of legal experts in Pakistan.</p>
                  </div>
               </div>
            </aside>

            {/* Content Body */}
            <div className="lg:col-span-3 space-y-12 text-lg leading-[1.8] font-medium text-slate-700 dark:text-slate-300">
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
                  Paktellect.vercel.app is an emerging online platform designed to connect legal experts with people seeking professional advice. Here’s why registering makes strong business sense:
                  </p>
                  
                  <div className="grid gap-4">
                     {[
                        { icon: <Globe className="size-5" />, title: "Increased Visibility", desc: "Appear in targeted searches when people look for lawyers in your specific city or practice area." },
                        { icon: <ShieldCheck className="size-5" />, title: "Builds Credibility", desc: "Verified profiles with ratings and feedback make you look more professional and reliable." },
                        { icon: <Target className="size-5" />, title: "Targeted Audience", desc: "Reach serious potential clients who are actively seeking legal help, not just random inquiries." },
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
                  <p>
                  One of the biggest challenges in Pakistan’s legal system has been the distance between ordinary citizens and qualified lawyers. Digital tools improve access to justice in several powerful ways:
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10">
                        <CheckCircle2 className="size-5 text-indigo-500 shrink-0 mt-1" />
                        <span><strong>Easy Discovery:</strong> Consumers can search by location, practice area, or language and instantly find suitable experts.</span>
                     </li>
                     <li className="flex items-start gap-3 bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10">
                        <CheckCircle2 className="size-5 text-indigo-500 shrink-0 mt-1" />
                        <span><strong>Transparent Information:</strong> Detailed profiles show experience, success stories, and fee structures.</span>
                     </li>
                     <li className="flex items-start gap-3 bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10">
                        <CheckCircle2 className="size-5 text-indigo-500 shrink-0 mt-1" />
                        <span><strong>Affordable Initial Access:</strong> Lowering barriers for people who feel intimidated by traditional chambers.</span>
                     </li>
                  </ul>
               </section>

               <section id="practice" className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-primary pl-6">Practice Management & Visibility</h2>
                  <p>
                  For maximum efficiency, lawyers should combine online directory registration with strong internal tools. A good lawyer management system like **Vakeel Diary** (available at vakeeldiary.com) helps you organize cases, hearings, billing, and documents efficiently.
                  </p>
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                     <h4 className="text-lg font-black mb-4 text-primary flex items-center gap-2">
                        <Zap className="size-5" /> Professional Synergy
                     </h4>
                     <p className="text-base font-bold italic leading-relaxed">
                        When paired with platforms like Paktellect.vercel.app, you can handle increased client flow without getting overwhelmed by administrative work.
                     </p>
                  </div>
               </section>

               <div className="premium-card cinematic-surface text-white space-y-8 animate-float">
                  <div className="flex items-center gap-3">
                    <Award className="size-10 text-emerald-300 fill-emerald-300 shadow-lg shadow-emerald-500/50" />
                    <h3 className="text-3xl font-black tracking-tight italic">Take the Digital Step Today</h3>
                  </div>
                  <h4 className="text-xl font-medium leading-relaxed opacity-90">
                  The legal profession in Pakistan is rapidly moving online. Lawyers who embrace digital tools early are gaining a clear advantage in client acquisition, reputation building, and practice growth.
                  </h4>
                  <div className="pt-4">
                    <Link href="/signup">
                      <button className="h-14 px-10 rounded-2xl bg-white text-primary font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/40">
                         Register Your Profile
                      </button>
                    </Link>
                  </div>
               </div>

               <div className="pt-20 border-t border-border flex flex-col items-center text-center gap-8">
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recommend this to your colleagues</p>
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

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
