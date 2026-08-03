import { UserProfile, Job, JobApplication } from '../types';
import { saveProfileToFirestore, saveJobToFirestore, saveApplicationToFirestore } from '../lib/firestoreService';

export const createGoogleProfile = (currentUser: any, existingPhone = '', existingTitle = ''): UserProfile => {
  return {
    id: currentUser.uid,
    fullName: currentUser.displayName || 'Google User',
    email: currentUser.email || '',
    phone: currentUser.phoneNumber || existingPhone || '',
    title: existingTitle || 'Job Seeker',
    location: 'Bangladesh',
    skills: ['React', 'JavaScript'],
    experience: '',
    education: '',
    bio: `Signed in via Google (${currentUser.email})`,
    resumeFileName: '',
    githubUrl: '',
    linkedinUrl: '',
    registeredAt: new Date().toISOString().split('T')[0],
    savedJobs: [],
  };
};

export const createNewJobObject = (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantCount'>): Job => {
  return {
    ...jobData,
    id: `job-${Date.now().toString().slice(-5)}`,
    createdAt: new Date().toISOString().split('T')[0],
    applicantCount: 0,
  };
};

export const createNewApplicationObject = (
  job: Job,
  userId: string,
  userName: string,
  userEmail: string,
  userPhone: string,
  resumeNote?: string,
  skills: string[] = []
): JobApplication => {
  return {
    id: `app-${Date.now().toString().slice(-5)}`,
    jobId: job.id,
    jobTitle: job.title,
    companyName: job.company,
    userId,
    userName,
    userEmail,
    userPhone,
    resumeNote: resumeNote || 'Applied using registered profile.',
    skills,
    status: 'Pending',
    appliedAt: new Date().toLocaleString(),
  };
};
