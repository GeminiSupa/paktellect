"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"

const PHONE_DISPLAY = "+92 349 0554719"
const PHONE_HREF = "tel:+923490554719"
const EMAIL = "info@ux4u.online"
const ADDRESS = "I 16-3 Service Road East, Islamabad"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <section className="container mx-auto px-6 pt-36 sm:pt-40 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 mb-8">
            <MessageCircle className="size-4 text-primary" aria-hidden />
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
            Get in touch
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12">
            For platform support, billing questions, or partnership inquiries, reach us using the details below.
          </p>

          <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-10 shadow-lg shadow-black/5 dark:shadow-black/30 space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact us at</p>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-3 text-xl font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <Phone className="size-6 shrink-0 text-primary" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">For queries</p>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-3 text-lg font-semibold text-foreground hover:text-primary transition-colors break-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <Mail className="size-6 shrink-0 text-primary" aria-hidden />
                {EMAIL}
              </a>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Address</p>
              <p className="inline-flex items-start gap-3 text-lg font-medium text-foreground leading-snug">
                <MapPin className="size-6 shrink-0 text-primary mt-0.5" aria-hidden />
                {ADDRESS}
              </p>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            Prefer self-serve help?{" "}
            <Link href="/help" className="font-semibold text-primary hover:underline">
              Visit the Help Center
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
