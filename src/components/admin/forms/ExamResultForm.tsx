import React from 'react';
import { Award } from 'lucide-react';

interface FormProps {
  jobForm: any;
  setJobForm: React.Dispatch<React.SetStateAction<any>>;
}

export const ExamResultForm: React.FC<FormProps> = ({ jobForm, setJobForm }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-extrabold text-amber-800">
        <Award className="w-4 h-4 text-amber-600" />
        <span>পরীক্ষার রেজাল্ট পোস্ট ফরম (Exam Result Fields)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Title - Mandatory */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            টাইটেল (Result Title) <span className="text-rose-600 font-extrabold">* (বাধ্যতামূলক)</span>
          </label>
          <input
            type="text"
            required
            value={jobForm.title || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, title: e.target.value }))}
            placeholder="যেমন: ৪৬তম বিসিএস প্রিলিমিনারি পরীক্ষার ফলাফল ও নির্দেশিকা"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Organization / Institute Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম (Institute / Board)</label>
          <input
            type="text"
            value={jobForm.company || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, company: e.target.value }))}
            placeholder="যেমন: বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Result Release Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">প্রকাশের তারিখ (Result Release Date)</label>
          <input
            type="date"
            value={jobForm.resultDate || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, resultDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Exam Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার তারিখ (Exam Date)</label>
          <input
            type="date"
            value={jobForm.examDate || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, examDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Passed Count */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">উত্তীর্ণ সংখ্যা (Passed Candidates Count)</label>
          <input
            type="text"
            value={jobForm.passedCount || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, passedCount: e.target.value }))}
            placeholder="যেমন: ১০,৬৩৮ জন উত্তীর্ণ"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* Written Exam Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">লিখিত পরীক্ষার তারিখ (Written Exam Date)</label>
          <input
            type="date"
            value={jobForm.writtenExamDate || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, writtenExamDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>

        {/* View Full Result Link */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            সম্পূর্ণ রেজাল্ট দেখুন বাটন লিংক (Full Result Link)
          </label>
          <input
            type="url"
            value={jobForm.circularUrl || ''}
            onChange={(e) => setJobForm((prev: any) => ({ ...prev, circularUrl: e.target.value }))}
            placeholder="https://bpsc.gov.bd/result.pdf"
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
          placeholder="পরীক্ষার ফলাফল সংক্রান্ত নির্দেশাবলী ও পরবর্তী ধাপের বিবরণ..."
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium"
        />
      </div>
    </div>
  );
};
