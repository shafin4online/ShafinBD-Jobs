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

export const saveProfileSectionToFirestore = async (
  userId: string,
  sectionHandle: string,
  sectionData: Record<string, any>
) => {
  if (!userId) return;
  try {
    const timestamp = new Date().toISOString();
    // 1. Save directly into subcollection document: profiles/{userId}/sections/{sectionHandle}
    const sectionDocRef = doc(db, 'profiles', userId, 'sections', sectionHandle);
    await setDoc(sectionDocRef, {
      ...sectionData,
      sectionHandle,
      updatedAt: timestamp,
    }, { merge: true });

    // 2. Also merge into the main user profile document at profiles/{userId}
    const mainProfileRef = doc(db, 'profiles', userId);
    await setDoc(mainProfileRef, {
      id: userId,
      ...sectionData,
      updatedAt: timestamp,
    }, { merge: true });

  } catch (e) {
    console.warn(`Firestore save section '${sectionHandle}' error:`, e);
  }
};

export const saveProfileToFirestore = async (profile: UserProfile) => {
  if (!profile.id) return;
  try {
    const timestamp = new Date().toISOString();
    
    // 1. Save root document
    await setDoc(doc(db, 'profiles', profile.id), {
      ...profile,
      updatedAt: timestamp,
    }, { merge: true });

    // 2. Save modular sections in subcollection: profiles/{userId}/sections/{sectionKey}
    const sections: Record<string, Record<string, any>> = {
      media: {
        photoUrl: profile.photoUrl || '',
        signatureUrl: profile.signatureUrl || '',
      },
      personal: {
        fullName: profile.fullName || '',
        fullNameBangla: profile.fullNameBangla || '',
        fatherName: profile.fatherName || '',
        fatherNameBangla: profile.fatherNameBangla || '',
        motherName: profile.motherName || '',
        motherNameBangla: profile.motherNameBangla || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || '',
        religion: profile.religion || '',
        nationality: profile.nationality || 'Bangladeshi',
        hasNid: profile.hasNid || '',
        nidNumber: profile.nidNumber || '',
        hasBirthReg: profile.hasBirthReg || '',
        birthRegNumber: profile.birthRegNumber || '',
        hasPassport: profile.hasPassport || '',
        passportNumber: profile.passportNumber || '',
        maritalStatus: profile.maritalStatus || '',
        phone: profile.phone || '',
        confirmPhone: profile.confirmPhone || '',
        email: profile.email || '',
        quota: profile.quota || '',
        deptStatus: profile.deptStatus || '',
        isContactLocked: Boolean(profile.isContactLocked),
      },
      address: {
        careOf: profile.careOf || '',
        villageRoad: profile.villageRoad || '',
        district: profile.district || '',
        upazila: profile.upazila || '',
        postOffice: profile.postOffice || '',
        postCode: profile.postCode || '',
        presentAddress: profile.presentAddress || '',
        permanentAddress: profile.permanentAddress || '',
      },
      education_ssc: {
        sscExam: profile.sscExam || '',
        sscRoll: profile.sscRoll || '',
        sscRegistration: profile.sscRegistration || '',
        sscGroup: profile.sscGroup || '',
        sscBoard: profile.sscBoard || '',
        sscResult: profile.sscResult || '',
        sscYear: profile.sscYear || '',
      },
      education_hsc: {
        hscExam: profile.hscExam || '',
        hscRoll: profile.hscRoll || '',
        hscRegistration: profile.hscRegistration || '',
        hscGroup: profile.hscGroup || '',
        hscBoard: profile.hscBoard || '',
        hscResult: profile.hscResult || '',
        hscYear: profile.hscYear || '',
      },
      education_grad: {
        gradExam: profile.gradExam || '',
        gradRoll: profile.gradRoll || '',
        gradRegistration: profile.gradRegistration || '',
        gradInstitute: profile.gradInstitute || '',
        gradYear: profile.gradYear || '',
        gradSubject: profile.gradSubject || '',
        gradResult: profile.gradResult || '',
        gradDuration: profile.gradDuration || '',
      },
      education_masters: {
        mastersExam: profile.mastersExam || '',
        mastersRoll: profile.mastersRoll || '',
        mastersRegistration: profile.mastersRegistration || '',
        mastersInstitute: profile.mastersInstitute || '',
        mastersYear: profile.mastersYear || '',
        mastersSubject: profile.mastersSubject || '',
        mastersResult: profile.mastersResult || '',
        mastersDuration: profile.mastersDuration || '',
      },
      experience_skills: {
        experience: profile.experience || '',
        skills: profile.skills || [],
        bio: profile.bio || '',
        title: profile.title || '',
        location: profile.location || '',
        expectedSalary: profile.expectedSalary || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
      },
      documents: {
        resumeUrl: profile.resumeUrl || '',
        resumeFileName: profile.resumeFileName || '',
      },
    };

    // Save each subcollection section
    for (const [sectionKey, sectionData] of Object.entries(sections)) {
      const sectionDocRef = doc(db, 'profiles', profile.id, 'sections', sectionKey);
      await setDoc(sectionDocRef, {
        ...sectionData,
        sectionHandle: sectionKey,
        updatedAt: timestamp,
      }, { merge: true });
    }

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


