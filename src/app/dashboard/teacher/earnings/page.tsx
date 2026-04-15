"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Loader2, DollarSign, ArrowUpRight, Clock, CheckCircle2, Wallet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

export default function TeacherEarnings() {
  const { user } = useStore()
  type Tx = {
    id: string
    amount: number | string
    status: 'pending' | 'held' | 'released' | 'refunded' | string
    created_at: string
    bookings?: { topic?: string | null; booking_date?: string | null } | null
  }
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    available: 0,
    total: 0
  })

  useEffect(() => {
    async function loadEarnings() {
      if (!user) return
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*, bookings(topic, booking_date)")
          .eq("payee_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setTransactions(data || [])
        
        // Calculate stats
        const pending = data?.filter(t => t.status === 'held').reduce((acc, t) => acc + Number(t.amount), 0) || 0
        const available = data?.filter(t => t.status === 'released').reduce((acc, t) => acc + Number(t.amount), 0) || 0
        const total = data?.filter(t => t.status !== 'refunded').reduce((acc, t) => acc + Number(t.amount), 0) || 0
        
        setStats({ pending, available, total })
      } catch (err: unknown) {
        console.error(err)
        toast.error("Failed to load earnings history")
      } finally {
        setIsLoading(false)
      }
    }

    loadEarnings()
  }, [user])

  const handleWithdraw = () => {
    if (stats.available === 0) {
      toast.error("No available funds to withdraw.")
      return
    }
    toast.success("Withdrawal initiated! Funds will arrive in 2-3 business days.")
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="bg-[#0f172a] rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 size-80 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5 w-fit mb-6">
              <Wallet className="size-3" />
              Verified Expert Wallet
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">Earnings Hub</h1>
            <p className="text-slate-400 text-lg max-w-md font-medium">Manage your revenue, track pending escrow funds, and withdraw to your bank.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 w-full lg:w-[380px] text-center shadow-2xl">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Available for Withdrawal</p>
            <h3 className="text-6xl font-black mb-8 text-primary tracking-tighter">${stats.available.toFixed(2)}</h3>
            <Button onClick={handleWithdraw} className="w-full h-20 bg-primary hover:bg-emerald-700 text-white font-black text-lg rounded-3xl shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95">
              Initiate Withdrawal
            </Button>
            <p className="text-[10px] text-slate-500 font-bold mt-6 uppercase tracking-widest italic opacity-60">Payouts typically arrive in 48-72 hours</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex items-center justify-between group overflow-hidden relative transition-all hover:scale-[1.02]">
           <div className="absolute -right-4 -bottom-4 size-24 bg-orange-600/5 rounded-full flex items-center justify-center">
              <Clock className="size-10 text-orange-600/20" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-hover:text-orange-600 transition-colors">Pending in Escrow</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">${stats.pending.toFixed(2)}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Locked until session completion</p>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex items-center justify-between group overflow-hidden relative transition-all hover:scale-[1.02]">
           <div className="absolute -right-4 -bottom-4 size-24 bg-primary/5 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-10 text-primary/20" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-hover:text-primary transition-colors">Career Revenue</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">${stats.total.toFixed(2)}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Total successful transactions</p>
           </div>
        </div>
        <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-100 italic">How it works</p>
              <h4 className="text-lg font-black tracking-tight leading-snug">Funds are held in Escrow and released immediately after you complete the session.</h4>
           </div>
           <ArrowRight className="absolute -right-4 -bottom-4 size-24 text-white/10 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Transaction History</h2>
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">All Times UTC</div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20">
            <DollarSign className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No earnings yet</h3>
            <p className="text-slate-500 text-sm">Once you complete a session, your earnings will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-900">
            {transactions.map((tx) => (
              <div key={tx.id} className="px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className={`size-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                    tx.status === 'released' ? 'bg-primary/10 text-primary border border-primary/20' :
                    tx.status === 'held' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    {tx.status === 'released' ? <ArrowUpRight className="size-7" /> : <Clock className="size-7" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white tracking-tight">{tx.bookings?.topic || 'Session Payment'}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Date: {tx.bookings?.booking_date || tx.created_at.split('T')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 justify-between md:justify-end">
                   <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">${Number(tx.amount).toFixed(2)}</p>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                        tx.status === 'released' ? 'bg-primary/10 text-primary border border-primary/10' : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {tx.status === 'held' ? 'Held (Escrow)' : tx.status}
                      </span>
                   </div>
                   <ArrowRight className="size-5 text-slate-200 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
