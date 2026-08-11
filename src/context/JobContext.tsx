import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Job, UserProfile, JobApplication, FilterState, ActiveTab, ApplicationStatus } from '../types';
import { INITIAL_PROFILE } from '../data/initialData';
import {
  subscribeToJobs,
  subscribeToApplications,
  subscribeToProfile,
  saveJobToFirestore,
  deleteJobFromFirestore,
  saveApplicationToFirestore,
  saveProfileToFirestore,
  saveProfileSectionToFirestore,
  clearDemoDataFromFirestore,
} from '../lib/firestoreService';
import { 
  firebaseConfig, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User 
} from '../lib/firebase';
import { JobContextType, DEFAULT_FILTERS, LOCAL_STORAGE_KEYS, AdminSubTab, AdminNotification } from './jobContextTypes';
import { createGoogleProfile, createNewJobObject, createNewApplicationObject } from './jobHelpers';
import { triggerPushBroadcast } from '../lib/pushNotification';
import { ADMIN_EMAILS, INITIAL_CATEGORIES, INITIAL_SAMPLE_USERS, INITIAL_NOTIFICATIONS } from './jobConstants';
import { processJobLifecycle } from './jobLifecycle';
import { syncProfileToExtension } from '../lib/extensionSync';
import { deleteFromCloudinary } from '../lib/cloudinary';

// Re-export for components that import directly from JobContext
export { ADMIN_EMAILS, processJobLifecycle };

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.JOBS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return processJobLifecycle(parsed);
      }
    } catch (e) {
      console.error('Error loading local jobs:', e);
    }
    return [];
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading local profile:', e);
    }
    return INITIAL_PROFILE;
  });

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] = useState<boolean>(false);

  const [role, setRoleState] = useState<'jobseeker' | 'admin'>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE) as 'jobseeker' | 'admin') || 'jobseeker';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      const validTabs: ActiveTab[] = [
        'jobs',
        'govt-jobs',
        'private-jobs',
        'university-admission',
        'exam-results',
        'saved-jobs',
        'applications',
        'profile',
        'admin',
        'privacy-policy',
        'terms',
        'about',
        'contact',
      ];
      if (validTabs.includes(path as ActiveTab)) {
        return path as ActiveTab;
      }
    }
    return 'jobs';
  });

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    setSelectedJobForModal(null);
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        window.location.hash = '';
      }
      const targetPath = tab === 'jobs' ? '/' : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/^\//, '');
        const validTabs: ActiveTab[] = [
          'jobs',
          'govt-jobs',
          'private-jobs',
          'university-admission',
          'exam-results',
          'saved-jobs',
          'applications',
          'profile',
          'admin',
          'privacy-policy',
          'terms',
          'about',
          'contact',
        ];
        if (validTabs.includes(path as ActiveTab)) {
          setActiveTabState(path as ActiveTab);
        } else if (path === '') {
          setActiveTabState('jobs');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('overview');
  const [categoriesList, setCategoriesList] = useState<string[]>(INITIAL_CATEGORIES);
  const [notificationsList, setNotificationsList] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [userList, setUserList] = useState<UserProfile[]>(INITIAL_SAMPLE_USERS);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedJobForModal, setSelectedJobForModalState] = useState<Job | null>(null);

  const setSelectedJobForModal = useCallback((job: Job | null) => {
    setSelectedJobForModalState(job);
    if (typeof window !== 'undefined') {
      if (job) {
        const targetHash = `#/job/${job.id}`;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
        }
      } else {
        if (window.location.hash.startsWith('#/job/')) {
          window.location.hash = '';
        }
      }
    }
  }, []);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [lang, setLang] = useState<'BN' | 'EN'>('BN');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const addCategory = (catName: string) => {
    if (!catName.trim()) return;
    if (!categoriesList.includes(catName.trim())) {
      setCategoriesList((prev) => [...prev, catName.trim()]);
    }
  };

  const deleteCategory = (catName: string) => {
    setCategoriesList((prev) => prev.filter((c) => c !== catName));
  };

  const sendNotification = (notif: Omit<AdminNotification, 'id' | 'sentAt'>) => {
    const newNotif: AdminNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toLocaleString(),
    };
    setNotificationsList((prev) => [newNotif, ...prev]);
    triggerPushBroadcast({
      title: notif.title,
      body: notif.message,
      url: '/'
    });
  };

  const checkAndSetAdmin = (email?: string | null) => {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const isTargetAdmin = ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === cleanEmail);
    if (isTargetAdmin) {
      setRoleState('admin');
      setIsAdminLoggedIn(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, 'admin');
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    } else {
      setRoleState('jobseeker');
      setIsAdminLoggedIn(false);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, 'jobseeker');
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'false');
      return false;
    }
  };

  useEffect(() => {
    if (lang === 'BN') {
      document.body.classList.add('font-bn');
      document.body.classList.remove('font-en');
    } else {
      document.body.classList.add('font-en');
      document.body.classList.remove('font-bn');
    }
  }, [lang]);

  // Check admin whenever user email changes
  useEffect(() => {
    if (authUser?.email) {
      const cleanEmail = authUser.email.trim().toLowerCase();
      const isTargetAdmin = ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === cleanEmail);
      if (isTargetAdmin) {
        setRoleState('admin');
        setIsAdminLoggedIn(true);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, 'admin');
        localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      } else {
        setRoleState('jobseeker');
        setIsAdminLoggedIn(false);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, 'jobseeker');
        localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'false');
      }
    } else {
      setRoleState('jobseeker');
      setIsAdminLoggedIn(false);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, 'jobseeker');
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'false');
    }
  }, [authUser?.email]);

  // Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        const updatedProf = createGoogleProfile(currentUser, profile.phone, profile.title);
        setProfile((prev) => ({ ...updatedProf, ...prev, id: currentUser.uid }));
        saveProfileToFirestore({ ...updatedProf, id: currentUser.uid });
        if (currentUser.email) {
          const isAdmin = checkAndSetAdmin(currentUser.email);
          if (isAdmin) {
            setActiveTab('admin');
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync profile & Firebase Auth ID token to Teletalk Browser Extension
  useEffect(() => {
    if (profile && profile.fullName) {
      syncProfileToExtension(profile, authUser);
    }
  }, [profile, authUser]);

  useEffect(() => { clearDemoDataFromFirestore(); }, []);

  // Sync jobs to localStorage and run lifecycle processor
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save jobs to local storage:', e);
    }
  }, [jobs]);

  // Periodic automated lifecycle check (checks every 24 hours for deadline expiration and 3-year cleanup)
  useEffect(() => {
    const runCheck = () => {
      setJobs((prevJobs) => {
        const processed = processJobLifecycle(prevJobs);
        if (JSON.stringify(processed) !== JSON.stringify(prevJobs)) {
          return processed;
        }
        return prevJobs;
      });
    };

    runCheck(); // Initial check on load
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; // 86,400,000 ms
    const interval = setInterval(runCheck, TWENTY_FOUR_HOURS_MS); // Repeat check every 24 hours
    return () => clearInterval(interval);
  }, []);

  // Realtime listeners
  useEffect(() => {
    const unsubJobs = subscribeToJobs((loaded) => {
      const demoIds = new Set(['job-101', 'job-102', 'job-103', 'job-104', 'job-105', 'job-106']);
      const cleanLoaded = (loaded || []).filter((j) => !demoIds.has(j.id));
      if (cleanLoaded.length > 0) {
        setJobs(processJobLifecycle(cleanLoaded));
      }
      setIsFirebaseConnected(true);
    }, () => setIsFirebaseConnected(false));

    const unsubApps = subscribeToApplications((loaded) => {
      const demoAppIds = new Set(['app-501', 'app-502']);
      setApplications((loaded || []).filter((a) => !demoAppIds.has(a.id)));
    }, () => {});

    return () => { unsubJobs(); unsubApps(); };
  }, []);

  useEffect(() => {
    if (!authUser?.uid) return;
    const unsubProfile = subscribeToProfile(authUser.uid, (loaded) => {
      if (loaded) {
        setProfile(loaded);
        if (loaded.email) {
          const isAdmin = checkAndSetAdmin(loaded.email);
          if (isAdmin) setActiveTab('admin');
        }
      }
    }, () => {});
    return () => unsubProfile();
  }, [authUser?.uid]);

  // Auth Handlers
  const signInWithGoogle = async () => {
    try {
      setIsAuthLoading(true); setAuthError(null);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const userEmail = res.user.email || '';
        const isAdmin = checkAndSetAdmin(userEmail);
        if (isAdmin) {
          setActiveTab('admin');
        } else {
          const currentPhone = profile.phone || res.user.phoneNumber || '';
          const currentName = profile.fullName || res.user.displayName || '';
          if (!currentPhone || !currentName || !profile.isAccountActive) {
            setShowActivationModal(true);
          } else {
            setActiveTab('profile');
          }
        }
      }
    } catch (error: any) {
      setAuthError(error); setShowAuthModal(true); throw error;
    } finally { setIsAuthLoading(false); }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setIsAuthLoading(true); setAuthError(null);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const targetEmail = res.user?.email || email;
      const isAdmin = checkAndSetAdmin(targetEmail);
      if (isAdmin) {
        setActiveTab('admin');
      } else {
        setActiveTab('profile');
      }
    } catch (error: any) { setAuthError(error); throw error; }
    finally { setIsAuthLoading(false); }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      setIsAuthLoading(true); setAuthError(null);
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProf = createGoogleProfile(userCred.user, '', '');
      newProf.fullName = name || email.split('@')[0];
      setProfile(newProf); saveProfileToFirestore(newProf);
      const isAdmin = checkAndSetAdmin(email);
      if (isAdmin) {
        setActiveTab('admin');
      } else {
        setActiveTab('profile');
      }
    } catch (error: any) { setAuthError(error); throw error; }
    finally { setIsAuthLoading(false); }
  };

  const directProfileLogin = (email: string, name: string) => {
    const customId = `user-${Date.now().toString().slice(-6)}`;
    const newProf: UserProfile = {
      id: customId,
      fullName: name || email.split('@')[0],
      email,
      phone: '',
      title: 'Job Seeker',
      location: 'Bangladesh',
      skills: ['React', 'JavaScript'],
      experience: '',
      education: '',
      bio: 'Direct registered profile',
      registeredAt: new Date().toISOString().split('T')[0],
      savedJobs: [],
    };
    setProfile(newProf); saveProfileToFirestore(newProf);
    const isAdmin = checkAndSetAdmin(email);
    if (isAdmin) {
      setActiveTab('admin');
    } else {
      setActiveTab('profile');
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setProfile(INITIAL_PROFILE);
      setRoleState('jobseeker');
      setIsAdminLoggedIn(false);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ROLE);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
      setActiveTab('jobs');
    } catch (e) {
      console.error(e);
    }
  };

  // Actions
  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantCount'>): Promise<Job> => {
    const newJob = createNewJobObject(jobData);
    setJobs((prev) => [newJob, ...prev]);
    await saveJobToFirestore(newJob);

    // Broadcast push notification to user devices
    triggerPushBroadcast({
      title: `নতুন নিয়োগ বিজ্ঞপ্তি: ${jobData.title}`,
      body: `${jobData.company} (${jobData.location}) | আবেদনের শেষ তারিখ: ${jobData.deadline}`,
      jobCategory: jobData.category,
      url: `/#/job/${newJob.id}`
    });

    return newJob;
  };

  const updateJob = async (updatedJob: Job): Promise<Job> => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    await saveJobToFirestore(updatedJob);
    return updatedJob;
  };

  const deleteJob = (jobId: string) => {
    const jobToDelete = jobs.find((j) => j.id === jobId);
    if (jobToDelete) {
      if (jobToDelete.companyLogo) {
        deleteFromCloudinary(jobToDelete.companyLogo);
      }
      if (jobToDelete.imageUrl) {
        deleteFromCloudinary(jobToDelete.imageUrl);
      }
      if (jobToDelete.imageUrls && Array.isArray(jobToDelete.imageUrls)) {
        jobToDelete.imageUrls.forEach((url) => deleteFromCloudinary(url));
      }
    }
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
      if (authUser?.uid) newProf.id = authUser.uid;
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(newProf));
      } catch (e) {
        console.error('Failed to save profile to local storage:', e);
      }
      saveProfileToFirestore(newProf);
      return newProf;
    });
  };

  const updateProfileSection = (sectionHandle: string, sectionData: Partial<UserProfile>) => {
    setProfile((prev) => {
      const newProf = { ...prev, ...sectionData };
      if (authUser?.uid) newProf.id = authUser.uid;
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(newProf));
      } catch (e) {
        console.error('Failed to save profile section to local storage:', e);
      }
      saveProfileSectionToFirestore(newProf.id, sectionHandle, sectionData);
      return newProf;
    });
  };

  const toggleSaveJob = (jobId: string) => {
    setProfile((prev) => {
      const currentSaved = prev?.savedJobs || [];
      const isSaved = currentSaved.includes(jobId);
      const newSaved = isSaved ? currentSaved.filter((id) => id !== jobId) : [...currentSaved, jobId];
      const updated = { ...prev, savedJobs: newSaved };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update local storage profile for savedJobs:', e);
      }
      if (authUser?.uid) saveProfileToFirestore(updated);
      return updated;
    });
  };

  const applyForJob = (jobId: string, resumeNote?: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };
    if (job.status === 'closed') return { success: false, message: 'Job is closed' };

    const currentUserId = authUser?.uid || profile.id || 'guest-user';
    if (applications.some((a) => a.jobId === jobId && a.userId === currentUserId)) {
      return { success: false, message: 'You have already applied.' };
    }

    const newApp = createNewApplicationObject(
      job, currentUserId,
      authUser?.displayName || profile.fullName || 'Applicant',
      authUser?.email || profile.email || 'applicant@gmail.com',
      profile.phone || '', resumeNote, profile.skills || []
    );

    setApplications((prev) => [newApp, ...prev]);
    saveApplicationToFirestore(newApp);

    const updatedJob = { ...job, applicantCount: (job.applicantCount || 0) + 1 };
    setJobs((prev) => prev.map((j) => (j.id === jobId ? updatedJob : j)));
    saveJobToFirestore(updatedJob);

    return { success: true, message: 'আবেদন সফলভাবে জমা নেওয়া হয়েছে!' };
  };

  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus, notes?: string) => {
    setApplications((prev) => {
      const updated = prev.map((app) =>
        app.id === applicationId ? { ...app, status, notes: notes !== undefined ? notes : app.notes } : app
      );
      const target = updated.find((a) => a.id === applicationId);
      if (target) saveApplicationToFirestore(target);
      return updated;
    });
  };

  const setRole = (newRole: 'jobseeker' | 'admin') => setRoleState(newRole);

  const loginAdmin = (passcode: string) => {
    if (passcode === 'admin123' || passcode === 'admin') {
      setIsAdminLoggedIn(true); setRoleState('admin'); return true;
    }
    return false;
  };

  const logoutAdmin = () => { setIsAdminLoggedIn(false); setRoleState('jobseeker'); };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const resetAllData = () => {
    setJobs([]); setProfile(INITIAL_PROFILE); setApplications([]);
    setRoleState('jobseeker'); setIsAdminLoggedIn(false); setFilters(DEFAULT_FILTERS);
    localStorage.clear();
  };

  return (
    <JobContext.Provider
      value={{
        jobs, profile, applications, authUser, role, isAdminLoggedIn, activeTab,
        adminSubTab, setAdminSubTab, categoriesList, addCategory, deleteCategory,
        notificationsList, sendNotification, userList, filters,
        isFirebaseConnected, firebaseProjectId: firebaseConfig.projectId, isAuthLoading,
        authError, setAuthError, showAuthModal, setShowAuthModal,
        showActivationModal, setShowActivationModal, signInWithGoogle,
        signInWithEmail, registerWithEmail, directProfileLogin, logoutUser, addJob,
        updateJob, deleteJob, toggleJobStatus, toggleJobFeatured, updateProfile, updateProfileSection, applyForJob,
        updateApplicationStatus, toggleSaveJob, setRole, loginAdmin, logoutAdmin, setFilters,
        resetFilters, setActiveTab, resetAllData, selectedJobForModal, setSelectedJobForModal,
        lang, setLang, isDarkMode, toggleDarkMode,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobContext must be used within a JobProvider');
  return context;
};
