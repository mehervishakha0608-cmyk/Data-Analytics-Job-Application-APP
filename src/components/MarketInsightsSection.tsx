/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketInsights } from '../types/job';
import { TrendingUp, Flame, MapPin, Building2, DollarSign, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface MarketInsightsSectionProps {
  insights: MarketInsights;
  onSelectCompany: (companyName: string) => void;
  onExploreWalkins: () => void;
}

export const MarketInsightsSection: React.FC<MarketInsightsSectionProps> = ({
  insights,
  onSelectCompany,
  onExploreWalkins,
}) => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>DATA & AI MARKET INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Where to Apply: High-Velocity Hiring Surge Insights
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time sector hiring velocity, remote/hybrid compensation benchmarks, and walk-in hotspots.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Last Updated: {insights.lastUpdated}
        </div>
      </div>

      {/* Priority 1: Top High-Priority Companies to Target Right Now */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>High-Priority Companies Hiring Now (Fast-Track Processing)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.highPriorityCompanies.map((c, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{c.domain}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{c.hiringSpeed}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {c.name}
                </h4>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-0.5">
                  {c.openings}+ Active Data/AI Openings
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  {c.whyApply}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onSelectCompany(c.name)}
                  className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Filter Jobs at {c.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority 2: Work Mode Distribution & City Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remote vs Hybrid Ratio */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Remote vs Hybrid Market Share in Data Field
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Over 90% of open Data Analytics and Gen AI vacancies now permit remote or hybrid arrangements (2 days/week office).
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-indigo-600 dark:text-indigo-400">100% Fully Remote Roles</span>
                <span className="font-mono tabular-nums">{insights.remoteVsHybridRatio.remotePercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${insights.remoteVsHybridRatio.remotePercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-600 dark:text-emerald-400">Hybrid (1-3 days in Tech Park)</span>
                <span className="font-mono tabular-nums">{insights.remoteVsHybridRatio.hybridPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${insights.remoteVsHybridRatio.hybridPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-500">Strictly On-Site Client Locations</span>
                <span className="font-mono tabular-nums">{insights.remoteVsHybridRatio.onsitePercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: `${insights.remoteVsHybridRatio.onsitePercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Walk-in Trends by City */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Walk-in & Drive Density by Hub
            </h3>
            <button
              onClick={onExploreWalkins}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All Drives →
            </button>
          </div>

          <div className="space-y-3">
            {insights.walkinTrends.map((trend, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{trend.city}</span>
                  </span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {trend.activeDrives} Active Drives
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Leading Employers: {trend.prominentCompanies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority 3: Verified Salary Benchmarks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          2026 Compensation Benchmarks: Data Analytics & Gen AI
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Aggregated offer benchmarks for Remote and Hybrid positions across Tier 1 tech and consulting companies.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="pb-2.5">Target Role</th>
                <th className="pb-2.5">Experience Tier</th>
                <th className="pb-2.5">Salary Range (Annual)</th>
                <th className="pb-2.5">Median Performance Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {insights.salaryBenchmarks.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{b.role}</td>
                  <td className="py-3">{b.experience}</td>
                  <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{b.range}</td>
                  <td className="py-3 font-mono tabular-nums">{b.medianBonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
