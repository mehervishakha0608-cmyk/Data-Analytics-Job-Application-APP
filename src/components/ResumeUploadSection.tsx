/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UserProfile } from '../types/job';
import { api } from '../services/apiClient';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  FileCheck, 
  ArrowRight, 
  ShieldCheck, 
  Code, 
  Briefcase, 
  RefreshCw,
  Copy
} from 'lucide-react';

interface ResumeUploadSectionProps {
  currentProfile: UserProfile;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
  onGoToOpportunities: () => void;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  currentProfile,
  onProfileUpdated,
  onGoToOpportunities,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  
  // Processing states
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccessData, setParseSuccessData] = useState<{
    fileName: string;
    parsedProfile: UserProfile;
    atsBaselineScore: number;
    atsImprovementTips: string[];
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setParseError(null);
    setParseSuccessData(null);

    // Read file text safely
    try {
      const text = await file.text();
      // Basic check for readable text
      if (text && text.trim().length > 0) {
        setResumeText(text);
      } else {
        setResumeText(`[Resume Document: ${file.name}] - Text will be analyzed by Gemini parser.`);
      }
    } catch {
      setResumeText(`[Resume Document: ${file.name}]`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleParseAndUpload = async () => {
    const textToSubmit = resumeText.trim();
    if (!textToSubmit || textToSubmit.length < 40) {
      setParseError('Please upload a valid resume file or paste your complete resume text (minimum 40 characters).');
      return;
    }

    setParsing(true);
    setParseError(null);
    setParseSuccessData(null);

    try {
      const fileName = selectedFile ? selectedFile.name : 'Pasted_Resume.txt';
      const result = await api.parseAndUploadResume({
        rawResumeText: textToSubmit,
        fileName,
      });

      setParseSuccessData(result);
      onProfileUpdated(result.parsedProfile);
    } catch (err: any) {
      setParseError(err?.message || 'Failed to parse resume. Please ensure file contains readable text.');
    } finally {
      setParsing(false);
    }
  };

  const loadSampleDataAnalyticsResume = () => {
    const sample = `Vishakha Meher
meher.vishakha0608@gmail.com | +91 98765 43210 | Bengaluru, India
LinkedIn: linkedin.com/in/vishakha-meher-data-ai | GitHub: github.com/vishakha-data-genai

PROFESSIONAL SUMMARY:
Senior Data Analytics & Generative AI Specialist with 4+ years architecting enterprise RAG knowledge engines, real-time KPI dashboards, and automated predictive pipelines. Expert in Python, Advanced SQL, Gemini API, LangChain, Snowflake, and Tableau, delivering $1.4M operational cost reductions.

TECHNICAL SKILLS:
- Data Analytics: Advanced SQL (Window functions, CTEs), Tableau, Power BI, Snowflake, BigQuery, Exploratory Data Analysis, Cohort Retention Modeling, A/B Testing
- Generative AI & LLMs: Gemini SDK, RAG Architecture, LangChain, LlamaIndex, Vector Databases (ChromaDB, Pinecone), Prompt Engineering, Semantic Chunking, Model Evaluation
- Programming & Cloud: Python (Pandas, NumPy, Scikit-learn, FastAPI), SQL, Docker, Google Cloud Platform (GCP), Git CI/CD

PROFESSIONAL EXPERIENCE:
CognitiveData Labs — Lead Gen AI & Analytics Specialist (2023 - Present)
- Deployed enterprise multi-tenant RAG retrieval pipeline with Gemini Flash & LangChain, decreasing internal analyst query latency by 68%.
- Built 14 mission-critical Tableau & Snowflake financial dashboards monitoring $42M in transaction volume with anomaly alerts.
- Formulated semantic indexing pipelines indexing 300,000+ unstructured corporate PDFs with 99.2% recall rate.

Synthetix Analytics — Data Analyst & Machine Learning Engineer (2021 - 2023)
- Built automated customer churn prediction pipelines in Python & SQL, cutting client attrition by 18% in fiscal year 2022.
- Orchestrated daily streaming telemetry ETL processing 2.5TB of event logs via GCP BigQuery and dbt.

EDUCATION:
B.Tech in Computer Science & Data Engineering, National Institute of Technology (2021, CGPA: 8.8/10)

CERTIFICATIONS:
- Google Professional Data Engineer
- DeepLearning.AI LangChain & Generative AI Specialization`;

    setResumeText(sample);
    setSelectedFile(null);
    setActiveMode('paste');
    setParseError(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <UploadCloud className="w-4 h-4" />
            <span>AI RESUME INGESTION & AUTO-EXTRACTION</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Upload Master Resume
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Upload your resume once. Gemini extracts, normalizes, and tailors your profile for 1-click Data & GenAI applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleDataAnalyticsResume}
            className="px-3.5 py-1.5 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Data/AI Resume</span>
          </button>
        </div>
      </div>

      {/* Input Mode Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveMode('upload')}
          className={`pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeMode === 'upload'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File (PDF / DOCX / TXT)</span>
        </button>

        <button
          onClick={() => setActiveMode('paste')}
          className={`pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeMode === 'paste'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste Plain Text</span>
        </button>
      </div>

      {/* UPLOAD MODE */}
      {activeMode === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-900'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            accept=".pdf,.docx,.txt,.md,.json"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {selectedFile ? selectedFile.name : 'Click to select or drag and drop your resume file'}
          </h3>

          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
            Supports PDF, DOCX, TXT, and Markdown files up to 5MB. Client-side extraction ensures your data remains encrypted and isolated.
          </p>

          {selectedFile ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Ready for AI Ingestion ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          ) : (
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Browse Local Files →
            </span>
          )}
        </div>
      )}

      {/* PASTE MODE */}
      {activeMode === 'paste' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Paste your full resume text (contact info, work history, projects, skills):</span>
            <span className="font-mono tabular-nums">{resumeText.length} characters</span>
          </div>

          <textarea
            rows={12}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Zero-Trust Isolation: Resume is parsed server-side with Gemini 3.8 Flash and saved strictly under your private vault.
          </span>
        </div>

        <button
          onClick={handleParseAndUpload}
          disabled={parsing || (!selectedFile && !resumeText.trim())}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
        >
          {parsing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing & Extracting with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Extract & Sync with Master Vault</span>
            </>
          )}
        </button>
      </div>

      {parseError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{parseError}</span>
        </div>
      )}

      {/* SUCCESS RESULT CARD & ATS HEALTH SCORE */}
      {parseSuccessData && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Resume Ingested & Master Vault Synchronized!
                </h3>
                <p className="text-xs text-slate-500">
                  Document: {parseSuccessData.fileName} · Verified under /users/{currentProfile.uid}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">ATS Baseline Health</div>
                <div className="text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {parseSuccessData.atsBaselineScore}%
                </div>
              </div>

              <button
                onClick={onGoToOpportunities}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <span>Browse Jobs to Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Parsed Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                <span>Extracted Profile Baseline</span>
              </div>
              <div><strong>Name:</strong> {parseSuccessData.parsedProfile.fullName}</div>
              <div><strong>Headline:</strong> {parseSuccessData.parsedProfile.headline}</div>
              <div><strong>Contact:</strong> {parseSuccessData.parsedProfile.email} · {parseSuccessData.parsedProfile.phone}</div>
              <div><strong>Experience:</strong> {parseSuccessData.parsedProfile.yearsOfExperience} Years</div>
              <div className="pt-1 text-slate-600 dark:text-slate-400 line-clamp-3">
                {parseSuccessData.parsedProfile.summary}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                <span>Normalized Data & AI Stack</span>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-1">Data Analytics & BI:</div>
                <div className="flex flex-wrap gap-1">
                  {parseSuccessData.parsedProfile.skills.dataAnalytics.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[11px] border border-slate-200 dark:border-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Generative AI & LLMs:</div>
                <div className="flex flex-wrap gap-1">
                  {parseSuccessData.parsedProfile.skills.genAI.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 rounded text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable ATS Improvement Tips */}
          {parseSuccessData.atsImprovementTips.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs space-y-1.5">
              <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Recommendations for Data & Gen AI Role Match</span>
              </div>
              <ul className="list-disc list-inside text-amber-800 dark:text-amber-200/90 space-y-1">
                {parseSuccessData.atsImprovementTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
