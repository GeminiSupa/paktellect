"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { 
  ShieldAlert, 
  ArrowLeft, 
  Share2, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function BlogPostPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-noto-urdu" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 sm:pt-48 pb-20 overflow-hidden isolate" dir="ltr">
        <div className="absolute inset-0 -z-10">
          <Image 
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop" 
            alt="Task Scam Awareness" 
            fill 
            className="object-cover opacity-15 saturate-0" 
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
        </div>

        <article className="container mx-auto px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-rose-500/20 bg-rose-500/5 mb-8"
            >
              <ShieldAlert className="size-4 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Security Warning 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tighter mb-8 leading-[1.3]" 
              dir="rtl"
            >
              پاکستان میں ٹاسک سکیم فراڈ 2026: <br />
              <span className="text-primary">300 روپے جمع کروائیں، 500 کمائیں، پھر لاکھوں ضائع</span> – وکیلوں کے لیے مکمل گائیڈ
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
            <aside className="lg:col-span-1 border-r border-border pr-8 hidden lg:block" dir="ltr">
               <div className="sticky top-40 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">On this page</h4>
                    <nav className="flex flex-col gap-3">
                       <a href="#intro" className="text-sm font-bold hover:text-primary transition-colors">Background</a>
                       <a href="#how-it-works" className="text-sm font-bold hover:text-primary transition-colors">How it works</a>
                       <a href="#scams" className="text-sm font-bold hover:text-primary transition-colors">2026 Trends</a>
                       <a href="#advice" className="text-sm font-bold hover:text-primary transition-colors">Lawyer Advice</a>
                       <a href="#fia" className="text-sm font-bold hover:text-primary transition-colors">How to File</a>
                    </nav>
                  </div>
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <Zap className="size-5 text-primary mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">VakeelDiary</p>
                    <p className="text-xs font-medium leading-relaxed italic">Manage cybercrime cases professionally with our legal tools.</p>
                  </div>
               </div>
            </aside>

            {/* Markdown Body */}
            <div className="lg:col-span-3 space-y-12 text-lg leading-[1.8] font-medium text-slate-700 dark:text-slate-300">
               <div id="intro" className="premium-card bg-emerald-500/5 border-emerald-500/10">
                  <p className="font-bold text-slate-900 dark:text-white leading-[2]">
                  2026 میں پاکستان میں آن لائن ٹاسک سکیمز (Task Scams) تیزی سے پھیل رہی ہیں۔ واٹس ایپ، ٹیلی گرام اور فیس بک پر "سادہ ٹاسکس کریں، 500 سے 2000 روپے یومیہ کمائیں" جیسے پیغامات عام ہو گئے ہیں۔ شروع میں 300 روپے جمع کروا کر چھوٹی ادائیگی کرتے ہیں، پھر بڑی رقم مانگتے جاتے ہیں اور آخر میں صارف کا سارا پیسہ ضائع ہو جاتا ہے۔
                  </p>
                  <p className="mt-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  MCB بینک اور FIA نے 2026 میں بار بار وارننگ جاری کی ہیں۔ خاص طور پر "Upwork Pakistan" جیسے ٹیلی گرام گروپس میں لوگوں نے لاکھوں روپے گنوائے ہیں۔
                  </p>
               </div>

               <section id="how-it-works" className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-r-4 border-primary pr-6 mb-4">یہ فراڈ کیسے کام کرتا ہے (Step-by-Step)</h2>
                  <div className="grid gap-4">
                     {[
                        { title: "لالچ کا پیغام", desc: "واٹس ایپ یا ٹیلی گرام پر 'کوئی سرمایہ کاری نہیں، صرف کلکس، لائکس یا ریویوز کریں اور 500 روپے کمائیں'۔" },
                        { title: "اعتماد بنانا", desc: "پہلے 1-2 ٹاسکس پر 300-600 روپے واقعی بھیج دیتے ہیں (EasyPaisa یا JazzCash سے)۔" },
                        { title: "جال", desc: "'بڑا ٹاسک کرنے کے لیے 300 روپے ٹاسک فیس جمع کروائیں'۔" },
                        { title: "رقم بڑھتی جاتی ہے", desc: "1000، 5000، 20,000 روپے… 'واپسی' یا 'لیول اپ' کے نام پر۔" },
                        { title: "آخری نتیجہ", desc: "بلاک، ڈیش بورڈ بند، پیسہ گیا۔" }
                     ].map((step, i) => (
                        <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-primary/20">
                           <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary transition-transform group-hover:scale-110 shrink-0">
                              {i+1}
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{step.title}</h4>
                              <p className="text-slate-600 dark:text-slate-400 text-base">{step.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section id="scams" className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-r-4 border-rose-500 pr-6 mb-4">پاکستان میں اس جیسے دوسرے فراڈز (2026 کی صورتحال)</h2>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                        <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-2" />
                        <span><strong>فری لانسنگ جاب سکیمز:</strong> "Upwork Pakistan" گروپ میں 28 لاکھ تک نقصان کے کیسز رپورٹ ہوئے۔</span>
                     </li>
                     <li className="flex items-start gap-3 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                        <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-2" />
                        <span><strong>فیک گورنمنٹ جابز:</strong> رجسٹریشن فیس کے نام پر لاکھوں لوٹے جا رہے ہیں۔</span>
                     </li>
                     <li className="flex items-start gap-3 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                        <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-2" />
                        <span><strong>کریپٹو اور انویسٹمنٹ سکیمز:</strong> چھوٹی ادائیگی کے بعد بڑی رقم مانگتے ہیں۔</span>
                     </li>
                     <li className="flex items-start gap-3 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                        <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-2" />
                        <span><strong>فری لانس ٹاسک فراڈ:</strong> PDF کنورٹ، ڈیٹا انٹری کے نام پر۔</span>
                     </li>
                  </ul>
                  <p className="text-sm font-black text-rose-500 uppercase tracking-widest text-center mt-4">FIA کے مطابق سائبر فراڈ کے کیسز میں تیزی سے اضافہ ہوا ہے۔</p>
               </section>

               <section id="advice" className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-r-4 border-emerald-500 pr-6 mb-4">وکیلوں کے لیے خاص مشورہ</h2>
                    <p className="text-lg italic">بطور وکیل آپ کو یہ کیسز روزانہ ملتے ہیں۔ یہاں کیا کریں:</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                     <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                           <CheckCircle2 className="size-6 text-emerald-500" />
                           خود بچاؤ کے اصول
                        </h3>
                        <ul className="space-y-4 text-base font-bold">
                           <li>• کوئی بھی "ٹاسک" کے لیے پیسہ کبھی نہ بھیجیں۔</li>
                           <li>• واٹس ایپ/ٹیلی گرام گروپس جوائن نہ کریں۔</li>
                           <li>• بینک ڈیٹیلز یا اسکرین شیئر کبھی نہ کریں۔</li>
                           <li>• "بہت آسان کمائی" والی آفرز پر شک کریں۔</li>
                        </ul>
                     </div>
                     <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                           <ShieldCheck className="size-6 text-indigo-500" />
                           کلائنٹ کیس ہینڈلنگ
                        </h3>
                        <ul className="space-y-4 text-base font-bold">
                           <li>• فوری ایکشن: مزید پیسہ نہ بھیجیں اور بلاک کریں۔</li>
                           <li>• ثبوت جمع کریں: چیٹس اور اسکرین شاٹس۔</li>
                           <li>• کیس مینجمنٹ: VakeelDiary میں محفوظ کریں۔</li>
                        </ul>
                     </div>
                  </div>
               </section>

               <section id="fia" className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight border-r-4 border-primary pr-6">کہاں اور کیسے کمپلینٹ کریں (2026 کے طریقے)</h2>
                  
                  <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                       <h4 className="text-lg font-black mb-6 text-primary flex items-center gap-2">
                          <Globe className="size-5" /> 1. FIA سائبر کرائم ونگ
                       </h4>
                       <div className="grid gap-4 text-base font-bold" dir="ltr">
                          <div className="flex justify-between items-center bg-white dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                             <span className="text-muted-foreground">Portal</span>
                             <a href="https://complaint.fia.gov.pk/" className="text-primary hover:underline">complaint.fia.gov.pk</a>
                          </div>
                          <div className="flex justify-between items-center bg-white dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                             <span className="text-muted-foreground">Helpline</span>
                             <span>1991 / 051-111-345-786</span>
                          </div>
                          <div className="flex justify-between items-center bg-white dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                             <span className="text-muted-foreground">Email</span>
                             <span>complaints@fia.gov.pk</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <h4 className="text-sm font-black mb-4 flex items-center gap-2" dir="ltr">
                             <PhoneCall className="size-4 text-primary" /> PTA (Block Numbers)
                          </h4>
                          <p className="text-sm font-bold" dir="ltr">0800-55055 | complaint.pta.gov.pk</p>
                       </div>
                       <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <h4 className="text-sm font-black mb-4 flex items-center gap-2" dir="ltr">
                             <ShieldCheck className="size-4 text-emerald-500" /> Wallet/Bank Support
                          </h4>
                          <p className="text-xs font-medium">EasyPaisa / JazzCash / Bank contact immediately to freeze transactions.</p>
                       </div>
                    </div>
                  </div>
               </section>

               <div className="premium-card cinematic-surface text-white space-y-8 animate-float">
                  <div className="flex items-center gap-3">
                    <Zap className="size-10 text-emerald-300 fill-emerald-300 shadow-lg shadow-emerald-500/50" />
                    <h3 className="text-3xl font-black tracking-tight" dir="ltr">VakeelDiary</h3>
                  </div>
                  <h4 className="text-2xl font-black leading-snug">وکیلوں کے لیے بہترین ٹول کیوں ہے؟</h4>
                  <ul className="grid sm:grid-cols-2 gap-4 text-emerald-50/90 font-medium">
                     <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> کلائنٹ کے تمام ثبوت، چیٹس ایک جگہ</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> خودکار یاد دہانیاں (reminders)</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> FIA کمپلینٹ کے لیے نوٹس</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> موبائل سے کہیں بھی رسائی</li>
                  </ul>
                  <div className="pt-4" dir="ltr">
                    <Link href="/signup">
                      <button className="h-14 px-10 rounded-2xl bg-white text-primary font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/40">
                         Start Free Trial
                      </button>
                    </Link>
                  </div>
               </div>

               <div className="pt-20 border-t border-border flex flex-col items-center text-center gap-8">
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Share this guide with other professionals</p>
                  <div className="flex gap-4">
                     <button className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:rotate-12 duration-500">
                        <Share2 className="size-6" />
                     </button>
                     <Link href="/blog">
                        <button className="h-14 px-10 rounded-2xl border border-border hover:bg-muted font-bold flex items-center gap-2 group transition-all">
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
