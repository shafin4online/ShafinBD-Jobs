import React from 'react';
import { useJobContext, ADMIN_EMAILS } from '../context/JobContext';
import { ActiveTab } from '../types';
import { t, TranslationKey } from '../translations';
import { APP_LOGO_URL } from '../constants';
import { 
  Home, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  UserCheck, 
  FileText, 
  ShieldAlert, 
  Info, 
  PhoneCall, 
  Lock, 
  LogOut,
  X,
  User as UserIcon,
  CheckCircle2,
  Award,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    authUser, 
    profile, 
    logoutUser,
    setShowAuthModal,
    lang,
    isAdminLoggedIn,
    role
  } = useJobContext();

  const userEmail = (authUser?.email || profile?.email || '').trim().toLowerCase();
  const isEmailAdmin = ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === userEmail);
  const isUserAdmin = isAdminLoggedIn || role === 'admin' || isEmailAdmin;

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const candidateNavItems: Array<{ id: ActiveTab; key: TranslationKey; icon: any; badge?: string }> = [
    { id: 'jobs', key: 'homeDashboard', icon: Home },
    { id: 'govt-jobs', key: 'govtJobs', icon: Building2, badge: 'Govt' },
    { id: 'private-jobs', key: 'privateJobs', icon: Briefcase },
    { id: 'university-admission', key: 'univAdmission', icon: GraduationCap, badge: 'New' },
    { id: 'exam-results', key: 'examResults', icon: Award, badge: 'Result' },
    { id: 'profile', key: 'candidateProfile', icon: UserCheck },
    { id: 'applications', key: 'myApplications', icon: FileText },
  ];

  const infoNavItems: Array<{ id: ActiveTab; key: TranslationKey; icon: any }> = [
    { id: 'privacy-policy', key: 'privacyPolicy', icon: Lock },
    { id: 'terms', key: 'termsOfService', icon: ShieldAlert },
    { id: 'about', key: 'aboutUs', icon: Info },
    { id: 'contact', key: 'contactUs', icon: PhoneCall },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 sm:w-72 bg-slate-900 text-slate-100 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
              <img 
                src={APP_LOGO_URL} 
                alt="ShafinBD Jobs Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight leading-none flex items-center gap-1">
                Shafin BD
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-bold rounded">BD</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {t('educationPortal', lang)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
          
          {/* SECTION: User Navigation Mode */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {t('mainNav', lang)}
            </div>

            {candidateNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{t(item.key, lang)}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section: Company Info & Pages */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {t('infoSupport', lang)}
            </div>
            {infoNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer ${
                    isActive ? 'bg-slate-800 text-emerald-400' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{t(item.key, lang)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 space-y-2">
          {authUser ? (
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-hidden">
                {authUser.photoURL ? (
                  <img src={authUser.photoURL} alt="User" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    {authUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{profile?.fullName || authUser.displayName || 'User'}</p>
                  <p className="text-[10px] text-emerald-400 font-medium truncate flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{t('activeLogin', lang)}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={logoutUser}
                title={t('signOut', lang)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                onClose();
              }}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>{t('signInRegister', lang)}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
