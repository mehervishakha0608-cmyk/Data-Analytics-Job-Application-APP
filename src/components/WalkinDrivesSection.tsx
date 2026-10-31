/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WalkinDrive, JobDomain } from '../types/job';
import { Calendar, MapPin, Clock, FileCheck, CheckCircle2, Search, Sparkles, Building2, Briefcase, AlertCircle } from 'lucide-react';
import { api } from '../services/apiClient';

interface WalkinDrivesSectionProps {
  walkins: WalkinDrive[];
  onGenerateWalkinDossier: (walkin: WalkinDrive) => void;
}

export const WalkinDrivesSection: React.FC<WalkinDrivesSectionProps> = ({
  walkins,
  onGenerateWalkinDossier,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Live AI Prober state
  const [companyIntelQuery, setCompanyIntelQuery] = useState('');
  const [intelCity, setIntelCity] = useState('');
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelResult, setIntelResult] = useState<string | null>(null);
  const [intelError, setIntelError] = useState<string | null>(null);

  const filteredWalkins = walkins.filter((w) => {
    const matchesCity =
      selectedCity === 'all' ||
      w.venues.some((v) => v.toLowerCase().includes(selectedCity.toLowerCase())) ||
      (selectedCity === 'virtual' && w.workMode === 'Virtual Fast-Track');

    const matchesDomain = selectedDomain === 'all' || w.domain === selectedDomain;

    const matchesSearch =
      searchQuery === '' ||
      w.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.venues.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCity && matchesDomain && matchesSearch;
  });

  const handleRunIntelProber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyIntelQuery.trim()) return;

    setIntelLoading(true);
    setIntelError(null);
    setIntelResult(null);

    try {
      const result = await api.searchWalkinIntel({
        companyName: companyIntelQuery,
        city: intelCity || 'Bengaluru / Hyderabad',
        roleType: 'Data Analytics & Gen AI Opportunities',
      });
      setIntelResult(result);
    } catch (err: any) {
      setIntelError(err?.message || 'Failed to generate walk-in intelligence. Please try again.');
    } finally {
      setIntelLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>EXPRESS HIRING & ON-THE-SPOT OFFERS</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Data Analytics & Gen AI Walk-in Radar
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Verified in-person walk-ins and virtual fast-track recruitment drives across leading tech parks.
          </p>
        </div>

        {/* Filter Controls (Segmented clean buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium self-start flex-wrap">
          <button
            onClick={() => setSelectedCity('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCity === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Locations
          </button>
          <button
            onClick={() => setSelectedCity('bengaluru')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCity === 'bengaluru'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bengaluru
          </button>
          <button
            onClick={() => setSelectedCity('hyderabad')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCity === 'hyderabad'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hyderabad
          </button>
          <button
            onClick={() => setSelectedCity('pune')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCity === 'pune'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pune / NCR
          </button>
          <button
            onClick={() => setSelectedCity('virtual')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCity === 'virtual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Virtual Fast-Track
          </button>
        </div>
      </div>

      {/* Grid of Walk-in Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWalkins.map((drive) => (
          <div
            key={drive.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      {drive.workMode}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{drive.domain}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {drive.role}
                  </h3>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{drive.company}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Target Offering</div>
                  <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {drive.salaryOffering}
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 font-mono tabular-nums">
                    {drive.openingsCount} Openings
                  </div>
                </div>
              </div>

              {/* Schedule & Timing Strip */}
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Date:</strong> {drive.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span><strong>Reporting:</strong> {drive.timing}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Venues:</strong>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-600 dark:text-slate-400">
                      {drive.venues.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Eligibility & Tips */}
              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Experience Needed:</span>{' '}
                  <span className="font-mono tabular-nums">{drive.experienceRequired}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Required Documents:</span>{' '}
                  <span>{drive.documentsRequired.slice(0, 3).join(', ')}...</span>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md text-amber-900 dark:text-amber-300 text-[11px] leading-relaxed">
                  <strong>Insider Strategy:</strong> {drive.walkinTips[0]}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <a
                href={drive.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline"
              >
                Pre-Register Slot
              </a>

              <button
                onClick={() => onGenerateWalkinDossier(drive)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prepare Tailored Walk-in Dossier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Live Walk-in Intelligence Prober */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI WALK-IN & OFF-CAMPUS INTELLIGENCE PROBER</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Investigate Any Company's Upcoming Data & GenAI Hiring Rounds
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Planning to walk into Accenture, TCS Digital, Fractal, Wipro, or a high-growth startup?
            Gemini synthesizes exact test rounds, SQL/Python coding questions, RAG case study expectations, and document requirements.
          </p>

          <form onSubmit={handleRunIntelProber} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={companyIntelQuery}
              onChange={(e) => setCompanyIntelQuery(e.target.value)}
              placeholder="e.g. LatentView, TCS GenAI, Genpact"
              className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              required
            />
            <input
              type="text"
              value={intelCity}
              onChange={(e) => setIntelCity(e.target.value)}
              placeholder="Location (e.g. Bengaluru, Pune, Virtual)"
              className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={intelLoading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
            >
              {intelLoading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Intel...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Generate Walk-in Intel</span>
                </>
              )}
            </button>
          </form>

          {intelError && (
            <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{intelError}</span>
            </div>
          )}

          {intelResult && (
            <div className="mt-6 p-5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 font-semibold text-white">
                <span>AI Hiring Intelligence & Round-by-Round Breakdown</span>
                <span className="text-[11px] text-emerald-400">Verified Strategy</span>
              </div>
              <div className="whitespace-pre-line leading-relaxed font-sans">
                {intelResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
