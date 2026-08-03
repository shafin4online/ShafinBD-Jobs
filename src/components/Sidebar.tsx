import React from 'react';
import { useJobContext } from '../context/JobContext';
import { ActiveTab } from '../types';
import { AdminSubTab } from '../context/jobContextTypes';
import { t, TranslationKey } from '../translations';
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
  FileCode,
  LogOut,
  X,
  User as UserIcon,
  CheckCircle2,
  LayoutDashboard,
  PlusCircle,
  Users,
  Bell,
  FolderKanban,
  ShieldCheck,
  ArrowLeftRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    adminSubTab,
    setAdminSubTab,
    role, 
    setRole, 
    isAdminLoggedIn,
    authUser, 
    profile, 
    logoutUser,
    setShowAuthModal,
    lang
  } = useJobContext();

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleAdminSubTabClick = (subTab: AdminSubTab) => {
    setActiveTab('admin');
    setAdminSubTab(subTab);
    onClose();
  };

  const isShowAdminMenu = isAdminLoggedIn || role === 'admin' || activeTab === 'admin';

  const adminNavItems: Array<{ id: AdminSubTab; key: TranslationKey; icon: any; badge?: string }> = [
    { id: 'overview', key: 'overview', icon: LayoutDashboard },
    { id: 'post', key: 'postNewJob', icon: PlusCircle, badge: 'New' },
    { id: 'users', key: 'userList', icon: Users },
    { id: 'notifications', key: 'notificationPanel', icon: Bell },
    { id: 'categories', key: 'categoryManagement', icon: FolderKanban },
    { id: 'jobs', key: 'manageJobs', icon: Briefcase },
    { id: 'applications', key: 'myApplications', icon: FileText },
  ];

  const candidateNavItems: Array<{ id: ActiveTab; key: TranslationKey; icon: any; badge?: string }> = [
    { id: 'jobs', key: 'homeDashboard', icon: Home },
    { id: 'govt-jobs', key: 'govtJobs', icon: Building2, badge: 'Govt' },
    { id: 'private-jobs', key: 'privateJobs', icon: Briefcase },
    { id: 'university-admission', key: 'univAdmission', icon: GraduationCap, badge: 'New' },
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-500/20">
              S
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
          
          {/* SECTION: Admin Navigation Mode */}
          {isShowAdminMenu ? (
            <div className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {t('adminNavTitle', lang)}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-extrabold">
                  ADMIN
                </span>
              </div>

              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === 'admin' && adminSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAdminSubTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                      <span>{t(item.key, lang)}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Mode Switcher / User View Option */}
              <div className="pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    setRole('jobseeker');
                    setActiveTab('jobs');
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-between cursor-pointer border border-slate-700"
                >
                  <span className="flex items-center gap-2 text-slate-300">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('exitAdminMode', lang)}</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-extrabold">
                    {t('jobSeeker', lang)}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* SECTION: Candidate / Job Seeker Navigation Mode */
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
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

              {/* Section: Admin Access Entry */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => handleTabClick('admin')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-purple-300 hover:bg-purple-950/40 hover:text-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>{t('adminPanel', lang)}</span>
                  </div>
                </button>
              </div>
            </div>
          )}

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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all ${
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
