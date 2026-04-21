import React from 'react';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

/**
 * PAKTELLECT PREMIUM BLOG TEMPLATE
 * 
 * Instructions:
 * 1. Ensure you have 'lucide-react' and 'framer-motion' installed.
 * 2. Copy the CSS classes (premium-card, glass, etc.) from globals.css.
 * 3. Use this structure for consistent high-fidelity professional layouts.
 */

const BlogTemplate = () => {
  return (
    <div className="min-h-screen bg-[#0b0d11] text-[#f0f6fc] font-sans selection:bg-[#c5a059] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-48 pb-20 overflow-hidden bg-slate-950 text-white isolate">
        {/* Background Image & Scrims */}
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950" />
        </div>

        <div className="container mx-auto px-6 max-w-4xl text-center">
            {/* Accent Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c5a059]/20 bg-[#c5a059]/5 mb-8">
              <Zap className="w-4 h-4 text-[#c5a059]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059]">Legal Analysis 2026</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-8xl font-serif tracking-tight mb-8 leading-[0.9]">
              The Future of <br />
              <span className="text-[#c5a059] italic">Legal Intelligence</span>
            </h1>

            {/* Meta Data */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest border-y border-white/5 py-8">
              <div className="flex items-center gap-2 italic">
                <Calendar className="w-4 h-4 text-[#c5a059]" />
                <span>21 April, 2026</span>
              </div>
              <div className="w-4 h-px bg-white/5" />
              <div className="flex items-center gap-2 italic text-[#c5a059]">
                <User className="w-4 h-4" />
                <span>Senior Counsel</span>
              </div>
            </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <section className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-1 border-r border-[#30363d] pr-8 hidden lg:block">
            <div className="sticky top-40 space-y-8">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Matter Index</h4>
               <nav className="flex flex-col gap-5 text-sm font-bold">
                  <a href="#" className="text-[#c5a059] hover:text-[#e2c799] transition-colors">Executive Summary</a>
                  <a href="#" className="hover:text-[#c5a059] transition-colors">Jurisdictional Review</a>
                  <a href="#" className="hover:text-[#c5a059] transition-colors">Conclusion</a>
               </nav>
            </div>
          </aside>

          {/* CONTENT BODY */}
          <div className="lg:col-span-3 space-y-16 text-xl leading-[1.8] font-medium text-[#8b949e]">
             
             {/* Highlight Card */}
             <div className="p-12 rounded-[3.5rem] bg-[#161b22] border border-[#30363d] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-32 bg-[#c5a059]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <p className="font-serif text-[#f0f6fc] leading-[1.6] relative z-10 text-2xl italic">
                  "The transformation of legal services into a digitally-native ecosystem is no longer a luxury—it is the foundational requirement for global chamber excellence."
                </p>
             </div>

             {/* Standard Section */}
             <section className="space-y-8">
                <h2 className="text-4xl font-serif text-[#f0f6fc] tracking-tight border-l-2 border-[#c5a059] pl-8">
                  Chamber Optimization
                </h2>
                <p>
                  Professional analysis requires a focus on both precision and aesthetic delivery. By utilizing high-fidelity surface depth and serif-based hierarchy, we ensure that complex legal insights are digested with appropriate gravity.
                </p>
             </section>

             {/* Icons/List Section */}
             <div className="grid gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-8 p-10 rounded-[3rem] bg-[#161b22] border border-[#30363d] transition-all hover:border-[#c5a059]/40 group">
                      <div className="w-16 h-16 rounded-2xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform shrink-0">
                         <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-serif text-[#f0f6fc] mb-2">Legal Security Protocol {i}</h4>
                        <p className="text-[#8b949e] text-lg leading-relaxed">Implementing end-to-end encryption for all chamber correspondence ensuring client-attorney privilege in the digital age.</p>
                      </div>
                  </div>
                ))}
             </div>

             {/* Dark Cinematic Card */}
             <div className="p-16 rounded-[4rem] bg-slate-950 text-white space-y-10 relative overflow-hidden group border border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 text-center max-w-lg mx-auto">
                  <h3 className="text-4xl font-serif italic mb-6">Access Elite Counsel</h3>
                  <p className="text-slate-400 mb-10 text-lg">Join the world's most exclusive professional ecosystem for high-stakes legal practice.</p>
                  <button className="h-16 px-12 rounded-2xl bg-[#c5a059] text-white font-black text-lg shadow-2xl shadow-[#c5a059]/20 hover:scale-105 active:scale-95 transition-all">
                    Initiate Practice
                  </button>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* 3. FOOTER AREA */}
      <footer className="border-t border-[#30363d] py-24 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-10">Final Insight</p>
         <div className="flex justify-center gap-6">
            <button className="w-16 h-16 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all text-[#8b949e]">
               <Share2 className="w-8 h-8" />
            </button>
         </div>
      </footer>

    </div>
  );
};

export default BlogTemplate;
