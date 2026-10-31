/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Briefcase, Calendar, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

interface HeaderProps {
  activeTab: 'jobs' | 'upload' | 'walkins' | 'vault' | 'applied' | 'insights';
  setActiveTab: (tab: 'jobs' | 'upload' | 'walkins' | 'vault' | 'applied' | 'insights') => void;
  appliedCount: number;
  onOpenQuickApply: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  appliedCount,
  onOpenQuickApply,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark in display face */}
          <button
            onClick={() => setActiveTab('jobs')}
            className="flex items-center gap-2 text-left font-bold text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              DG
            </span>
            <span>DataGenius Apply</span>
          </button>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'jobs' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Opportunities</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'upload' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>

            <button
              onClick={() => setActiveTab('walkins')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'walkins' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Walk-in Drives</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'vault' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('applied')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'applied' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Applied Track ({appliedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'insights' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Market Insights</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenQuickApply}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-lg transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Autopilot</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
