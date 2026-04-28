"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/Button"
import { LayoutDashboard, Menu, X, LogOut } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, setUser } = useStore()
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? undefined

  const isExpertWorkspace = pathname?.startsWith("/dashboard/teacher") ?? false
  const isStudentWorkspace = pathname?.startsWith("/dashboard/student") ?? false
  const inWorkspace = isExpertWorkspace || isStudentWorkspace
  const workspaceHref = user?.user_metadata?.role === "expert" ? "/dashboard/teacher" : "/dashboard/student"

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" })
      if (error) throw error
      setUser(null)
      toast.success("Signed out successfully")
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to sign out"
      toast.error(message)
    }
  }

  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-6xl z-50 rounded-[2rem] sm:rounded-[2.5rem] border border-border bg-background/95 dark:bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10">
      <div className="container mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
          <div className="relative size-11 sm:size-12 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-emerald-500/15 transition-transform group-hover:scale-105 group-active:scale-95 duration-500 bg-white/85 dark:bg-card/90 ring-1 ring-border">
            <Image src="/logo1.png" alt="PAKTELLECT" fill className="object-contain p-0 sm:p-1" sizes="48px" priority />
          </div>
          <span className="text-lg sm:text-2xl tracking-tighter hidden sm:block text-foreground truncate">
            <span className="font-black">PAK</span>
            <span className="font-semibold">TELLECT</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 min-w-0">
          <div className="flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-semibold uppercase tracking-wide text-foreground">
            {inWorkspace ? (
              <>
                <Link href="/" className="hover:text-primary transition-colors shrink-0">
                  Home
                </Link>
                <Link href="/experts" className="hover:text-primary transition-colors shrink-0">
                  Directory
                </Link>
                <Link href="/safety" className="hover:text-primary transition-colors shrink-0">
                  Safety
                </Link>
                <Link href="/escrow-protection" className="hover:text-primary transition-colors shrink-0">
                  Trust
                </Link>
                <Link href="/contact" className="hover:text-primary transition-colors shrink-0">
                  Contact
                </Link>
                <Link href="/blog" className="hover:text-primary transition-colors shrink-0">
                  Blog
                </Link>
              </>
            ) : (
              <>
                {user?.user_metadata?.role !== "expert" && (
                  <Link href="/experts" className="hover:text-primary transition-colors">
                    Directory
                  </Link>
                )}
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="/manual" className="hover:text-primary transition-colors hidden lg:inline">
                  Guide
                </Link>
                <Link href="/safety" className="hover:text-primary transition-colors">
                  Safety
                </Link>
                <Link href="/escrow-protection" className="hover:text-primary transition-colors">
                  Trust
                </Link>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-border shrink-0" />

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  href={workspaceHref}
                  className="flex items-center gap-2 lg:gap-3 group/dash rounded-xl px-2 py-1.5 hover:bg-muted/80 transition-colors"
                >
                  <div className="size-9 lg:size-10 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt="" fill className="object-cover" sizes="40px" />
                    ) : (
                      <LayoutDashboard className="size-4 text-muted-foreground group-hover/dash:text-primary" />
                    )}
                  </div>
                  <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover/dash:text-foreground max-w-32 truncate">
                    {inWorkspace ? "Workspace" : "Dashboard"}
                  </span>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="h-9 lg:h-10 px-2 lg:px-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 font-bold text-[10px] uppercase tracking-widest"
                >
                  <LogOut className="size-3.5 lg:hidden" aria-hidden />
                  <span className="hidden sm:inline">Log out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="h-11 px-4 rounded-2xl font-black text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="h-11 px-6 rounded-2xl bg-primary hover:opacity-90 text-primary-foreground font-black shadow-lg text-sm">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden size-11 flex items-center justify-center bg-muted rounded-2xl border border-border text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu — compact, less intrusive */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-[max-height] duration-300 ease-out border-t border-border",
          isOpen ? "max-h-[min(70vh,520px)]" : "max-h-0 border-t-0"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4 max-h-[min(65vh,480px)] overflow-y-auto">
          <div className="flex flex-col gap-1 text-sm font-semibold text-foreground">
            {inWorkspace ? (
              <>
                <Link href="/" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Marketing home
                </Link>
                <Link href="/experts" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Find experts
                </Link>
                <Link href="/safety" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Safety
                </Link>
                <Link href="/escrow-protection" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Escrow & trust
                </Link>
                <Link href="/blog" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Blog
                </Link>
              </>
            ) : (
              <>
                {user?.user_metadata?.role !== "expert" && (
                  <Link href="/experts" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                    Directory
                  </Link>
                )}
                <Link href="/contact" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
                <Link href="/blog" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  News & Blog
                </Link>
                <Link href="/manual" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  User guide
                </Link>
                <Link href="/safety" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Safety
                </Link>
                <Link href="/escrow-protection" className="py-2.5 px-3 rounded-xl hover:bg-muted" onClick={() => setIsOpen(false)}>
                  Trust / Escrow
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {user ? (
              <>
                <Link href={workspaceHref} onClick={() => setIsOpen(false)} className="flex-1 min-w-[140px]">
                  <span className="flex h-11 items-center justify-center rounded-xl border border-border bg-muted font-bold text-sm text-foreground">
                    Open workspace
                  </span>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px] h-11 rounded-xl border-destructive/30 text-destructive font-bold text-sm"
                  onClick={() => {
                    setIsOpen(false)
                    void handleSignOut()
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <span className="flex h-11 items-center justify-center rounded-xl border border-border font-bold text-sm">
                    Sign in
                  </span>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="flex-1">
                  <span className="flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                    Get started
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
