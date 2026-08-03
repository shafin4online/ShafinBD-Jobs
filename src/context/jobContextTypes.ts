import React from 'react';
import { Job, UserProfile, JobApplication, FilterState, ActiveTab, ApplicationStatus } from '../types';
import { User } from '../lib/firebase';

export interface JobContextType {
  jobs: Job[];
  profile: UserProfile;
  applications: JobApplication[];
  authUser: User | null;
  role: 'jobseeker' | 'admin';
  isAdminLoggedIn: boolean;
  activeTab: ActiveTab;
  filters: FilterState;
  isFirebaseConnected: boolean;
  firebaseProjectId: string;
  isAuthLoading: boolean;
  authError: any;
  setAuthError: (err: any) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  directProfileLogin: (email: string, name: string) => void;
  logoutUser: () => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'applicantCount'>) => void;
  updateJob: (job: Job) => void;
  deleteJob: (jobId: string) => void;
  toggleJobStatus: (jobId: string) => void;
  toggleJobFeatured: (jobId: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  applyForJob: (jobId: string, resumeNote?: string) => { success: boolean; message: string };
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus, notes?: string) => void;
  toggleSaveJob: (jobId: string) => void;
  setRole: (role: 'jobseeker' | 'admin') => void;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  resetAllData: () => void;
  selectedJobForModal: Job | null;
  setSelectedJobForModal: (job: Job | null) => void;
  lang: 'BN' | 'EN';
  setLang: (lang: 'BN' | 'EN') => void;
}

export const DEFAULT_FILTERS: FilterState = {
  searchKeyword: '',
  category: 'All',
  jobType: 'All',
  location: 'All',
  experienceLevel: 'All',
  salaryMin: 0,
};

export const LOCAL_STORAGE_KEYS = {
  JOBS: 'shafinbd_jobs_v2',
  PROFILE: 'shafinbd_profile_v2',
  APPLICATIONS: 'shafinbd_applications_v2',
  ROLE: 'shafinbd_role_v2',
  ADMIN_AUTH: 'shafinbd_admin_auth_v2',
};
