import React from 'react';
import { useJobContext } from '../context/JobContext';
import { AdminSubTab } from '../context/jobContextTypes';
import { APP_LOGO_URL } from '../constants';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users, 
  FileText, 
  Bell, 
  FolderKanban, 
  LogOut, 
  X, 
  Home, 
  ShieldCheck,
  HelpCircle,
  Award
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    adminSubTab, 
    setAdminSubTab, 
    authUser, 
    profile, 
    logoutUser 
  } = useJobContext();

  const handleSubTabClick = (subTab: AdminSubTab) => {
    setActiveTab('admin');
    setAdminSubTab(subTab);
    onClose();
  };

  const adminNavItems: Array<{ id: AdminSubTab; label: string; icon: any }> = [
    { id: 'overview', label: 'এডমিন ড্যাশবোর্ড (Overview)', icon: LayoutDashboard },
    { id: 'post', label: 'নতুন জব পোস্ট (Post Job)', icon: PlusCircle },
    { id: 'jobs', label: 'সার্কুলার তালিকা (Manage Jobs)', icon: Briefcase },
    { id: 'question-bank', label: 'প্রশ্নব্যাংক (Question Bank)', icon: HelpCircle },
    { id: 'model-tests', label: 'লাইভ মডেল টেস্ট (Live Exams)', icon: Award },
    { id: 'users', label: 'ইউজার তালিকা (User List)', icon: Users },
    { id: 'applications', label: 'আবেদনসমূহ (Applications)', icon: FileText },
    { id: 'notifications', label: 'নোটিফিকেশন পাঠান (Notifications)', icon: Bell },
    { id: 'categories', label: 'ক্যাটাগরি ম্যানেজমেন্ট (Categories)', icon: FolderKanban },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Admin Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 sm:w-72 bg-slate-950 border-r border-amber-500/20 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-amber-500/20 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <img 
              src={APP_LOGO_URL} 
              alt="Shafin BD Jobs Logo" 
              className="w-9 h-9 rounded-xl object-contain bg-white/10 p-1 ring-1 ring-amber-400/40" 
            />
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-amber-400 flex items-center gap-1">
                Shafin BD Jobs
              </span>
              <span className="text-[10px] font-bold text-amber-200/70 tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                এডমিন প্যানেল
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === 'admin' && adminSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSubTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
                    : 'text-amber-200/90 hover:bg-amber-500/15 hover:text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Admin Footer User Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-800/60 border border-amber-500/10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-xs shrink-0">
                {(authUser?.displayName || profile?.fullName || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-extrabold text-amber-200 truncate">
                  {authUser?.displayName || profile?.fullName || 'Admin User'}
                </p>
                <p className="text-[10px] text-amber-400/80 truncate">
                  {authUser?.email || profile?.email}
                </p>
              </div>
            </div>

            <button
              onClick={logoutUser}
              title="লগআউট"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
