import React, { useState, useRef, useEffect } from 'react';
import { useJobContext, ADMIN_EMAILS } from '../context/JobContext';
import { Menu, Search, Bookmark, Globe, User, LogOut, Settings, Sun, Moon, ChevronDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { t } from '../translations';
import { APP_LOGO_URL } from '../constants';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onOpenMobileFilter?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar, onOpenMobileFilter }) => {
  const { 
    authUser, 
    profile, 
    filters, 
    setFilters, 
    setShowAuthModal, 
    activeTab,
    setActiveTab,
    logoutUser,
    isDarkMode,
    toggleDarkMode,
    lang,
    setLang,
    isAdminLoggedIn,
    role
  } = useJobContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEmail = (authUser?.email || profile?.email || '').trim().toLowerCase();
  const isEmailAdmin = ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === userEmail);
  const isUserAdmin = isAdminLoggedIn || role === 'admin' || isEmailAdmin;

  const savedJobsCount = profile?.savedJobs?.length || 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userPhoto = authUser?.photoURL || (profile as any)?.photoURL;
  const userName = profile?.fullName || authUser?.displayName || 'User';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-7xl mx-auto">
        
        {/* Left Side: Mobile Menu Toggle + Logo Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
              <img 
                src={APP_LOGO_URL} 
                alt="ShafinBD Jobs Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight block">
                {t('appTitle', lang)} <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">{t('liveBadge', lang)}</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block -mt-0.5">
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
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
            />
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-2">

          {/* Saved Jobs Badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
            <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{t('saved', lang)}: {savedJobsCount}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'BN' ? 'EN' : 'BN')}
            title={lang === 'BN' ? 'Switch to English' : 'Switch to Bangla'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang}</span>
          </button>

          {/* User Profile / Auth Button */}
          {authUser ? (
            <div className="relative pl-2 border-l border-slate-200 dark:border-slate-700" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {userName[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline font-bold text-xs text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    {userPhoto ? (
                      <img src={userPhoto} alt="User Avatar" className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                        {userName[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{authUser.email}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>লগইন সক্রিয়</span>
                      </span>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="p-1.5 space-y-1 text-xs font-semibold">
                    {/* User Profile Link */}
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>আমার প্রোফাইল (User Profile)</span>
                    </button>

                    {/* Settings & Theme Switcher */}
                    <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-200 font-bold">
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span>সেটিংস (Settings)</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                        <span className="text-[11px] flex items-center gap-1.5 font-medium">
                          {isDarkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                          <span>{isDarkMode ? 'ডার্ক মোড' : 'লাইট মোড'}</span>
                        </span>
                        
                        <button
                          onClick={toggleDarkMode}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isDarkMode ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              isDarkMode ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
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

      {/* Fixed Mobile & PWA Quick Nav Strip */}
      <div className="lg:hidden border-t border-slate-300 dark:border-slate-800 bg-slate-400 dark:bg-slate-800 shadow-xs">
        <div className="grid grid-cols-4 gap-px bg-slate-400 dark:bg-slate-700">
          <button
            onClick={() => setActiveTab('govt-jobs')}
            className={`py-2.5 px-0.5 text-center font-extrabold text-[11px] sm:text-xs tracking-tight transition-all cursor-pointer flex items-center justify-center leading-tight select-none ${
              activeTab === 'govt-jobs'
                ? 'bg-[#6093cd] text-slate-950 font-black shadow-inner border-b-2 border-slate-900 dark:border-slate-100'
                : 'bg-[#a8cbf0] dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 hover:bg-[#93bde8] dark:hover:bg-slate-700'
            }`}
          >
            <span>সরকারি চাকুরী</span>
          </button>

          <button
            onClick={() => setActiveTab('private-jobs')}
            className={`py-2.5 px-0.5 text-center font-extrabold text-[11px] sm:text-xs tracking-tight transition-all cursor-pointer flex items-center justify-center leading-tight select-none ${
              activeTab === 'private-jobs'
                ? 'bg-[#6093cd] text-slate-950 font-black shadow-inner border-b-2 border-slate-900 dark:border-slate-100'
                : 'bg-[#a8cbf0] dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 hover:bg-[#93bde8] dark:hover:bg-slate-700'
            }`}
          >
            <span>বেসরকারি চাকুরী</span>
          </button>

          <button
            onClick={() => setActiveTab('exam-results')}
            className={`py-2.5 px-0.5 text-center font-extrabold text-[11px] sm:text-xs tracking-tight transition-all cursor-pointer flex items-center justify-center leading-tight select-none ${
              activeTab === 'exam-results'
                ? 'bg-[#6093cd] text-slate-950 font-black shadow-inner border-b-2 border-slate-900 dark:border-slate-100'
                : 'bg-[#a8cbf0] dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 hover:bg-[#93bde8] dark:hover:bg-slate-700'
            }`}
          >
            <span>ফলাফল</span>
          </button>

          <button
            onClick={() => {
              if (onOpenMobileFilter) onOpenMobileFilter();
            }}
            className="py-2.5 px-0.5 text-center font-extrabold text-[11px] sm:text-xs tracking-tight bg-[#a8cbf0] dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 hover:bg-[#93bde8] dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center leading-tight select-none"
          >
            <span>ফিল্টার করুন</span>
          </button>
        </div>
      </div>
    </header>
  );
};

