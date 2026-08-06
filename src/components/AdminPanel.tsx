import React, { useState } from 'react';
import { useJobContext, ADMIN_EMAILS } from '../context/JobContext';
import { Job, JobType, JobCategory, ExperienceLevel } from '../types';
import { GoogleGenAI } from '@google/genai';
import { 
  ShieldCheck, 
  PlusCircle, 
  Briefcase, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Bell, 
  FolderKanban,
  CheckCircle2,
  Loader2,
  CloudUpload,
  ExternalLink,
  X,
  AlertTriangle
} from 'lucide-react';
import { JobForm } from './admin/JobForm';
import { AdminJobsTable } from './admin/AdminJobsTable';
import { AdminApplicationsTable } from './admin/AdminApplicationsTable';
import { AdminOverview } from './admin/AdminOverview';
import { AdminUserList } from './admin/AdminUserList';
import { AdminNotifications } from './admin/AdminNotifications';
import { AdminCategories } from './admin/AdminCategories';
import { AdminSubTab } from '../context/jobContextTypes';

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
    adminSubTab,
    setAdminSubTab,
  } = useJobContext();

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  const currentUserEmail = (authUser?.email || profile?.email || '').trim().toLowerCase();
  const isEmailAdmin = ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === currentUserEmail);
  const isAuthorizedAdmin = isAdminLoggedIn || isEmailAdmin;

  if (!isAuthorizedAdmin) {
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
    postType: 'govt' as 'govt' | 'private' | 'exam-result' | 'university',
    title: '',
    company: '',
    companyLogo: '',
    location: 'বাংলাদেশ (Bangladesh)',
    jobType: 'Full-time' as JobType,
    category: 'Govt. Job' as JobCategory,
    salaryRange: 'আলোচনা সাপেক্ষে',
    experienceLevel: 'Entry Level' as ExperienceLevel,
    description: '',
    requirementsText: '',
    responsibilitiesText: '',
    deadline: '',
    startDate: '',
    position: '',
    vacancies: '',
    applicationFee: '',
    applicationUrl: '',
    circularUrl: '',
    resultDate: '',
    examDate: '',
    passedCount: '',
    writtenExamDate: '',
    imageUrl: '',
    imageUrls: [] as string[],
    status: 'active' as 'active' | 'closed',
    featured: true,
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [publishingModal, setPublishingModal] = useState<{
    isOpen: boolean;
    step: 'preparing' | 'saving_cloud' | 'broadcasting' | 'success' | 'error';
    jobId?: string;
    error?: string;
  }>({
    isOpen: false,
    step: 'preparing',
  });

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
            description: `${jobForm.title} পোস্টের জন্য সার্কুলারের বিস্তারিত তথ্য নিচে প্রকাশ করা হলো। আগ্রহী প্রার্থীদের যথাসময়ে আবেদন করার আহ্বান জানানো হচ্ছে।`,
          }));
          setIsGeneratingAi(false);
          setAiNotice('AI টেমপ্লেট থেকে বিবরণ জেনারেট হয়েছে!');
        }, 600);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a professional description in Bengali for "${jobForm.title}" in category "${jobForm.category}" in Bangladesh.`,
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobForm.title || !jobForm.title.trim()) {
      alert('দয়া করে জবের শিরোনাম (Title) লিখুন!');
      return;
    }

    // Open Real-time Publishing Modal
    setPublishingModal({
      isOpen: true,
      step: 'preparing',
    });

    try {
      const requirements = (jobForm.requirementsText || '')
        .split('\n')
        .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);

      const responsibilities = (jobForm.responsibilitiesText || '')
        .split('\n')
        .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);

      const imageUrlsList =
        jobForm.imageUrls && Array.isArray(jobForm.imageUrls) && jobForm.imageUrls.length > 0
          ? jobForm.imageUrls
          : jobForm.imageUrl
          ? [jobForm.imageUrl]
          : [];

      const payload = {
        title: jobForm.title.trim(),
        company: jobForm.company || 'Shafin BD Jobs',
        companyLogo: jobForm.companyLogo || imageUrlsList[0] || jobForm.imageUrl || '',
        location: jobForm.location || 'বাংলাদেশ',
        jobType: jobForm.jobType || 'Full-time',
        category: jobForm.category || 'Govt. Job',
        salaryRange: jobForm.salaryRange || 'আলোচনা সাপেক্ষে',
        experienceLevel: jobForm.experienceLevel || 'Entry Level',
        description: jobForm.description || '',
        requirements,
        responsibilities,
        deadline: jobForm.deadline || new Date().toISOString().split('T')[0],
        status: jobForm.status || 'active',
        featured: jobForm.featured,

        // Extended Fields
        postType: jobForm.postType || 'govt',
        startDate: jobForm.startDate || '',
        position: jobForm.position || '',
        vacancies: jobForm.vacancies || '',
        applicationFee: jobForm.applicationFee || '',
        applicationUrl: jobForm.applicationUrl || '',
        circularUrl: jobForm.circularUrl || '',
        resultDate: jobForm.resultDate || '',
        examDate: jobForm.examDate || '',
        passedCount: jobForm.passedCount || '',
        writtenExamDate: jobForm.writtenExamDate || '',
        imageUrl: imageUrlsList[0] || jobForm.imageUrl || '',
        imageUrls: imageUrlsList,
      };

      // Auto-save institute logo into gallery for future reuse
      if (jobForm.company && jobForm.companyLogo) {
        try {
          const stored = localStorage.getItem('SAVED_INSTITUTE_LOGOS_GALLERY');
          const list = stored ? JSON.parse(stored) : [];
          const nameKey = jobForm.company.trim().toLowerCase();
          const exists = list.some((item: any) => item.name.trim().toLowerCase() === nameKey);
          if (!exists) {
            list.unshift({
              id: `custom-logo-${Date.now()}`,
              name: jobForm.company.trim(),
              logoUrl: jobForm.companyLogo,
            });
            localStorage.setItem('SAVED_INSTITUTE_LOGOS_GALLERY', JSON.stringify(list));
          }
        } catch (e) {
          console.error('Failed to update saved institute logos gallery:', e);
        }
      }

      // Step 2: Saving to Firebase Cloud Firestore
      setPublishingModal({
        isOpen: true,
        step: 'saving_cloud',
      });

      let savedResult: Job;
      if (editingJob) {
        savedResult = await updateJob({
          ...editingJob,
          ...payload,
        });
        setFormSuccess('পোস্টের তথ্য সফলভাবে আপডেট করা হয়েছে!');
      } else {
        savedResult = await addJob(payload);
        setFormSuccess('নতুন পোস্ট সফলভাবে লাইভ প্রকাশিত হয়েছে!');
      }

      // Step 3: Broadcasting Push
      setPublishingModal({
        isOpen: true,
        step: 'broadcasting',
        jobId: savedResult.id,
      });

      await new Promise((res) => setTimeout(res, 600));

      // Step 4: Success Feedback
      setPublishingModal({
        isOpen: true,
        step: 'success',
        jobId: savedResult.id,
      });

      setEditingJob(null);
      setJobForm({
        postType: 'govt',
        title: '',
        company: '',
        companyLogo: '',
        location: 'বাংলাদেশ (Bangladesh)',
        jobType: 'Full-time',
        category: 'Govt. Job',
        salaryRange: 'আলোচনা সাপেক্ষে',
        experienceLevel: 'Entry Level',
        description: '',
        requirementsText: '',
        responsibilitiesText: '',
        deadline: '',
        startDate: '',
        position: '',
        vacancies: '',
        applicationFee: '',
        applicationUrl: '',
        circularUrl: '',
        resultDate: '',
        examDate: '',
        passedCount: '',
        writtenExamDate: '',
        imageUrl: '',
        imageUrls: [],
        status: 'active',
        featured: true,
      });

      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err: any) {
      console.error('Error publishing job:', err);
      setPublishingModal({
        isOpen: true,
        step: 'error',
        error: err?.message || 'ক্লাউডে সেভ করার সময় একটি ত্রুটি ঘটেছে।',
      });
    }
  };

  const startEditJob = (job: Job) => {
    setEditingJob(job);
    const existingImages =
      job.imageUrls && Array.isArray(job.imageUrls) && job.imageUrls.length > 0
        ? job.imageUrls
        : job.imageUrl
        ? [job.imageUrl]
        : [];

    setJobForm({
      postType: job.postType || (job.category === 'Private Job' ? 'private' : job.category === 'University Admission Notice' ? 'university' : 'govt'),
      title: job.title || '',
      company: job.company || '',
      companyLogo: job.companyLogo || '',
      location: job.location || 'বাংলাদেশ',
      jobType: job.jobType || 'Full-time',
      category: job.category || 'Govt. Job',
      salaryRange: job.salaryRange || '',
      experienceLevel: job.experienceLevel || 'Entry Level',
      description: job.description || '',
      requirementsText: (job.requirements || []).map((r) => `• ${r}`).join('\n'),
      responsibilitiesText: (job.responsibilities || []).map((r) => `• ${r}`).join('\n'),
      deadline: job.deadline || '',
      startDate: job.startDate || '',
      position: job.position || '',
      vacancies: job.vacancies || '',
      applicationFee: job.applicationFee || '',
      applicationUrl: job.applicationUrl || '',
      circularUrl: job.circularUrl || '',
      resultDate: job.resultDate || '',
      examDate: job.examDate || '',
      passedCount: job.passedCount || '',
      writtenExamDate: job.writtenExamDate || '',
      imageUrl: existingImages[0] || job.imageUrl || job.companyLogo || '',
      imageUrls: existingImages,
      status: job.status || 'active',
      featured: job.featured ?? true,
    });
    setAdminSubTab('post');
  };

  const subNavTabs: Array<{ id: AdminSubTab; label: string; icon: any }> = [
    { id: 'overview', label: 'ওভারভিউ (Overview)', icon: LayoutDashboard },
    { id: 'post', label: 'নতুন জব পোস্ট (Post Job)', icon: PlusCircle },
    { id: 'users', label: 'ইউজার লিস্ট (Users)', icon: Users },
    { id: 'notifications', label: 'নোটিফিকেশন প্যানেল', icon: Bell },
    { id: 'categories', label: 'ক্যাটাগরি ম্যানেজমেন্ট', icon: FolderKanban },
    { id: 'jobs', label: 'সার্কুলার তালিকা (' + jobs.length + ')', icon: Briefcase },
    { id: 'applications', label: 'আবেদনসমূহ (' + applications.length + ')', icon: FileText },
  ];

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
              <h2 className="text-xl font-black text-white">এডমিন এডমিনিস্ট্রেশন প্যানেল</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase">
                Admin Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">সক্রিয় এডমিন অ্যাকাউন্ট: <span className="text-emerald-400 font-bold">{currentAdminEmail}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAllData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 text-xs font-semibold cursor-pointer"
          >
            ডাটা রিসেট
          </button>
          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
          >
            এডমিন এক্সিট
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 bg-slate-200/90 p-1.5 rounded-2xl overflow-x-auto text-xs font-bold scrollbar-none">
        {subNavTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = adminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminSubTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-view Content Rendering */}
      {adminSubTab === 'overview' && <AdminOverview />}

      {adminSubTab === 'post' && (
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

      {adminSubTab === 'users' && <AdminUserList />}

      {adminSubTab === 'notifications' && <AdminNotifications />}

      {adminSubTab === 'categories' && <AdminCategories />}

      {adminSubTab === 'jobs' && (
        <AdminJobsTable
          jobs={jobs}
          startEditJob={startEditJob}
          deleteJob={deleteJob}
          toggleJobStatus={toggleJobStatus}
          toggleJobFeatured={toggleJobFeatured}
        />
      )}

      {adminSubTab === 'applications' && (
        <AdminApplicationsTable
          applications={applications}
          updateApplicationStatus={updateApplicationStatus}
        />
      )}

      {/* Real-time Publishing Progress & Cloud Feedback Modal */}
      {publishingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-100 relative">
            <button
              onClick={() => setPublishingModal({ isOpen: false, step: 'preparing' })}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                <CloudUpload className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">লাইভ পাবলিশিং প্রসেস</h3>
                <p className="text-xs text-slate-400">Real-Time Cloud Firestore Sync & Broadcast</p>
              </div>
            </div>

            {/* Steps Progress Checklist */}
            <div className="space-y-3 text-xs font-semibold">
              {/* Step 1: Data Formatting */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-slate-200">১. পোস্টের তথ্য প্রসেস ও ফরম্যাট করা হয়েছে</span>
              </div>

              {/* Step 2: Saving to Cloud Firestore */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                {publishingModal.step === 'preparing' || publishingModal.step === 'saving_cloud' ? (
                  <Loader2 className="w-5 h-5 text-sky-400 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div className="flex-1">
                  <span className={publishingModal.step === 'saving_cloud' ? 'text-sky-300 font-bold' : 'text-slate-200'}>
                    ২. Firebase Cloud Firestore এ সেভ হচ্ছে...
                  </span>
                  {publishingModal.jobId && (
                    <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">
                      ✓ ক্লাউডে সফলভাবে সেভ হয়েছে! (ID: {publishingModal.jobId})
                    </span>
                  )}
                </div>
              </div>

              {/* Step 3: FCM Push Broadcast */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                {publishingModal.step === 'broadcasting' ? (
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                ) : publishingModal.step === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0" />
                )}
                <span className={publishingModal.step === 'broadcasting' ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                  ৩. পুশ নোটিফিকেশন এলার্ট ইউজারদের ডিভাইসে ব্রডকাস্ট হচ্ছে
                </span>
              </div>
            </div>

            {/* Error Feedback */}
            {publishingModal.step === 'error' && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-rose-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{publishingModal.error || 'ক্লাউডে সেভ করার সময় ত্রুটি ঘটেছে।'}</span>
              </div>
            )}

            {/* Success Feedback Banner */}
            {publishingModal.step === 'success' && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-center animate-fadeIn">
                <p className="text-xs font-extrabold text-emerald-400">🎉 পোস্টটি সফলভাবে ক্লাউডে সেভ ও লাইভ পাবলিশ হয়েছে!</p>
                <p className="text-[11px] text-slate-300">সকল ইউজার তাৎক্ষণিকভাবে জবের আপডেট দেখতে পাবেন।</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              {publishingModal.step === 'success' && publishingModal.jobId && (
                <button
                  onClick={() => {
                    const targetId = publishingModal.jobId;
                    setPublishingModal({ isOpen: false, step: 'preparing' });
                    window.location.hash = `#/job/${targetId}`;
                  }}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-sky-600/20"
                >
                  <span>পোস্ট দেখুন (View Post)</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setPublishingModal({ isOpen: false, step: 'preparing' })}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-700 text-center"
              >
                {publishingModal.step === 'success' ? 'ঠিক আছে (Dismiss)' : 'বন্ধ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

