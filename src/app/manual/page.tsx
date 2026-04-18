"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { BookOpen, Search, Calendar, MessageCircle, Shield, CreditCard } from "lucide-react"

export default function ClientManualPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <article className="container mx-auto px-6 pt-36 sm:pt-40 pb-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 mb-8">
          <BookOpen className="size-4 text-primary" />
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">For students & clients</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">How to use PAKTELLECT</h1>
        <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12">
          Book verified professionals, pay safely with escrow, and keep communication on the platform.
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mt-0 mb-4 text-foreground">
              <Search className="size-6 text-primary shrink-0" />
              Find an expert
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground font-medium leading-relaxed">
              <li>Open <Link href="/experts" className="text-primary font-semibold hover:underline">Find Experts</Link> from your dashboard or the home page.</li>
              <li>Filter by category (Academic, Legal, Wellness, Mental Health) and use search.</li>
              <li>Open a profile to see headline, rate, location, and reviews from completed sessions.</li>
            </ol>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mt-0 mb-4 text-foreground">
              <Calendar className="size-6 text-primary shrink-0" />
              Book & pay
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-medium leading-relaxed">
              <li>Use <strong className="text-foreground">Book</strong> when the expert has set a rate and you agree on time.</li>
              <li>Use <strong className="text-foreground">Send Offer</strong> to negotiate time and price before payment.</li>
              <li>Funds are held in escrow until the session is completed per platform rules.</li>
            </ul>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mt-0 mb-4 text-foreground">
              <MessageCircle className="size-6 text-primary shrink-0" />
              Messages & safety
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-0">
              After booking, use <strong className="text-foreground">Messages</strong> under your booking. Avoid taking payments or sharing sensitive data off-platform.
            </p>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mt-0 mb-4 text-foreground">
              <CreditCard className="size-6 text-primary shrink-0" />
              Payments & offers
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              View payment history under <Link href="/dashboard/student/payments" className="text-primary font-semibold hover:underline">Payments</Link>. Track offer status under{" "}
              <Link href="/dashboard/student/offers" className="text-primary font-semibold hover:underline">Offers</Link>.
            </p>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mt-0 mb-4 text-foreground">
              <Shield className="size-6 text-primary shrink-0" />
              Reviews
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-0">
              You can leave a review after a <strong className="text-foreground">completed</strong> booking. Reviews help others choose the right expert.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Experts should read the{" "}
          <Link href="/manual/expert" className="font-semibold text-primary hover:underline">
            Expert manual
          </Link>
          . More help: <Link href="/help" className="text-primary hover:underline">Help Center</Link>,{" "}
          <Link href="/contact" className="text-primary hover:underline">Contact</Link>.
        </p>
      </article>

      <Footer />
    </main>
  )
}
