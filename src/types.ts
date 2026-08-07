export type JobType = 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Internship';

export type JobCategory =
  | 'Govt. Job'
  | 'Private Job'
  | 'University Admission Notice'
  | 'Exam Result'
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

export type PostCategoryType = 'govt' | 'private' | 'exam-result' | 'university';

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

  // Extended Post Fields based on Post Type
  postType?: PostCategoryType;
  startDate?: string;          // আবেদন শুরু
  position?: string;           // পদের নাম
  vacancies?: string;          // পdes সংখ্যা
  applicationFee?: string;     // আবেদন ফি
  applicationUrl?: string;     // আবেদনের লিংক
  circularUrl?: string;        // সম্পূর্ণ নিয়োগ বিজ্ঞপ্তি লিংক / রেজাল্ট লিংক
  resultDate?: string;         // প্রকাশের তারিখ
  examDate?: string;           // পরীক্ষার তারিখ
  passedCount?: string;        // উত্তীর্ণ সংখ্যা
  writtenExamDate?: string;    // লিখিত পরীক্ষার তারিখ
  imageUrl?: string;           // Base64 Image (Primary/First Image)
  imageUrls?: string[];        // Multiple Base64 Images for Multi-page Circulars/Results
}

export interface UserProfile {
  id: string;
  isAccountActive?: boolean;
  // Personal Info
  fullName: string;
  fullNameBangla?: string;
  fatherName?: string;
  fatherNameBangla?: string;
  motherName?: string;
  motherNameBangla?: string;
  dateOfBirth?: string;
  nationality?: string;
  religion?: string;
  gender?: string;
  hasNid?: 'Yes' | 'No' | string;
  nidNumber?: string;
  hasBirthReg?: 'Yes' | 'No' | string;
  birthRegNumber?: string;
  hasPassport?: 'Yes' | 'No' | string;
  passportNumber?: string;
  maritalStatus?: string;
  phone: string;
  confirmPhone?: string;
  email: string;
  quota?: string;
  deptStatus?: string;

  // Address Details
  careOf?: string;
  villageRoad?: string;
  district?: string;
  upazila?: string;
  postOffice?: string;
  postCode?: string;

  // SSC/Equivalent Level
  sscExam?: string;
  sscRoll?: string;
  sscRegistration?: string;
  sscGroup?: string;
  sscBoard?: string;
  sscResult?: string;
  sscYear?: string;

  // HSC/Equivalent Level
  hscExam?: string;
  hscRoll?: string;
  hscRegistration?: string;
  hscGroup?: string;
  hscBoard?: string;
  hscResult?: string;
  hscYear?: string;

  // Graduation/Equivalent Level
  gradExam?: string;
  gradRoll?: string;
  gradRegistration?: string;
  gradInstitute?: string;
  gradYear?: string;
  gradSubject?: string;
  gradResult?: string;
  gradDuration?: string;

  // Masters/Equivalent Level
  mastersExam?: string;
  mastersRoll?: string;
  mastersRegistration?: string;
  mastersInstitute?: string;
  mastersYear?: string;
  mastersSubject?: string;
  mastersResult?: string;
  mastersDuration?: string;

  // Contact info locking (Name, Email, Phone editable only once)
  isContactLocked?: boolean;

  // Legacy / Additional fields
  title?: string;
  location?: string;
  presentAddress?: string;
  permanentAddress?: string;
  nidOrPassport?: string;
  altPhone?: string;
  expectedSalary?: string;
  skills: string[];
  experience?: string;
  education?: string;
  bio?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  photoUrl?: string;
  signatureUrl?: string;
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
  status: 'all' | 'active' | 'closed';
}

export type ActiveTab = 
  | 'jobs' 
  | 'govt-jobs'
  | 'private-jobs'
  | 'university-admission'
  | 'exam-results'
  | 'saved-jobs'
  | 'applications' 
  | 'profile' 
  | 'admin' 
  | 'deploy-guide'
  | 'privacy-policy'
  | 'terms'
  | 'about'
  | 'contact';

