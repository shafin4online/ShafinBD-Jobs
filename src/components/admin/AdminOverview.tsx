import React from 'react';
import { useJobContext } from '../../context/JobContext';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Clock, 
  FolderKanban, 
  Bell, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { 
    jobs, 
    applications, 
    userList, 
    categoriesList, 
    notificationsList,
    setAdminSubTab 
  } = useJobContext();

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Overview Top Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">মোট ইউজার</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{userList.length}</p>
          <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>সক্রিয় ক্যান্ডিডেট</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">সক্রিয় জব</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{activeJobsCount}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-1">মোট প্রকাশ: {jobs.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">মোট আবেদন</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{applications.length}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-1">ক্যান্ডিডেট সাবমিশন</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">অপেক্ষমাণ</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingAppsCount}</p>
          <p className="text-[10px] font-medium text-amber-700 mt-1">রিভিউ বাকী</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">ক্যাটাগরি</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{categoriesList.length}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-1">সক্রিয় বিষয়সমূহ</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">নোটিফিকেশন</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{notificationsList.length}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-1">প্রেরিত এলার্ট</p>
        </div>
      </div>

      {/* Quick Admin Actions Grid */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>এডমিন কুইক অ্যাকশন (Quick Management Navigation)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">সহজেই প্ল্যাটফর্মের বিভিন্ন বিভাগ পরিচালনা করতে নিচের অপশন নির্বাচন করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setAdminSubTab('post')}
            className="p-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-left transition-all flex flex-col justify-between shadow-md cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <PlusCircle className="w-5 h-5 text-white" />
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-white">নতুন জব পোস্ট</p>
              <p className="text-[10px] text-emerald-100">সার্কুলার প্রকাশ করুন</p>
            </div>
          </button>

          <button
            onClick={() => setAdminSubTab('users')}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-left transition-all flex flex-col justify-between border border-slate-700 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-blue-400" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-white">ইউজার তালিকা</p>
              <p className="text-[10px] text-slate-400">{userList.length} প্রার্থীর প্রোফাইল</p>
            </div>
          </button>

          <button
            onClick={() => setAdminSubTab('notifications')}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-left transition-all flex flex-col justify-between border border-slate-700 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <Bell className="w-5 h-5 text-amber-400" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-white">নোটিফিকেশন প্যানেল</p>
              <p className="text-[10px] text-slate-400">মেসেজ/এলার্ট ব্রডকাস্ট</p>
            </div>
          </button>

          <button
            onClick={() => setAdminSubTab('categories')}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-left transition-all flex flex-col justify-between border border-slate-700 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <FolderKanban className="w-5 h-5 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-white">ক্যাটাগরি ম্যানেজমেন্ট</p>
              <p className="text-[10px] text-slate-400">{categoriesList.length} ক্যাটাগরি রয়েছে</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Applications & Registered Candidates Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>সাম্প্রতিক আবেদনসমূহ (Recent Applications)</span>
            </h4>
            <button 
              onClick={() => setAdminSubTab('applications')}
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              সবগুলো দেখুন ({applications.length})
            </button>
          </div>

          {applications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">এখনো কোনো আবেদন জমা পড়েনি।</p>
          ) : (
            <div className="space-y-2.5">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{app.userName}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">{app.jobTitle} • <span className="text-slate-500">{app.companyName}</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{app.appliedAt}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    app.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registered Users Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>রেজিস্টার্ড ইউজার তালিকা (Registered Candidates)</span>
            </h4>
            <button 
              onClick={() => setAdminSubTab('users')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              ইউজার ম্যানেজমেন্ট ({userList.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {userList.slice(0, 4).map((user) => (
              <div key={user.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black flex items-center justify-center text-xs shadow-xs">
                    {user.fullName[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg">
                  {user.title || 'Candidate'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
