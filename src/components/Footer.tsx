import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative size-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/10 transition-transform group-hover:scale-110 bg-white/50">
                <Image src="/logo1.png" alt="PAKTELLECT" fill className="object-contain p-1.5" sizes="40px" />
              </div>
              <span className="text-2xl tracking-tighter text-slate-900 dark:text-white">
                <span className="font-black">PAK</span>
                <span className="font-semibold">TELLECT</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-medium">
              Scaling expertise with total trust. The world&apos;s premier professional consultation ecosystem.
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              <li><Link href="/experts" className="hover:text-primary transition-colors">Browse Experts</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Become an Expert</Link></li>
              <li><Link href="/safety" className="hover:text-primary transition-colors">Safety Protocol</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/escrow-protection" className="hover:text-primary transition-colors">Escrow Protection</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Connect</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              <li><Link href="/help" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <p>© 2026 PAKTELLECT. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-primary transition-colors">Status</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

