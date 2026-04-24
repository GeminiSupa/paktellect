"use client"

import { useEffect, useState, useMemo } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { 
  Briefcase, 
  Search, 
  Loader2, 
  Clock, 
  MapPin, 
  DollarSign, 
  ChevronRight,
  Filter,
  Sparkles,
  Globe
} from "lucide-react"
import { detectLocation, UserLocation } from "@/lib/location"

export default function ExpertBrowseJobsPage() {
  const { user } = useStore()
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [userLoc, setUserLoc] = useState<UserLocation>({ city: null, country: null })

  const categories = ["All", "Academic", "Legal", "Wellness", "Mental Health", "Plumbing", "Electrical", "Logistics"]

  useEffect(() => {
    async function init() {
      const loc = await detectLocation(user?.id)
      setUserLoc(loc)
      
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select(`
            *,
            profiles:client_id (full_name, city, country)
          `)
          .eq("status", "open")
          .order("created_at", { ascending: false })

        if (error) throw error
        setJobs(data || [])
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load available jobs")
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [user])

  const filteredJobs = useMemo(() => {
    let filtered = jobs

    if (selectedCategory !== "All") {
      filtered = filtered.filter(j => j.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(term) || 
        j.description.toLowerCase().includes(term) ||
        (j.profiles?.full_name || "").toLowerCase().includes(term)
      )
    }

    // Sort by location relevance (experts see local jobs first)
    if (userLoc.city || userLoc.country) {
      filtered = [...filtered].sort((a, b) => {
        const aMatch = a.location_city === userLoc.city || a.location_country === userLoc.country
        const bMatch = b.location_city === userLoc.city || b.location_country === userLoc.country
        if (aMatch && !bMatch) return -1
        if (!aMatch && bMatch) return 1
        return 0
      })
    }

    return filtered
  }, [jobs, searchTerm, selectedCategory, userLoc])

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary size-10" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scanning marketplace...</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-border pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white shadow-2xl mb-6">
            <Globe className="size-3 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Global Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-foreground mb-4 leading-none">
            Browse Opportunities <br /><span className="text-primary">& Secure Mandates.</span>
          </h1>
          <p className="text-slate-600 dark:text-muted-foreground font-medium text-xl leading-relaxed">
            Apply to open queries and projects posted by clients in your domain. {userLoc.city && `Showing jobs near ${userLoc.city} first.`}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-40">
        <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row gap-4">
          <div className="flex flex-wrap gap-2 p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white shadow-xl" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block self-center mx-2" />
          <div className="relative grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
            <input 
              type="text" 
              placeholder="Search by topic, client name, or keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-8 rounded-2xl border-0 bg-transparent focus:ring-0 font-bold text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3 px-6 h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Filter className="size-4" />
            {filteredJobs.length} Results
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="size-24 rounded-full bg-slate-50 dark:bg-slate-950 mx-auto flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800">
            <Search className="size-10 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">No matching jobs</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">We couldn't find any open jobs matching your criteria. Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredJobs.map((job) => (
            <div key={job.id} className="group bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
               {/* Location Match Badge */}
               {(job.location_city === userLoc.city || job.location_country === userLoc.country) && (
                 <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                   <MapPin className="size-3" />
                   Relevant Near You
                 </div>
               )}

               <div className="flex flex-col lg:flex-row gap-10">
                  <div className="grow space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">
                        {job.category}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Clock className="size-4" />
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] group-hover:text-primary transition-colors">
                      {job.title}
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-3xl line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-8 pt-4">
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
                           <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <MapPin className="size-5 text-slate-400" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{job.location_city}, {job.location_country}</p>
                           </div>
                        </div>
                       )}

                       {job.budget_pkr && (
                        <div className="flex items-center gap-3">
                           <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <DollarSign className="size-5 text-emerald-600" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Estimated Budget</p>
                              <p className="text-sm font-black text-emerald-600">PKR {job.budget_pkr.toLocaleString()}</p>
                           </div>
                        </div>
                       )}
                    </div>
                  </div>

                  <div className="lg:w-72 shrink-0 flex items-end">
                     <Link href={`/dashboard/teacher/jobs/${job.id}`} className="w-full">
                        <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 group-hover:scale-[1.02] transition-all">
                           Review Details
                           <ChevronRight className="size-5" />
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
