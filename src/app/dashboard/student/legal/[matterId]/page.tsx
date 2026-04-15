"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, CheckCircle2, ExternalLink, FileText, Loader2, Scale, Signature, ThumbsDown } from "lucide-react"

type MatterRow = {
  id: string
  title: string
  status: string
  teacher?: { profiles?: { full_name?: string | null } | null } | null
}

type DocRow = {
  id: string
  name: string
  url: string
  requires_signature: boolean
  created_at: string
}

type ESignRow = {
  id: string
  document_id: string
  status: "requested" | "signed" | "declined" | "voided" | string
  requested_at: string
  completed_at?: string | null
  document?: { name?: string | null } | null
}

export default function StudentMatterDetail() {
  const { user } = useStore()
  const params = useParams()
  const router = useRouter()
  const matterId = params.matterId as string

  const [isLoading, setIsLoading] = useState(true)
  const [matter, setMatter] = useState<MatterRow | null>(null)
  const [docs, setDocs] = useState<DocRow[]>([])
  const [reqs, setReqs] = useState<ESignRow[]>([])

  const pendingReqs = useMemo(() => reqs.filter((r) => r.status === "requested"), [reqs])

  useEffect(() => {
    async function load() {
      if (!user) return
      setIsLoading(true)
      try {
        const { data: m, error: mErr } = await supabase
          .from("matters")
          .select("id, title, status, teacher:teachers(profiles!teachers_user_id_fkey(full_name))")
          .eq("id", matterId)
          .single()
        if (mErr) throw mErr
        setMatter(m as MatterRow)

        const { data: d, error: dErr } = await supabase
          .from("matter_documents")
          .select("id, name, url, requires_signature, created_at")
          .eq("matter_id", matterId)
          .order("created_at", { ascending: false })
        if (dErr) throw dErr
        setDocs((d || []) as DocRow[])

        const { data: r, error: rErr } = await supabase
          .from("esign_requests")
          .select("id, document_id, status, requested_at, completed_at, document:matter_documents!inner(name, matter_id)")
          .eq("signer_id", user.id)
          .eq("document.matter_id", matterId)
          .order("requested_at", { ascending: false })
        if (rErr) throw rErr
        setReqs((r || []) as ESignRow[])
      } catch (err) {
        console.error(err)
        toast.error("Failed to load matter")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user, matterId])

  const openDoc = async (doc: DocRow) => {
    if (/^https?:\/\//i.test(doc.url)) {
      window.open(doc.url, "_blank", "noreferrer")
      return
    }
    const { data, error } = await supabase.storage.from("legal_docs").createSignedUrl(doc.url, 60 * 30)
    if (error || !data?.signedUrl) {
      toast.error("Failed to open file")
      return
    }
    window.open(data.signedUrl, "_blank", "noreferrer")
  }

  const updateSignature = async (req: ESignRow, nextStatus: "signed" | "declined") => {
    if (!user) return
    try {
      const { error } = await supabase
        .from("esign_requests")
        .update({ status: nextStatus, completed_at: new Date().toISOString() })
        .eq("id", req.id)
      if (error) throw error

      setReqs((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: nextStatus, completed_at: new Date().toISOString() } : r)))

      await supabase.from("matter_events").insert({
        matter_id: matterId,
        actor_id: user.id,
        type: "signature_updated",
        meta: { request_id: req.id, status: nextStatus, document_id: req.document_id },
      })

      toast.success(nextStatus === "signed" ? "Signed" : "Declined")
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to update signature"
      toast.error(message)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-bold text-slate-500">Please sign in.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!matter) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          <p className="text-slate-500 font-medium">Matter not found or you don&apos;t have access.</p>
          <div className="pt-6">
            <Button variant="outline" className="h-12 px-6 rounded-2xl" onClick={() => router.push("/dashboard/student/legal")}>
              <ArrowLeft className="size-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 mb-5" onClick={() => router.push("/dashboard/student/legal")}>
            <ArrowLeft className="size-4 mr-2" /> Back
          </Button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 text-orange-600 text-[10px] font-black uppercase tracking-widest">
            <Scale className="size-3" /> Legal Matter
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white truncate">{matter.title}</h1>
          <p className="text-slate-500 font-medium mt-2">
            Lawyer: <span className="font-black">{matter.teacher?.profiles?.full_name || "Expert"}</span>
          </p>
        </div>
        <div className="shrink-0">
          <div className="px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Signatures</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{pendingReqs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Signature className="size-6 text-orange-500" />
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Signature Requests</h2>
        </div>

        {pendingReqs.length === 0 ? (
          <p className="text-slate-500 font-bold">No signature requests right now.</p>
        ) : (
          <div className="space-y-4">
            {pendingReqs.map((r) => (
              <div key={r.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Requested {r.requested_at.split("T")[0]}</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white truncate">{r.document?.name || "Document"}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button onClick={() => updateSignature(r, "declined")} variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 font-black">
                    <ThumbsDown className="size-4 mr-2" /> Decline
                  </Button>
                  <Button onClick={() => updateSignature(r, "signed")} className="h-12 px-5 rounded-2xl bg-primary text-white font-black">
                    <CheckCircle2 className="size-4 mr-2" /> Sign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Documents</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{docs.length} total</span>
        </div>

        {docs.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No documents yet</h3>
            <p className="text-slate-500 font-medium mt-2">Your lawyer will attach files here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {docs.map((d) => (
              <div key={d.id} className="px-10 py-8 flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-black text-slate-900 dark:text-white truncate">{d.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                    {d.requires_signature ? "Signature required" : "Reference"}
                  </p>
                </div>
                <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 font-black" onClick={() => openDoc(d)}>
                  <ExternalLink className="size-4 mr-2" /> Open
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        Need help? Message your lawyer in <a href="/dashboard/student" className="text-primary hover:underline">My Sessions</a>.
      </div>
    </div>
  )
}

