import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, UserProfile, JobApplication, FilterState, ActiveTab, ApplicationStatus } from '../types';
import { INITIAL_JOBS, INITIAL_PROFILE, INITIAL_APPLICATIONS } from '../data/initialData';
import {
  subscribeToJobs,
  subscribeToApplications,
  subscribeToProfile,
  saveJobToFirestore,
  deleteJobFromFirestore,
  saveApplicationToFirestore,
  saveProfileToFirestore,
  clearDemoDataFromFirestore,
} from '../lib/firestoreService';
import { 
  firebaseConfig, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from '../lib/firebase';

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
  authUser: User | null;
  role: 'jobseeker' | 'admin';
  isAdminLoggedIn: boolean;
  activeTab: ActiveTab;
  filters: FilterState;
  isFirebaseConnected: boolean;
  firebaseProjectId: string;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
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
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  JOBS: 'shafinbd_jobs_v2',
  PROFILE: 'shafinbd_profile_v2',
  APPLICATIONS: 'shafinbd_applications_v2',
  ROLE: 'shafinbd_role_v2',
  ADMIN_AUTH: 'shafinbd_admin_auth_v2',
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

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
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Firebase Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        // Build candidate profile from Google User credentials
        const updatedProf: UserProfile = {
          id: currentUser.uid,
          fullName: currentUser.displayName || 'Google User',
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || profile.phone || '',
          title: profile.title || 'Job Seeker',
          location: profile.location || 'Bangladesh',
          skills: profile.skills || ['React', 'JavaScript'],
          experience: profile.experience || '',
          education: profile.education || '',
          bio: profile.bio || `Signed in via Google (${currentUser.email})`,
          resumeFileName: profile.resumeFileName || '',
          githubUrl: profile.githubUrl || '',
          linkedinUrl: profile.linkedinUrl || '',
          registeredAt: profile.registeredAt || new Date().toISOString().split('T')[0],
          savedJobs: profile.savedJobs || [],
        };

        setProfile((prev) => ({
          ...updatedProf,
          ...prev,
          id: currentUser.uid,
          fullName: currentUser.displayName || prev.fullName || 'Google User',
          email: currentUser.email || prev.email || '',
        }));

        saveProfileToFirestore({
          ...updatedProf,
          id: currentUser.uid,
          fullName: currentUser.displayName || 'Google User',
          email: currentUser.email || '',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Purge legacy demo data on mount
  useEffect(() => {
    clearDemoDataFromFirestore();
    // Clear legacy localStorage cached demo data
    localStorage.removeItem('shafinbd_jobs_v1');
    localStorage.removeItem('shafinbd_profile_v1');
    localStorage.removeItem('shafinbd_applications_v1');
    localStorage.removeItem('shafinbd_jobs_v2');
    localStorage.removeItem('shafinbd_profile_v2');
    localStorage.removeItem('shafinbd_applications_v2');
  }, []);

  // Realtime Firestore listeners for jobs & applications
  useEffect(() => {
    const unsubJobs = subscribeToJobs(
      (loadedJobs) => {
        const demoIds = new Set(['job-101', 'job-102', 'job-103', 'job-104', 'job-105', 'job-106']);
        const cleaned = (loadedJobs || []).filter((j) => !demoIds.has(j.id));
        setJobs(cleaned);
        setIsFirebaseConnected(true);
      },
      () => setIsFirebaseConnected(false)
    );

    const unsubApps = subscribeToApplications(
      (loadedApps) => {
        const demoAppIds = new Set(['app-501', 'app-502']);
        const cleaned = (loadedApps || []).filter((a) => !demoAppIds.has(a.id));
        setApplications(cleaned);
      },
      () => {}
    );

    return () => {
      unsubJobs();
      unsubApps();
    };
  }, []);

  // Listen to profile updates if authenticated
  useEffect(() => {
    if (!authUser?.uid) return;

    const unsubProfile = subscribeToProfile(
      authUser.uid,
      (loadedProfile) => {
        if (loadedProfile) {
          setProfile(loadedProfile);
        }
      },
      () => {}
    );

    return () => unsubProfile();
  }, [authUser?.uid]);

  // Google Login function
  const signInWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      alert('Google Sign-In failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign out function
  const logoutUser = async () => {
    try {
      await signOut(auth);
      setProfile(INITIAL_PROFILE);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    saveJobToFirestore(newJob);
  };

  const updateJob = (updatedJob: Job) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    saveJobToFirestore(updatedJob);
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    deleteJobFromFirestore(jobId);
  };

  const toggleJobStatus = (jobId: string) => {
    setJobs((prev) => {
      const updated = prev.map((j) =>
        j.id === jobId ? { ...j, status: (j.status === 'active' ? 'closed' : 'active') as 'active' | 'closed' } : j
      );
      const target = updated.find((j) => j.id === jobId);
      if (target) saveJobToFirestore(target);
      return updated;
    });
  };

  const toggleJobFeatured = (jobId: string) => {
    setJobs((prev) => {
      const updated = prev.map((j) => (j.id === jobId ? { ...j, featured: !j.featured } : j));
      const target = updated.find((j) => j.id === jobId);
      if (target) saveJobToFirestore(target);
      return updated;
    });
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
    setProfile((prev) => {
      const newProf = { ...prev, ...updatedFields };
      if (authUser?.uid) {
        newProf.id = authUser.uid;
      }
      saveProfileToFirestore(newProf);
      return newProf;
    });
  };

  const toggleSaveJob = (jobId: string) => {
    setProfile((prev) => {
      const isSaved = prev.savedJobs.includes(jobId);
      const newSaved = isSaved
        ? prev.savedJobs.filter((id) => id !== jobId)
        : [...prev.savedJobs, jobId];
      const updated = { ...prev, savedJobs: newSaved };
      if (authUser?.uid) {
        saveProfileToFirestore(updated);
      }
      return updated;
    });
  };

  const applyForJob = (jobId: string, resumeNote?: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    if (job.status === 'closed') {
      return { success: false, message: 'This job post is closed for applications.' };
    }

    const currentUserId = authUser?.uid || profile.id || 'guest-user';
    const existing = applications.find((a) => a.jobId === jobId && a.userId === currentUserId);
    if (existing) {
      return { success: false, message: 'You have already applied for this position.' };
    }

    const newApplication: JobApplication = {
      id: `app-${Date.now().toString().slice(-5)}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company,
      userId: currentUserId,
      userName: authUser?.displayName || profile.fullName || 'Gmail Applicant',
      userEmail: authUser?.email || profile.email || 'applicant@gmail.com',
      userPhone: profile.phone || '',
      resumeNote: resumeNote || 'Applied using registered Gmail profile.',
      skills: profile.skills || [],
      status: 'Pending',
      appliedAt: new Date().toLocaleString(),
    };

    setApplications((prev) => [newApplication, ...prev]);
    saveApplicationToFirestore(newApplication);

    const updatedJob = { ...job, applicantCount: (job.applicantCount || 0) + 1 };
    setJobs((prev) => prev.map((j) => (j.id === jobId ? updatedJob : j)));
    saveJobToFirestore(updatedJob);

    return { success: true, message: 'Application submitted successfully!' };
  };

  const updateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ) => {
    setApplications((prev) => {
      const updated = prev.map((app) =>
        app.id === applicationId
          ? { ...app, status, notes: notes !== undefined ? notes : app.notes }
          : app
      );
      const target = updated.find((a) => a.id === applicationId);
      if (target) saveApplicationToFirestore(target);
      return updated;
    });
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
    setJobs([]);
    setProfile(INITIAL_PROFILE);
    setApplications([]);
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
        authUser,
        role,
        isAdminLoggedIn,
        activeTab,
        filters,
        isFirebaseConnected,
        firebaseProjectId: firebaseConfig.projectId,
        isAuthLoading,
        signInWithGoogle,
        logoutUser,
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


