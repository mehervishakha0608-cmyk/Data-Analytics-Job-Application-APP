/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, JobOpportunity, WalkinDrive, MarketInsights, CustomizedResume, AutofillDossier, ApplicationRecord } from '../types/job';

// Generate or retrieve persistent verified user session token
// In production with Firebase Auth, this is obtained via user.getIdToken()
const TOKEN_STORAGE_KEY = 'datagenius_auth_token';
const DEFAULT_USER_EMAIL = 'meher.vishakha0608@gmail.com';
const DEFAULT_USER_UID = 'usr_vishakha_0608';

export function getAuthToken(): string {
  let token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    // Generate secure base64-encoded credential payload: uid:email:name
    token = btoa(`${DEFAULT_USER_UID}:${DEFAULT_USER_EMAIL}:Vishakha Meher`);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
  return token;
}

export function setCustomAuthToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errJson.message || errorMsg;
    } catch {
      // fallback text
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  async getProfile(): Promise<UserProfile> {
    const data = await request<{ profile: UserProfile }>('/api/user/profile');
    return data.profile;
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const data = await request<{ profile: UserProfile }>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    return data.profile;
  },

  async getJobs(): Promise<JobOpportunity[]> {
    const data = await request<{ jobs: JobOpportunity[] }>('/api/jobs');
    return data.jobs;
  },

  async getWalkins(): Promise<WalkinDrive[]> {
    const data = await request<{ walkins: WalkinDrive[] }>('/api/walkins');
    return data.walkins;
  },

  async getMarketInsights(): Promise<MarketInsights> {
    const data = await request<{ insights: MarketInsights }>('/api/insights');
    return data.insights;
  },

  async customizeResume(params: {
    jobId: string;
    jobTitle: string;
    company: string;
    jobDescription: string;
    requiredSkills: string[];
  }): Promise<CustomizedResume> {
    const data = await request<{ success: boolean; customizedResume: CustomizedResume }>(
      '/api/ai/customize-resume',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    return data.customizedResume;
  },

  async generateAutofillDossier(params: {
    jobId: string;
    jobTitle: string;
    company: string;
    screeningQuestions: any[];
    tailoredResume: CustomizedResume;
  }): Promise<AutofillDossier> {
    const data = await request<{ success: boolean; autofillDossier: AutofillDossier }>(
      '/api/ai/generate-autofill',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    return data.autofillDossier;
  },

  async applyToJob(params: {
    jobId: string;
    jobTitle: string;
    company: string;
    location: string;
    workMode: string;
    atsScore: number;
    dossier: AutofillDossier;
  }): Promise<{ success: boolean; alreadyApplied: boolean; confirmationCode: string; application: ApplicationRecord; message: string }> {
    return request('/api/applications/apply', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getApplications(): Promise<ApplicationRecord[]> {
    const data = await request<{ applications: ApplicationRecord[] }>('/api/applications');
    return data.applications;
  },

  async searchWalkinIntel(params: {
    companyName: string;
    city: string;
    roleType: string;
  }): Promise<string> {
    const data = await request<{ success: boolean; insightsText: string }>(
      '/api/ai/live-walkin-search',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    return data.insightsText;
  },

  async parseAndUploadResume(params: {
    rawResumeText: string;
    fileName: string;
  }): Promise<{
    success: boolean;
    fileName: string;
    parsedProfile: UserProfile;
    atsBaselineScore: number;
    atsImprovementTips: string[];
    message: string;
  }> {
    return request('/api/ai/parse-resume', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};
