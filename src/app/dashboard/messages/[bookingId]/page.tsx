"use client"

import { useEffect, useState, useRef } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Loader2, Send, ArrowLeft, MessageSquare, Info, ShieldCheck } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function ChatPage() {
  const { user } = useStore()
  const router = useRouter()
  const params = useParams()
  const bookingId = params.bookingId as string

  type ChatMessage = {
    id?: string
    booking_id?: string
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
    if (!user || !bookingId) return

    async function loadMessages() {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*, sender:profiles!messages_sender_id_fkey(full_name)")
          .eq("booking_id", bookingId)
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
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
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
  }, [user, bookingId])

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
        booking_id: bookingId,
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
        
        {/* Chat Header */}
        <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-t-[2.5rem] border border-slate-200 dark:border-slate-800 border-b-0 flex items-center justify-between shadow-xl shadow-slate-200/50">
           <div className="flex items-center gap-6">
             <button 
               onClick={() => router.back()} 
               className="size-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
             >
               <ArrowLeft className="size-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
             </button>
             <div>
               <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Session Coordination</h1>
               <div className="flex items-center gap-2">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted</p>
               </div>
             </div>
           </div>
           
           <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-primary dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <ShieldCheck className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Trust Engine Active</span>
           </div>
        </div>

        <div className="grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative shadow-xl shadow-slate-200/50">
          
          {/* Messages Area */}
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
                 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Safe Conversation</h3>
                 <p className="text-slate-500 font-bold text-sm leading-relaxed">Please keep all coordination within the platform to maintain your escrow protection.</p>
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
                                    ? 'bg-secondary text-white rounded-tr-none shadow-emerald-950/20' 
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-slate-200/40'
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

          {/* Secure Tip */}
          <div className="mx-8 mb-4 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
             <div className="size-10 bg-white dark:bg-rose-900 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Info className="size-5 text-rose-600" />
             </div>
             <p className="text-[10px] font-black text-rose-800 dark:text-rose-400 uppercase tracking-tight leading-[1.2]">
                Tip: Never share your phone number or external payment links. Your safety is our priority.
             </p>
          </div>

          {/* Input Area */}
           <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 rounded-b-[2.5rem]">
            <form onSubmit={sendMessage} className="relative flex items-center gap-4">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Share your coordinates or session questions..." 
                className="w-full h-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] pl-8 pr-20 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-inner transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="absolute right-2 size-12 bg-primary hover:bg-emerald-700 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:cursor-not-allowed text-white rounded-2xl transition-all flex items-center justify-center shadow-lg shadow-emerald-500/30 group"
              >
                <Send className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
