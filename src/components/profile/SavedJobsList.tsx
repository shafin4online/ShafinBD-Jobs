import React from 'react';
import { Job } from '../../types';
import { JobCard } from '../JobCard';
import { Bookmark } from 'lucide-react';

interface SavedJobsListProps {
  jobs: Job[];
}

export const SavedJobsList: React.FC<SavedJobsListProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
        <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">কোনো চাকরি সংরক্ষিত নেই</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          পছন্দের জব সার্কুলারের বুকমার্ক আইকনে ক্লিক করে পরবর্তীতে দেখার জন্য সেভ করে রাখতে পারেন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>আপনার বুকমার্ককৃত সংরক্ষিত সার্কুলারসমূহ ({jobs.length} টি)</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
