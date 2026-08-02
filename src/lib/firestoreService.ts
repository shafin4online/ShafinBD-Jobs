import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { Job, UserProfile, JobApplication } from '../types';

export const subscribeToJobs = (onSync: (jobs: Job[]) => void, onError?: (err: any) => void) => {
  try {
    const jobsRef = collection(db, 'jobs');
    return onSnapshot(
      jobsRef, 
      (snapshot) => {
        if (snapshot.empty) {
          onSync([]);
        } else {
          const loadedJobs: Job[] = [];
          snapshot.forEach((docSnap) => {
            loadedJobs.push(docSnap.data() as Job);
          });
          onSync(loadedJobs);
        }
      }, 
      (error) => {
        console.warn('Firestore jobs listener notice:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Firestore subscription catch:', err);
    if (onError) onError(err);
    return () => {};
  }
};

export const subscribeToApplications = (onSync: (apps: JobApplication[]) => void, onError?: (err: any) => void) => {
  try {
    const appsRef = collection(db, 'applications');
    return onSnapshot(
      appsRef, 
      (snapshot) => {
        if (snapshot.empty) {
          onSync([]);
        } else {
          const loadedApps: JobApplication[] = [];
          snapshot.forEach((docSnap) => {
            loadedApps.push(docSnap.data() as JobApplication);
          });
          onSync(loadedApps);
        }
      }, 
      (error) => {
        console.warn('Firestore apps listener notice:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Firestore apps catch:', err);
    if (onError) onError(err);
    return () => {};
  }
};

export const subscribeToProfile = (profileId: string, onSync: (profile: UserProfile | null) => void, onError?: (err: any) => void) => {
  if (!profileId) {
    onSync(null);
    return () => {};
  }
  try {
    const profileRef = doc(db, 'profiles', profileId);
    return onSnapshot(
      profileRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          onSync(docSnap.data() as UserProfile);
        } else {
          onSync(null);
        }
      }, 
      (error) => {
        console.warn('Firestore profile listener notice:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    if (onError) onError(err);
    return () => {};
  }
};

export const saveJobToFirestore = async (job: Job) => {
  try {
    await setDoc(doc(db, 'jobs', job.id), job);
  } catch (e) {
    console.warn('Firestore save job error:', e);
  }
};

export const deleteJobFromFirestore = async (jobId: string) => {
  try {
    await deleteDoc(doc(db, 'jobs', jobId));
  } catch (e) {
    console.warn('Firestore delete job error:', e);
  }
};

export const saveApplicationToFirestore = async (application: JobApplication) => {
  try {
    await setDoc(doc(db, 'applications', application.id), application);
  } catch (e) {
    console.warn('Firestore save application error:', e);
  }
};

export const saveProfileToFirestore = async (profile: UserProfile) => {
  if (!profile.id) return;
  try {
    await setDoc(doc(db, 'profiles', profile.id), profile);
  } catch (e) {
    console.warn('Firestore save profile error:', e);
  }
};

export const clearDemoDataFromFirestore = async () => {
  const demoJobIds = ['job-101', 'job-102', 'job-103', 'job-104', 'job-105', 'job-106'];
  const demoAppIds = ['app-501', 'app-502'];
  const demoProfileIds = ['user-001'];

  for (const id of demoJobIds) {
    try { await deleteDoc(doc(db, 'jobs', id)); } catch (e) {}
  }
  for (const id of demoAppIds) {
    try { await deleteDoc(doc(db, 'applications', id)); } catch (e) {}
  }
  for (const id of demoProfileIds) {
    try { await deleteDoc(doc(db, 'profiles', id)); } catch (e) {}
  }
};


