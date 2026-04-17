"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Loader2, CreditCard, ShieldCheck, CheckCircle2, Search, ArrowRight, History } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

export default function StudentPayments() {
  const { user } = useStore()
  type Tx = {
    id: string
    amount: number | string
    status: 'pending' | 'held' | 'released' | 'refunded' | string
    created_at: string
    payee?: { full_name?: string | null } | null
    bookings?: { topic?: string | null; booking_date?: string | null } | null
  }

  const [transactions, setTransactions] = useState<Tx[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    held: 0,
    released: 0,
    total: 0
  })

  useEffect(() => {
    async function loadPayments() {
      if (!user) return
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*, payee:profiles!transactions_payee_id_fkey(full_name), bookings(topic, booking_date)")
          .eq("payer_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setTransactions(data || [])
        
        // Calculate stats
        const held = data?.filter(t => t.status === 'held').reduce((acc, t) => acc + Number(t.amount), 0) || 0
        const released = data?.filter(t => t.status === 'released').reduce((acc, t) => acc + Number(t.amount), 0) || 0
        const total = data?.filter(t => t.status !== 'refunded').reduce((acc, t) => acc + Number(t.amount), 0) || 0
        
        setStats({ held, released, total })
      } catch (err: unknown) {
        console.error(err)
        toast.error("Failed to load payment history")
      } finally {
        setIsLoading(false)
      }
    }

    loadPayments()
  }, [user])

  return (
    <div className="space-y-10">
      <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40">
        <div className="absolute top-0 right-0 size-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-1.5 w-fit mb-6">
              <ShieldCheck className="size-3" />
              Secure Escrow
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Your Payments</h1>
            <p className="text-indigo-100 text-lg max-w-md">Track your spending and manage your held funds. All payments are protected by our escrow engine.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full md:w-80 text-center">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Total Amount Held</p>
            <h3 className="text-5xl font-black mb-1 text-white">${stats.held.toFixed(2)}</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-4">Protected by Hayy.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex flex-col justify-center group relative overflow-hidden transition-all hover:scale-[1.02]">
           <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 mb-2 group-hover:text-blue-600 transition-colors">Career Investment</p>
           <h3 className="text-4xl font-black text-slate-900 dark:text-white">${stats.total.toFixed(2)}</h3>
           <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 mt-2">Total value of sessions booked</p>
           <History className="absolute -bottom-6 -right-6 size-32 text-slate-50 dark:text-slate-950 pointer-events-none" />
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex flex-col justify-center group relative overflow-hidden transition-all hover:scale-[1.02]">
           <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 mb-2 group-hover:text-green-600 transition-colors">Released Funds</p>
           <h3 className="text-4xl font-black text-slate-900 dark:text-white">${stats.released.toFixed(2)}</h3>
           <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 mt-2">Successfully completed sessions</p>
           <CheckCircle2 className="absolute -bottom-6 -right-6 size-32 text-slate-50 dark:text-slate-950 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Billing History</h2>
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input type="text" placeholder="Search billing..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-0 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
           </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-blue-500" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-24">
            <CreditCard className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">No transactions</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-2">You haven&apos;t made any payments yet. Find an expert to start!</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
                   <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Details</th>
                   <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expert</th>
                   <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                   <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                    <td className="px-10 py-6">
                       <h4 className="font-black text-slate-900 dark:text-white tracking-tight leading-none">{tx.bookings?.topic || 'Session Payment'}</h4>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 block">{tx.bookings?.booking_date || tx.created_at.split('T')[0]}</span>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                             {tx.payee?.full_name?.charAt(0) || 'E'}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tx.payee?.full_name || 'Expert'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all group-hover:scale-105 ${
                         tx.status === 'held' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                         tx.status === 'released' ? 'bg-green-50 text-green-600 border-green-100' :
                         'bg-red-50 text-red-600 border-red-100'
                       }`}>
                         {tx.status}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">${Number(tx.amount).toFixed(2)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="max-w-md">
            <h3 className="text-3xl font-black tracking-tight mb-2">Need a refund?</h3>
            <p className="text-slate-400 font-bold">If a session never happened or you&apos;re unsatisfied, our support team can help you resolve the dispute before the funds are released.</p>
         </div>
         <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/20 hover:bg-white/5 text-white font-black">
            Contact Support <ArrowRight className="size-5 ml-3" />
         </Button>
      </div>
    </div>
  )
}
