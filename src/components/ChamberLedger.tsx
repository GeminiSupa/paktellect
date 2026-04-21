"use client"

import React from 'react';
import { Scale, Search, Clock, ChevronRight } from 'lucide-react';

interface MatterItem {
  id: string;
  title: string;
  subtitle: string;
  status: 'HEARING' | 'FILED' | 'NEW';
}

interface ChamberLedgerProps {
  matters?: MatterItem[];
  metrics?: {
    activeMatters: number;
    thisWeek: number;
    pendingFees: string;
  };
  nextHearing?: {
    date: string;
    location: string;
  };
}

export const ChamberLedger: React.FC<ChamberLedgerProps> = ({ 
  matters = [
    { id: '1', title: 'State v. Rehman', subtitle: 'LHC-2024-0041 · LHC', status: 'HEARING' },
    { id: '2', title: 'Ahmed v. Ahmed', subtitle: 'SC-2024-0187 · SC', status: 'FILED' },
    { id: '3', title: 'Khan Estate', subtitle: 'DHC-2025-0012 · DHC', status: 'NEW' },
  ],
  metrics = {
    activeMatters: 24,
    thisWeek: 3,
    pendingFees: '48k'
  },
  nextHearing = {
    date: '18 Apr',
    location: 'LHC Court 4'
  }
}) => {
  return (
    <div className="w-full max-w-xl mx-auto overflow-hidden rounded-[2rem] bg-[#0d1117] border border-[#30363d] shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#30363d]/50">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]">
            <Scale className="size-5" />
          </div>
          <h2 className="font-serif text-lg tracking-wide text-[#f0f6fc]">Chamber Ledger</h2>
        </div>
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-[#ff5f56]" />
          <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d]/50">
            <div className="text-2xl font-serif text-[#f0f6fc]">{metrics.activeMatters}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#8b949e] mt-1">Active matters</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d]/50">
            <div className="text-2xl font-serif text-[#f0f6fc]">{metrics.thisWeek}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#8b949e] mt-1">This week</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d]/50">
            <div className="text-2xl font-serif text-[#f0f6fc] flex items-baseline">
              <span className="text-sm mr-0.5">Rs</span>{metrics.pendingFees}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#8b949e] mt-1">Pending fees</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#8b949e] group-focus-within:text-[#c5a059] transition-colors" />
          <input 
            type="text" 
            placeholder="Search matters, CNIC, FIR..." 
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#0d1117] border border-[#30363d] text-sm text-[#f0f6fc] placeholder:text-[#484f58] focus:outline-none focus:border-[#c5a059] transition-all"
          />
        </div>

        {/* Matter List */}
        <div className="space-y-3">
          {matters.map((matter) => (
            <div key={matter.id} className="p-4 rounded-2xl bg-[#161b22] border border-transparent hover:border-[#30363d] transition-all group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-[#f0f6fc] group-hover:text-[#c5a059] transition-colors">{matter.title}</h4>
                  <p className="text-[10px] text-[#8b949e] mt-1">{matter.subtitle}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest ${
                  matter.status === 'HEARING' ? 'bg-[#bb80091a] text-[#d29922]' :
                  matter.status === 'FILED' ? 'bg-[#388bfd1a] text-[#58a6ff]' :
                  'bg-[#6e76811a] text-[#8b949e]'
                }`}>
                  {matter.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Hearing Ribbon */}
        <div className="p-4 rounded-2xl bg-[#1a1c1e] border border-[#c5a059]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#c5a059] font-medium">Next hearing — {nextHearing.date}</span>
            <span className="text-[10px] text-[#8b949e]">· {nextHearing.location}</span>
          </div>
          <Clock className="size-3.5 text-[#c5a059]/50" />
        </div>
      </div>
    </div>
  );
};
