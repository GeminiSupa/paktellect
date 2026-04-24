"use client"

import { useEffect, useState, useRef, use } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Loader2, Send, ArrowLeft, MessageSquare, Info, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function JobChatPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const { user } = useStore()
  const router = useRouter()

  type ChatMessage = {
    id?: string
    job_id?: string
    sender_id: string
    content: string
    created_at: string
    sender?: { full_name?: string | null }
  }

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (!user || !jobId) return

    async function loadMessages() {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*, sender:profiles!messages_sender_id_fkey(full_name)")
          .eq("job_id", jobId)
          .order("created_at", { ascending: true })

        if (!error && data) {
          setMessages(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
        setTimeout(scrollToBottom, 50)
      }
    }

    loadMessages()

    const channel = supabase
      .channel(`job-chat-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          const incoming = payload.new as unknown as ChatMessage
          if (incoming?.sender_id && incoming?.content && incoming?.created_at) {
            setMessages((current) => [...current, incoming])
          }
          setTimeout(scrollToBottom, 50)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, jobId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !user) return

    const tempMsg = {
        id: 'temp-' + Date.now(),
        content: inputText,
        sender_id: user.id,
        created_at: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, tempMsg])
    setInputText("")
    setTimeout(scrollToBottom, 50)

    try {
      const { error } = await supabase.from("messages").insert({
        job_id: jobId,
        sender_id: user.id,
        content: tempMsg.content
      })
      if (error) throw error;
    } catch (err) {
      console.error("Failed to send message", err)
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id))
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col font-sans">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 grow mt-24 max-w-4xl flex flex-col h-[calc(100vh-140px)]">
        
        <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-t-[2.5rem] border border-slate-200 dark:border-slate-800 border-b-0 flex items-center justify-between shadow-xl shadow-slate-200/50">
           <div className="flex items-center gap-6">
             <button 
               onClick={() => router.back()} 
               className="size-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
             >
               <ArrowLeft className="size-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
             </button>
             <div>
               <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Project Consultation</h1>
               <div className="flex items-center gap-2">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted</p>
               </div>
             </div>
           </div>
           
           <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <ShieldCheck className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Escrow Protected</span>
           </div>
        </div>

        <div className="grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative shadow-xl shadow-slate-200/50">
          <div className="grow p-8 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
             {isLoading ? (
               <div className="h-full flex items-center justify-center">
                 <Loader2 className="animate-spin text-primary size-10" />
               </div>
             ) : messages.length === 0 ? (
               <div className="h-full flex items-center justify-center flex-col text-center max-w-xs mx-auto">
                 <div className="size-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                   <MessageSquare className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Initiate Mandate</h3>
                 <p className="text-slate-500 font-bold text-sm leading-relaxed">Discuss project details, timelines, and deliverables safely here.</p>
               </div>
             ) : (
                messages.map((msg, idx) => {
                    const isMe = msg.sender_id === user?.id
                    return (
                        <div key={msg.id || idx} className={`group flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                {!isMe && msg.sender?.full_name && (
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">{msg.sender.full_name}</p>
                                )}
                                <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm transition-all hover:shadow-md ${
                                  isMe 
                                    ? 'bg-slate-900 text-white rounded-tr-none' 
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'
                                }`}>
                                   {msg.content}
                                </div>
                                <p className="text-[8px] font-black text-slate-400 uppercase mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    )
                })
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 rounded-b-[2.5rem]">
            <form onSubmit={sendMessage} className="relative flex items-center gap-4">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask for clarification or share project files..." 
                className="w-full h-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] pl-8 pr-20 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="absolute right-2 size-12 bg-primary hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-2xl transition-all flex items-center justify-center shadow-lg"
              >
                <Send className="size-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
