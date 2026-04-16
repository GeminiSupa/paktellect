import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { LayoutDashboard, User, Calendar, Settings, DollarSign, Users, MessageSquare, Clock, Scale } from "lucide-react"

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 grow flex flex-col md:flex-row gap-8 mt-24">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-80 shrink-0">
          <nav className="bg-secondary text-white rounded-[2.5rem] p-6 sticky top-32 shadow-2xl shadow-slate-900/20">
            <div className="mb-10 px-6 py-4 bg-slate-800/50 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Teacher Dashboard</p>
              <h3 className="text-xl font-black tracking-tighter text-white">Management Suite</h3>
            </div>
            <ul className="space-y-3">
               <li>
                <Link href="/dashboard/teacher" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                  <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <LayoutDashboard className="size-5" />
                  </div>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/bookings" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Calendar className="size-5" />
                  </div>
                  Schedule & Sessions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/bookings?status=pending" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Users className="size-5" />
                  </div>
                  Student Inquiries
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/messages" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <MessageSquare className="size-5" />
                  </div>
                  Messages
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/legal" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Scale className="size-5" />
                  </div>
                  Legal Workspace
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/earnings" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <DollarSign className="size-5" />
                  </div>
                  Financials & Payouts
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/profile" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <User className="size-5" />
                  </div>
                  Practice Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/availability" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Clock className="size-5" />
                  </div>
                  Slots & Availability
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teacher/settings" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                   <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Settings className="size-5" />
                  </div>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="grow">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  )
}
