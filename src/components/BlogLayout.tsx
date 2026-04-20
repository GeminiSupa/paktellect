"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { 
  ArrowLeft, 
  Share2, 
  Calendar, 
  User, 
  Zap,
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

interface SidebarLink {
  href: string
  label: string
}

interface BlogLayoutProps {
  title: string | React.ReactNode
  subtitle?: string
  date: string
  author: string
  heroImage: string
  category: string
  dir?: "ltr" | "rtl"
  sidebarLinks?: SidebarLink[]
  children: React.ReactNode
  accentIcon?: React.ReactNode
  accentLabel?: string
  accentColorClass?: string // e.g. "rose-500", "emerald-500", "primary"
}

export function BlogLayout({
  title,
  subtitle,
  date,
  author,
  heroImage,
  category,
  dir = "ltr",
  sidebarLinks = [],
  children,
  accentIcon = <Zap className="size-4" />,
  accentLabel = "Blog Intelligence",
  accentColorClass = "primary"
}: BlogLayoutProps) {
  const isRtl = dir === "rtl"

  return (
    <main 
        className={`min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground ${isRtl ? 'font-noto-urdu' : ''}`} 
        dir={dir}
    >
      <Navbar />

      {/* Hero Section */}
      <div className={`relative pt-32 sm:pt-48 pb-20 overflow-hidden isolate`} dir="ltr">
        <div className="absolute inset-0 -z-10">
          <Image 
            src={heroImage} 
            alt={typeof title === 'string' ? title : "Blog Hero"} 
            fill 
            className="object-cover opacity-15 saturate-[0.8] transition-opacity duration-1000" 
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
        </div>

        <article className="container mx-auto px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border bg-${accentColorClass}/5 border-${accentColorClass}/20 mb-8`}
            >
              <div className={`text-${accentColorClass}`}>
                {accentIcon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-${accentColorClass}`}>
                {accentLabel}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.2] lg:leading-[1.1] ${isRtl ? 'font-noto-urdu leading-[1.4]' : ''}`}
              dir={dir}
            >
              {title}
            </motion.h1>

            {subtitle && (
               <motion.p
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.15 }}
                 className="text-lg sm:text-xl text-muted-foreground font-medium mb-10 max-w-2xl mx-auto italic"
               >
                 {subtitle}
               </motion.p>
            )}

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-y border-border py-6 mb-12"
            >
              <div className="flex items-center gap-2 italic">
                <Calendar className="size-4 text-primary" />
                <span>{date}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 italic">
                <User className="size-4 text-primary" />
                <span>{author}</span>
              </div>
            </motion.div>
        </article>
      </div>

      {/* Main Content Section */}
      <section className="container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar (RHS for LTR, LHS for RTL visually) */}
            <aside 
                className={`lg:col-span-1 border-border hidden lg:block ${isRtl ? 'border-l pl-8' : 'border-r pr-8'}`}
                dir="ltr"
            >
               <div className="sticky top-40 space-y-8">
                  {sidebarLinks.length > 0 && (
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">On this page</h4>
                        <nav className="flex flex-col gap-3">
                           {sidebarLinks.map((link) => (
                              <a 
                                 key={link.href} 
                                 href={link.href} 
                                 className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group"
                              >
                                 <ChevronRight className="size-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                 {link.label}
                              </a>
                           ))}
                        </nav>
                     </div>
                  )}

                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                    <Zap className="size-5 text-primary mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Legal Ecosystem</p>
                    <p className="text-xs font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">
                        Join Pakistan&apos;s premium professional directory.
                    </p>
                  </div>
               </div>
            </aside>

            {/* Markdown/Content Body */}
            <div className={`lg:col-span-3 space-y-12 text-lg leading-[1.8] font-medium text-slate-700 dark:text-slate-300`}>
                {children}

                {/* Footer Sharing/Nav Area */}
                <div className="pt-20 border-t border-border flex flex-col items-center text-center gap-8">
                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Share this insight with your network</p>
                    <div className="flex gap-4">
                        <button className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:rotate-12 duration-500">
                            <Share2 className="size-6" />
                        </button>
                        <Link href="/blog">
                            <button className="h-14 px-10 rounded-2xl border border-border hover:bg-muted font-bold flex items-center gap-2 group transition-all">
                            <ArrowLeft className={`size-5 transition-transform duration-300 ${isRtl ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
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
