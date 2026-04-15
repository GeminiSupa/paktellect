import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-16 bg-primary text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 size-[500px] bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 size-[500px] bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <Link href="/" className="flex items-center gap-3 relative z-10 group">
          <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-primary font-black text-2xl shadow-2xl transition-transform group-hover:scale-110">
            H
          </div>
          <span className="font-black text-3xl tracking-tighter">Hayy<span className="text-white/60">.</span></span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-6xl font-black mb-8 leading-[0.9] tracking-tighter max-w-md">
            The elite way to scale your <br /> expertise.
          </h2>
          <p className="text-emerald-50 text-xl max-w-md font-medium leading-relaxed opacity-80">
            Join the world&apos;s premier professional ecosystem. 
            Connect with top-tier clients and students through total security.
          </p>
        </div>

        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 relative z-10">
          © 2026 HAYY ECOSYSTEM PROTOCOL
        </div>
      </div>
      
      <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 selection:bg-primary selection:text-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

