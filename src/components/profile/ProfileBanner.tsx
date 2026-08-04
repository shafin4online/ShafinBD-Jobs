import React from 'react';
import { UserCheck, Sparkles, Download, Eye, FileText, Bookmark } from 'lucide-react';

interface ProfileBannerProps {
  activeSubTab: 'profile' | 'applications' | 'saved';
  setActiveSubTab: (tab: 'profile' | 'applications' | 'saved') => void;
  formData: any;
  completeness: number;
  applicationsCount: number;
  savedJobsCount: number;
  isEditingProfile: boolean;
  setIsEditingProfile: (editing: boolean) => void;
  onDownloadCvClick: () => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  activeSubTab,
  setActiveSubTab,
  formData,
  completeness,
  applicationsCount,
  savedJobsCount,
  isEditingProfile,
  setIsEditingProfile,
  onDownloadCvClick,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
      
      {/* Top Header Row: User Profile Title + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>User Profile</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {formData.fullName ? `${formData.fullName} - এর প্রোফাইল বিবরণ` : 'আপনার ব্যক্তিগত ও শিক্ষাগত তথ্যাবলী আপডেট করুন'}
          </p>
        </div>

        {/* Action Buttons: Download CV & View Profile */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={onDownloadCvClick}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('profile');
              setIsEditingProfile(false);
            }}
            className={`flex-1 sm:flex-none px-4 py-2.5 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              activeSubTab === 'profile' && !isEditingProfile
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-500" />
            <span>View Profile</span>
          </button>
        </div>
      </div>

      {/* Real-Time Profile Completeness Progress Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>প্রোফাইল পূর্ণতা (Profile Completeness)</span>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">{completeness}%</span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${completeness}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span>{completeness === 100 ? '🎉 আপনার প্রোফাইল সম্পূর্ণ তথ্য সমৃদ্ধ!' : 'চাকরির সহজে আবেদন করার জন্য প্রতিটি সেকশন পূরণ করুন'}</span>
          <span>{completeness}% Completed</span>
        </div>
      </div>

      {/* Subtab Navigation Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>প্রোফাইল বিবরণ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'applications'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span>আমার আবেদন ({applicationsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('saved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'saved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-500" />
          <span>সংরক্ষিত সার্কুলার ({savedJobsCount})</span>
        </button>
      </div>

    </div>
  );
};
