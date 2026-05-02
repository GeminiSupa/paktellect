"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, MessageSquare, ArrowRight, Inbox } from "lucide-react"
import Image from "next/image"

import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { fetchProfilesByUserIds } from "@/lib/fetchProfilesByUserIds"

type ProfileLite = { full_name?: string | null; avatar_url?: string | null }

type BookingThread = {
  id: string
  topic: string | null
  status: string | null
  booking_date: string | null
  booking_time: string | null
  expert_id: string | null
  teachers?: {
    user_id: string | null
    category: string | null
    profiles?: ProfileLite | ProfileLite[] | null
  } | null
}

function pickProfile(p: ProfileLite | ProfileLite[] | null | undefined): ProfileLite | null {
  if (!p) return null
  if (Array.isArray(p)) return p[0] ?? null
  return p
}

export default function StudentMessagesInbox() {
  const { user } = useStore()
  const [threads, setThreads] = useState<BookingThread[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadByBooking, setUnreadByBooking] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!user) return

    let active = true
    async function load() {
      try {
        const { data } = await supabase
          .from("bookings")
          .select("id, topic, status, booking_date, booking_time, expert_id, teachers!bookings_expert_id_fkey(user_id, category)")
          .eq("user_id", user!.id)
          .order("booking_date", { ascending: false })
          .limit(50)

        if (!active) return
        const rowsRaw = (data || []) as unknown as BookingThread[]
        const expertUserIds = rowsRaw
          .map((r) => r.teachers?.user_id)
          .filter((uid): uid is string => typeof uid === "string" && uid.length > 0)
        const profMap = await fetchProfilesByUserIds<ProfileLite & { id?: string }>(
          supabase,
          expertUserIds,
          "id, full_name, avatar_url"
        )
        const rows = rowsRaw.map((r) => {
          const uid = r.teachers?.user_id
          const profiles = uid ? profMap.get(uid) ?? null : null
          return {
            ...r,
            teachers: r.teachers ? { ...r.teachers, profiles } : r.teachers,
          }
        })
        setThreads(rows)

        const ids = rows.map((r) => r.id)
        if (ids.length > 0) {
          const { data: msgRows } = await supabase
            .from("messages")
            .select("booking_id, is_read, sender_id")
            .in("booking_id", ids)
            .eq("is_read", false)
            .neq("sender_id", user!.id)

          if (!active) return
          const counts: Record<string, number> = {}
          for (const m of msgRows || []) {
            const bid = m.booking_id as string
            counts[bid] = (counts[bid] || 0) + 1
          }
          setUnreadByBooking(counts)
        }
      } catch (err) {
        console.error("messages inbox load failed", err)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Loading messages…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <MessageSquare className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground font-medium">
            All conversations from your bookings, newest first.
          </p>
        </div>
      </header>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Inbox className="size-10 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-lg font-black text-foreground mb-1">No conversations yet</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Book an expert and your chat threads will appear here.
          </p>
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest"
          >
            Find experts <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {threads.map((t) => {
            const profile = pickProfile(t.teachers?.profiles)
            const name = profile?.full_name || "Expert"
            const avatar = profile?.avatar_url
            const unread = unreadByBooking[t.id] || 0
            return (
              <li key={t.id}>
                <Link
                  href={`/dashboard/messages/${t.id}`}
                  className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="relative size-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                    {avatar ? (
                      <Image src={avatar} alt={name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="size-full flex items-center justify-center text-muted-foreground font-black">
                        {name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 grow">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground truncate">{name}</p>
                      {unread > 0 && (
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.topic || "Booking conversation"}
                      {t.booking_date ? ` • ${t.booking_date}` : ""}
                      {t.status ? ` • ${t.status}` : ""}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
