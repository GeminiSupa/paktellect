"use client"

import { useEffect, useState, use } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  MessageSquare,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Send,
  ShieldCheck,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function ExpertJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useStore()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teacherId, setTeacherId] = useState<string | null>(null)
  const [hasApplied, setHasApplied] = useState(false)
  
  const [proposal, setProposal] = useState("")
  const [bidAmount, setBidAmount] = useState("")

  useEffect(() => {
    async function loadJobAndTeacher() {
      if (!user) return
      try {
        // 1. Get teacher profile
        const { data: teacher } = await supabase
          .from("teachers")
          .select("id")
          .eq("user_id", user.id)
          .single()
        
        if (teacher) setTeacherId(teacher.id)

        // 2. Get job details
        const { data: jobData, error } = await supabase
          .from("jobs")
          .select(`
            *,
            profiles:client_id (full_name, city, country)
          `)
          .eq("id", id)
          .single()

        if (error) throw error
        setJob(jobData)

        // 3. Check if already applied
        if (teacher) {
          const { data: app } = await supabase
            .from("job_applications")
            .select("id")
            .eq("job_id", id)
            .eq("expert_id", teacher.id)
            .single()
          
          if (app) setHasApplied(true)
        }
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load mandate details")
      } finally {
        setIsLoading(false)
      }
    }
    loadJobAndTeacher()
  }, [user, id])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !teacherId) {
      toast.error("You must be registered as an expert to apply")
      return
    }

    if (!proposal) {
      toast.error("Please provide a proposal description")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("job_applications")
        .insert({
          job_id: id,
          expert_id: teacherId,
          proposal,
          bid_amount: bidAmount ? parseFloat(bidAmount) : job.budget_pkr,
          status: 'pending'
        })

      if (error) throw error

      toast.success("Application submitted successfully!")
      setHasApplied(true)
      router.push("/dashboard/teacher/jobs")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to submit proposal")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary size-10" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verifying project details...</p>
    </div>
  )

  if (!job) return <div>Mandate not found.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-0">
      <Link href="/dashboard/teacher/jobs" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
        <ChevronLeft className="size-4" />
        Back to Marketplace
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
        <div className="grow space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                {job.category}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Clock className="size-4" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-foreground leading-none">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500">
                     {job.profiles?.full_name?.charAt(0)}
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Client</p>
                     <p className="text-sm font-bold text-slate-900 dark:text-white">{job.profiles?.full_name}</p>
                  </div>
               </div>
               {job.location_city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-primary" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{job.location_city}, {job.location_country}</p>
                    </div>
                  </div>
               )}
            </div>
          </div>

          <div className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="size-5 text-primary" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground">Mandate Description</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        </div>

        <div className="md:w-96 shrink-0 space-y-8">
           <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget Range</p>
                 <ShieldCheck className="size-5 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black tracking-tighter">
                   PKR {job.budget_pkr ? job.budget_pkr.toLocaleString() : "TBD"}
                 </span>
                 <span className="text-xs text-slate-400 font-bold">Total Project</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">Escrow safety active</p>
                 </div>
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">Direct message line open after acceptance</p>
                 </div>
              </div>
           </div>

           {hasApplied ? (
             <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] text-center space-y-4">
                <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight">Proposal Submitted</h4>
                <p className="text-xs font-bold text-emerald-700/70 uppercase tracking-widest leading-relaxed">The client has been notified of your interest. You will be alerted upon their review.</p>
                
                <Link href={`/dashboard/messages/job/${id}`}>
                   <Button variant="outline" className="w-full h-14 rounded-2xl border-emerald-200 text-emerald-700 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                      <MessageSquare className="size-4" />
                      Message Client
                   </Button>
                </Link>
             </div>
           ) : (
             <form onSubmit={handleApply} className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Your Proposal (Mandatory)</label>
                  <textarea
                    placeholder="Describe your qualifications and how you plan to help..."
                    className="w-full px-6 py-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-medium leading-relaxed min-h-[180px] transition-all"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Your Bid (PKR)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary size-5" />
                    <input
                      type="number"
                      placeholder={job.budget_pkr ? String(job.budget_pkr) : "0"}
                      className="w-full pl-14 pr-8 h-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-black text-xl tracking-tight shadow-inner"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-18 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin size-6" /> : <Send className="size-5" />}
                  Submit Proposal
                </Button>

                <div className="flex items-center justify-center gap-2 pt-2">
                   <Zap className="size-3 text-primary animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Response time: ~12 hours</span>
                </div>
             </form>
           )}
        </div>
      </div>
    </div>
  )
}
