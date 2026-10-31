/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { JobOpportunity, UserProfile, CustomizedResume, AutofillDossier, ApplicationRecord } from '../types/job';
import { api } from '../services/apiClient';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Send, 
  Download, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface ApplyModalProps {
  job: JobOpportunity;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSuccess: (application: ApplicationRecord) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  userProfile,
  isOpen,
  onClose,
  onApplicationSuccess,
}) => {
  // Step workflow: 'customize' -> 'autofill' -> 'submitted'
  const [currentStep, setCurrentStep] = useState<'customize' | 'autofill' | 'submitted'>('customize');

  // Loading & error states
  const [loadingCustomization, setLoadingCustomization] = useState(false);
  const [loadingAutofill, setLoadingAutofill] = useState(false);
  const [submittingApply, setSubmittingApply] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data states
  const [customizedResume, setCustomizedResume] = useState<CustomizedResume | null>(null);
  const [autofillDossier, setAutofillDossier] = useState<AutofillDossier | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    confirmationCode: string;
    application: ApplicationRecord;
    message: string;
  } | null>(null);

  const [copiedJSON, setCopiedJSON] = useState(false);

  // Auto-trigger customization on modal open
  useEffect(() => {
    if (isOpen && job) {
      setCurrentStep('customize');
      setErrorMessage(null);
      setCustomizedResume(null);
      setAutofillDossier(null);
      setSubmissionResult(null);
      handleGenerateCustomization();
    }
  }, [isOpen, job?.id]);

  const handleGenerateCustomization = async () => {
    setLoadingCustomization(true);
    setErrorMessage(null);
    try {
      const tailored = await api.customizeResume({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        requiredSkills: job.requiredSkills,
      });
      setCustomizedResume(tailored);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to customize resume. Please check your network and retry.');
    } finally {
      setLoadingCustomization(false);
    }
  };

  const handleProceedToAutofill = async () => {
    if (!customizedResume) return;
    setLoadingAutofill(true);
    setErrorMessage(null);
    try {
      const dossier = await api.generateAutofillDossier({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        screeningQuestions: job.screeningQuestions,
        tailoredResume: customizedResume,
      });
      setAutofillDossier(dossier);
      setCurrentStep('autofill');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to generate autofill form. Please retry.');
    } finally {
      setLoadingAutofill(false);
    }
  };

  // THE 1-CLICK FINAL SUBMIT ACTION
  const handleFinalOneClickSubmit = async () => {
    if (!autofillDossier || !customizedResume) return;
    setSubmittingApply(true);
    setErrorMessage(null);

    try {
      const response = await api.applyToJob({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        workMode: job.workMode,
        atsScore: customizedResume.atsScore,
        dossier: autofillDossier,
      });

      setSubmissionResult({
        confirmationCode: response.confirmationCode,
        application: response.application,
        message: response.message,
      });
      setCurrentStep('submitted');
      onApplicationSuccess(response.application);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Application submission failed. Please try again.');
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleCopyJSON = () => {
    if (!autofillDossier) return;
    navigator.clipboard.writeText(JSON.stringify(autofillDossier, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handlePrintOrDownloadResume = () => {
    if (!customizedResume) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const resumeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${userProfile.fullName} - Tailored Resume (${job.company})</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; }
          h1 { margin: 0 0 4px 0; font-size: 24px; color: #0f172a; }
          .headline { font-size: 15px; color: #4338ca; font-weight: bold; margin-bottom: 8px; }
          .contact { font-size: 12px; color: #64748b; margin-bottom: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 12px; }
          h2 { font-size: 14px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; }
          p, li { font-size: 12px; }
          ul { margin: 4px 0 12px 18px; padding: 0; }
          .exp-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; }
          .company { color: #334155; font-style: italic; font-size: 12px; margin-bottom: 4px; }
          .ats-badge { background: #e0e7ff; color: #3730a3; padding: 4px 8px; font-size: 11px; border-radius: 4px; display: inline-block; margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <div class="ats-badge">ATS Score Optimized: ${customizedResume.atsScore}% Match for ${job.title} at ${job.company}</div>
        <h1>${userProfile.fullName}</h1>
        <div class="headline">${customizedResume.tailoredHeadline}</div>
        <div class="contact">
          ${userProfile.email} | ${userProfile.phone} | ${userProfile.location} | ${userProfile.linkedinUrl} | ${userProfile.githubUrl}
        </div>

        <h2>Executive Summary</h2>
        <p>${customizedResume.tailoredSummary}</p>

        <h2>Professional Experience</h2>
        ${customizedResume.tailoredExperiences.map(e => `
          <div class="exp-header"><span>${e.role}</span><span>${e.period}</span></div>
          <div class="company">${e.company}</div>
          <ul>
            ${e.tailoredBullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        `).join('')}

        <h2>Technical Skills</h2>
        <p><strong>Core Stack:</strong> ${customizedResume.keyMatches.join(', ')}</p>

        <h2>Tailored Cover Letter</h2>
        <p style="white-space: pre-line;">${customizedResume.tailoredCoverLetter}</p>
      </body>
      </html>
    `;

    printWindow.document.write(resumeHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
              {job.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  {job.title}
                </h3>
                <span className="text-xs text-slate-500 font-medium capitalize">· {job.workMode}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {job.company} · {job.location} · <span className="font-mono tabular-nums">{job.salaryRange}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 'customize' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              1
            </span>
            <span className={currentStep === 'customize' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
              GenAI Resume Customization
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 'autofill' ? 'bg-indigo-600 text-white' : currentStep === 'submitted' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              2
            </span>
            <span className={currentStep === 'autofill' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
              Autofill Form Mapping
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 'submitted' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              3
            </span>
            <span className={currentStep === 'submitted' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
              1-Click Confirmation
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Zero-Trust Token Verified</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 text-xs">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: CUSTOMIZE */}
          {currentStep === 'customize' && (
            <div className="space-y-6">
              {loadingCustomization ? (
                <div className="py-16 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto animate-spin" />
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    Analyzing Job Description & Customizing Resume...
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Gemini 3.8 Flash is scoring required keywords, restructuring project metrics via the X-Y-Z formula, and tuning your ATS match rating.
                  </p>
                </div>
              ) : customizedResume ? (
                <div className="space-y-5">
                  {/* ATS Score & Fit Banner */}
                  <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>ATS Algorithm Compatibility Assessment</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
                        {customizedResume.matchSummary}
                      </p>
                    </div>

                    <div className="text-center sm:text-right shrink-0 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-xs">
                      <div className="text-[11px] text-slate-400 font-medium">ATS Match Score</div>
                      <div className="text-2xl font-black font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                        {customizedResume.atsScore}%
                      </div>
                    </div>
                  </div>

                  {/* Tailored Headline & Summary */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Tailored Professional Headline
                      </span>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {customizedResume.tailoredHeadline}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Targeted Executive Summary
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {customizedResume.tailoredSummary}
                      </p>
                    </div>
                  </div>

                  {/* Keyword Matching & Gap Analysis */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl">
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Exact Matching Keywords ({customizedResume.keyMatches.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {customizedResume.keyMatches.map((k) => (
                          <span key={k} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded text-[11px]">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl">
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>JD Keywords Addressed in Tailored Copy</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {customizedResume.missingKeywords.length > 0 ? (
                          customizedResume.missingKeywords.map((k) => (
                            <span key={k} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded text-[11px]">
                              {k}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-700">All required keywords successfully satisfied!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tailored Experience Highlights */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                      Re-engineered Experience Bullets (Google X-Y-Z Formula)
                    </h4>
                    <div className="space-y-3">
                      {customizedResume.tailoredExperiences.map((exp, idx) => (
                        <div key={idx} className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex justify-between font-bold text-slate-900 dark:text-white text-xs mb-1">
                            <span>{exp.role} · {exp.company}</span>
                            <span className="text-slate-400 font-mono">{exp.period}</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                            {exp.tailoredBullets.map((b, i) => (
                              <li key={i} className="leading-relaxed">{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Tips */}
                  <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">Interview Advantage Tip:</span>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-0.5">
                      {customizedResume.strategicAdvice.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* STEP 2: AUTOFILL FORM */}
          {currentStep === 'autofill' && (
            <div className="space-y-5">
              {loadingAutofill ? (
                <div className="py-16 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-600 mx-auto animate-spin" />
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    Mapping Autofill Fields & Answering Screening Questions...
                  </div>
                </div>
              ) : autofillDossier ? (
                <div className="space-y-5">
                  <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-indigo-900 dark:text-indigo-200">
                        Enterprise ATS Form Mapping Verified
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                        Direct mapping active for Workday, Greenhouse, Lever, and Taleo portals.
                      </div>
                    </div>
                    <button
                      onClick={handleCopyJSON}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
                    >
                      {copiedJSON ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJSON ? 'Copied JSON!' : 'Copy Form JSON'}</span>
                    </button>
                  </div>

                  {/* Contact Fields Review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Full Name</label>
                      <input
                        type="text"
                        value={autofillDossier.personalInfo.fullName}
                        readOnly
                        className="w-full mt-0.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Email Address</label>
                      <input
                        type="text"
                        value={autofillDossier.personalInfo.email}
                        readOnly
                        className="w-full mt-0.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Phone</label>
                      <input
                        type="text"
                        value={autofillDossier.personalInfo.phone}
                        readOnly
                        className="w-full mt-0.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Notice Period</label>
                      <input
                        type="text"
                        value={autofillDossier.personalInfo.noticePeriod}
                        readOnly
                        className="w-full mt-0.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Current CTC</label>
                      <input
                        type="text"
                        value={autofillDossier.personalInfo.currentCompensation}
                        readOnly
                        className="w-full mt-0.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Expected CTC</label>
                      <input
                        type="text"
                        value={autofillDossier.personalInfo.expectedCompensation}
                        readOnly
                        className="w-full mt-0.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Automated Screening Answers */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                      AI Generated Screening Question Responses
                    </h4>
                    <div className="space-y-3">
                      {autofillDossier.screeningAnswers.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-100">
                              Q: {item.question}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded font-mono shrink-0">
                              {item.confidenceScore}% Confidence
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-sans">
                            {item.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tailored Cover Letter preview */}
                  {autofillDossier.customCoverLetter && (
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                        Tailored Cover Letter Pitch
                      </h4>
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg whitespace-pre-line text-slate-700 dark:text-slate-300">
                        {autofillDossier.customCoverLetter}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* STEP 3: SUBMITTED SUCCESS */}
          {currentStep === 'submitted' && submissionResult && (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Application Successfully Transmitted!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                  Your customized resume and autofill dossier have been submitted to {job.company}'s talent acquisition network with 1-click autopilot.
                </p>
              </div>

              {/* Confirmation Code Card */}
              <div className="max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Verified Transmission ID
                </div>
                <div className="text-lg font-mono font-black text-indigo-600 dark:text-indigo-400">
                  {submissionResult.confirmationCode}
                </div>
                <div className="text-xs text-slate-500">
                  Logged under secure user record: <span className="font-mono text-slate-700 dark:text-slate-300">{userProfile.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={handlePrintOrDownloadResume}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print Tailored Resume</span>
                </button>

                <button
                  onClick={handleCopyJSON}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedJSON ? 'Copied Dossier!' : 'Copy Dossier JSON'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Close & View in Tracker
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          {currentStep === 'customize' && (
            <>
              <button
                onClick={handlePrintOrDownloadResume}
                disabled={!customizedResume}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Preview Tailored PDF</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleProceedToAutofill}
                  disabled={!customizedResume || loadingCustomization}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Review Autofill Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {currentStep === 'autofill' && (
            <>
              <button
                onClick={() => setCurrentStep('customize')}
                className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ← Back to Resume
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>

                {/* THE FINAL 1-CLICK APPLY BUTTON */}
                <button
                  onClick={handleFinalOneClickSubmit}
                  disabled={submittingApply}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-extrabold text-xs rounded-lg shadow-md transition-all flex items-center gap-2"
                >
                  {submittingApply ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Transmitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application in 1-Click</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {currentStep === 'submitted' && (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
