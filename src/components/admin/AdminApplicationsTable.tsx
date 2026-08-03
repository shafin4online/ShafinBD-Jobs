import React from 'react';
import { JobApplication, ApplicationStatus } from '../../types';
import { Mail, Phone, Clock } from 'lucide-react';

interface AdminApplicationsTableProps {
  applications: JobApplication[];
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
}

export const AdminApplicationsTable: React.FC<AdminApplicationsTableProps> = ({
  applications,
  updateApplicationStatus,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">সকল চাকরির আবেদনপত্র ({applications.length} টি)</h3>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 font-medium">
          এখনো কোনো প্রার্থী আবেদন জমা দেয়নি।
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">প্রার্থীর নাম & ইমেইল</th>
                <th className="p-3.5">আবেদনকৃত পদ</th>
                <th className="p-3.5">আবেদনের তারিখ</th>
                <th className="p-3.5">স্ট্যাটাস পরিবর্তন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{app.userName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {app.userEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {app.userPhone}
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-emerald-800">{app.jobTitle}</div>
                    <div className="text-[11px] text-slate-500">{app.companyName}</div>
                  </td>

                  <td className="p-3.5 text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(app.appliedAt).toLocaleDateString('bn-BD')}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
