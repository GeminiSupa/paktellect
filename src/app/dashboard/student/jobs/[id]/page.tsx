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
  Star,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StudentJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useStore()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadJobAndApplications() {
      if (!user) return
      try {
        const { data: jobData, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error
        setJob(jobData)

        const { data: apps, error: aErr } = await supabase
          .from("job_applications")
          .select(`
            *,
            expert:expert_id (
              id,
              headline,
              rating_avg,
              profile_pic_url,
              profiles:user_id (full_name, city, country)
            )
          `)
          .eq("job_id", id)
          .order("created_at", { ascending: false })

        if (aErr) throw aErr
        setApplications(apps || [])
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load project details")
      } finally {
        setIsLoading(false)
      }
    }
    loadJobAndApplications()
  }, [user, id])

  const acceptProposal = async (appId: string, expertId: string) => {
     // This would normally involve a payment flow (escrow) or creating a booking.
     // For MVP, we'll mark the application as accepted and the job as in_progress.
     toast.info("Accepting proposal & initiating message line...")
     try {
        await supabase.from("job_applications").update({ status: 'accepted' }).eq("id", appId)
        await supabase.from("jobs").update({ status: 'in_progress' }).eq("id", id)
        
        toast.success("Proposal accepted! You can now message the expert.")
        router.refresh()
     } catch (err) {
        toast.error("Process interrupted. Please try again.")
     }
  }

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary size-10" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading mandate & proposals...</p>
    </div>
  )

  if (!job) return <div>Mandate not found.</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-0">
      <Link href="/dashboard/student/jobs" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
        <ChevronLeft className="size-4" />
        Back to mandates
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="grow space-y-10">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                  {job.status}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {job.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-foreground leading-none">
                {job.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap max-w-4xl">
                {job.description}
              </p>
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="size-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground">Recieved Proposals ({applications.length})</h3>
                </div>
              </div>

              {applications.length === 0 ? (
                <div className="py-20 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                   <Clock className="size-12 text-slate-200 mx-auto mb-4" />
                   <p className="text-slate-500 font-bold">Waiting for experts to submit proposals...</p>
                   <p className="text-xs text-slate-400 mt-2 font-medium">Most jobs receive bids within 4-8 hours.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                   {applications.map((app) => (
                     <div key={app.id} className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="flex flex-col md:flex-row gap-10">
                           <div className="md:w-64 shrink-0 flex flex-col items-center text-center space-y-4">
                              <div className="relative size-24 rounded-[1.8rem] bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner border border-slate-200/50">
                                 {app.expert.profile_pic_url ? (
                                   <Image src={app.expert.profile_pic_url} alt={app.expert.profiles.full_name} fill className="object-cover" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-300">
                                      {app.expert.profiles.full_name.charAt(0)}
                                   </div>
                                 )}
                              </div>
                              <div>
                                 <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-1">{app.expert.profiles.full_name}</h4>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{app.expert.headline}</p>
                                 <div className="flex items-center justify-center gap-1.5 text-xs font-black text-orange-500">
                                    <Star className="size-4 fill-orange-500" />
                                    {app.expert.rating_avg > 0 ? Number(app.expert.rating_avg).toFixed(1) : "New"}
                                 </div>
                              </div>
                              <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200">
                                 View Expert Bio
                              </Button>
                           </div>

                           <div className="grow space-y-6">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <DollarSign className="size-5 text-emerald-600" />
                                    <div>
                                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Expert Bid</p>
                                       <p className="text-xl font-black text-emerald-600">PKR {app.bid_amount?.toLocaleString()}</p>
                                    </div>
                                 </div>
                                 {app.status === 'accepted' && (
                                   <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                      Mandate Accepted
                                   </div>
                                 )}
                              </div>
                              
                              <div className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Proposal Narrative</p>
                                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                    {app.proposal}
                                 </p>
                              </div>

                              <div className="flex items-center gap-4 pt-4">
                                 <Button 
                                    onClick={() => acceptProposal(app.id, app.expert_id)}
                                    disabled={app.status === 'accepted' || job.status !== 'open'}
                                    className="flex-1 h-16 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/10 flex items-center justify-center gap-3"
                                 >
                                    {app.status === 'accepted' ? 'Hired' : 'Accept Proposal'}
                                    <ArrowRight className="size-4" />
                                 </Button>
                                 <Link href={`/dashboard/messages/job/${job.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                                       <MessageSquare className="size-4" />
                                       Open Message Line
                                    </Button>
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        <div className="lg:w-80 shrink-0 space-y-6">
           <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl space-y-6">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Budget</p>
                 <p className="text-3xl font-black tracking-tighter">PKR {job.budget_pkr ? job.budget_pkr.toLocaleString() : "TBD"}</p>
              </div>
              <div className="h-px bg-white/10" />
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-primary" />
                    <span className="text-xs font-bold text-slate-300">{job.location_city || "Remote"}, {job.location_country}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Clock className="size-4 text-primary" />
                    <span className="text-xs font-bold text-slate-300">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>
           
           <div className="p-8 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
              <ShieldCheck className="size-10 text-primary mb-6" />
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">Elite Guarantee</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Ensure you review expert portfolios & ratings before accepting a mandate.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
