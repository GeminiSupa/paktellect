import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { LayoutDashboard, Settings, BookOpen, CreditCard, Scale } from "lucide-react"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 grow flex flex-col md:flex-row gap-10 mt-24">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-80 shrink-0">
          <nav className="bg-secondary text-white rounded-[2.5rem] p-8 sticky top-32 shadow-2xl shadow-slate-900/20">
            <div className="mb-10 px-5 py-3 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Learning Hub</p>
              <h3 className="text-xl font-black tracking-tight">Main Menu</h3>
            </div>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard/student" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                    <LayoutDashboard className="size-5" />
                  </div>
                  My Sessions
                </Link>
              </li>
              <li>
                <Link href="/experts" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                    <BookOpen className="size-5" />
                  </div>
                  Find Experts
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student/payments" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                    <CreditCard className="size-5" />
                  </div>
                  Payments
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student/legal" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                    <Scale className="size-5" />
                  </div>
                  Legal Files
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student/settings" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
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
