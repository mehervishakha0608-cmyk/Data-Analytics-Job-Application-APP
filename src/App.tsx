/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { JobCard } from './components/JobCard';
import { WalkinDrivesSection } from './components/WalkinDrivesSection';
import { ResumeVaultModal } from './components/ResumeVaultModal';
import { ResumeUploadSection } from './components/ResumeUploadSection';
import { ApplyModal } from './components/ApplyModal';
import { AppliedTrackerSection } from './components/AppliedTrackerSection';
import { MarketInsightsSection } from './components/MarketInsightsSection';
import { api } from './services/apiClient';
import { JobOpportunity, WalkinDrive, MarketInsights, ApplicationRecord, UserProfile, WorkMode } from './types/job';
import { Search, Filter, Sparkles, AlertCircle, RefreshCw, Briefcase, Calendar, CheckCircle2, UploadCloud } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'upload' | 'walkins' | 'vault' | 'applied' | 'insights'>('jobs');
  
  // Data state
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [walkins, setWalkins] = useState<WalkinDrive[]>([]);
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Filter state for Jobs
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOpportunity | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedJobs, fetchedWalkins, fetchedInsights, fetchedApps, fetchedProfile] = await Promise.all([
        api.getJobs(),
        api.getWalkins(),
        api.getMarketInsights(),
        api.getApplications(),
        api.getProfile(),
      ]);

      setJobs(fetchedJobs);
      setWalkins(fetchedWalkins);
      setInsights(fetchedInsights);
      setApplications(fetchedApps);
      setUserProfile(fetchedProfile);
    } catch (err: any) {
      console.error('Initialization error:', err);
      setError(err?.message || 'Failed to connect to application server. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Convert Walk-in drive to a JobOpportunity for the 1-Click Tailor & Apply Modal
  const handleOpenWalkinDossier = (walkin: WalkinDrive) => {
    const walkinJob: JobOpportunity = {
      id: walkin.id,
      title: `${walkin.role} (Walk-in Drive)`,
      company: walkin.company,
      logoText: walkin.company.slice(0, 2).toUpperCase(),
      location: walkin.venues[0] || 'In-Person Walk-in',
      workMode: 'walk-in',
      domain: walkin.domain,
      salaryRange: walkin.salaryOffering,
      experienceLevel: walkin.experienceRequired,
      postedDate: 'Walk-in Active',
      description: `Express Walk-in Drive for ${walkin.company}. Date: ${walkin.date}. Reporting: ${walkin.timing}. Venues: ${walkin.venues.join('; ')}. Eligible batches: ${walkin.eligibleBatches}. Required docs: ${walkin.documentsRequired.join(', ')}.`,
      requiredSkills: [walkin.domain, 'SQL', 'Data Analytics', 'GenAI'],
      screeningQuestions: [
        { id: 'w1', question: `Are you available to attend on ${walkin.date} at ${walkin.venues[0]}?`, type: 'boolean' },
        { id: 'w2', question: 'Do you meet the experience criterion of ' + walkin.experienceRequired + '?', type: 'boolean' },
        { id: 'w3', question: 'Highlight a complex Data Analytics or GenAI project you can present during the technical interview round.', type: 'text' },
      ],
      applicationUrl: walkin.registrationUrl,
      isWalkin: true,
      walkinDetails: {
        date: walkin.date,
        venue: walkin.venues[0],
        reportingTime: walkin.timing,
        registrationDeadline: 'Prior to walk-in',
      },
    };

    setSelectedJobForApply(walkinJob);
  };

  // Filtered jobs list
  const filteredJobs = jobs.filter((job) => {
    const matchesDomain = selectedDomain === 'all' || job.domain === selectedDomain;
    const matchesWorkMode =
      selectedWorkMode === 'all' ||
      job.workMode === selectedWorkMode ||
      (selectedWorkMode === 'remote-hybrid' && (job.workMode === 'remote' || job.workMode === 'hybrid'));

    const matchesSearch =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesWorkMode && matchesSearch;
  });

  const isJobApplied = (jobId: string) => {
    return applications.some((a) => a.jobId === jobId);
  };

  const handleApplicationSuccess = (newApp: ApplicationRecord) => {
    setApplications((prev) => [newApp, ...prev.filter((a) => a.jobId !== newApp.jobId)]);
  };

  const handleSelectCompanyFromInsights = (companyName: string) => {
    setActiveTab('jobs');
    setSearchQuery(companyName);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appliedCount={applications.length}
        onOpenQuickApply={() => {
          if (jobs.length > 0) {
            setSelectedJobForApply(jobs[0]);
          }
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadInitialData}
              className="px-3 py-1 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 text-red-800 dark:text-red-200 rounded font-semibold text-xs flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto animate-spin" />
            <div className="text-base font-bold text-slate-900 dark:text-white">
              Loading Data & Gen AI Intelligence Engine...
            </div>
            <p className="text-xs text-slate-500">
              Verifying token authentication and scoping user vault under /users/uid/...
            </p>
          </div>
        ) : (
          <>
            {/* VIEW 1: JOB OPPORTUNITIES */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                {/* Hero Showcase with High-Fidelity Asset */}
                <HeroSection
                  onUploadResume={() => setActiveTab('upload')}
                  onExploreWalkins={() => setActiveTab('walkins')}
                  onExploreRemoteJobs={() => {
                    setSelectedWorkMode('remote');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  onOpenVault={() => setIsVaultOpen(true)}
                  activeWalkinCount={walkins.length}
                  totalJobCount={jobs.length}
                />

                {/* Filter and Search Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by role, company, or tech skill (e.g. RAG, SQL, Tableau, BigQuery, Gemini)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Work Mode Filter (Clean functional buttons) */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium shrink-0 flex-wrap">
                      <button
                        onClick={() => setSelectedWorkMode('all')}
                        className={`px-3 py-1.5 rounded-md transition-colors ${
                          selectedWorkMode === 'all'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        All Modes
                      </button>
                      <button
                        onClick={() => setSelectedWorkMode('remote')}
                        className={`px-3 py-1.5 rounded-md transition-colors ${
                          selectedWorkMode === 'remote'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Remote Only
                      </button>
                      <button
                        onClick={() => setSelectedWorkMode('hybrid')}
                        className={`px-3 py-1.5 rounded-md transition-colors ${
                          selectedWorkMode === 'hybrid'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Hybrid
                      </button>
                      <button
                        onClick={() => setSelectedWorkMode('walk-in')}
                        className={`px-3 py-1.5 rounded-md transition-colors ${
                          selectedWorkMode === 'walk-in'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Walk-in Drives
                      </button>
                    </div>
                  </div>

                  {/* Domain Sub-filter */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex-wrap">
                    <span className="text-slate-400 font-medium">Domain:</span>
                    {['all', 'Data Analytics', 'Gen AI & LLM', 'Data Science', 'BI & Data Engineering'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDomain(d)}
                        className={`px-2.5 py-1 rounded-sm transition-colors capitalize ${
                          selectedDomain === d
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {d === 'all' ? 'All Data & AI' : d}
                      </button>
                    ))}

                    <span className="ml-auto text-slate-400 text-[11px] font-mono tabular-nums">
                      Showing {filteredJobs.length} active opportunities
                    </span>
                  </div>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                  <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No jobs match your selected filter criteria.
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDomain('all');
                        setSelectedWorkMode('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isApplied={isJobApplied(job.id)}
                        onApply={(j) => setSelectedJobForApply(j)}
                        onViewWalkin={(j) => {
                          const matchingWalkin = walkins.find((w) => w.company.toLowerCase().includes(j.company.toLowerCase()));
                          if (matchingWalkin) {
                            handleOpenWalkinDossier(matchingWalkin);
                          } else {
                            setSelectedJobForApply(j);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: UPLOAD RESUME */}
            {activeTab === 'upload' && userProfile && (
              <ResumeUploadSection
                currentProfile={userProfile}
                onProfileUpdated={(updated) => setUserProfile(updated)}
                onGoToOpportunities={() => setActiveTab('jobs')}
              />
            )}

            {/* VIEW 3: WALKIN DRIVES */}
            {activeTab === 'walkins' && (
              <WalkinDrivesSection
                walkins={walkins}
                onGenerateWalkinDossier={handleOpenWalkinDossier}
              />
            )}

            {/* VIEW 3: RESUME VAULT */}
            {activeTab === 'vault' && userProfile && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Master Resume Vault
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Your central, verified credentials. Every 1-click tailored application pulls from this baseline.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Upload New Resume</span>
                    </button>

                    <button
                      onClick={() => setIsVaultOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Edit Master Profile & Skills</span>
                    </button>
                  </div>
                </div>

                {/* Profile Overview Card */}
                <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {userProfile.fullName}
                      </h3>
                      <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs mt-0.5">
                        {userProfile.headline}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 mt-2 flex-wrap">
                        <span>{userProfile.email}</span>
                        <span>·</span>
                        <span>{userProfile.phone}</span>
                        <span>·</span>
                        <span>{userProfile.location}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{userProfile.yearsOfExperience} Yrs Exp</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-slate-400">Notice Period</div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{userProfile.noticePeriodDays} Days</div>
                      <div className="text-slate-400 mt-1">Compensation</div>
                      <div className="font-mono tabular-nums">{userProfile.currentCTC} → <span className="text-emerald-600 dark:text-emerald-400 font-bold">{userProfile.expectedCTC}</span></div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400 text-[11px] mb-1">
                      Professional Narrative
                    </h4>
                    <p className="leading-relaxed bg-white dark:bg-slate-800/30 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      {userProfile.summary}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400 text-[11px] mb-2">
                      Master Technical Stack
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Data Analytics & BI</div>
                        <div className="flex flex-wrap gap-1">
                          {userProfile.skills.dataAnalytics.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-[11px] border border-slate-200 dark:border-slate-600">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1.5">Generative AI & LLMs</div>
                        <div className="flex flex-wrap gap-1">
                          {userProfile.skills.genAI.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 rounded text-[11px] border border-indigo-200 dark:border-indigo-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience List */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400 text-[11px] mb-2">
                      Work Experience Records
                    </h4>
                    <div className="space-y-3">
                      {userProfile.experiences.map((exp) => (
                        <div key={exp.id} className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between font-bold text-slate-900 dark:text-white text-xs mb-1">
                            <span>{exp.role} · {exp.company}</span>
                            <span className="text-slate-400 font-mono">{exp.period}</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                            {exp.bullets.map((b, i) => (
                              <li key={i} className="leading-relaxed">{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: APPLIED OPPORTUNITIES TRACKER */}
            {activeTab === 'applied' && (
              <AppliedTrackerSection
                applications={applications}
                onExploreMore={() => setActiveTab('jobs')}
              />
            )}

            {/* VIEW 5: MARKET INSIGHTS */}
            {activeTab === 'insights' && insights && (
              <MarketInsightsSection
                insights={insights}
                onSelectCompany={handleSelectCompanyFromInsights}
                onExploreWalkins={() => setActiveTab('walkins')}
              />
            )}
          </>
        )}
      </main>

      {/* 1-CLICK APPLY & RESUME CUSTOMIZER MODAL */}
      {selectedJobForApply && userProfile && (
        <ApplyModal
          job={selectedJobForApply}
          userProfile={userProfile}
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
          onApplicationSuccess={handleApplicationSuccess}
        />
      )}

      {/* MASTER RESUME VAULT MODAL */}
      {userProfile && (
        <ResumeVaultModal
          profile={userProfile}
          isOpen={isVaultOpen}
          onClose={() => setIsVaultOpen(false)}
          onProfileUpdated={(updated) => setUserProfile(updated)}
        />
      )}

      {/* Clean Footer (Quiet Copyright and Security Note) */}
      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            DataGenius Apply © 2026. Autonomous Data Analytics & Gen AI Career Engine.
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Gemini 3.8 Flash · Zero-Trust Token Auth · Data Isolation Enforced
          </div>
        </div>
      </footer>
    </div>
  );
}
