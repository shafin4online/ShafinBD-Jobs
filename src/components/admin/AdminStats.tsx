import React from 'react';
import { Briefcase, FileText, Users, TrendingUp } from 'lucide-react';

interface AdminStatsProps {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  totalJobs,
  activeJobs,
  totalApplications,
  pendingApplications,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">মোট জব পোস্ট</span>
          <span className="text-lg font-black text-slate-900">{totalJobs}</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">সক্রিয় পোস্ট</span>
          <span className="text-lg font-black text-slate-900">{activeJobs}</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">মোট আবেদন</span>
          <span className="text-lg font-black text-slate-900">{totalApplications}</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">পেন্ডিং আবেদন</span>
          <span className="text-lg font-black text-slate-900">{pendingApplications}</span>
        </div>
      </div>
    </div>
  );
};
