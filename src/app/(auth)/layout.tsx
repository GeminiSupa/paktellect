import Link from "next/link"
import Image from "next/image"

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
          <div className="relative size-12 bg-white rounded-2xl overflow-hidden shadow-2xl transition-transform group-hover:scale-110">
            <Image src="/logo1.png" alt="PAKTELLECT" fill className="object-contain p-2" sizes="48px" />
          </div>
          <span className="text-3xl tracking-tighter">
            <span className="font-black">PAK</span>
            <span className="font-semibold">TELLECT</span>
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-6xl font-black mb-8 leading-[0.9] tracking-tighter max-w-md">
            The elite way to scale your <br /> expertise.
          </h2>
          <p className="text-emerald-50 text-xl max-w-md font-medium leading-relaxed opacity-80">
            Join Pakistan&apos;s premium professional ecosystem. 
            Connect with top-tier clients and students through total security.
          </p>
        </div>

        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 relative z-10">
          © 2026 PAKTELLECT PROTOCOL
        </div>
      </div>
      
      <div className="flex items-center justify-center p-4 sm:p-8 bg-slate-100 dark:bg-slate-950 selection:bg-primary selection:text-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

