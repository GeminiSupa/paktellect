"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { 
  Briefcase, 
  Plus, 
  Loader2, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight,
  Search,
  MessageSquare,
  DollarSign
} from "lucide-react"

export default function StudentJobsPage() {
  const { user } = useStore()
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadJobs() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select(`
            *,
            job_applications (
              id,
              expert_id,
              status,
              teachers:expert_id (
                profile_pic_url
              )
            )
          `)
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setJobs(data || [])
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load your jobs")
      } finally {
        setIsLoading(false)
      }
    }
    loadJobs()
  }, [user])

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary size-10" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading your marketplace...</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12 pb-28 sm:pb-32 px-0 sm:px-0">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200 dark:border-border pb-8 sm:pb-12">
        <div className="max-w-2xl min-w-0">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-foreground mb-3 sm:mb-4 leading-[1.05] text-balance">
            Your jobs <span className="text-primary">&amp; queries</span>
          </h1>
          <p className="text-slate-600 dark:text-muted-foreground font-medium text-base sm:text-lg md:text-xl leading-relaxed">
            Post a brief, compare proposals, then hire with confidence.
          </p>
        </div>
        <Link href="/dashboard/student/jobs/new" className="w-full md:w-auto shrink-0">
          <Button className="w-full md:w-auto min-h-12 px-8 rounded-2xl bg-primary hover:bg-emerald-700 text-primary-foreground font-black text-xs sm:text-sm uppercase tracking-wide gap-2 shadow-xl">
            <Plus className="size-5 shrink-0" aria-hidden />
            <span className="text-balance">Post new job</span>
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="size-24 rounded-full bg-slate-50 dark:bg-slate-950 mx-auto flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800">
            <Search className="size-10 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">No active queries</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium mb-10 text-lg">You haven't posted any jobs or queries yet. Reach out to our expert network to get started.</p>
          <Link href="/dashboard/student/jobs/new">
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-primary text-primary font-black uppercase text-xs tracking-widest">
              Establish Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[300px]">
               <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="flex flex-col lg:flex-row gap-10">
                  <div className="grow space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                        {job.category}
                      </span>
                      <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        job.status === 'open' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-200 text-slate-500 border border-slate-300'
                      }`}>
                        <div className={`size-1.5 rounded-full ${job.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {job.status}
                      </span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] group-hover:text-primary transition-colors line-clamp-1">
                      {job.title}
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-3xl line-clamp-3 min-h-[72px]">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-4">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Clock className="size-4" />
                          {new Date(job.created_at).toLocaleDateString()}
                       </div>
                       {job.location_city && (
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <MapPin className="size-4" />
                            {job.location_city}, {job.location_country}
                         </div>
                       )}
                       {job.budget_pkr && (
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 font-black">
                            <DollarSign className="size-4" />
                            PKR {job.budget_pkr.toLocaleString()}
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="lg:w-80 shrink-0 space-y-6">
                     <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                        <Users className="size-8 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-2xl font-black text-slate-950 dark:text-white mb-1 tabular-nums">
                           {job.job_applications?.length || 0}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expert Proposals</p>
                     </div>
                     
                     <div className="flex flex-col gap-3">
                         <Link href={`/dashboard/student/jobs/${job.id}`} className="w-full">
                           <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black active:scale-95 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                              View Proposals
                              <ChevronRight className="size-4" />
                           </Button>
                        </Link>
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 hover:bg-red-50 hover:text-red-600 active:scale-95 text-slate-600 font-black text-xs uppercase tracking-widest transition-all">
                           Close Job
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
