"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, Scale, FileText, ChevronRight, Signature } from "lucide-react"

type MatterListRow = {
  id: string
  title: string
  status: string
  created_at: string
  teacher?: { id?: string; profiles?: { full_name?: string | null } | null } | null
}

export default function StudentLegalFiles() {
  const { user } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [matters, setMatters] = useState<MatterListRow[]>([])
  const [pendingSigs, setPendingSigs] = useState<number>(0)

  useEffect(() => {
    async function load() {
      if (!user) return
      setIsLoading(true)
      try {
        const { data: m, error: mErr } = await supabase
          .from("matters")
          // Avoid relying on a specific FK constraint name (schema-cache mismatch can break embeds).
          .select("id, title, status, created_at, teacher:teachers(id, profiles(full_name))")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })
        if (mErr) throw mErr
        setMatters((m || []) as MatterListRow[])

        const { count: sigCount, error: sErr } = await supabase
          .from("esign_requests")
          .select("*", { count: "exact", head: true })
          .eq("signer_id", user.id)
          .eq("status", "requested")
        if (sErr) throw sErr
        setPendingSigs(sigCount || 0)
      } catch (err) {
        console.error(err)
        const message = err instanceof Error ? err.message : "Failed to load legal files"
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-bold text-slate-500">Please sign in.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 text-orange-600 text-[10px] font-black uppercase tracking-widest">
              <Scale className="size-3" /> Legal Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Your Legal Files</h1>
            <p className="text-slate-600 dark:text-slate-300 font-medium">View documents and complete signature requests securely.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 min-w-[240px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pending Signatures</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black text-slate-900 dark:text-white">{pendingSigs}</p>
              <Signature className="size-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Matters</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{matters.length} total</span>
        </div>

        {matters.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No legal matters yet</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">When a lawyer opens a matter for your booking, it will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {matters.map((m) => (
              <Link key={m.id} href={`/dashboard/student/legal/${m.id}`} className="block group">
                <div className="px-10 py-8 flex items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Lawyer: {m.teacher?.profiles?.full_name || "Expert"}
                    </p>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">{m.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{m.status}</p>
                  </div>
                  <ChevronRight className="size-6 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

