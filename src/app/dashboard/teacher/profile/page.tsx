"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { X, Save, Image as ImageIcon, Link as LinkIcon, DollarSign, Loader2, User, Globe, Briefcase, Camera, Star, MessageSquarePlus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"
import Image from "next/image"

export default function TeacherProfile() {
  const { user, setUser } = useStore()
  const [avatar, setAvatar] = useState<string | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<{ id: string, type: 'image' | 'link', content: string }[]>([])
  const [category, setCategory] = useState<string>("Academic")
  const [qualifications, setQualifications] = useState("")
  const [headline, setHeadline] = useState("")
  const [bio, setBio] = useState("")
  const [rate, setRate] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  // Category-specific fields
  const [legalBarNumber, setLegalBarNumber] = useState("")
  const [legalJurisdiction, setLegalJurisdiction] = useState("")
  const [legalPracticeAreas, setLegalPracticeAreas] = useState("")

  const [mentalLicenseNumber, setMentalLicenseNumber] = useState("")
  const [mentalLicenseType, setMentalLicenseType] = useState("")
  const [mentalModalities, setMentalModalities] = useState("")

  const [wellnessCertification, setWellnessCertification] = useState("")
  const [wellnessSpecialties, setWellnessSpecialties] = useState("")
  const [wellnessApproach, setWellnessApproach] = useState("")

  const [academicSubjects, setAcademicSubjects] = useState("")
  const [academicEducationLevel, setAcademicEducationLevel] = useState("")
  const [academicCredentials, setAcademicCredentials] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  type ReviewRow = {
    id: string
    booking_id: string
    rating: number
    comment?: string | null
    expert_reply?: string | null
    expert_replied_at?: string | null
    created_at: string
    student?: { full_name?: string | null } | null
  }
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [replyingId, setReplyingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      setIsLoading(true)
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error(error)
      }
      
      if (data) {
        setCategory(data.category || "Academic")
        setBio(data.bio || "")
        setQualifications(data.qualifications || "")
        setHeadline(data.headline || "")
        setRate(data.hourly_rate != null && Number(data.hourly_rate) > 0 ? String(data.hourly_rate) : "")
        setAvatar(data.profile_pic_url || null)
        setSpecialty(data.specialty || "")
        setLegalBarNumber(data.legal_bar_number || "")
        setLegalJurisdiction(data.legal_jurisdiction || "")
        setLegalPracticeAreas((data.legal_practice_areas || []).join(", "))
        setMentalLicenseNumber(data.mental_license_number || "")
        setMentalLicenseType(data.mental_license_type || "")
        setMentalModalities((data.mental_modalities || []).join(", "))
        setWellnessCertification(data.wellness_certification || "")
        setWellnessSpecialties((data.wellness_specialties || []).join(", "))
        setWellnessApproach(data.wellness_approach || "")
        setAcademicSubjects((data.academic_subjects || []).join(", "))
        setAcademicEducationLevel(data.academic_education_level || "")
        setAcademicCredentials(data.academic_credentials || "")
        if (data.portfolio_urls && Array.isArray(data.portfolio_urls)) {
            setPortfolioItems(data.portfolio_urls)
        }
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [user])

  useEffect(() => {
    async function loadLocation() {
      if (!user) return
      try {
        const { data, error } = await supabase.from("profiles").select("city, country").eq("id", user.id).single()
        if (error) throw error
        setCity((data?.city as string | null) || "")
        setCountry((data?.country as string | null) || "")
      } catch (err) {
        console.error(err)
      }
    }
    loadLocation()
  }, [user])

  useEffect(() => {
    async function loadReviews() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("id, booking_id, rating, comment, expert_reply, expert_replied_at, created_at, student:profiles!reviews_student_id_fkey(full_name)")
          .eq("expert_id", user.id)
          .order("created_at", { ascending: false })
          .limit(25)
        if (error) throw error
        setReviews((data || []) as ReviewRow[])
      } catch (err) {
        console.error(err)
      }
    }
    loadReviews()
  }, [user])

  const submitReply = async (reviewId: string) => {
    if (!user) return
    const text = (replyDrafts[reviewId] || "").trim()
    if (!text) {
      toast.error("Write a short reply first.")
      return
    }
    setReplyingId(reviewId)
    try {
      const now = new Date().toISOString()
      const { error } = await supabase
        .from("reviews")
        .update({ expert_reply: text, expert_replied_at: now })
        .eq("id", reviewId)
      if (error) throw error
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, expert_reply: text, expert_replied_at: now } : r)))
      toast.success("Reply posted")
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to post reply"
      toast.error(message)
    } finally {
      setReplyingId(null)
    }
  }

  const handleAddPortfolioLink = () => {
    const url = prompt("Enter link URL (e.g., Behance, GitHub, Dribbble):")
    if (url) {
      setPortfolioItems(prev => [...prev, { id: Date.now().toString(), type: 'link', content: url }])
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAvatar = false) => {
    if (!e.target.files || !e.target.files[0] || !user) return
    
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const bucket = isAvatar ? 'avatars' : 'portfolios'
    const filePath = `${user.id}/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
      
      if (isAvatar) {
        setAvatar(publicUrl)
        // Sync with base profiles as well
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
        // Update auth metadata
        await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
        
        // Update store
        if (user) {
          setUser({
            ...user,
            user_metadata: {
              ...user.user_metadata,
              avatar_url: publicUrl
            }
          })
        }
      } else {
        setPortfolioItems(prev => [...prev, { id: Date.now().toString(), type: 'image', content: publicUrl }])
      }
      toast.success("File uploaded successfully!")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to upload file"
      toast.error(message)
    }
  }

  const handleSave = async () => {
    if (!user) {
        toast.error("Please login first")
        return
    }
    setIsSaving(true)
    try {
        const toTextArray = (v: string) =>
          v.split(",").map(s => s.trim()).filter(Boolean)

        const { error } = await supabase
            .from('teachers')
            .upsert({
                user_id: user.id,
                bio,
                qualifications,
                headline: headline.trim() ? headline.trim() : null,
                hourly_rate: rate.trim() ? parseFloat(rate) : null,
                profile_pic_url: avatar,
                specialty,
                legal_bar_number: legalBarNumber || null,
                legal_jurisdiction: legalJurisdiction || null,
                legal_practice_areas: toTextArray(legalPracticeAreas),
                mental_license_number: mentalLicenseNumber || null,
                mental_license_type: mentalLicenseType || null,
                mental_modalities: toTextArray(mentalModalities),
                wellness_certification: wellnessCertification || null,
                wellness_specialties: toTextArray(wellnessSpecialties),
                wellness_approach: wellnessApproach || null,
                academic_subjects: toTextArray(academicSubjects),
                academic_education_level: academicEducationLevel || null,
                academic_credentials: academicCredentials || null,
                portfolio_urls: portfolioItems,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            
        if (error) throw error

        const { error: pErr } = await supabase
          .from("profiles")
          .update({
            city: city.trim() ? city.trim() : null,
            country: country.trim() ? country.trim() : null,
          })
          .eq("id", user.id)
        if (pErr) throw pErr

        toast.success("Professional profile established")
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to save profile"
        toast.error(message)
        console.error(error)
    } finally {
        setIsSaving(false)
    }
  }

  if (isLoading) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary size-12" />
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Loading Clinical Profile...</p>
        </div>
      )
  }

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <div className="bg-white dark:bg-slate-950 p-10 md:p-14 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/40">
        <div className="mb-14 border-b border-slate-100 dark:border-slate-800 pb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 font-black text-[10px] uppercase tracking-widest text-primary">
              <User className="size-3" /> Practice Identity
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">Profile & Practice</h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">Elite professionals maintain high-fidelity profiles. Your portfolio is your bridge to new clients.</p>
          </div>
          
          <div className="flex items-center gap-8 group">
            <div className="relative size-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl transition-all group-hover:border-primary duration-500">
              {avatar ? (
                <Image src={avatar} alt="Avatar" fill className="object-cover" sizes="128px" />
              ) : (
                <User className="size-12 text-slate-300" />
              )}
              <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-sm">
                <Camera className="size-8 text-white mb-2" />
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Update Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section className="space-y-8">
             <div className="flex items-center gap-3">
               <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="size-5 text-primary" />
               </div>
               <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Core Competencies</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Professional Narrative (Bio)</label>
                  <textarea 
                    className="w-full rounded-[1.8rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-8 py-6 focus:ring-4 focus:ring-primary/10 text-sm font-medium leading-relaxed shadow-inner min-h-[180px] transition-all"
                    placeholder="Describe your professional journey, your approach, or your advisory philosophy..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div className="md:col-span-4 space-y-6">
                   <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Public Headline</label>
                    <div className="relative group">
                      <MessageSquarePlus className="absolute left-6 top-1/2 -translate-y-1/2 text-primary size-5 group-hover:scale-110 transition-transform" />
                      <input
                        type="text"
                        placeholder="e.g. Corporate lawyer • M&A, startups, contracts"
                        className="w-full pl-14 pr-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                      />
                    </div>
                  </div>
                   <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Hourly Advisory Rate</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary size-5 group-hover:scale-110 transition-transform" />
                      <input 
                        type="number" 
                        className="w-full pl-14 pr-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-xl font-black tracking-tight transition-all"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="Leave blank to negotiate"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Primary Specialty</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Clinical Psychology"
                      className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    />
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">City</label>
                 <input
                   type="text"
                   placeholder="e.g. Lahore"
                   className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Country</label>
                 <input
                   type="text"
                   placeholder="e.g. Pakistan"
                   className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
                   value={country}
                   onChange={(e) => setCountry(e.target.value)}
                 />
               </div>
             </div>

             <div>
               <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Key Qualifications & Credentials</label>
               <input 
                 type="text" 
                 placeholder="e.g. Board Certified, PhD, Senior Consultant at Mayo Clinic"
                 className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
                 value={qualifications}
                 onChange={(e) => setQualifications(e.target.value)}
               />
             </div>
          </section>

          {/* Reviews & replies */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Star className="size-5 text-orange-600 fill-orange-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Reviews</h2>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                <Star className="size-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No reviews yet.</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Reviews appear after completed bookings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {r.student?.full_name || "Client"} • {r.created_at.split("T")[0]}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`size-4 ${r.rating >= n ? "text-orange-500 fill-orange-500" : "text-slate-300"}`} />
                          ))}
                          <span className="text-xs font-black text-slate-500">({r.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking: {r.booking_id.substring(0, 8)}</p>
                    </div>

                    {r.comment ? <p className="mt-5 text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{r.comment}</p> : null}

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                      {r.expert_reply ? (
                        <div className="rounded-2xl bg-white/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your reply</p>
                          <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{r.expert_reply}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post a public reply</p>
                          <textarea
                            value={replyDrafts[r.id] || ""}
                            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                            className="w-full min-h-[110px] rounded-[1.6rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-primary/10"
                            placeholder="Thank you for your feedback…"
                            disabled={replyingId === r.id}
                          />
                          <Button
                            onClick={() => submitReply(r.id)}
                            disabled={replyingId === r.id}
                            className="h-12 px-6 rounded-2xl bg-primary text-white font-black"
                          >
                            {replyingId === r.id ? <Loader2 className="size-4 animate-spin" /> : <MessageSquarePlus className="size-4" />}
                            Post reply
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <Briefcase className="size-5 text-slate-700 dark:text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Field Requirements (for Public Listing)</h2>
            </div>

            {category === "Legal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Bar / Registration Number</label>
                  <input value={legalBarNumber} onChange={(e) => setLegalBarNumber(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Jurisdiction</label>
                  <input value={legalJurisdiction} onChange={(e) => setLegalJurisdiction(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. Pakistan, UK, California" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Practice Areas (comma-separated)</label>
                  <input value={legalPracticeAreas} onChange={(e) => setLegalPracticeAreas(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. Family law, Contracts, Corporate" />
                </div>
              </div>
            )}

            {category === "Mental Health" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">License Number</label>
                  <input value={mentalLicenseNumber} onChange={(e) => setMentalLicenseNumber(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">License Type</label>
                  <input value={mentalLicenseType} onChange={(e) => setMentalLicenseType(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. Psychologist, Therapist, Counselor" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Modalities (comma-separated)</label>
                  <input value={mentalModalities} onChange={(e) => setMentalModalities(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. CBT, DBT, ACT" />
                </div>
              </div>
            )}

            {category === "Wellness" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Certification / License</label>
                  <input value={wellnessCertification} onChange={(e) => setWellnessCertification(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. RD, CNC, ISSA" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Dietary / Coaching Approach</label>
                  <input value={wellnessApproach} onChange={(e) => setWellnessApproach(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. Mediterranean, Low-carb, Habit-based" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Specialties (comma-separated)</label>
                  <input value={wellnessSpecialties} onChange={(e) => setWellnessSpecialties(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. Diabetes, Weight loss, Sports nutrition" />
                </div>
              </div>
            )}

            {category === "Academic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Subjects (comma-separated)</label>
                  <input value={academicSubjects} onChange={(e) => setAcademicSubjects(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. Algebra, IELTS, Physics" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Education Level</label>
                  <input value={academicEducationLevel} onChange={(e) => setAcademicEducationLevel(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. High school, University" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Credentials</label>
                  <input value={academicCredentials} onChange={(e) => setAcademicCredentials(e.target.value)} className="w-full px-8 h-16 rounded-[1.2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all" placeholder="e.g. MSc Math, 8+ yrs experience" />
                </div>
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Globe className="size-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Portfolio & Evidence</h2>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" onClick={handleAddPortfolioLink} className="h-12 px-6 rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] border-slate-200 hover:border-primary hover:text-primary transition-all">
                  <LinkIcon className="size-3.5" />
                  Add Link
                </Button>
                <label className="cursor-pointer">
                   <div className="h-12 px-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:border-primary hover:text-primary transition-all">
                      <ImageIcon className="size-3.5" />
                      Add Photo
                   </div>
                   <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, false)} />
                </label>
              </div>
            </div>

            {portfolioItems.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <ImageIcon className="size-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No evidence uploaded</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">Showcase your case studies, publications, or portfolio highlights.</p>
              </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {portfolioItems.map((item) => (
                   <div key={item.id} className="relative group rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 aspect-video flex items-center justify-center shadow-xl hover:-translate-y-2 transition-all duration-500">
                     {item.type === 'image' ? (
                       <Image src={item.content} alt="Portfolio item" fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                     ) : (
                       <div className="p-8 text-center break-all flex flex-col items-center">
                         <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                            <Globe className="size-6 text-primary" />
                         </div>
                         <span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-full mb-1">{item.content}</span>
                         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">External Resource</span>
                       </div>
                     )}
                     <button 
                       onClick={() => setPortfolioItems(prev => prev.filter(p => p.id !== item.id))}
                       className="absolute top-4 right-4 bg-rose-500 text-white rounded-2xl p-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 active:scale-95"
                     >
                       <X className="size-4" />
                     </button>
                   </div>
                 ))}
               </div>
            )}
          </section>

          <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-6">
            <Button onClick={handleSave} disabled={isSaving} className="h-16 px-12 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-lg shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 gap-3">
               {isSaving ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
               Publish Clinical Profile
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
