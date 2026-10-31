export type WorkMode = 'remote' | 'hybrid' | 'onsite' | 'walk-in';

export type JobDomain = 
  | 'Data Analytics'
  | 'Gen AI & LLM'
  | 'Data Science'
  | 'BI & Data Engineering';

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  logoText: string;
  location: string;
  workMode: WorkMode;
  domain: JobDomain;
  salaryRange: string;
  experienceLevel: string; // e.g. "0-2 Yrs", "2-5 Yrs", "5+ Yrs"
  postedDate: string;
  deadline?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  screeningQuestions: {
    id: string;
    question: string;
    type: 'text' | 'choice' | 'boolean';
    options?: string[];
  }[];
  applicationUrl: string;
  isWalkin?: boolean;
  walkinDetails?: {
    date: string;
    venue: string;
    reportingTime: string;
    registrationDeadline: string;
  };
  hiringSurge?: boolean;
}

export interface WalkinDrive {
  id: string;
  company: string;
  role: string;
  domain: JobDomain;
  date: string;
  timing: string;
  workMode: 'In-Person Walk-in' | 'Virtual Fast-Track';
  venues: string[]; // e.g. ["Bengaluru - Whitefield Campus", "Hyderabad - HITEC City"]
  eligibleBatches: string;
  experienceRequired: string;
  salaryOffering: string;
  documentsRequired: string[];
  walkinTips: string[];
  registrationUrl: string;
  openingsCount: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string[];
  summary: string;
  metrics: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  headline: string;
  summary: string;
  yearsOfExperience: number;
  noticePeriodDays: number;
  currentCTC: string;
  expectedCTC: string;
  preferredWorkModes: WorkMode[];
  preferredLocations: string[];
  skills: {
    dataAnalytics: string[];
    genAI: string[];
    programming: string[];
    toolsAndDatabases: string[];
  };
  experiences: WorkExperience[];
  educations: Education[];
  projects: ProjectItem[];
  certifications: string[];
}

export interface CustomizedResume {
  jobId: string;
  jobTitle: string;
  company: string;
  atsScore: number;
  matchSummary: string;
  tailoredHeadline: string;
  tailoredSummary: string;
  keyMatches: string[];
  missingKeywords: string[];
  tailoredExperiences: {
    company: string;
    role: string;
    period: string;
    tailoredBullets: string[];
  }[];
  strategicAdvice: string[];
  tailoredCoverLetter: string;
}

export interface AutofillDossier {
  jobId: string;
  company: string;
  role: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    authorizedToWork: boolean;
    requiresSponsorship: boolean;
    noticePeriod: string;
    currentCompensation: string;
    expectedCompensation: string;
  };
  screeningAnswers: {
    questionId: string;
    question: string;
    answer: string;
    confidenceScore: number;
  }[];
  tailoredResumeSummary: string;
  customCoverLetter: string;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  workMode: WorkMode;
  appliedAt: string;
  status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Interview Scheduled' | 'Offer';
  atsScore: number;
  confirmationCode: string;
  dossierSummary: string;
  notes?: string;
}

export interface MarketInsights {
  lastUpdated: string;
  hiringSurges: {
    domain: string;
    growthRate: string;
    hotSkills: string[];
    insight: string;
  }[];
  walkinTrends: {
    city: string;
    activeDrives: number;
    prominentCompanies: string[];
  }[];
  remoteVsHybridRatio: {
    remotePercent: number;
    hybridPercent: number;
    onsitePercent: number;
  };
  salaryBenchmarks: {
    role: string;
    experience: string;
    range: string;
    medianBonus: string;
  }[];
  highPriorityCompanies: {
    name: string;
    domain: string;
    openings: number;
    hiringSpeed: 'Fast-Track (3-5 days)' | 'Standard (2 weeks)';
    whyApply: string;
  }[];
}
