"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { TEACHER_NAV, TEACHER_BOTTOM_PRIMARY } from "@/lib/teacherDashboardNav"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export default function TeacherDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    const [path, query] = href.split("?")
    const base = path || href
    if (query?.includes("status=pending")) {
      return (
        pathname?.startsWith("/dashboard/teacher/bookings") &&
        searchParams?.get("status") === "pending"
      )
    }
    if (base === "/dashboard/teacher") return pathname === "/dashboard/teacher"
    return pathname === base || pathname?.startsWith(`${base}/`)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12 grow flex flex-col md:flex-row gap-6 md:gap-8 mt-28 md:mt-28 relative z-0">
        <aside className="hidden md:block w-full md:w-80 shrink-0">
          <nav
            className="rounded-[2rem] p-6 sticky top-24 shadow-xl border text-white"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mb-8 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Expert workspace</p>
              <h3 className="text-lg font-black tracking-tight text-white">Navigation</h3>
              <p className="text-xs text-slate-400 mt-2 leading-snug">
                Same app as the marketing site — use the top bar for Safety, Trust, and Directory.
              </p>
            </div>
            <ul className="space-y-1.5">
              {TEACHER_NAV.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all",
                        active
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-slate-200 hover:text-white hover:bg-white/10",
                        item.emphasize && !active && "ring-1 ring-primary/40 bg-primary/10 text-white"
                      )}
                    >
                      <div
                        className={cn(
                          "size-9 rounded-xl flex items-center justify-center border",
                          active
                            ? "border-white/20 bg-white/10"
                            : "border-white/10 bg-slate-800/80"
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                      </div>
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        <div className="grow min-w-0 pb-24 md:pb-6">{children}</div>
      </div>

      {/* Mobile bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0)]"
        style={{ borderColor: "var(--border)" }}
        aria-label="Workspace navigation"
      >
        <div className="flex items-stretch justify-around px-1 pt-2">
          {TEACHER_BOTTOM_PRIMARY.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-2 min-w-0 flex-1 rounded-xl transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                <span className="text-[10px] font-bold truncate max-w-full">{item.shortLabel}</span>
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-2 min-w-0 flex-1 rounded-xl text-muted-foreground",
              moreOpen && "text-primary"
            )}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
          >
            <Menu className="size-5" aria-hidden />
            <span className="text-[10px] font-bold">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile "More" sheet */}
      {moreOpen ? (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="More navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative bg-card border-t rounded-t-3xl max-h-[70vh] overflow-y-auto shadow-2xl" style={{ borderColor: "var(--border)" }}>
            <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b bg-card" style={{ borderColor: "var(--border)" }}>
              <span className="font-black text-foreground">All workspace links</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-2 rounded-xl hover:bg-muted text-foreground"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="p-3 space-y-1">
              {TEACHER_NAV.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm",
                        active ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="size-5 shrink-0" />
                      {item.label}
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
