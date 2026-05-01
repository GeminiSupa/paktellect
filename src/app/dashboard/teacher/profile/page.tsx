"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import {
  X,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  DollarSign,
  Loader2,
  User,
  Globe,
  Briefcase,
  Camera,
  Star,
  MessageSquarePlus,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ShieldCheck,
} from "lucide-react"
import {
  validateProfileForSave,
  validateProfileForPublish,
  type ExpertProfileBasicsInput,
} from "@/lib/expertProfileBasics"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"
import Image from "next/image"

const INPUT_CLASS =
  "w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"

const INPUT_WITH_ICON =
  "w-full h-14 pl-12 pr-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"

const FIELD_LABEL =
  "block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 mb-2 px-1"

export default function TeacherProfile() {
  const { user, setUser } = useStore()
  const [avatar, setAvatar] = useState<string | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<{ id: string; type: "image" | "link"; content: string }[]>([])
  const [category, setCategory] = useState<string>("Academic")
  const [qualifications, setQualifications] = useState("")
  const [headline, setHeadline] = useState("")
  const [bio, setBio] = useState("")
  const [rate, setRate] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [isPublicLoaded, setIsPublicLoaded] = useState(false)
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
  const [saveErrors, setSaveErrors] = useState<string[]>([])

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
        .from("teachers")
        .select("*")
        .eq("user_id", user.id)
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
        setIsPublicLoaded(Boolean(data.is_public))
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [user])

  useEffect(() => {
    async function loadLocation() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("city, country, full_name, phone")
          .eq("id", user.id)
          .single()
        if (error) throw error
        setCity((data?.city as string | null) || "")
        setCountry((data?.country as string | null) || "")
        setFullName((data?.full_name as string | null) || (user.user_metadata?.full_name as string | null) || "")
        setPhone((data?.phone as string | null) || (user.user_metadata?.phone as string | null) || "")
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
          .select(
            "id, booking_id, rating, comment, expert_reply, expert_replied_at, created_at, student:profiles!reviews_student_id_fkey(full_name)"
          )
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

  // Live "ready to publish" check used to render the friendly checklist panel.
  const validatorInput: ExpertProfileBasicsInput = useMemo(
    () => ({
      displayNameFromAccount: fullName,
      phone,
      category,
      headline,
      specialty,
      rate,
      city,
      country,
      bio,
      qualifications,
      legalBarNumber,
      legalJurisdiction,
      legalPracticeAreas,
      mentalLicenseNumber,
      mentalLicenseType,
      mentalModalities,
      wellnessCertification,
      wellnessSpecialties,
      wellnessApproach,
      academicSubjects,
      academicEducationLevel,
      academicCredentials,
    }),
    [
      fullName,
      phone,
      category,
      headline,
      specialty,
      rate,
      city,
      country,
      bio,
      qualifications,
      legalBarNumber,
      legalJurisdiction,
      legalPracticeAreas,
      mentalLicenseNumber,
      mentalLicenseType,
      mentalModalities,
      wellnessCertification,
      wellnessSpecialties,
      wellnessApproach,
      academicSubjects,
      academicEducationLevel,
      academicCredentials,
    ]
  )

  const publishCheck = useMemo(() => validateProfileForPublish(validatorInput), [validatorInput])

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
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, expert_reply: text, expert_replied_at: now } : r))
      )
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
      setPortfolioItems((prev) => [...prev, { id: Date.now().toString(), type: "link", content: url }])
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAvatar = false) => {
    if (!e.target.files || !e.target.files[0] || !user) return

    const file = e.target.files[0]
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const bucket = isAvatar ? "avatars" : "portfolios"
    const filePath = `${user.id}/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      if (isAvatar) {
        setAvatar(publicUrl)
        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id)
        await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })

        if (user) {
          setUser({
            ...user,
            user_metadata: {
              ...user.user_metadata,
              avatar_url: publicUrl,
            },
          })
        }
      } else {
        setPortfolioItems((prev) => [...prev, { id: Date.now().toString(), type: "image", content: publicUrl }])
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

    // Save tier: only blocks on the bare minimum (name + phone + category).
    // Everything else is saved as a draft and surfaced in the Go-Live checklist.
    const saveCheck = validateProfileForSave(validatorInput)
    if (!saveCheck.ok) {
      setSaveErrors(saveCheck.errors)
      toast.error(saveCheck.errors[0])
      return
    }
    setSaveErrors([])

    setIsSaving(true)
    try {
      const toTextArray = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean)

      const { error } = await supabase
        .from("teachers")
        .upsert(
          {
            user_id: user.id,
            category,
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
            // is_public intentionally NOT touched here. The only place that controls
            // it is the Dashboard "Go Live" hero (single source of truth).
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )

      if (error) throw error

      const { error: pErr } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          city: city.trim() ? city.trim() : null,
          country: country.trim() ? country.trim() : null,
          phone: phone.trim() ? phone.trim() : null,
        })
        .eq("id", user.id)
      if (pErr) throw pErr

      await supabase.auth.updateUser({ data: { full_name: fullName.trim(), phone: phone.trim() } })
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        })
      }

      if (publishCheck.ok && !isPublicLoaded) {
        toast.success("Draft saved", {
          description: "You're ready to go live. Open the dashboard to publish.",
          action: {
            label: "Go to dashboard",
            onClick: () => {
              window.location.href = "/dashboard/teacher"
            },
          },
        })
      } else if (publishCheck.ok && isPublicLoaded) {
        toast.success("Profile updated", {
          description: "Your live listing now reflects your changes.",
        })
      } else {
        toast.success("Draft saved", {
          description: `${publishCheck.errors.length} item${
            publishCheck.errors.length === 1 ? "" : "s"
          } left before you can go live.`,
        })
      }
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
        <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Loading profile…</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-8 pb-32">
      <div className="bg-white dark:bg-slate-950 p-5 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 mx-3 sm:mx-0">
        {/* Header */}
        <div className="mb-8 sm:mb-10 border-b border-slate-100 dark:border-slate-800 pb-6 sm:pb-8 flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-black text-[10px] uppercase tracking-widest text-primary">
                <User className="size-3" /> Edit profile
              </div>
              {isPublicLoaded ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-black text-[10px] uppercase tracking-widest text-emerald-600">
                  <CheckCircle2 className="size-3" /> Live in directory
                </div>
              ) : publishCheck.ok ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 font-black text-[10px] uppercase tracking-widest text-amber-600">
                  <CheckCircle2 className="size-3" /> Ready to go live
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 font-black text-[10px] uppercase tracking-widest text-slate-500">
                  <AlertCircle className="size-3" /> Draft
                </div>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
              Your profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium max-w-xl">
              Save your work anytime — it&apos;s a draft until you publish it from the dashboard.
            </p>
          </div>

          <div className="flex items-center gap-6 group shrink-0 self-center lg:self-start">
            <div className="relative size-24 sm:size-28 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-xl transition-all group-hover:border-primary duration-500">
              {avatar ? (
                <Image src={avatar} alt="Avatar" fill className="object-cover" sizes="112px" />
              ) : (
                <User className="size-10 text-slate-300" />
              )}
              <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-sm">
                <Camera className="size-7 text-white mb-1.5" />
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Update Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Inline save errors (only shown when Save itself failed) */}
          {saveErrors.length > 0 && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-950 dark:text-rose-100"
            >
              <div className="flex items-center gap-2 font-bold mb-2">
                <AlertCircle className="size-4 shrink-0" />
                Can&apos;t save yet
              </div>
              <ul className="list-disc pl-5 space-y-1 font-medium">
                {saveErrors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Friendly "Before going live" panel — only shown when something is missing */}
          {!publishCheck.ok && (
            <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-amber-600 shrink-0" aria-hidden />
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Before you can go live in the directory
                  </h3>
                </div>
                <Link
                  href="/manual/expert"
                  className="hidden sm:inline-flex items-center gap-1 shrink-0 text-xs font-bold text-amber-700 hover:underline"
                >
                  <BookOpen className="size-3.5" />
                  Manual
                </Link>
              </div>
              <ul className="space-y-1.5">
                {publishCheck.errors.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-100 font-medium">
                    <span className="text-amber-600 mt-0.5">•</span>
                    {e}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-medium text-amber-800/80 dark:text-amber-200/80">
                You can save and edit these whenever you like. Publishing happens from the dashboard.
              </p>
            </section>
          )}

          {/* Identity */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="size-4 text-primary" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Basics
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={FIELD_LABEL}>Display name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-4" aria-hidden />
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sarah Ahmed"
                    className={INPUT_WITH_ICON}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={FIELD_LABEL}>
                  Phone number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  className={INPUT_CLASS}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={FIELD_LABEL}>Public headline</label>
                <div className="relative">
                  <MessageSquarePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-4" aria-hidden />
                  <input
                    type="text"
                    placeholder="e.g. Corporate lawyer • M&A, startups, contracts"
                    className={INPUT_WITH_ICON}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={FIELD_LABEL}>Hourly rate (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-4" aria-hidden />
                  <input
                    type="number"
                    placeholder="Leave blank to negotiate"
                    className={`${INPUT_WITH_ICON} text-base font-bold`}
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={FIELD_LABEL}>Specialty</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-4" aria-hidden />
                  <input
                    type="text"
                    placeholder="e.g. M&A Advisor, Fitness Coach"
                    className={INPUT_WITH_ICON}
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={FIELD_LABEL}>Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. Board Certified, MBBS, 10+ yrs"
                  className={INPUT_CLASS}
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={FIELD_LABEL}>City</label>
                <input
                  type="text"
                  placeholder="e.g. Lahore"
                  className={INPUT_CLASS}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Country</label>
                <input
                  type="text"
                  placeholder="e.g. Pakistan"
                  className={INPUT_CLASS}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={FIELD_LABEL}>Bio</label>
              <textarea
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-5 py-4 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 leading-relaxed min-h-[140px] transition-all"
                placeholder="What do you help clients with? Keep it concrete and friendly."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </section>

          {/* Category-specific */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="size-4 text-slate-700 dark:text-slate-200" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {category} requirements
              </h2>
            </div>

            {category === "Legal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={FIELD_LABEL}>Bar / registration number</label>
                  <input
                    value={legalBarNumber}
                    onChange={(e) => setLegalBarNumber(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Jurisdiction</label>
                  <input
                    value={legalJurisdiction}
                    onChange={(e) => setLegalJurisdiction(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="e.g. Pakistan, UK, California"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={FIELD_LABEL}>Practice areas (comma-separated)</label>
                  <input
                    value={legalPracticeAreas}
                    onChange={(e) => setLegalPracticeAreas(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Family law, Contracts, Corporate"
                  />
                </div>
              </div>
            )}

            {category === "Mental Health" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={FIELD_LABEL}>License number</label>
                  <input
                    value={mentalLicenseNumber}
                    onChange={(e) => setMentalLicenseNumber(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>License type</label>
                  <input
                    value={mentalLicenseType}
                    onChange={(e) => setMentalLicenseType(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="e.g. Psychologist, Therapist, Counselor"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={FIELD_LABEL}>Modalities (comma-separated)</label>
                  <input
                    value={mentalModalities}
                    onChange={(e) => setMentalModalities(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="CBT, DBT, ACT"
                  />
                </div>
              </div>
            )}

            {category === "Wellness" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={FIELD_LABEL}>Certification / license</label>
                  <input
                    value={wellnessCertification}
                    onChange={(e) => setWellnessCertification(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="e.g. RD, CNC, ISSA"
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Coaching approach</label>
                  <input
                    value={wellnessApproach}
                    onChange={(e) => setWellnessApproach(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="e.g. Mediterranean, Habit-based"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={FIELD_LABEL}>Specialties (comma-separated)</label>
                  <input
                    value={wellnessSpecialties}
                    onChange={(e) => setWellnessSpecialties(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Diabetes, Weight loss, Sports nutrition"
                  />
                </div>
              </div>
            )}

            {(category === "Academic" ||
              category === "Plumbing" ||
              category === "Electrical" ||
              category === "Logistics" ||
              category === "Mechanics") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={FIELD_LABEL}>Subjects / services (comma-separated)</label>
                  <input
                    value={academicSubjects}
                    onChange={(e) => setAcademicSubjects(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Algebra, IELTS, Physics"
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Education / experience level</label>
                  <input
                    value={academicEducationLevel}
                    onChange={(e) => setAcademicEducationLevel(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="e.g. High school, University"
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Credentials</label>
                  <input
                    value={academicCredentials}
                    onChange={(e) => setAcademicCredentials(e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="e.g. MSc Math, 8+ yrs experience"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Portfolio */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Globe className="size-4 text-orange-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Portfolio
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddPortfolioLink}
                  className="h-10 px-4 rounded-xl gap-2 font-black uppercase tracking-widest text-[10px]"
                >
                  <LinkIcon className="size-3.5" />
                  Add Link
                </Button>
                <label className="cursor-pointer">
                  <div className="h-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:border-primary hover:text-primary transition-all">
                    <ImageIcon className="size-3.5" />
                    Add Photo
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, false)} />
                </label>
              </div>
            </div>

            {portfolioItems.length === 0 ? (
              <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <ImageIcon className="size-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                  Optional. Add work samples or links to make a stronger case.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 aspect-video flex items-center justify-center shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.content}
                        alt="Portfolio item"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="p-6 text-center break-all flex flex-col items-center">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                          <Globe className="size-5 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full mb-1">
                          {item.content}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                          External link
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => setPortfolioItems((prev) => prev.filter((p) => p.id !== item.id))}
                      className="absolute top-3 right-3 bg-rose-500 text-white rounded-xl p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110 active:scale-95"
                      aria-label="Remove portfolio item"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Save bar */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:mr-auto">
              {publishCheck.ok
                ? isPublicLoaded
                  ? "Live in directory. Changes are reflected immediately on save."
                  : "Ready to go live — publish from the dashboard."
                : `${publishCheck.errors.length} item${
                    publishCheck.errors.length === 1 ? "" : "s"
                  } left before you can go live.`}
            </p>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
              Save profile
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews — separate card below the editor */}
      <section
        id="reviews"
        className="bg-white dark:bg-slate-950 p-5 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 mx-3 sm:mx-0 space-y-5 scroll-mt-28"
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Star className="size-4 text-orange-600 fill-orange-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Reviews</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Star className="size-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-sm">No reviews yet.</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Reviews appear after completed bookings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {r.student?.full_name || "Client"} • {r.created_at.split("T")[0]}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`size-4 ${
                            r.rating >= n ? "text-orange-500 fill-orange-500" : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-black text-slate-500">({r.rating}/5)</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Booking: {r.booking_id.substring(0, 8)}
                  </p>
                </div>

                {r.comment ? (
                  <p className="mt-3 text-slate-700 dark:text-slate-200 font-medium leading-relaxed text-sm">
                    {r.comment}
                  </p>
                ) : null}

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {r.expert_reply ? (
                    <div className="rounded-xl bg-white/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        Your reply
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed text-sm">
                        {r.expert_reply}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Post a public reply
                      </p>
                      <textarea
                        value={replyDrafts[r.id] || ""}
                        onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                        className="w-full min-h-[90px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Thank you for your feedback…"
                        disabled={replyingId === r.id}
                      />
                      <Button
                        onClick={() => submitReply(r.id)}
                        disabled={replyingId === r.id}
                        className="h-11 px-5 rounded-xl bg-primary text-white font-black"
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
    </div>
  )
}
