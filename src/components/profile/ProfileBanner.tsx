import React from 'react';
import { useJobContext } from '../../context/JobContext';
import { User, CheckCircle2 } from 'lucide-react';

interface ProfileBannerProps {
  activeSubTab: 'profile' | 'applications' | 'saved';
  setActiveSubTab: (tab: 'profile' | 'applications' | 'saved') => void;
  formData: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
  };
  applicationsCount: number;
  savedJobsCount: number;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  activeSubTab,
  setActiveSubTab,
  formData,
  applicationsCount,
  savedJobsCount,
}) => {
  const { authUser, signInWithGoogle } = useJobContext();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
      <div className="flex items-center gap-4">
        {authUser?.photoURL ? (
          <img
            src={authUser.photoURL}
            alt={authUser.displayName || 'Google Profile'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg shadow-emerald-600/30"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-600/30">
            {formData.fullName ? formData.fullName.charAt(0) : 'S'}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-white">{formData.fullName || 'Job Seeker Profile'}</h2>
            {authUser ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Gmail Verified
              </span>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Connect Gmail
              </button>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1">{formData.title || 'পেশাগত পদবী উল্লেখ করুন'}</p>
          <p className="text-xs text-slate-400 mt-0.5">{formData.email} • {formData.phone || 'মোবাইল যুক্ত করা হয়নি'}</p>
        </div>
      </div>

      {/* Subtab Toggle Buttons */}
      <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 w-full md:w-auto">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          প্রোফাইল সম্পাদন
        </button>
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'applications'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          আমার আবেদন ({applicationsCount})
        </button>
        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'saved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          সংরক্ষিত ({savedJobsCount})
        </button>
      </div>
    </div>
  );
};
