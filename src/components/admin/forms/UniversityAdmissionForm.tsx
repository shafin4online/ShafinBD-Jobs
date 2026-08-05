import React from 'react';
import { GraduationCap } from 'lucide-react';

interface FormProps {
  jobForm: any;
  setJobForm: React.Dispatch<React.SetStateAction<any>>;
}

export const UniversityAdmissionForm: React.FC<FormProps> = ({ jobForm, setJobForm }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-extrabold text-purple-800">
        <GraduationCap className="w-4 h-4 text-purple-600" />
        <span>বিশ্ববিদ্যালয় ভর্তি পোস্ট ফরম (University Admission Fields)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Title - Mandatory */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            টাইটেল (Notice Title) <span className="text-rose-600 font-extrabold">* (অবশ্যই/বাধ্যতামূলক)</span>
          </label>
          <input
            type="text"
            required
            value={jobForm.title || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, title: e.target.value }))}
            placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় 'ক' ইউনিট স্নাতক ভর্তি পরীক্ষা ২০২৬"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Institution Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম (University / Institute)</label>
          <input
            type="text"
            value={jobForm.company || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, company: e.target.value }))}
            placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় (DU)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
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

        {/* Deadline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">আবেদনের শেষ তারিখ (Deadline)</label>
          <input
            type="date"
            value={jobForm.deadline || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, deadline: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Application Link */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">আবেদনের লিংক (Admission Link)</label>
          <input
            type="url"
            value={jobForm.applicationUrl || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, applicationUrl: e.target.value }))}
            placeholder="https://admission.eis.du.ac.bd"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>
      </div>

      {/* Details */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত (Details)</label>
        <textarea
          rows={4}
          value={jobForm.description || ''}
          onChange={(e) => setJobForm((prev: any) => ({ ...prev, description: e.target.value }))}
          placeholder="ভর্তি সার্কুলার সংক্রান্ত ইউনিট বিবরণী, আবেদনের যোগ্যতা ও পরীক্ষা কেন্দ্র..."
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium"
        />
      </div>
    </div>
  );
};
