"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Calendar, ArrowRight, ShieldCheck, Zap, Newspaper } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function BlogListingPage() {
  const blogs = [
    {
      slug: "allama-iqbal-khudi-vs-barelvi-thought-review",
      title: "Allama Iqbal’s Concept of Khudi vs Barelvi Thought: A Philosophical Review",
      excerpt: "Explore the dynamic relationship between Iqbal's selfhood philosophy and traditional Barelvi devotion, and how it shapes the modern lawyer.",
      date: "April 21, 2026",
      category: "Philosophy",
      image: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?q=80&w=2069&auto=format&fit=crop",
      author: "Paktellect Legal Intelligence",
      isUrdu: false
    },
    {
      slug: "why-lawyers-pakistan-register-online-2026",
      title: "Why Every Lawyer in Pakistan Should Register on Online Tools Like Paktellect in 2026",
      excerpt: "In today’s digital age, physical offices aren't enough. Discover why online visibility is the new standard for legal growth and client trust in Pakistan.",
      date: "April 20, 2026",
      category: "Digital Growth",
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop",
      author: "Paktellect Insights",
      isUrdu: false
    },
    {
      slug: "task-scheme-fraud-pakistan-2026",
      title: "پاکستان میں ٹاسک سکیم فراڈ 2026: وکیلوں کے لیے مکمل گائیڈ",
      excerpt: "کیا آپ کو بھی ریویو کرنے یا کلک کرنے پر پیسے ملنے کا پیغام ملا ہے؟ جانیں کہ یہ فراڈ کیسے کام کرتا ہے اور آپ خود کو اور اپنے کلائنٹس کو کیسے محفوظ رکھ سکتے ہیں۔",
      date: "April 20, 2026",
      category: "Legal Safety",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop",
      author: "Paktellect Team",
      isUrdu: true
    }
  ]

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <section className="container mx-auto px-6 pt-36 sm:pt-48 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 mb-8">
            <Newspaper className="size-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Perspectives & News</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-linear-to-br from-foreground to-foreground/50">
            Insights for the <br className="hidden sm:block" />
            <span className="text-primary italic">Modern Professional</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto italic">
            Essential updates on security, legality, and the freelance economy in Pakistan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col premium-card overflow-hidden !p-0 hover:-translate-y-2 duration-500 hover:shadow-emerald-500/10"
            >
              <Link href={`/blog/${blog.slug}`} className="flex-1 flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden overflow-hidden rounded-t-[2.5rem]">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest">
                      {blog.category}
                    </div>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    <Calendar className="size-3 text-primary" />
                    <span>{blog.date}</span>
                    <span className="size-1 rounded-full bg-border" />
                    <span>{blog.author}</span>
                  </div>
                  
                  <h3 className={`text-xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors leading-snug ${blog.isUrdu ? 'font-noto-urdu text-right leading-relaxed' : ''}`} dir={blog.isUrdu ? 'rtl' : 'ltr'}>
                    {blog.title}
                  </h3>
                  
                  <p className={`text-sm text-muted-foreground font-medium flex-1 mb-8 leading-relaxed ${blog.isUrdu ? 'text-right font-noto-urdu' : ''}`} dir={blog.isUrdu ? 'rtl' : 'ltr'}>
                    {blog.excerpt}
                  </p>
                  
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                       Read Analysis
                       <ArrowRight className="size-3 group-hover:translate-x-1 duration-300" />
                    </span>
                    <div className="flex -space-x-2">
                       <Zap className="size-4 text-emerald-500 fill-emerald-500" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Placeholder for future blogs */}
          <div className="hidden lg:flex flex-col items-center justify-center p-10 border-2 border-dashed border-border rounded-[3rem] opacity-40 hover:opacity-100 transition-opacity">
             <div className="size-16 rounded-[1.5rem] bg-muted flex items-center justify-center mb-6">
                <Zap className="size-8 text-primary" />
             </div>
             <p className="text-sm font-black uppercase tracking-widest text-center">New insights <br />dropping soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
