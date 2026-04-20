"use client"

import { BlogLayout } from "@/components/BlogLayout"
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Globe, 
  ShieldCheck,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function TaskScamBlog() {
  const sidebarLinks = [
    { href: "#intro", label: "Background" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#scams", label: "2026 Trends" },
    { href: "#advice", label: "Lawyer Advice" },
    { href: "#fia", label: "How to File" },
  ]

  return (
    <BlogLayout
      title={
        <>
          پاکستان میں ٹاسک سکیم فراڈ 2026: <br />
          <span className="text-primary">300 روپے جمع کروائیں، 500 کمائیں، پھر لاکھوں ضائع</span> – وکیلوں کے لیے مکمل گائیڈ
        </>
      }
      date="20 April, 2026"
      author="Paktellect Legal Intelligence"
      category="Legal Safety"
      heroImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop"
      dir="rtl"
      accentIcon={<ShieldAlert className="size-4" />}
      accentLabel="Security Warning 2026"
      accentColorClass="rose-500"
      sidebarLinks={sidebarLinks}
    >
      {/* Markdown Body */}
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
                    <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary shrink-0">
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
          </ul>
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
                  <p className="text-xs font-medium">EasyPaisa / JazzCash / Bank contact immediately.</p>
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
    </BlogLayout>
  )
}
