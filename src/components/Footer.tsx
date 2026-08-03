import React from 'react';
import { useJobContext } from '../context/JobContext';
import { Briefcase } from 'lucide-react';
import { t } from '../translations';

export const Footer: React.FC = () => {
  const { setActiveTab, lang } = useJobContext();

  return (
    <footer className="mt-16 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          {/* Brand */}
          <div className="space-y-2">
            <div
              onClick={() => setActiveTab('jobs')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                ShafinBD<span className="text-emerald-500">Jobs</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm">
              {t('subTitle', lang)}
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-semibold text-slate-300">
            <button onClick={() => setActiveTab('jobs')} className="hover:text-emerald-400">
              {t('homeDashboard', lang)}
            </button>
            <button onClick={() => setActiveTab('profile')} className="hover:text-emerald-400">
              {t('candidateProfile', lang)}
            </button>
            <button onClick={() => setActiveTab('applications')} className="hover:text-emerald-400">
              {t('myApplications', lang)}
            </button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-400">
              {t('employerLogin', lang)}
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {t('footerCopyright', lang)}</p>
        </div>
      </div>
    </footer>
  );
};
