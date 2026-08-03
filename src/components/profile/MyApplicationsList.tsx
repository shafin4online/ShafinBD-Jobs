import React from 'react';
import { JobApplication } from '../../types';
import { Clock, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

interface MyApplicationsListProps {
  applications: JobApplication[];
}

export const MyApplicationsList: React.FC<MyApplicationsListProps> = ({ applications }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'Hired':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">এখনো কোনো পদে আবেদন করা হয়নি</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          হোমপেজের সার্কুলার থেকে আপনার যোগ্যতার চাকরি খুঁজে নিয়ে ১-ক্লিকে আবেদন করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>আপনার জমাকৃত চাকরি আবেদন তালিকা</span>
        </h3>
        <p className="text-xs text-slate-500">নিয়োগকর্তা কর্তৃক আপডেটেড বর্তমান অবস্থা এখানে রিয়েল-টাইমে আপডেট দেখাবে</p>
      </div>

      <div className="divide-y divide-slate-100">
        {applications.map((app) => (
          <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{app.jobTitle}</h4>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">{app.companyName}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  আবেদনের তারিখ: {new Date(app.appliedAt).toLocaleDateString('bn-BD')}
                </span>
                <span>•</span>
                <span>মোবাইল: {app.userPhone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs border ${getStatusBadge(app.status)}`}>
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
