import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, UserProfile, JobApplication, FilterState, ActiveTab, ApplicationStatus } from '../types';
import { INITIAL_JOBS, INITIAL_PROFILE, INITIAL_APPLICATIONS } from '../data/initialData';

const DEFAULT_FILTERS: FilterState = {
  searchKeyword: '',
  category: 'All',
  jobType: 'All',
  location: 'All',
  experienceLevel: 'All',
  salaryMin: 0,
};

interface JobContextType {
  jobs: Job[];
  profile: UserProfile;
  applications: JobApplication[];
  role: 'jobseeker' | 'admin';
  isAdminLoggedIn: boolean;
  activeTab: ActiveTab;
  filters: FilterState;
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
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  JOBS: 'shafinbd_jobs_v1',
  PROFILE: 'shafinbd_profile_v1',
  APPLICATIONS: 'shafinbd_applications_v1',
  ROLE: 'shafinbd_role_v1',
  ADMIN_AUTH: 'shafinbd_admin_auth_v1',
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.JOBS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse jobs', e);
      }
    }
    return INITIAL_JOBS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
    return INITIAL_PROFILE;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse applications', e);
      }
    }
    return INITIAL_APPLICATIONS;
  });

  const [role, setRoleState] = useState<'jobseeker' | 'admin'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE);
    return (saved as 'jobseeker' | 'admin') || 'jobseeker';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('jobs');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Actions
  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantCount'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString().split('T')[0],
      applicantCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  const updateJob = (updatedJob: Job) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const toggleJobStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: j.status === 'active' ? 'closed' : 'active' } : j
      )
    );
  };

  const toggleJobFeatured = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, featured: !j.featured } : j))
    );
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
  };

  const toggleSaveJob = (jobId: string) => {
    setProfile((prev) => {
      const isSaved = prev.savedJobs.includes(jobId);
      const newSaved = isSaved
        ? prev.savedJobs.filter((id) => id !== jobId)
        : [...prev.savedJobs, jobId];
      return { ...prev, savedJobs: newSaved };
    });
  };

  const applyForJob = (jobId: string, resumeNote?: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    if (job.status === 'closed') {
      return { success: false, message: 'This job post is closed for applications.' };
    }

    // Check if user already applied
    const existing = applications.find((a) => a.jobId === jobId && a.userId === profile.id);
    if (existing) {
      return { success: false, message: 'You have already applied for this position.' };
    }

    const newApplication: JobApplication = {
      id: `app-${Date.now().toString().slice(-5)}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company,
      userId: profile.id,
      userName: profile.fullName || 'Anonymous Applicant',
      userEmail: profile.email,
      userPhone: profile.phone,
      resumeNote: resumeNote || 'Applied using registered ShafinBD profile.',
      skills: profile.skills,
      status: 'Pending',
      appliedAt: new Date().toLocaleString(),
    };

    setApplications((prev) => [newApplication, ...prev]);

    // Increment job applicant count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
    );

    return { success: true, message: 'Application submitted successfully!' };
  };

  const updateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status, notes: notes !== undefined ? notes : app.notes }
          : app
      )
    );
  };

  const setRole = (newRole: 'jobseeker' | 'admin') => {
    setRoleState(newRole);
  };

  const loginAdmin = (passcode: string) => {
    if (passcode === 'admin123' || passcode === 'admin') {
      setIsAdminLoggedIn(true);
      setRoleState('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setRoleState('jobseeker');
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const resetAllData = () => {
    setJobs(INITIAL_JOBS);
    setProfile(INITIAL_PROFILE);
    setApplications(INITIAL_APPLICATIONS);
    setRoleState('jobseeker');
    setIsAdminLoggedIn(false);
    setFilters(DEFAULT_FILTERS);
    localStorage.clear();
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        profile,
        applications,
        role,
        isAdminLoggedIn,
        activeTab,
        filters,
        addJob,
        updateJob,
        deleteJob,
        toggleJobStatus,
        toggleJobFeatured,
        updateProfile,
        applyForJob,
        updateApplicationStatus,
        toggleSaveJob,
        setRole,
        loginAdmin,
        logoutAdmin,
        setFilters,
        resetFilters,
        setActiveTab,
        resetAllData,
        selectedJobForModal,
        setSelectedJobForModal,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
