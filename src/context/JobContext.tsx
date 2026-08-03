import React, { createContext, useContext, useState, useEffect } from 'react';
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

const JobContext = createContext<JobContextType | undefined>(undefined);

export const ADMIN_EMAILS = [
  'shafinbd4u@gmail.com',
  'rashidul4you@gmail.com',
];

const INITIAL_CATEGORIES = [
  '🏛️ Govt. Job',
  '💼 Private Job',
  '🎓 University Admission Notice',
  'Software & IT',
  'Digital Marketing',
  'Graphic Design',
  'Banking & Finance',
  'Customer Support',
  'Data Entry',
  'Engineering',
  'Sales & Business',
];

const INITIAL_SAMPLE_USERS: UserProfile[] = [
  {
    id: 'usr-101',
    fullName: 'Shafin BD (Admin)',
    email: 'shafinbd4u@gmail.com',
    phone: '01700000000',
    title: 'Super Administrator',
    location: 'Dhaka, Bangladesh',
    skills: ['Management', 'React', 'Firebase', 'System Admin'],
    experience: '5 Years',
    education: 'B.Sc in CSE',
    bio: 'Platform Owner & Administrator for ShafinBD Jobs',
    registeredAt: '2026-01-01',
    savedJobs: [],
  },
  {
    id: 'usr-102',
    fullName: 'Rashidul Islam (Admin)',
    email: 'rashidul4you@gmail.com',
    phone: '01800000000',
    title: 'Co-Admin & Moderator',
    location: 'Dhaka, Bangladesh',
    skills: ['Operations', 'Recruitment', 'SQL'],
    experience: '4 Years',
    education: 'BBA in Marketing',
    bio: 'Job Circular Moderator & Portal Admin',
    registeredAt: '2026-01-05',
    savedJobs: [],
  },
  {
    id: 'usr-103',
    fullName: 'Tanvir Ahmed',
    email: 'tanvir.dev@gmail.com',
    phone: '01912345678',
    title: 'Senior Full Stack Web Developer',
    location: 'Dhaka (Uttara)',
    skills: ['React', 'Node.js', 'TypeScript', 'Tailwind'],
    experience: '3.5 Years',
    education: 'B.Sc in CSE (BUET)',
    bio: 'Passionate Web Developer looking for full-time remote or hybrid opportunities.',
    registeredAt: '2026-02-10',
    savedJobs: [],
  },
  {
    id: 'usr-104',
    fullName: 'Anika Rahman',
    email: 'anika.mktg@gmail.com',
    phone: '01711223344',
    title: 'Digital Marketing & SEO Specialist',
    location: 'Chittagong',
    skills: ['SEO', 'Google Ads', 'Content Strategy', 'Social Media'],
    experience: '2 Years',
    education: 'BBA in Management (CU)',
    bio: 'E-commerce & Brand Growth Marketer.',
    registeredAt: '2026-02-15',
    savedJobs: [],
  }
];

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [role, setRoleState] = useState<'jobseeker' | 'admin'>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE) as 'jobseeker' | 'admin') || 'jobseeker';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('jobs');
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('overview');
  const [categoriesList, setCategoriesList] = useState<string[]>(INITIAL_CATEGORIES);
  const [notificationsList, setNotificationsList] = useState<AdminNotification[]>([
    {
      id: 'notif-1',
      title: 'নতুন সরকারি প্রাথমিক নিয়োগ বিজ্ঞপ্তি ২০২৬',
      message: 'বাংলাদেশ প্রাথমিক শিক্ষা অধিদপ্তর কর্তৃক সহকারী শিক্ষক নিয়োগের নিয়োগ বিজ্ঞপ্তি প্রকাশ করা হয়েছে।',
      target: 'All Users',
      type: 'Circular Alert',
      sentAt: new Date().toLocaleDateString('bn-BD') + ' 10:30 AM',
    }
  ]);
  const [userList, setUserList] = useState<UserProfile[]>(INITIAL_SAMPLE_USERS);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [lang, setLang] = useState<'BN' | 'EN'>('BN');

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
  };

  const checkAndSetAdmin = (email?: string | null) => {
    if (!email) return false;
    const isTargetAdmin = ADMIN_EMAILS.some((e) => e.toLowerCase() === email.toLowerCase());
    if (isTargetAdmin) {
      setRoleState('admin');
      setIsAdminLoggedIn(true);
      setActiveTab('admin');
      localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, 'admin');
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
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
    const currentEmail = authUser?.email || profile?.email;
    if (currentEmail) {
      const isTargetAdmin = ADMIN_EMAILS.some((e) => e.toLowerCase() === currentEmail.toLowerCase());
      if (isTargetAdmin) {
        setRoleState('admin');
        setIsAdminLoggedIn(true);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, 'admin');
        localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      }
    }
  }, [authUser?.email, profile?.email]);

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
          checkAndSetAdmin(currentUser.email);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => { clearDemoDataFromFirestore(); }, []);

  // Realtime listeners
  useEffect(() => {
    const unsubJobs = subscribeToJobs((loaded) => {
      const demoIds = new Set(['job-101', 'job-102', 'job-103', 'job-104', 'job-105', 'job-106']);
      setJobs((loaded || []).filter((j) => !demoIds.has(j.id)));
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
        if (loaded.email) checkAndSetAdmin(loaded.email);
      }
    }, () => {});
    return () => unsubProfile();
  }, [authUser?.uid]);

  // Auth Handlers
  const signInWithGoogle = async () => {
    try {
      setIsAuthLoading(true); setAuthError(null);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user?.email) {
        checkAndSetAdmin(res.user.email);
      }
    } catch (error: any) {
      setAuthError(error); setShowAuthModal(true); throw error;
    } finally { setIsAuthLoading(false); }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setIsAuthLoading(true); setAuthError(null);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user?.email) {
        checkAndSetAdmin(res.user.email);
      } else {
        checkAndSetAdmin(email);
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
      checkAndSetAdmin(email);
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
    checkAndSetAdmin(email);
  };

  const logoutUser = async () => {
    try { await signOut(auth); setProfile(INITIAL_PROFILE); }
    catch (e) { console.error(e); }
  };

  // Actions
  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantCount'>) => {
    const newJob = createNewJobObject(jobData);
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
      if (authUser?.uid) newProf.id = authUser.uid;
      saveProfileToFirestore(newProf);
      return newProf;
    });
  };

  const toggleSaveJob = (jobId: string) => {
    setProfile((prev) => {
      const isSaved = prev.savedJobs.includes(jobId);
      const newSaved = isSaved ? prev.savedJobs.filter((id) => id !== jobId) : [...prev.savedJobs, jobId];
      const updated = { ...prev, savedJobs: newSaved };
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
        authError, setAuthError, showAuthModal, setShowAuthModal, signInWithGoogle,
        signInWithEmail, registerWithEmail, directProfileLogin, logoutUser, addJob,
        updateJob, deleteJob, toggleJobStatus, toggleJobFeatured, updateProfile, applyForJob,
        updateApplicationStatus, toggleSaveJob, setRole, loginAdmin, logoutAdmin, setFilters,
        resetFilters, setActiveTab, resetAllData, selectedJobForModal, setSelectedJobForModal,
        lang, setLang,
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
