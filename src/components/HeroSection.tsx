/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Calendar, Zap, ArrowRight, ShieldCheck, MapPin, Briefcase } from 'lucide-react';

interface HeroSectionProps {
  onExploreWalkins: () => void;
  onExploreRemoteJobs: () => void;
  onOpenVault: () => void;
  onUploadResume: () => void;
  activeWalkinCount: number;
  totalJobCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWalkins,
  onExploreRemoteJobs,
  onOpenVault,
  onUploadResume,
  activeWalkinCount,
  totalJobCount,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white rounded-2xl mb-8 border border-slate-800 shadow-xl">
      {/* Background Graphic Asset with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/job_autopilot_hero_1793428212314.jpg"
          alt="Data Analytics and AI Operations Workspace"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-3 tracking-wide">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AUTONOMOUS APPLICATION ENGINE & HIRING RADAR</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight text-balance">
          Apply to Data Analytics & Gen AI Opportunities in One Click
        </h1>

        <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Gemini automatically re-engineers your resume for 95%+ ATS match, fills enterprise screening forms, and submits applications instantly. Stay ahead with curated remote, hybrid, and walk-in hiring drives.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            onClick={onUploadResume}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-sm rounded-lg shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upload & Ingest Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onExploreRemoteJobs}
            className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-medium text-sm rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse {totalJobCount} Openings</span>
          </button>

          <button
            onClick={onExploreWalkins}
            className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-medium text-sm rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Walk-in Radar ({activeWalkinCount})</span>
          </button>

          <button
            onClick={onOpenVault}
            className="px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Review Master Resume Vault →
          </button>
        </div>

        {/* Quantified Rigor Strip with Tabular Numerals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
          <div>
            <div className="text-slate-400 font-medium mb-1">ATS Optimization</div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">96.8% Match</div>
          </div>

          <div>
            <div className="text-slate-400 font-medium mb-1">Auto-Fill Latency</div>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">1.8 Seconds</div>
          </div>

          <div>
            <div className="text-slate-400 font-medium mb-1">Work Modes</div>
            <div className="text-xl font-bold text-white">Remote & Hybrid</div>
          </div>

          <div>
            <div className="text-slate-400 font-medium mb-1">Security Standard</div>
            <div className="text-xl font-bold text-indigo-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Token Scoped</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
