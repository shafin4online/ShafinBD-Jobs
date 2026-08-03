import React from 'react';
import { useJobContext } from '../context/JobContext';
import { Menu, Search, Bookmark, Globe, User } from 'lucide-react';
import { t } from '../translations';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const { 
    authUser, 
    profile, 
    filters, 
    setFilters, 
    setShowAuthModal, 
    lang,
    setLang
  } = useJobContext();

  const savedJobsCount = profile?.savedJobs?.length || 0;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-7xl mx-auto">
        
        {/* Left Side: Mobile Menu Toggle + Logo Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl lg:hidden transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 font-black text-lg flex items-center justify-center border border-slate-800 shadow-xs">
              S
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight block">
                {t('appTitle', lang)} <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{t('liveBadge', lang)}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium block -mt-0.5">
                {t('subTitle', lang)}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchKeyword}
              onChange={(e) => setFilters({ ...filters, searchKeyword: e.target.value })}
              placeholder={t('searchPlaceholder', lang)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-2">

          {/* Saved Jobs Badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
            <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{t('saved', lang)}: {savedJobsCount}</span>
          </div>

          {/* Language & Font Switcher */}
          <button
            onClick={() => setLang(lang === 'BN' ? 'EN' : 'BN')}
            title={lang === 'BN' ? 'Switch to English' : 'Switch to Bangla'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200 cursor-pointer shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang}</span>
          </button>

          {/* User Auth Profile Button */}
          {authUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2">
                {authUser.photoURL ? (
                  <img src={authUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-300 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {authUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <span className="hidden xl:inline font-bold text-xs text-slate-800">
                  {profile?.fullName || authUser.displayName?.split(' ')[0] || 'User'}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('signIn', lang)}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
