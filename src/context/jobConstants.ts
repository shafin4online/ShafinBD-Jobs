import { UserProfile } from '../types';
import { AdminNotification } from './jobContextTypes';

export const ADMIN_EMAILS = [
  'shafinbd4u@gmail.com',
  'rashidul4you@gmail.com',
];

export const INITIAL_CATEGORIES = [
  '🏛️ Govt. Job',
  '💼 Private Job',
  '🎓 University Admission Notice',
  '🏆 Exam Result',
  'Software & IT',
  'Digital Marketing',
  'Graphic Design',
  'Banking & Finance',
  'Customer Support',
  'Data Entry',
  'Engineering',
  'Sales & Business',
];

export const INITIAL_SAMPLE_USERS: UserProfile[] = [
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
  },
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'নতুন সরকারি প্রাথমিক নিয়োগ বিজ্ঞপ্তি ২০২৬',
    message: 'বাংলাদেশ প্রাথমিক শিক্ষা অধিদপ্তর কর্তৃক সহকারী শিক্ষক নিয়োগের নিয়োগ বিজ্ঞপ্তি প্রকাশ করা হয়েছে।',
    target: 'All Users',
    type: 'Circular Alert',
    sentAt: new Date().toLocaleDateString('bn-BD') + ' 10:30 AM',
  },
];
