import React, { useState } from 'react';
import { Award, Search, AlertCircle } from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { JobCard } from '../JobCard';

export const ExamResultsPage: React.FC = () => {
  const { jobs } = useJobContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Strictly filter jobs created from Admin Panel with postType 'exam-result' or category 'Exam Result'
  const examJobs = jobs.filter(
    (job) =>
      job.postType === 'exam-result' ||
      job.category === 'Exam Result'
  );

  const filteredExamJobs = examJobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      (job.description && job.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 mx-3 sm:mx-0 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>পরীক্ষার রেজাল্ট (Exam Results)</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                {filteredExamJobs.length}
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              এডমিন প্যানেল থেকে প্রকাশিত সকল পরীক্ষার রেজাল্ট ও পোস্ট
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রেজাল্ট পোস্ট খুঁজুন..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      {/* Results Grid */}
      {filteredExamJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">কোনো পরীক্ষার রেজাল্ট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            এডমিন প্যানেল থেকে "পরীক্ষার রেজাল্ট" সিলেক্ট করে নতুন পোস্ট দেওয়া হলে তা এখানে দেখাবে।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-5">
          {filteredExamJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};
