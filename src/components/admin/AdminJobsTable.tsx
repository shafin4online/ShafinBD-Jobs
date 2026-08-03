import React from 'react';
import { Job } from '../../types';
import { Edit, Trash2, Eye, Sparkles } from 'lucide-react';

interface AdminJobsTableProps {
  jobs: Job[];
  startEditJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  toggleJobStatus: (id: string) => void;
  toggleJobFeatured: (id: string) => void;
}

export const AdminJobsTable: React.FC<AdminJobsTableProps> = ({
  jobs,
  startEditJob,
  deleteJob,
  toggleJobStatus,
  toggleJobFeatured,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">প্রকাশিত সার্কুলার তালিকা ({jobs.length} টি)</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">জব টাইটেল & কোম্পানি</th>
              <th className="p-3.5">ক্যাটাগরি</th>
              <th className="p-3.5">স্ট্যাটাস</th>
              <th className="p-3.5">আবেদন সংখ্যা</th>
              <th className="p-3.5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{job.title}</div>
                  <div className="text-[11px] text-slate-500">{job.company} • {job.location}</div>
                </td>

                <td className="p-3.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                    {job.category}
                  </span>
                </td>

                <td className="p-3.5">
                  <button
                    onClick={() => toggleJobStatus(job.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                      job.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.status === 'active' ? '● Live' : 'Closed'}
                  </button>
                </td>

                <td className="p-3.5">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {job.applicantCount || 0} জন
                  </span>
                </td>

                <td className="p-3.5 text-right space-x-1">
                  <button
                    onClick={() => toggleJobFeatured(job.id)}
                    title="Toggle Featured"
                    className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                      job.featured
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => startEditJob(job)}
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('নিশ্চিতভাব চাকরি পোস্টটি মুছে ফেলতে চান?')) {
                        deleteJob(job.id);
                      }
                    }}
                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
