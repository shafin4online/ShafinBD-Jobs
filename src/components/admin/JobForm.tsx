import React from 'react';
import { Job, JobCategory, JobType, ExperienceLevel } from '../../types';
import { useJobContext } from '../../context/JobContext';
import { Sparkles, Save, RotateCcw } from 'lucide-react';

interface JobFormProps {
  editingJob: Job | null;
  setEditingJob: (job: Job | null) => void;
  jobForm: any;
  setJobForm: (form: any) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  handleAiGenerate: () => void;
  isGeneratingAi: boolean;
  aiNotice: string;
  formSuccess: string;
}

export const JobForm: React.FC<JobFormProps> = ({
  editingJob,
  setEditingJob,
  jobForm,
  setJobForm,
  handleFormSubmit,
  handleAiGenerate,
  isGeneratingAi,
  aiNotice,
  formSuccess,
}) => {
  const { categoriesList } = useJobContext();

  return (
    <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            {editingJob ? 'সম্পাদনা করুন (Edit Job Posting)' : 'নতুন জব সার্কুলার প্রকাশ করুন (Post New Job)'}
          </h3>
          <p className="text-xs text-slate-500">সরকারি, বেসরকারি চাকরি বা ভর্তি বিজ্ঞপ্তি ডাটাবেজে যুক্ত করুন</p>
        </div>

        {editingJob && (
          <button
            type="button"
            onClick={() => {
              setEditingJob(null);
              setJobForm({
                title: '',
                company: 'ShafinBD Tech',
                companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
                location: 'Dhaka (Hybrid)',
                jobType: 'Full-time',
                category: categoriesList[0] || 'Software & IT',
                salaryRange: '৳50,000 - ৳75,000 / month',
                experienceLevel: 'Mid Level',
                description: '',
                requirementsText: '• 2+ years relevant experience\n• Strong communication skills',
                responsibilitiesText: '• Execute daily tasks and deliverables',
                deadline: '2026-09-15',
                status: 'active',
                featured: true,
              });
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>বাতিল করুন</span>
          </button>
        )}
      </div>

      {formSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
          ✅ {formSuccess}
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">জব টাইটেল (Job Title) *</label>
          <input
            type="text"
            required
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            placeholder="যেমন: Senior React Developer / সহকারী শিক্ষক"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">কোম্পানি / প্রতিষ্ঠানের নাম *</label>
          <input
            type="text"
            required
            value={jobForm.company}
            onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
            placeholder="যেমন: Bangladesh Bank / ShafinBD Tech"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি (Category) *</label>
          <select
            value={jobForm.category}
            onChange={(e) => setJobForm({ ...jobForm, category: e.target.value as JobCategory })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">জব টাইপ (Job Type)</label>
          <select
            value={jobForm.jobType}
            onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value as JobType })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">লোকেশন (Location) *</label>
          <input
            type="text"
            required
            value={jobForm.location}
            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
            placeholder="Dhaka, Bangladesh"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">বেতন স্কেল (Salary Range)</label>
          <input
            type="text"
            value={jobForm.salaryRange}
            onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
            placeholder="৳৫০,০০০ - ৳৭৫,০০০ / মাস"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">আবেদনের শেষ তারিখ (Deadline)</label>
          <input
            type="date"
            value={jobForm.deadline}
            onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ফিচার্ড সার্ভিস (Featured)</label>
          <select
            value={jobForm.featured ? 'yes' : 'no'}
            onChange={(e) => setJobForm({ ...jobForm, featured: e.target.value === 'yes' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          >
            <option value="yes">হ্যাঁ (Featured Top)</option>
            <option value="no">না (Regular)</option>
          </select>
        </div>
      </div>

      {/* AI Generate Prompt Box */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI অটো-ডেসক্রিপশন জেনারেটর</span>
          </h4>
          <p className="text-[11px] text-emerald-700 mt-0.5">টাইটেল অনুযায়ী AI দিয়ে বিবরণ তৈরি করুন</p>
          {aiNotice && <p className="text-[10px] text-emerald-800 font-bold mt-1">{aiNotice}</p>}
        </div>

        <button
          type="button"
          onClick={handleAiGenerate}
          disabled={isGeneratingAi}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGeneratingAi ? 'জেনারেট হচ্ছে...' : 'AI বিবরণ জেনারেট'}</span>
        </button>
      </div>

      {/* Description & Text Areas */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">জব ডেসক্রিপশন (Job Description) *</label>
        <textarea
          rows={3}
          required
          value={jobForm.description}
          onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
          placeholder="সার্কুলারের মূল বিষয়বস্তু লিখুন..."
          className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">আবেদনের যোগ্যতা (Requirements - newline separated)</label>
          <textarea
            rows={3}
            value={jobForm.requirementsText}
            onChange={(e) => setJobForm({ ...jobForm, requirementsText: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">দায়িত্বসমূহ (Responsibilities - newline separated)</label>
          <textarea
            rows={3}
            value={jobForm.responsibilitiesText}
            onChange={(e) => setJobForm({ ...jobForm, responsibilitiesText: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{editingJob ? 'সার্কুলার আপডেট করুন' : 'সার্কুলার পাবলিশ করুন'}</span>
        </button>
      </div>
    </form>
  );
};
