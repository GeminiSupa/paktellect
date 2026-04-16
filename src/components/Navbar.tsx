"use client"

import Link from "next/link"
import { Button } from "./ui/Button"
import { LayoutDashboard, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, setUser } = useStore()
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? undefined

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
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 glass rounded-[2.5rem] border border-white/20 shadow-2xl shadow-emerald-900/10">
      <div className="container mx-auto px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative size-12 rounded-3xl overflow-hidden shadow-xl shadow-emerald-500/20 transition-transform group-hover:scale-110 group-active:scale-95 duration-500 bg-white/50">
            <Image src="/logo1.png" alt="PAKTELLECT" fill className="object-contain p-2" sizes="48px" priority />
          </div>
          <span className="text-2xl tracking-tighter hidden sm:block text-slate-950 dark:text-white">
            <span className="font-black">PAK</span>
            <span className="font-semibold">TELLECT</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
            {user?.user_metadata?.role !== 'expert' && <Link href="/experts" className="hover:text-primary transition-colors">Directory</Link>}
            <Link href="#features" className="hover:text-primary transition-colors">Safety</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">Trust</Link>
          </div>
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 ml-2" />

          <div className="flex items-center gap-3">
            {user ? (
               <>
                 <Link href={user.user_metadata?.role === 'expert' ? "/dashboard/teacher" : "/dashboard/student"} className="flex items-center gap-4 group/dash">
                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden transition-all group-hover/dash:border-primary group-hover/dash:scale-105">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt="Profile" fill className="object-cover" sizes="40px" />
                        ) : (
                            <LayoutDashboard className="size-4 text-slate-400 group-hover/dash:text-primary" />
                        )}
                    </div>
                    <span className="hidden lg:block text-xs font-black uppercase tracking-widest text-slate-500 group-hover/dash:text-primary transition-colors">Workspace</span>
                 </Link>
                 <Button onClick={handleSignOut} variant="ghost" className="h-10 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest">
                   Exit
                 </Button>
               </>
            ) : (
               <>
                 <Link href="/login"><Button variant="ghost" className="h-12 px-6 rounded-2xl font-black">Sign In</Button></Link>
                 <Link href="/signup">
                   <Button className="h-12 px-8 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/20">
                     Join Now
                   </Button>
                 </Link>
               </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden size-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
        isOpen ? "max-h-[400px] border-t border-slate-100 dark:border-slate-800 py-6" : "max-h-0"
      )}>
        <div className="container mx-auto px-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4 text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
            {user?.user_metadata?.role !== 'expert' && <Link href="/experts" onClick={() => setIsOpen(false)}>Directory</Link>}
            <Link href="#features" onClick={() => setIsOpen(false)}>Safety Protocol</Link>
            <Link href="#how-it-works" onClick={() => setIsOpen(false)}>Escrow Flow</Link>
          </div>
          <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            {user ? (
              <Link href={user.user_metadata?.role === 'expert' ? "/dashboard/teacher" : "/dashboard/student"} onClick={() => setIsOpen(false)}>
                <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>

  )
}
