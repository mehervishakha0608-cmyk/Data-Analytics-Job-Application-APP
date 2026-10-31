/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { JobOpportunity } from '../types/job';
import { Sparkles, MapPin, DollarSign, Calendar, ChevronDown, ChevronUp, CheckCircle, ExternalLink, Flame } from 'lucide-react';

interface JobCardProps {
  job: JobOpportunity;
  isApplied: boolean;
  onApply: (job: JobOpportunity) => void;
  onViewWalkin?: (job: JobOpportunity) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isApplied,
  onApply,
  onViewWalkin,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left side: Role info */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400 text-sm shrink-0">
            {job.logoText}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {job.title}
              </h2>
              {job.hiringSurge && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-sm">
                  <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Urgent Hiring Surge
                </span>
              )}
            </div>

            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
              {job.company}
            </div>

            {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="font-medium text-slate-800 dark:text-slate-200">{job.domain}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{job.workMode}</span>
              <span aria-hidden="true">·</span>
              <span>{job.location}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{job.experienceLevel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-medium">{job.salaryRange}</span>
              <span aria-hidden="true">·</span>
              <span>{job.postedDate}</span>
            </div>
          </div>
        </div>

        {/* Right side: Action button */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2.5 shrink-0 self-start">
          {isApplied ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Applied</span>
            </div>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Tailor & Apply</span>
            </button>
          )}

          {job.isWalkin && (
            <button
              onClick={() => onViewWalkin ? onViewWalkin(job) : onApply(job)}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Walk-in Drive Info</span>
            </button>
          )}
        </div>
      </div>

      {/* Required Skills Strip */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Stack:</span>
          {job.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 ml-auto transition-colors"
        >
          <span>{expanded ? 'Hide Details' : 'View Description & Screening'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Accordion Area */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Role Description</h4>
            <p className="leading-relaxed">{job.description}</p>
          </div>

          {job.walkinDetails && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Walk-in Drive Logistics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div><strong>Date & Time:</strong> {job.walkinDetails.date} ({job.walkinDetails.reportingTime})</div>
                <div><strong>Venue:</strong> {job.walkinDetails.venue}</div>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">
              Automated Screening Questions ({job.screeningQuestions.length})
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              {job.screeningQuestions.map((q) => (
                <li key={q.id}>
                  <span className="text-slate-800 dark:text-slate-200">{q.question}</span>
                  {q.type === 'choice' && q.options && (
                    <span className="text-slate-400 ml-1">({q.options.join(', ')})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Autofill engine prepares 100% compliant responses mapped to this role before final submission.
            </span>
            <button
              onClick={() => onApply(job)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors"
            >
              Start 1-Click Tailor →
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
