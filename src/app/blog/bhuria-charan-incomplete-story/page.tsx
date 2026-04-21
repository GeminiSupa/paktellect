"use client"

import { BlogLayout } from "@/components/BlogLayout"
import { 
  Book, 
  MapPin, 
  Wind, 
  Moon, 
  MessagesSquare,
  Sparkles,
  Heart
} from "lucide-react"
import Link from "next/link"

export default function BhuriaCharanBlog() {
  const sidebarLinks = [
    { href: "#village", label: "ہڈالی کی یادیں" },
    { href: "#cousin", label: "کہانی سنانے والا" },
    { href: "#atmosphere", label: "شام کا منظر" },
    { href: "#mystery", label: "بھوریاء چرن کا سحر" },
    { href: "#conclusion", label: "ادھوری کہانی" },
  ]

  return (
    <BlogLayout
      title="بھوریاء چرن – ایک ادھوری کہانی (افسانہ)"
      subtitle="بچپن کی وہ سرد شامیں، ہڈالی کی مٹی اور ادھورے قصوں کی خلش"
      date="21 April, 2026"
      author="Paktellect Stories"
      category="Literature"
      heroImage="https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=2070&auto=format&fit=crop"
      dir="rtl"
      accentIcon={<Book className="size-4" />}
      accentLabel="Urdu Literature"
      accentColorClass="primary"
      sidebarLinks={sidebarLinks}
    >
      <div className="space-y-12 text-xl leading-[2] font-medium text-slate-700 dark:text-slate-300">
        
        <section id="village" className="space-y-6">
          <p>
            بچپن کا وہ زمانہ تھا جب ہم تیسری، چوتھی جماعت کے کم عقل مگر بے فکر بچے تھے۔
            سردیوں کی چھٹیاں شروع ہوتیں تو دل شہر میں نہیں ٹھہرتا تھا، بس ایک ہی دھن سوار ہو جاتی — ہڈالی جانا ہے، ضلع خوشاب کا ہمارا گاؤں۔
          </p>
          <div className="premium-card bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 italic">
             پنجاب کی وہ ٹھنڈی مگر زندگی سے بھری سردیاں، جن میں صبح کی دھند، دوپہر کی دھوپ اور شام کی ٹھنڈ تین الگ کہانیاں لگتیں۔
             دادا کے گاؤں میں باقاعدہ، لمبی چوڑی ڈگریوں والی تعلیم عام نہیں تھی، مگر کتابوں اور کہانیوں سے انس لوگوں کے دلوں میں پھر بھی تھا۔
          </div>
        </section>

        <section id="cousin" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-950 dark:text-white border-r-4 border-primary pr-6">کہانی کا کردار</h2>
          <p>
            ہمارا بڑا کزن اس سارے ماحول کا اپنا الگ ہی کردار تھا۔ وہ پڑھتا بھی تھا اور کام بھی کرتا تھا۔ دن بھر کبھی کسی کے کھیت میں ہاتھ بٹاتا، کبھی مزدوری، کبھی کسی گھر کے چھوٹے موٹے کام۔
            شام تک پسینہ، تھکن اور ذمہ داریاں اس کے ساتھ لپٹی رہتیں، مگر آنکھوں میں پھر بھی ایک عجب سی چمک باقی رہتی، جیسے ذہن کہیں اور بھی مصروف ہو — کہانیوں کی کسی دنیا میں۔
          </p>
        </section>

        <section id="atmosphere" className="space-y-8">
          <h2 className="text-3xl font-black text-slate-950 dark:text-white border-r-4 border-emerald-500 pr-6">انتظار اور شام</h2>
          <p>
            ہمیں شام کا بے چینی سے انتظار رہتا۔ سورج جیسے ہی ہڈالی کے کھیتوں اور ٹیلوں کے پیچھے ڈوبنے لگتا، گاؤں کی ٹھنڈی ہوا کے ساتھ ایک اور ہی خوشی جاگ اٹھتی:
            <strong> "آج بھائی آئے گا نا کہانی سنانے؟"</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-orange-500/5 border border-orange-500/10">
               <div className="flex items-center gap-3 mb-4">
                  <MessagesSquare className="size-6 text-orange-500" />
                  <h4 className="text-xl font-black">محفل کا سماں</h4>
               </div>
               <p className="text-base leading-relaxed">
                  صحن میں چارپائیاں بچھ جاتیں۔ کوئی مونگ پھلی لیے بیٹھا ہوتا، کوئی بھنے ہوئے چنے، کہیں جلتی لکڑی کے دھوئیں کی خوشبو، کہیں ٹھنڈی مٹی کی باس۔
               </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10">
               <div className="flex items-center gap-3 mb-4">
                  <Moon className="size-6 text-indigo-500" />
                  <h4 className="text-xl font-black">بے تابی</h4>
               </div>
               <p className="text-base leading-relaxed">
                  ہم رضائیوں میں گھس کر ایک جگہ سمٹ جاتے اور دروازے کی طرف نظریں جما کر اس کا انتظار کرتے رہتے کہ کب وہ ہماری طرف آتا ہوا دکھائی دے۔
               </p>
            </div>
          </div>
        </section>

        <section id="mystery" className="space-y-6">
          <h2 className="text-3xl font-black text-slate-950 dark:text-white border-r-4 border-primary pr-6">بھوریاء چرن کا سحر</h2>
          <p>
            وہ آتا تو چہرے پر دن بھر کی مشقت کی تھکن ضرور ہوتی، مگر آنکھوں میں ایک الگ سی روشنی بھی ہوتی۔ چائے، روٹی، گھر کی مختصر باتیں، اور پھر ہماری ضد شروع ہو جاتی:
            <span className="text-primary font-black block mt-2">"بھائی، آج بھوریاء چرن سے آگے سناؤ نا!"</span>
          </p>
          <p>
            اس کی آواز دھیمی ہو جاتی، لہجہ بدل جاتا، اور پھر مسعود کی دنیا ہمارے سامنے کھلنے لگتی — وہ لڑکا، اس کے خواب، اس کی کمزوریاں، اس کا لالچ، اس کا خوف، اور اس سب کے اوپر چھایا ہوا بھوریاء چرن کا سایا۔
            وہ روز تھوڑا سا سناتا۔ کہانی کسی موڑ پر آ کر رک جاتی۔ کہیں کوئی دروازہ کھلنے ہی والا ہوتا، کہیں کوئی تعویذ جلنے کے قریب، کہیں قبرستان کا موڑ سامنے آ کر ٹھہر جاتا، اور وہیں وہ کہہ دیتا:
            <strong> "بس، باقی کل۔"</strong>
          </p>
        </section>

        <section id="conclusion" className="space-y-10">
          <h2 className="text-3xl font-black text-slate-950 dark:text-white border-r-4 border-indigo-500 pr-6">ایک ادھوری خلش</h2>
          <p>
            یوں ہماری سردیوں کی چھٹیاں گزرتی رہتیں۔ ہڈالی کی گلیاں، خوشاب کی سرد ہوا، ہماری بچوں والی ہنسی، اور ہر شام بھوریاء چرن کی ایک نئی جھلک۔
            پھر جیسے اچانک چھٹیاں آتی تھیں، ویسے ہی اچانک ختم ہو جاتیں۔ ہم بستے اٹھاتے، شہر واپسی کی تیاری کرتے، اور دل میں ایک ہی خلش لیے جاتے:
            <span className="italic block mt-4 text-slate-500">"ابھی تو کہانی ختم ہی نہیں ہوئی…"</span>
          </p>
          
          <div className="premium-card cinematic-surface text-white p-12 space-y-6">
            <Sparkles className="size-10 text-emerald-300" />
            <p className="text-2xl font-black leading-relaxed">
              زندگی آگے بڑھ گئی۔ لیکن ہڈالی کی وہ ایک سرد شام آج بھی دل کے اندر کہیں پوری گرمی اور نرمی کے ساتھ روشن ہے۔
            </p>
            <p className="text-lg opacity-90">
              اور کہانی؟ وہ آج بھی ادھوری ہے، بالکل ہماری اپنی طرح — جو بڑے تو ہو گئے، مگر اندر کہیں وہی تیسری، چوتھی جماعت کے بچے بن کر کسی بھوریاء چرن کی اگلی قسط کا انتظار کرتے رہتے ہیں۔
            </p>
          </div>
        </section>

        <div className="flex justify-center pt-20">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-black text-sm uppercase tracking-widest text-slate-500">
            <Heart className="size-4 text-rose-500" />
            ایک آخری قسط کی منتظر بیٹھی ہے
          </div>
        </div>

      </div>
    </BlogLayout>
  )
}
