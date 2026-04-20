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
    <div className="min-h-screen bg-[#f8fafb] text-[#020617] font-sans selection:bg-[#005959] selection:text-white">
      
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/20 bg-teal-500/5 mb-8">
              <Zap className="w-4 h-4 text-teal-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">Analysis 2026</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
              Title of Your <br />
              <span className="text-teal-400 italic">Premium Article</span>
            </h1>

            {/* Meta Data */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-y border-white/10 py-6">
              <div className="flex items-center gap-2 italic">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>21 April, 2026</span>
              </div>
              <div className="w-4 h-px bg-white/10" />
              <div className="flex items-center gap-2 italic">
                <User className="w-4 h-4 text-teal-400" />
                <span>Author Name</span>
              </div>
            </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <section className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-1 border-r border-slate-200 pr-8 hidden lg:block">
            <div className="sticky top-40 space-y-8">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navigation</h4>
               <nav className="flex flex-col gap-4 text-sm font-bold">
                  <a href="#" className="hover:text-teal-600 transition-colors">Introduction</a>
                  <a href="#" className="hover:text-teal-600 transition-colors">Core Concepts</a>
                  <a href="#" className="hover:text-teal-600 transition-colors">Conclusion</a>
               </nav>
            </div>
          </aside>

          {/* CONTENT BODY */}
          <div className="lg:col-span-3 space-y-12 text-lg leading-[1.8] font-medium text-slate-700">
             
             {/* Highlight Card */}
             <div className="p-10 rounded-[3rem] bg-teal-500/5 border border-teal-500/10 shadow-2xl shadow-teal-500/5">
                <p className="font-bold text-slate-900 leading-[1.8]">
                  Key introduction or summary text goes here. Use a subtle background color to make it pop from the white page.
                </p>
             </div>

             {/* Standard Section */}
             <section className="space-y-6">
                <h2 className="text-3xl font-black text-slate-950 tracking-tight border-l-4 border-teal-600 pl-6">
                  Section Header
                </h2>
                <p>
                  Standard article paragraph. Maintain generous line height (leading-relaxed) and slate-700 color for high readability on bright backgrounds.
                </p>
             </section>

             {/* Icons/List Section */}
             <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-6 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all hover:border-teal-500/20 group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shrink-0">
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 mb-1">Benefit {i}</h4>
                        <p className="text-slate-500 text-base">Description of the benefit or feature in a clean, legible font.</p>
                      </div>
                  </div>
                ))}
             </div>

             {/* Dark Cinematic Card */}
             <div className="p-12 rounded-[3rem] bg-slate-950 text-white space-y-8 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black italic mb-4">Call to Action Card</h3>
                  <p className="text-slate-300 mb-8">Encourage users to take action with a high-contrast dark section.</p>
                  <button className="h-14 px-10 rounded-2xl bg-teal-500 text-white font-black shadow-xl shadow-teal-500/20 hover:scale-105 transition-all">
                    Get Started
                  </button>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* 3. FOOTER AREA */}
      <footer className="border-t border-slate-100 py-20 text-center">
         <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">End of Insight</p>
         <div className="flex justify-center gap-4">
            <button className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
               <Share2 className="w-6 h-6" />
            </button>
         </div>
      </footer>

    </div>
  );
};

export default BlogTemplate;
