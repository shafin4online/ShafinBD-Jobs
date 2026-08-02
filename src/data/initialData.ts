import { Job, UserProfile, JobApplication } from '../types';

export const INITIAL_JOBS: Job[] = [];

export const INITIAL_PROFILE: UserProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  title: '',
  location: '',
  skills: [],
  experience: '',
  education: '',
  bio: '',
  resumeFileName: '',
  githubUrl: '',
  linkedinUrl: '',
  registeredAt: '',
  savedJobs: [],
};

export const INITIAL_APPLICATIONS: JobApplication[] = [];

