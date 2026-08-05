import React from 'react';
import { Building2 } from 'lucide-react';

interface FormProps {
  jobForm: any;
  setJobForm: React.Dispatch<React.SetStateAction<any>>;
}

export const GovtJobForm: React.FC<FormProps> = ({ jobForm, setJobForm }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-extrabold text-emerald-800">
        <Building2 className="w-4 h-4 text-emerald-600" />
        <span>সরকারি চাকরি পোস্ট ফরম (Government Job Fields)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Job Title - Mandatory */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            জব টাইটেল (Job Title) <span className="text-rose-600 font-extrabold">* (বাধ্যতামূলক)</span>
          </label>
          <input
            type="text"
            required
            value={jobForm.title || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, title: e.target.value }))}
            placeholder="যেমন: ৪৭তম বিসিএস ক্যাডার নিয়োগ বিজ্ঞপ্তি ২০২৬"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Deadline - Mandatory */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            আবেদনের শেষ তারিখ (Deadline) <span className="text-rose-600 font-extrabold">* (বাধ্যতামূলক)</span>
          </label>
          <input
            type="date"
            required
            value={jobForm.deadline || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, deadline: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Application Start Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">আবেদন শুরু (Start Date)</label>
          <input
            type="date"
            value={jobForm.startDate || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Organization / Ministry Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম (Organization / Ministry)</label>
          <input
            type="text"
            value={jobForm.company || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, company: e.target.value }))}
            placeholder="যেমন: বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Designation / Post Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">পদের নাম (Designation / Position)</label>
          <input
            type="text"
            value={jobForm.position || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, position: e.target.value }))}
            placeholder="যেমন: সহকারী শিক্ষক / সহকারী পরিচালক"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Number of Vacancies */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">পদের সংখ্যা (Number of Vacancies)</label>
          <input
            type="text"
            value={jobForm.vacancies || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, vacancies: e.target.value }))}
            placeholder="যেমন: ৩,৪৮০ জন"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Application Fee */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">আবেদন ফি (Application Fee)</label>
          <input
            type="text"
            value={jobForm.applicationFee || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, applicationFee: e.target.value }))}
            placeholder="যেমন: ৭০০ টাকা (টেলিটক সার্ভিস চার্জসহ)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Application Link */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">আবেদনের লিংক (Apply Link)</label>
          <input
            type="url"
            value={jobForm.applicationUrl || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, applicationUrl: e.target.value }))}
            placeholder="https://bpsc.teletalk.com.bd"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Full Circular Link */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            সম্পূর্ণ নিয়োগ বিজ্ঞপ্তি বাটন লিংক (Full Circular Link)
          </label>
          <input
            type="url"
            value={jobForm.circularUrl || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, circularUrl: e.target.value }))}
            placeholder="https://example.com/circular.pdf"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Job Description (বিবরণ)</label>
        <textarea
          rows={4}
          value={jobForm.description || ''}
          onChange={(e) => setJobForm((prev: any) => ({ ...prev, description: e.target.value }))}
          placeholder="সরকারি চাকরির আবেদনের শর্তাবলী ও বিস্তারিত বিবরণ লিখুন..."
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium"
        />
      </div>
    </div>
  );
};
