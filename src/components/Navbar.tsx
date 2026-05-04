"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "./ui/Button"
import { LayoutDashboard, Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
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
      router.replace("/")
      router.refresh()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to sign out"
      toast.error(message)
    }
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
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
                  <div className="relative size-9 lg:size-10 shrink-0 rounded-xl bg-muted border border-border overflow-hidden">
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
    </nav>

    {/* Mobile Overlay & Drawer */}
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-background border-l border-border z-[70] shadow-2xl flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-border">
              <span className="text-xl font-black tracking-tighter text-foreground">MENU</span>
              <button
                type="button"
                className="size-10 flex items-center justify-center bg-muted rounded-full text-foreground hover:bg-muted/80 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
              <div className="flex flex-col gap-2 text-lg font-bold text-foreground">
                {inWorkspace ? (
                  <>
                    <Link href="/" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Marketing home
                    </Link>
                    <Link href="/experts" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Find experts
                    </Link>
                    <Link href="/safety" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Safety
                    </Link>
                    <Link href="/escrow-protection" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Escrow & trust
                    </Link>
                    <Link href="/blog" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Blog
                    </Link>
                  </>
                ) : (
                  <>
                    {user?.user_metadata?.role !== "expert" && (
                      <Link href="/experts" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                        Directory
                      </Link>
                    )}
                    <Link href="/contact" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Contact
                    </Link>
                    <Link href="/blog" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      News & Blog
                    </Link>
                    <Link href="/manual" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      User guide
                    </Link>
                    <Link href="/safety" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Safety
                    </Link>
                    <Link href="/escrow-protection" className="py-3 px-4 rounded-2xl hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                      Trust / Escrow
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/30">
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link href={workspaceHref} onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-14 rounded-xl font-bold text-base bg-primary hover:opacity-90 text-primary-foreground shadow-lg">
                      Open workspace
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-xl border-destructive/30 text-destructive font-bold text-base hover:bg-destructive/10"
                    onClick={() => {
                      setIsOpen(false)
                      void handleSignOut()
                    }}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-14 rounded-xl font-bold text-base bg-primary hover:opacity-90 text-primary-foreground shadow-lg">
                      Get started
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-14 rounded-xl font-bold text-base">
                      Sign in
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  )
}
