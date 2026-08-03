import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { Job, JobType, JobCategory, ExperienceLevel } from '../types';
import { GoogleGenAI } from '@google/genai';
import { ShieldCheck, PlusCircle, Briefcase, FileText } from 'lucide-react';
import { AdminStats } from './admin/AdminStats';
import { JobForm } from './admin/JobForm';
import { AdminJobsTable } from './admin/AdminJobsTable';
import { AdminApplicationsTable } from './admin/AdminApplicationsTable';

export const AdminPanel: React.FC = () => {
  const {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    toggleJobFeatured,
    applications,
    updateApplicationStatus,
    logoutAdmin,
    resetAllData,
    isAdminLoggedIn,
    loginAdmin,
    directProfileLogin,
    setShowAuthModal,
    profile,
    authUser,
  } = useJobContext();

  const [activeAdminTab, setActiveAdminTab] = useState<'post' | 'jobs' | 'applications'>('post');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  if (!isAdminLoggedIn) {
    const handlePasscodeLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginAdmin(passcode);
      if (!success) {
        setPassError('পাসকোড ভুল হয়েছে। (পাসকোড: admin123)');
      }
    };

    return (
      <div className="max-w-md mx-auto my-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto font-bold">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-black text-slate-900">এডমিন প্যানেল এক্সেস (Admin Panel)</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            অনুমোদিত এডমিন ইমেইল (<span className="font-bold text-emerald-600">shafinbd4u@gmail.com</span> অথবা <span className="font-bold text-emerald-600">rashidul4you@gmail.com</span>) দিয়ে সাইন-ইন করলে স্বয়ংক্রিয়ভাবে এডমিন এক্সেস পাবেন।
          </p>
        </div>

        {/* 1-Click Fast Login for Admins */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">অনুমোদিত এডমিন ইমেইলে সাইন-ইন করুন</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => directProfileLogin('shafinbd4u@gmail.com', 'Shafin (Admin)')}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>shafinbd4u@gmail.com হিসেবে প্রবেশ</span>
            </button>
            <button
              onClick={() => directProfileLogin('rashidul4you@gmail.com', 'Rashidul (Admin)')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>rashidul4you@gmail.com হিসেবে প্রবেশ</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase absolute">অথবা পাসকোড দিন</span>
        </div>

        {/* Passcode Login */}
        <form onSubmit={handlePasscodeLogin} className="space-y-3">
          <input
            type="password"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setPassError('');
            }}
            placeholder="পাসকোড লিখুন (যেমন: admin123)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-center font-bold tracking-widest focus:outline-emerald-500"
          />
          {passError && <p className="text-xs text-rose-600 font-bold">{passError}</p>}
          <button
            type="submit"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-300 cursor-pointer"
          >
            পাসকোড দিয়ে খুলুন
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
          >
            Google / Email দিয়ে সাইন-ইন উইন্ডো খুলুন
          </button>
        </div>
      </div>
    );
  }

  const currentAdminEmail = authUser?.email || profile?.email || 'shafinbd4u@gmail.com';

  const [jobForm, setJobForm] = useState({
    title: '',
    company: 'ShafinBD Tech',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    location: 'Dhaka (Hybrid)',
    jobType: 'Full-time' as JobType,
    category: 'Govt. Job' as JobCategory,
    salaryRange: '৳50,000 - ৳75,000 / month',
    experienceLevel: 'Mid Level' as ExperienceLevel,
    description: '',
    requirementsText: '• 2+ years relevant experience\n• Strong communication skills',
    responsibilitiesText: '• Execute daily tasks and deliverables',
    deadline: '2026-09-15',
    status: 'active' as 'active' | 'closed',
    featured: true,
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleAiGenerate = async () => {
    if (!jobForm.title) {
      alert('প্রথমে জবের টাইটেল লিখুন!');
      return;
    }
    setIsGeneratingAi(true);
    setAiNotice('');
    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        setTimeout(() => {
          setJobForm((prev) => ({
            ...prev,
            description: `${jobForm.title} পদের জন্য অভিজ্ঞ ও মেধা সম্পন্ন প্রার্থী আহ্বান করা হচ্ছে। বাংলাদেশে আকর্ষণীয় কর্মপরিবেশে কাজ করার সুযোগ রয়েছে।`,
            requirementsText: `• ${jobForm.title} পদে ন্যূনতম বাস্তব অভিজ্ঞতা\n• সমস্যা সমাধানের দক্ষতা ও যোগাযোগে পারদর্শিতা\n• সংশ্লিষ্ট বিষয়ভিত্তিক শিক্ষাগত যোগ্যতা`,
            responsibilitiesText: `• প্রধান কাজ ও প্রকল্প বাস্তবায়ন পরিচালনা করা\n• টিম লিডার ও কর্মকর্তাদের সাথে নিয়মিত কাজের সমন্বয় রাখা`,
          }));
          setIsGeneratingAi(false);
          setAiNotice('AI টেমপ্লেট থেকে সফলভাবে বর্ণনা জেনারেট হয়েছে!');
        }, 600);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a professional job description in Bengali for "${jobForm.title}" in category "${jobForm.category}" in Bangladesh.`,
      });

      const text = response.text || '';
      setJobForm((prev) => ({
        ...prev,
        description: text.slice(0, 300) + '...',
      }));
      setAiNotice('AI সাফল্যজনকভাবে বিবরণ তৈরি করেছে!');
    } catch (err) {
      console.error(err);
      setAiNotice('টেমপ্লেট থেকে ডেসক্রিপশন তৈরি করা হয়েছে।');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requirements = jobForm.requirementsText
      .split('\n')
      .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    const responsibilities = jobForm.responsibilitiesText
      .split('\n')
      .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    if (editingJob) {
      updateJob({
        ...editingJob,
        title: jobForm.title,
        company: jobForm.company,
        companyLogo: jobForm.companyLogo,
        location: jobForm.location,
        jobType: jobForm.jobType,
        category: jobForm.category,
        salaryRange: jobForm.salaryRange,
        experienceLevel: jobForm.experienceLevel,
        description: jobForm.description,
        requirements,
        responsibilities,
        deadline: jobForm.deadline,
        status: jobForm.status,
        featured: jobForm.featured,
      });
      setFormSuccess('সার্কুলার আপডেট সম্পন্ন হয়েছে!');
      setEditingJob(null);
    } else {
      addJob({
        title: jobForm.title,
        company: jobForm.company,
        companyLogo: jobForm.companyLogo,
        location: jobForm.location,
        jobType: jobForm.jobType,
        category: jobForm.category,
        salaryRange: jobForm.salaryRange,
        experienceLevel: jobForm.experienceLevel,
        description: jobForm.description,
        requirements,
        responsibilities,
        deadline: jobForm.deadline,
        status: jobForm.status,
        featured: jobForm.featured,
      });
      setFormSuccess('নতুন সার্কুলার সফলভাবে লাইভ প্রকাশিত হয়েছে!');
    }

    setJobForm({
      title: '',
      company: 'ShafinBD Tech',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      location: 'Dhaka (Hybrid)',
      jobType: 'Full-time',
      category: 'Govt. Job',
      salaryRange: '৳50,000 - ৳75,000 / month',
      experienceLevel: 'Mid Level',
      description: '',
      requirementsText: '• 2+ years relevant experience\n• Strong communication skills',
      responsibilitiesText: '• Execute daily tasks and deliverables',
      deadline: '2026-09-15',
      status: 'active',
      featured: true,
    });

    setTimeout(() => setFormSuccess(''), 4000);
  };

  const startEditJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo || '',
      location: job.location,
      jobType: job.jobType,
      category: job.category,
      salaryRange: job.salaryRange,
      experienceLevel: job.experienceLevel,
      description: job.description,
      requirementsText: job.requirements.map((r) => `• ${r}`).join('\n'),
      responsibilitiesText: job.responsibilities.map((r) => `• ${r}`).join('\n'),
      deadline: job.deadline,
      status: job.status,
      featured: job.featured,
    });
    setActiveAdminTab('post');
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">এডমিন প্যানেল (Admin Management)</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
                Admin Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">নতুন জব ও সার্কুলার পোস্ট করুন • সক্রিয় এডমিন: <span className="text-emerald-400 font-bold">{currentAdminEmail}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAllData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 text-xs font-semibold"
          >
            ডাটা রিসেট
          </button>
          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
          >
            এডমিন এক্সিট
          </button>
        </div>
      </div>

      <AdminStats
        totalJobs={jobs.length}
        activeJobs={activeJobsCount}
        totalApplications={applications.length}
        pendingApplications={pendingAppsCount}
      />

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveAdminTab('post')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeAdminTab === 'post' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>নতুন জব পোস্ট করুন</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('jobs')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeAdminTab === 'jobs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-600" />
          <span>জব লিস্ট ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('applications')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeAdminTab === 'applications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>আবেদনপত্র ({applications.length})</span>
        </button>
      </div>

      {activeAdminTab === 'post' && (
        <JobForm
          editingJob={editingJob}
          setEditingJob={setEditingJob}
          jobForm={jobForm}
          setJobForm={setJobForm}
          handleFormSubmit={handleFormSubmit}
          handleAiGenerate={handleAiGenerate}
          isGeneratingAi={isGeneratingAi}
          aiNotice={aiNotice}
          formSuccess={formSuccess}
        />
      )}

      {activeAdminTab === 'jobs' && (
        <AdminJobsTable
          jobs={jobs}
          startEditJob={startEditJob}
          deleteJob={deleteJob}
          toggleJobStatus={toggleJobStatus}
          toggleJobFeatured={toggleJobFeatured}
        />
      )}

      {activeAdminTab === 'applications' && (
        <AdminApplicationsTable
          applications={applications}
          updateApplicationStatus={updateApplicationStatus}
        />
      )}
    </div>
  );
};
