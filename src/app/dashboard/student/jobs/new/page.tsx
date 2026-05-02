"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Tag, 
  MessageSquare, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Sparkles
} from "lucide-react"

export default function PostJobPage() {
  const { user } = useStore()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic",
    budget: "",
    city: "",
    country: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to post a job")
      return
    }

    if (!formData.title || !formData.description) {
      toast.error("Title and description are required")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("jobs")
        .insert({
          client_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget_pkr: formData.budget ? parseFloat(formData.budget) : null,
          location_city: formData.city || null,
          location_country: formData.country || null,
          status: 'open'
        })

      if (error) throw error

      toast.success("Job posted successfully!")
      router.push("/dashboard/student/jobs")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to post job")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-28 sm:pb-32 px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 border-b border-slate-200 dark:border-border pb-8 sm:pb-12">
        <div className="max-w-2xl min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900 text-white shadow-2xl mb-4 sm:mb-6">
            <Sparkles className="size-4 text-primary shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold tracking-wide leading-none text-white">Marketplace Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-foreground mb-3 sm:mb-4 leading-[1.05] text-balance">
            Post a Query <br /><span className="text-primary">& Find Experts.</span>
          </h1>
          <p className="text-slate-600 dark:text-muted-foreground font-medium text-base sm:text-xl leading-relaxed">
            Describe your project, legal matter, or academic challenge and receive proposals from our elite expert network.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-8 space-y-8 sm:space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="size-5 text-primary" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground">Job Essentials</h3>
            </div>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Need urgent legal advice for property dispute in Lahore"
                className="w-full px-4 sm:px-8 min-h-11 sm:h-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all shadow-inner"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Full Description</label>
              <textarea
                placeholder="Provide as much detail as possible. This helps experts give you accurate proposals."
                className="w-full px-4 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-medium leading-relaxed shadow-inner min-h-[200px] sm:min-h-[250px] transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </section>

          <section className="space-y-6">
             <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <MapPin className="size-5 text-orange-600" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground">Location (Optional)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="City (e.g. Karachi)"
                className="w-full px-4 sm:px-8 min-h-11 sm:h-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country (e.g. Pakistan)"
                className="w-full px-4 sm:px-8 min-h-11 sm:h-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </section>
        </div>

        <div className="md:col-span-4 space-y-8">
          <div className="p-5 sm:p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-6 sm:space-y-8 md:sticky md:top-24 shadow-xl">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Domain / Category</label>
              <div className="relative group">
                <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-primary size-5" />
                <select
                  className="w-full pl-14 pr-8 min-h-11 sm:h-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-sm focus:ring-2 focus:ring-primary appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Academic">Academic</option>
                  <option value="Legal">Legal</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Mechanics">Mechanics</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Estimated Budget (PKR)</label>
              <div className="relative group">
                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary size-5" />
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full pl-14 pr-8 min-h-11 sm:h-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-black text-lg sm:text-xl tracking-tight shadow-inner"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                  Verified experts will review your post and send tailored proposals.
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full min-h-14 sm:min-h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-base sm:text-lg shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 whitespace-normal text-center px-3"
            >
              {isSubmitting ? <Loader2 className="animate-spin size-6" /> : <ChevronRight className="size-6" />}
              Post Query Now
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
