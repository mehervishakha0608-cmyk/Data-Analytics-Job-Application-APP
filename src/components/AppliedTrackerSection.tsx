/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ApplicationRecord } from '../types/job';
import { CheckCircle2, Clock, Calendar, Download, ExternalLink, Search, Copy, Check, Briefcase } from 'lucide-react';

interface AppliedTrackerSectionProps {
  applications: ApplicationRecord[];
  onExploreMore: () => void;
}

export const AppliedTrackerSection: React.FC<AppliedTrackerSectionProps> = ({
  applications,
  onExploreMore,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExportCSV = () => {
    if (applications.length === 0) return;
    const headers = ['ID', 'Job Title', 'Company', 'Location', 'Work Mode', 'Applied Date', 'ATS Match %', 'Confirmation Code', 'Status'];
    const rows = applications.map((a) => [
      a.id,
      `"${a.jobTitle}"`,
      `"${a.company}"`,
      `"${a.location}"`,
      a.workMode,
      a.appliedAt,
      `${a.atsScore}%`,
      a.confirmationCode,
      a.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Applied_Jobs_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Applied Opportunities Track
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time log of 1-click submitted applications, ATS scores, and transmission verification codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={applications.length === 0}
            className="px-3.5 py-1.5 border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onExploreMore}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Apply to More</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium self-start w-fit">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterStatus === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          onClick={() => setFilterStatus('applied')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterStatus === 'applied'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Submitted ({applications.filter((a) => a.status === 'Applied').length})
        </button>
        <button
          onClick={() => setFilterStatus('reviewing')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterStatus === 'reviewing'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          In Review ({applications.filter((a) => a.status === 'Reviewing').length})
        </button>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Applications Logged Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Select any Data Analytics or Gen AI opportunity and click "1-Click Tailor & Apply" to automatically optimize your resume and submit!
            </p>
          </div>
          <button
            onClick={onExploreMore}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Browse Openings Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {app.jobTitle}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    · {app.company}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span>{app.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{app.workMode}</span>
                  <span aria-hidden="true">·</span>
                  <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  {app.dossierSummary}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                    {app.atsScore}% ATS Match
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span>Code: {app.confirmationCode}</span>
                  <button
                    onClick={() => handleCopyCode(app.confirmationCode)}
                    title="Copy confirmation ID"
                    className="p-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    {copiedCode === app.confirmationCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
