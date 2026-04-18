"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { BookOpen, User, Globe, Clock, DollarSign, Shield } from "lucide-react"

export default function ExpertManualPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <article className="container mx-auto px-6 pt-36 sm:pt-40 pb-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 mb-8">
          <BookOpen className="size-4 text-primary" />
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">For experts</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Expert manual</h1>
        <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12">
          Complete your basics, go public when ready, and manage sessions professionally.
        </p>

        <div className="space-y-10">
          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mb-4 text-foreground">
              <User className="size-6 text-primary shrink-0" />
              1. Profile basics (required to save)
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-4">
              Under <Link href="/dashboard/teacher/profile" className="text-primary font-semibold hover:underline">Practice Profile</Link>, fill everything marked in the checklist. Your{" "}
              <strong className="text-foreground">display name</strong> is set in Account Settings — clients see it on cards and booking.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-medium">
              <li>Headline, specialty, hourly rate, location, bio, qualifications.</li>
              <li>Category-specific fields (e.g. practice areas for Legal, subjects for Academic).</li>
              <li>Profile photo strongly recommended — it appears in the directory.</li>
            </ul>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mb-4 text-foreground">
              <Globe className="size-6 text-primary shrink-0" />
              2. Appear in Find Experts
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-0">
              Turn on <strong className="text-foreground">Public profile</strong> in{" "}
              <Link href="/dashboard/teacher/settings" className="text-primary font-semibold hover:underline">Settings</Link> only after your category requirements are complete. The directory lists{" "}
              <strong className="text-foreground">public</strong> experts only.
            </p>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mb-4 text-foreground">
              <Clock className="size-6 text-primary shrink-0" />
              3. Availability
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-0">
              Set recurring slots under{" "}
              <Link href="/dashboard/teacher/availability" className="text-primary font-semibold hover:underline">Slots &amp; Availability</Link>. Save after editing. Timezone and buffer are in Settings.
            </p>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mb-4 text-foreground">
              <DollarSign className="size-6 text-primary shrink-0" />
              4. Offers &amp; earnings
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Review <strong className="text-foreground">Offers</strong> from clients. Accept, counter, or decline. Track payouts under{" "}
              <Link href="/dashboard/teacher/earnings" className="text-primary font-semibold hover:underline">Financials &amp; Payouts</Link>.
            </p>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mb-4 text-foreground">
              <Shield className="size-6 text-primary shrink-0" />
              5. Reviews &amp; replies
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-0">
              After completed bookings, clients may leave reviews. You can post a professional reply from your profile page. Reviews affect featured rankings over time.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Client guide: <Link href="/manual" className="font-semibold text-primary hover:underline">How to use PAKTELLECT</Link> ·{" "}
          <Link href="/help" className="text-primary hover:underline">Help Center</Link> ·{" "}
          <Link href="/contact" className="text-primary hover:underline">Contact</Link>
        </p>
      </article>

      <Footer />
    </main>
  )
}
