"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Loader2, MessageSquare, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
export default function TeacherMessagesInbox() {
  const { user } = useStore()
  type Conversation = {
    id: string
    topic?: string | null
    booking_date?: string | null
    status?: string | null
    profiles?: { full_name?: string | null; avatar_url?: string | null } | null
  }
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadConversations() {
      if (!user) return
      try {
        const { data: teacher } = await supabase.from('teachers').select('id').eq('user_id', user.id).single()
        
        if (teacher) {
            // Fetch bookings that have messages or are active
            const { data, error } = await supabase
              .from("bookings")
              .select("*, profiles!bookings_user_id_fkey(full_name, avatar_url)")
              .eq("expert_id", teacher.id)
              .order("created_at", { ascending: false })

            if (!error) {
                setConversations(data || [])
            }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadConversations()
  }, [user])

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary size-8" /></div>

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 leading-none">Communications Hub</h1>
        <p className="text-slate-500 font-medium">Manage student discussions and session inquiries.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {conversations.length === 0 ? (
          <div className="py-32 text-center">
            <MessageSquare className="size-14 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-400">No active discussions</h3>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {conversations.map((conv) => (
              <Link key={conv.id} href={`/dashboard/messages/${conv.id}`} className="block group">
                <div className="p-8 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all flex items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                        {conv.profiles?.avatar_url ? (
                            <Image src={conv.profiles.avatar_url} alt="User" fill className="object-cover" sizes="64px" />
                        ) : (
                            <MessageSquare className="size-6 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-black text-xl text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{conv.profiles?.full_name || 'Student'}</h4>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Calendar className="size-3" />
                           {conv.topic} — {conv.booking_date}
                        </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${
                        conv.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                     }`}>
                        {conv.status}
                     </span>
                     <ChevronRight className="size-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
