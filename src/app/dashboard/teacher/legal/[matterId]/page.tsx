"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Clock, Eye, FileText, Loader2, Paperclip, PenLine, Scale, Send, Signature } from "lucide-react"

type TeacherRow = { id: string; category: string }

type MatterRow = {
  id: string
  title: string
  status: string
  client_id: string
  booking_id?: string | null
  created_at: string
  client?: Array<{ full_name?: string | null }> | null
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
  status: string
  requested_at: string
  completed_at?: string | null
  signer_id: string
  signer?: { full_name?: string | null } | null
  document?: { name?: string | null } | null
}

type TimeRow = {
  id: string
  minutes: number
  note?: string | null
  happened_at: string
}

export default function MatterDetailPage() {
  const { user } = useStore()
  const params = useParams()
  const router = useRouter()
  const matterId = params.matterId as string

  const [isLoading, setIsLoading] = useState(true)
  const [teacher, setTeacher] = useState<TeacherRow | null>(null)
  const [matter, setMatter] = useState<MatterRow | null>(null)
  const [docs, setDocs] = useState<DocRow[]>([])
  const [requests, setRequests] = useState<ESignRow[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeRow[]>([])
  type MatterEvent = { id: string; type: string; created_at: string; meta: Record<string, unknown> }
  const [events, setEvents] = useState<MatterEvent[]>([])

  const [docName, setDocName] = useState("")
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docRequiresSig, setDocRequiresSig] = useState(false)
  const [isAddingDoc, setIsAddingDoc] = useState(false)

  const [sigDocId, setSigDocId] = useState<string>("")
  const [isRequestingSig, setIsRequestingSig] = useState(false)

  const [minutes, setMinutes] = useState<string>("30")
  const [timeNote, setTimeNote] = useState<string>("")
  const [isLoggingTime, setIsLoggingTime] = useState(false)

  const sigEligibleDocs = useMemo(() => docs.filter((d) => d.requires_signature), [docs])

  useEffect(() => {
    async function load() {
      if (!user || !matterId) return
      setIsLoading(true)
      try {
        const { data: t, error: tErr } = await supabase
          .from("teachers")
          .select("id, category")
          .eq("user_id", user.id)
          .single()
        if (tErr) throw tErr
        setTeacher(t)

        const { data: m, error: mErr } = await supabase
          .from("matters")
          .select("id, title, status, client_id, booking_id, created_at, client:profiles!matters_client_id_fkey(full_name)")
          .eq("id", matterId)
          .single()
        if (mErr) throw mErr
        setMatter(m as unknown as MatterRow)

        const { data: d, error: dErr } = await supabase
          .from("matter_documents")
          .select("id, name, url, requires_signature, created_at")
          .eq("matter_id", matterId)
          .order("created_at", { ascending: false })
        if (dErr) throw dErr
        setDocs((d || []) as DocRow[])

        const { data: r, error: rErr } = await supabase
          .from("esign_requests")
          .select("id, status, requested_at, completed_at, signer_id, signer:profiles!esign_requests_signer_id_fkey(full_name), document:matter_documents(name)")
          .in("document_id", (d || []).map((x) => x.id).length ? (d || []).map((x) => x.id) : ["00000000-0000-0000-0000-000000000000"])
          .order("requested_at", { ascending: false })
        if (rErr) {
          // If there are no docs yet, avoid failing the page.
          console.error(rErr)
        } else {
          setRequests((r || []) as ESignRow[])
        }

        const { data: te, error: teErr } = await supabase
          .from("time_entries")
          .select("id, minutes, note, happened_at")
          .eq("matter_id", matterId)
          .order("happened_at", { ascending: false })
        if (teErr) throw teErr
        setTimeEntries((te || []) as TimeRow[])

        const { data: ev, error: evErr } = await supabase
          .from("matter_events")
          .select("id, type, created_at, meta")
          .eq("matter_id", matterId)
          .order("created_at", { ascending: false })
        if (evErr) throw evErr
        setEvents((ev || []) as MatterEvent[])

        // Default the signature doc picker
        const firstSig = (d || []).find((x) => x.requires_signature)
        if (firstSig) setSigDocId(firstSig.id)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load matter")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user, matterId])

  const addDoc = async () => {
    if (!user || !matter) return
    if (!docName.trim() || !docFile) {
      toast.error("Enter document name and choose a file")
      return
    }
    setIsAddingDoc(true)
    try {
      const actorId = user.id
      const safeName = docFile.name.replace(/[^\w.\-() ]+/g, "_")
      const path = `${matter.id}/${crypto.randomUUID()}-${safeName}`
      const { error: upErr } = await supabase.storage.from("legal_docs").upload(path, docFile, {
        cacheControl: "3600",
        upsert: false,
      })
      if (upErr) throw upErr

      const { data, error } = await supabase
        .from("matter_documents")
        .insert({
          matter_id: matter.id,
          uploader_id: user.id,
          name: docName.trim(),
          url: path,
          requires_signature: docRequiresSig,
        })
        .select("id, name, url, requires_signature, created_at")
        .single()
      if (error) throw error
      setDocs((prev) => [data as DocRow, ...prev])
      if (docRequiresSig) setSigDocId((data as DocRow).id)
      await supabase.from("matter_events").insert({
        matter_id: matter.id,
        actor_id: actorId,
        type: "document_added",
        meta: { name: docName.trim(), requires_signature: docRequiresSig },
      })
      setDocName("")
      setDocFile(null)
      setDocRequiresSig(false)
      toast.success("Document added")
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to add document"
      toast.error(message)
    } finally {
      setIsAddingDoc(false)
    }
  }

  const openDoc = async (doc: DocRow) => {
    // If it looks like a URL, open directly
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

  const requestSignature = async () => {
    if (!user || !matter || !sigDocId) return
    if (!matter.client_id) {
      toast.error("Missing client for this matter")
      return
    }
    setIsRequestingSig(true)
    try {
      const actorId = user.id
      const { data, error } = await supabase
        .from("esign_requests")
        .insert({
          document_id: sigDocId,
          requester_id: user.id,
          signer_id: matter.client_id,
          status: "requested",
        })
        .select("id, status, requested_at, completed_at, signer_id, signer:profiles!esign_requests_signer_id_fkey(full_name), document:matter_documents(name)")
        .single()
      if (error) throw error
      setRequests((prev) => [data as ESignRow, ...prev])
      await supabase.from("matter_events").insert({
        matter_id: matter.id,
        actor_id: actorId,
        type: "signature_requested",
        meta: { document_id: sigDocId },
      })
      toast.success("Signature requested")
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to request signature"
      toast.error(message)
    } finally {
      setIsRequestingSig(false)
    }
  }

  const logTime = async () => {
    if (!teacher || !matter) return
    if (!user) return
    const m = Number(minutes)
    if (!Number.isFinite(m) || m <= 0) {
      toast.error("Enter valid minutes")
      return
    }
    setIsLoggingTime(true)
    try {
      const actorId = user.id
      const { data, error } = await supabase
        .from("time_entries")
        .insert({
          matter_id: matter.id,
          teacher_id: teacher.id,
          minutes: m,
          note: timeNote.trim() || null,
        })
        .select("id, minutes, note, happened_at")
        .single()
      if (error) throw error
      setTimeEntries((prev) => [data as TimeRow, ...prev])
      await supabase.from("matter_events").insert({
        matter_id: matter.id,
        actor_id: actorId,
        type: "time_logged",
        meta: { minutes: m, note: timeNote.trim() || null },
      })
      setTimeNote("")
      toast.success("Time logged")
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Failed to log time"
      toast.error(message)
    } finally {
      setIsLoggingTime(false)
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

  if (teacher?.category !== "Legal") {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="size-6 text-orange-500" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Legal Matter</h1>
          </div>
          <p className="text-slate-500 font-medium">This page is available for Legal experts only.</p>
          <div className="pt-6">
            <Link href="/dashboard/teacher">
              <Button className="h-12 px-6 rounded-2xl bg-primary text-white font-black">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!matter) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          <p className="text-slate-500 font-medium">Matter not found or you don&apos;t have access.</p>
          <div className="pt-6">
            <Button variant="outline" className="h-12 px-6 rounded-2xl" onClick={() => router.push("/dashboard/teacher/legal")}>
              <ArrowLeft className="size-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 mb-5" onClick={() => router.push("/dashboard/teacher/legal")}>
            <ArrowLeft className="size-4 mr-2" /> Back to Matters
          </Button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 text-orange-600 text-[10px] font-black uppercase tracking-widest">
            <Scale className="size-3" /> Matter
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white truncate">{matter.title}</h1>
          <p className="text-slate-500 font-medium mt-2">
            Client: <span className="font-black">{matter.client?.[0]?.full_name || "Client"}</span>
          </p>
        </div>
        <div className="shrink-0">
          <span
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              matter.status === "closed"
                ? "bg-slate-100 text-slate-600 border-slate-200"
                : matter.status === "pending"
                  ? "bg-orange-50 text-orange-700 border-orange-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}
          >
            {matter.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Documents</h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Paperclip className="size-3" /> Secure Uploads
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Document Name</label>
              <input value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">File</label>
              <input
                type="file"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                className="w-full h-14 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500">
                <input type="checkbox" checked={docRequiresSig} onChange={(e) => setDocRequiresSig(e.target.checked)} className="size-4 rounded border-slate-300" />
                Requires signature
              </label>
              <Button onClick={addDoc} disabled={isAddingDoc} className="h-12 px-6 rounded-2xl bg-primary text-white font-black">
                {isAddingDoc ? <Loader2 className="size-4 mr-2 animate-spin" /> : <PenLine className="size-4 mr-2" />}
                Add Document
              </Button>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 dark:border-slate-800 pt-8 space-y-4">
            {docs.length === 0 ? (
              <div className="py-10 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <FileText className="size-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No documents yet</p>
              </div>
            ) : (
              docs.map((d) => (
                <div key={d.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate">{d.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      {d.requires_signature ? "Signature required" : "Reference"}
                    </p>
                  </div>
                  <button
                    onClick={() => openDoc(d)}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    aria-label={`Open document ${d.name}`}
                  >
                    <Eye className="size-4" /> View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Matter Timeline</h2>
            {events.length === 0 ? (
              <p className="text-sm font-bold text-slate-500">No events yet.</p>
            ) : (
              <div className="space-y-3">
                {events.slice(0, 12).map((e) => (
                  <div key={e.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">{e.type.replace(/_/g, " ")}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{e.created_at.split("T")[0]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Signature Requests</h2>
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Document</label>
              <select
                value={sigDocId}
                onChange={(e) => setSigDocId(e.target.value)}
                className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              >
                <option value="">Select…</option>
                {sigEligibleDocs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={requestSignature}
                disabled={isRequestingSig || !sigDocId || sigEligibleDocs.length === 0}
                className="w-full h-12 rounded-2xl bg-primary text-white font-black mt-3"
              >
                {isRequestingSig ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Signature className="size-4 mr-2" />}
                Request Signature
              </Button>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                Signer: {matter.client?.[0]?.full_name || "Client"}
              </p>
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 space-y-3">
              {requests.length === 0 ? (
                <p className="text-sm font-bold text-slate-500">No requests yet.</p>
              ) : (
                requests.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{r.document?.name || "Document"}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      {r.status} • {r.requested_at.split("T")[0]}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="size-5 text-orange-400" />
              <h2 className="text-xl font-black tracking-tight">Billable Time</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Minutes</label>
                <input value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Note</label>
                <input value={timeNote} onChange={(e) => setTimeNote(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold" placeholder="e.g. Drafted letter" />
              </div>
            </div>
            <Button onClick={logTime} disabled={isLoggingTime} className="w-full h-12 rounded-2xl bg-primary text-white font-black mt-4">
              {isLoggingTime ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Send className="size-4 mr-2" />}
              Log Time
            </Button>

            <div className="mt-6 space-y-3">
              {timeEntries.length === 0 ? (
                <p className="text-sm font-bold text-slate-300">No time entries yet.</p>
              ) : (
                timeEntries.slice(0, 5).map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm font-black">{t.minutes} min</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      {t.happened_at.split("T")[0]} {t.note ? `• ${t.note}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

