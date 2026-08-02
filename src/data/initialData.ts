import { Job, UserProfile, JobApplication } from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-101',
    title: 'Senior React & Node.js Developer',
    company: 'TechBD Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    location: 'Gulshan, Dhaka (Hybrid)',
    jobType: 'Full-time',
    category: 'Software & IT',
    salaryRange: '৳85,000 - ৳120,000 / month',
    experienceLevel: 'Senior Level',
    description: 'We are seeking an experienced Full Stack Developer skilled in React.js, TypeScript, Tailwind CSS, and Node.js/Express to lead development on scalable web apps.',
    requirements: [
      '3+ years of commercial experience in React & Node.js',
      'Strong proficiency in TypeScript, Tailwind CSS, and REST API design',
      'Familiarity with PostgreSQL or MongoDB databases',
      'Experience with Git workflows and CI/CD deployment pipelines'
    ],
    responsibilities: [
      'Architect and build high-performance web applications',
      'Collaborate with product managers and UI/UX designers',
      'Code review and mentor junior developers',
      'Optimize web applications for maximum speed and scalability'
    ],
    deadline: '2026-08-25',
    createdAt: '2026-08-01',
    status: 'active',
    featured: true,
    applicantCount: 14,
  },
  {
    id: 'job-102',
    title: 'Digital Marketing & SEO Specialist',
    company: 'GrowthVibe Agency',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    location: 'Banani, Dhaka',
    jobType: 'Full-time',
    category: 'Digital Marketing',
    salaryRange: '৳40,000 - ৳60,000 / month',
    experienceLevel: 'Mid Level',
    description: 'Lead multi-channel digital marketing campaigns across Meta Ads, Google Ads, and technical SEO for top e-commerce brands in Bangladesh.',
    requirements: [
      '2+ years experience in Digital Marketing & Paid Ads',
      'Proven track record with Meta Business Suite and Google Analytics 4',
      'Good understanding of keyword research and SEO tools (Ahrefs/SEMrush)',
      'Strong analytical mindset and copy writing skills'
    ],
    responsibilities: [
      'Manage advertising budget and optimize ROAS',
      'Perform search engine optimization audits and content strategies',
      'Create weekly performance reports for clients'
    ],
    deadline: '2026-08-30',
    createdAt: '2026-08-02',
    status: 'active',
    featured: true,
    applicantCount: 22,
  },
  {
    id: 'job-103',
    title: 'UI/UX Designer (Product & Web)',
    company: 'Shafin Digital Lab',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    location: 'Uttara, Dhaka (Remote option)',
    jobType: 'Remote',
    category: 'Graphic Design',
    salaryRange: '৳50,000 - ৳75,000 / month',
    experienceLevel: 'Mid Level',
    description: 'Design intuitive, accessible, and elegant visual interfaces for modern web and mobile SaaS applications.',
    requirements: [
      'Expert proficiency in Figma, design systems, and auto-layout',
      'Solid portfolio demonstrating user-centric web/app design process',
      'Ability to conduct user research and usability testing',
      'Understanding of HTML/CSS capabilities for seamless dev handoff'
    ],
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity UI screens',
      'Maintain and expand the company design system',
      'Work closely with engineers to ensure pixel-perfect implementation'
    ],
    deadline: '2026-09-05',
    createdAt: '2026-07-28',
    status: 'active',
    featured: false,
    applicantCount: 9,
  },
  {
    id: 'job-104',
    title: 'Junior Executive - Accounts & Banking',
    company: 'Bengal Trade Ltd.',
    companyLogo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=120&auto=format&fit=crop&q=80',
    location: 'Agrabad, Chattogram',
    jobType: 'Full-time',
    category: 'Banking & Finance',
    salaryRange: '৳30,000 - ৳42,000 / month',
    experienceLevel: 'Entry Level',
    description: 'Handling day-to-day accounting transactions, tax compliance documentation, bank reconciliation, and financial ledger maintenance.',
    requirements: [
      'BBA or B.Com in Accounting / Finance from a recognized university',
      'Proficiency in Tally Prime, MS Excel (VLOOKUP, Pivot tables)',
      'Basic knowledge of VAT and Tax regulations in Bangladesh',
      'Good attention to detail and accuracy'
    ],
    responsibilities: [
      'Prepare daily vouchers and record expenses accurately',
      'Reconcile monthly bank statements and ledger accounts',
      'Assist senior accountant with audit preparations'
    ],
    deadline: '2026-08-20',
    createdAt: '2026-07-25',
    status: 'active',
    featured: false,
    applicantCount: 31,
  },
  {
    id: 'job-105',
    title: 'Customer Support Representative (Night Shift)',
    company: 'GlobalCare BPO',
    companyLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    location: 'Dhanmondi, Dhaka',
    jobType: 'Contract',
    category: 'Customer Support',
    salaryRange: '৳35,000 - ৳48,000 / month',
    experienceLevel: 'Entry Level',
    description: 'Provide customer assistance via chat, email, and call for international e-commerce clients during US business hours.',
    requirements: [
      'Fluency in spoken and written English',
      'Good problem-solving skills and patient communication manner',
      'Comfortable working night shifts (8 PM - 5 AM)',
      'Basic typing speed of at least 40 WPM'
    ],
    responsibilities: [
      'Respond to customer inquiries and resolve complaints promptly',
      'Document customer support tickets in CRM tool',
      'Escalate complex issues to technical tier-2 teams'
    ],
    deadline: '2026-08-28',
    createdAt: '2026-08-02',
    status: 'active',
    featured: false,
    applicantCount: 18,
  },
  {
    id: 'job-106',
    title: 'Executive - Business Development & Sales',
    company: 'InnovateBD Tech',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
    location: 'Motijheel, Dhaka',
    jobType: 'Full-time',
    category: 'Sales & Business',
    salaryRange: '৳35,000 + Sales Commission',
    experienceLevel: 'Mid Level',
    description: 'Drive B2B software sales, build relations with corporate clients, present solution demos, and achieve quarterly sales targets.',
    requirements: [
      '1-2 years experience in corporate sales or business development',
      'Strong negotiation, presentation, and interpersonal skills',
      'Ability to generate leads through cold outreach and networking',
      'Familiarity with CRM software'
    ],
    responsibilities: [
      'Identify prospect business clients and schedule meetings',
      'Deliver tailored product demos to key decision makers',
      'Close sales agreements and achieve monthly revenue metrics'
    ],
    deadline: '2026-09-01',
    createdAt: '2026-07-30',
    status: 'active',
    featured: true,
    applicantCount: 12,
  }
];

export const INITIAL_PROFILE: UserProfile = {
  id: 'user-001',
  fullName: 'Shafin Ahmed',
  email: 'shafin.jobseeker@example.com',
  phone: '+880 1712-345678',
  title: 'Full Stack Web Developer & Tech Enthusiast',
  location: 'Dhaka, Bangladesh',
  skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Git', 'REST APIs'],
  experience: '2 years of frontend web development building interactive modern web applications.',
  education: 'B.Sc in Computer Science & Engineering - BRAC University',
  bio: 'Passionate software engineer looking for exciting opportunities in modern web development. Specialized in building clean, responsive user interfaces and robust APIs.',
  resumeFileName: 'Shafin_Ahmed_CV.pdf',
  githubUrl: 'https://github.com/shafinbd4u',
  linkedinUrl: 'https://linkedin.com/in/shafinbd',
  registeredAt: '2026-08-01',
  savedJobs: ['job-101', 'job-103'],
};

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-501',
    jobId: 'job-101',
    jobTitle: 'Senior React & Node.js Developer',
    companyName: 'TechBD Solutions',
    userId: 'user-001',
    userName: 'Shafin Ahmed',
    userEmail: 'shafin.jobseeker@example.com',
    userPhone: '+880 1712-345678',
    resumeNote: 'I have attached my updated resume and highlighted my React and Node.js projects.',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
    status: 'Reviewing',
    appliedAt: '2026-08-01 14:30',
    notes: 'Shortlisted for initial tech interview.'
  },
  {
    id: 'app-502',
    jobId: 'job-103',
    jobTitle: 'UI/UX Designer (Product & Web)',
    companyName: 'Shafin Digital Lab',
    userId: 'user-001',
    userName: 'Shafin Ahmed',
    userEmail: 'shafin.jobseeker@example.com',
    userPhone: '+880 1712-345678',
    resumeNote: 'Passionate about UI engineering and design systems.',
    skills: ['Figma', 'Tailwind CSS', 'React'],
    status: 'Pending',
    appliedAt: '2026-08-02 09:15',
  }
];
