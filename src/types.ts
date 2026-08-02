export type JobType = 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Internship';

export type JobCategory =
  | 'Software & IT'
  | 'Digital Marketing'
  | 'Graphic Design'
  | 'Banking & Finance'
  | 'Customer Support'
  | 'Data Entry'
  | 'Engineering'
  | 'Sales & Business';

export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';

export type ApplicationStatus = 'Pending' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Hired';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: JobType;
  category: JobCategory;
  salaryRange: string; // e.g. "৳45,000 - ৳65,000 / month"
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  deadline: string;
  createdAt: string;
  status: 'active' | 'closed';
  featured: boolean;
  applicantCount: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  title: string; // e.g. "Frontend React Developer"
  location: string;
  skills: string[];
  experience: string;
  education: string;
  bio: string;
  resumeFileName?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  registeredAt: string;
  savedJobs: string[]; // Job IDs
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  resumeNote: string;
  skills: string[];
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
}

export interface FilterState {
  searchKeyword: string;
  category: string;
  jobType: string;
  location: string;
  experienceLevel: string;
  salaryMin: number;
}

export type ActiveTab = 'jobs' | 'applications' | 'profile' | 'admin' | 'deploy-guide';
