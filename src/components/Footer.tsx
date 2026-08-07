import React from 'react';
import { useJobContext } from '../context/JobContext';
import { t } from '../translations';
import { APP_LOGO_URL } from '../constants';

export const Footer: React.FC = () => {
  const { setActiveTab, lang } = useJobContext();

  return (
    <footer className="mt-16 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div
              onClick={() => setActiveTab('jobs')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={APP_LOGO_URL} 
                  alt="ShafinBD Jobs Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                ShafinBD<span className="text-emerald-500">Jobs</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm">
              {t('subTitle', lang)}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-semibold text-slate-300">
            <button onClick={() => setActiveTab('privacy-policy')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              {t('privacyPolicy', lang)}
            </button>
            <button onClick={() => setActiveTab('terms')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              {t('termsOfService', lang)}
            </button>
            <button onClick={() => setActiveTab('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              {t('aboutUs', lang)}
            </button>
            <button onClick={() => setActiveTab('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              {t('contactUs', lang)}
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] text-center sm:text-left">
          <p>© {new Date().getFullYear()} {t('footerCopyright', lang)}</p>
          <p className="text-slate-600 font-medium">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
