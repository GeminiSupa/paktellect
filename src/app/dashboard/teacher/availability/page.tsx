"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { ensureExpertTeacherRow } from "@/lib/ensureExpertTeacher"
import { Button } from "@/components/ui/Button"
import { Loader2, Plus, Clock, Trash2, ShieldCheck, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"

export default function AvailabilityPage() {
  const { user } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  type Slot = { id: string; day: string; time: string; active: boolean }
  const [slots, setSlots] = useState<Slot[]>([])

  useEffect(() => {
    async function loadAvailability() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select('available_slots')
          .eq('user_id', user.id)
          .single()
        if (error) console.error(error)
        
        if (data?.available_slots != null) {
          const raw = data.available_slots
          let parsed: unknown = []
          try {
            parsed = Array.isArray(raw) ? raw : typeof raw === "string" ? JSON.parse(raw) : []
          } catch {
            parsed = []
          }
          const list = Array.isArray(parsed) ? parsed : []
          setSlots(
            list.map((s: Record<string, unknown>) => ({
              id: String(s.id ?? crypto.randomUUID()),
              day: String(s.day ?? "Monday"),
              time: String(s.time ?? "09:00 AM"),
              active: s.active !== false,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to load availability", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAvailability()
  }, [user])

  const addSlot = () => {
    const newSlot = { 
      id: crypto.randomUUID(), 
      day: "Monday", 
      time: "09:00 AM",
      active: true 
    }
    setSlots([...slots, newSlot])
  }

  const removeSlot = (id: string) => {
    setSlots(slots.filter(s => s.id !== id))
  }

  const saveAvailability = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const slotsPayload = slots.map((s) => ({
        id: s.id,
        day: s.day,
        time: s.time,
        active: s.active,
      }))

      const updatedAt = new Date().toISOString()

      const runUpdate = () =>
        supabase
          .from("teachers")
          .update({
            available_slots: slotsPayload,
            updated_at: updatedAt,
          })
          .eq("user_id", user.id)
          .select("id")

      let { data: updatedRows, error } = await runUpdate()

      if (error) throw error

      if (!updatedRows?.length) {
        const ensured = await ensureExpertTeacherRow(user as User)
        if (ensured.status === "error") throw new Error(ensured.message)
        const retry = await runUpdate()
        error = retry.error
        updatedRows = retry.data
        if (error) throw error
        if (!updatedRows?.length) {
          throw new Error("Could not find your expert profile. Try signing out and back in.")
        }
      }

      toast.success("Availability updated successfully")
    } catch (err: unknown) {
      console.error(err)
      const msg =
        err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Failed to save availability"
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary size-8" /></div>

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 leading-none">Practice Availability</h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Define your hours and session capacity.</p>
        </div>
        <Button onClick={saveAvailability} disabled={isSaving} className="h-14 px-10 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/20">
          {isSaving ? <Loader2 className="animate-spin size-4 mr-2" /> : <ShieldCheck className="size-4 mr-2" />}
          Save Clinical Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none mx-4 sm:mx-0">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Active Recurring Slots</h3>
                    <Button onClick={addSlot} variant="outline" className="h-10 px-4 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2">
                        <Plus className="size-3" /> New Slot
                    </Button>
                </div>

                {slots.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                        <Clock className="size-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No availability slots defined</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {slots.map((slot) => (
                            <div key={slot.id} className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 transition-all group hover:border-primary">
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                                    <CalendarIcon className="size-4 text-slate-400" />
                                </div>
                                <div className="grow grid grid-cols-2 gap-4">
                                    <select 
                                        value={slot.day}
                                        onChange={(e) => setSlots(slots.map(s => s.id === slot.id ? {...s, day: e.target.value} : s))}
                                        className="bg-transparent font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 focus:outline-none"
                                    >
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <input 
                                        type="text" 
                                        value={slot.time}
                                        onChange={(e) => setSlots(slots.map(s => s.id === slot.id ? {...s, time: e.target.value} : s))}
                                        className="bg-transparent font-black text-xs uppercase tracking-widest text-primary focus:outline-none"
                                        placeholder="e.g. 09:00 AM"
                                    />
                                </div>
                                <button onClick={() => removeSlot(slot.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl mx-4 sm:mx-0">
                 <div className="relative z-10">
                    <h4 className="text-xl font-black tracking-tight mb-4">Professional Disclaimer</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl">
                        Updating your availability will affect all future discovery results. Existing confirmed sessions will remain unchanged. Please ensure technical stability before opening new slots.
                    </p>
                 </div>
                 <ShieldCheck className="absolute -right-4 -bottom-4 size-32 text-white/5" />
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Capacity Overview</p>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">Weekly Slots</span>
                        <span className="font-black text-xl">{slots.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">Active Students</span>
                        <span className="font-black text-xl">2.1k</span>
                    </div>
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                            Students typically prefer slots between 04:00 PM and 08:00 PM in your local timezone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
