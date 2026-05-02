"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { STUDENT_NAV, STUDENT_BOTTOM_PRIMARY } from "@/lib/studentDashboardNav"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export default function StudentDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/experts") return pathname === "/experts"
    if (href === "/manual") return pathname?.startsWith("/manual") ?? false
    if (href === "/dashboard/student") return pathname === "/dashboard/student"
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 md:py-12 grow flex flex-col md:flex-row gap-6 md:gap-10 mt-24 sm:mt-28 md:mt-32 relative z-0">
        <aside className="hidden md:block w-full md:w-72 lg:w-80 shrink-0">
          <nav className="rounded-[2rem] p-6 lg:p-8 sticky top-28 shadow-xl border border-border bg-secondary text-secondary-foreground">
            <div className="mb-8 px-4 py-4 rounded-2xl bg-white/10 border border-white/15">
              <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em] mb-1">Learning hub</p>
              <h3 className="text-lg font-black tracking-tight text-white leading-tight">Main menu</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Book sessions, pay securely, and message experts — same bar as the marketing site for Safety & Trust.
              </p>
            </div>
            <ul className="space-y-2">
              {STUDENT_NAV.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all min-h-[3rem]",
                        active
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-slate-200 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <div
                        className={cn(
                          "size-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5",
                          active ? "border-white/25 bg-white/15" : "border-white/10 bg-slate-800/90"
                        )}
                      >
                        <Icon className="size-[18px] shrink-0" aria-hidden />
                      </div>
                      <span className="min-w-0 flex-1 leading-snug pt-1">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        <div className="grow min-w-0 pb-28 md:pb-8">{children}</div>
      </div>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
        aria-label="Student navigation"
      >
        <div className="flex items-stretch justify-around px-1 pt-2 gap-0.5">
          {STUDENT_BOTTOM_PRIMARY.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 px-1 min-w-0 flex-1 rounded-xl transition-colors min-h-[3.25rem]",
                  active ? "text-primary bg-primary/10" : "text-muted-foreground active:bg-muted"
                )}
              >
                <Icon className="size-[22px] shrink-0 stroke-[2]" aria-hidden />
                <span className="text-[10px] font-bold leading-none text-center max-w-full px-0.5 line-clamp-2">
                  {item.shortLabel}
                </span>
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2.5 px-1 min-w-0 flex-1 rounded-xl text-muted-foreground min-h-[3.25rem] active:bg-muted",
              moreOpen && "text-primary bg-primary/10"
            )}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
          >
            <Menu className="size-[22px] shrink-0" aria-hidden />
            <span className="text-[10px] font-bold leading-none">More</span>
          </button>
        </div>
      </nav>

      {moreOpen ? (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="More navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative bg-card border-t border-border rounded-t-3xl max-h-[72vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-border bg-card">
              <span className="font-black text-foreground text-lg tracking-tight">All links</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-2.5 rounded-xl hover:bg-muted text-foreground min-h-11 min-w-11 inline-flex items-center justify-center"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="p-3 space-y-1 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {STUDENT_NAV.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-sm min-h-[3.25rem]",
                        active ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="size-5 shrink-0" aria-hidden />
                      <span className="leading-snug">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}
