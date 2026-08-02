import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { ActiveTab } from '../types';
import {
  Briefcase,
  User,
  ShieldCheck,
  Bookmark,
  FileText,
  Rocket,
  LogOut,
  Lock,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    role,
    setRole,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    profile,
    applications
  } = useJobContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  const savedCount = profile.savedJobs.length;
  const applicationCount = applications.length;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      setShowAdminModal(false);
      setPasscode('');
      setPassError('');
      setActiveTab('admin');
    } else {
      setPassError('Invalid passcode! Try "admin123"');
    }
  };

  const navTo = (tab: ActiveTab) => {
    if (tab === 'admin' && !isAdminLoggedIn) {
      setShowAdminModal(true);
    } else {
      setActiveTab(tab);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div
              onClick={() => navTo('jobs')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  ShafinBD<span className="text-emerald-600">Jobs</span>
                </span>
                <span className="block text-[10px] font-medium text-emerald-700 tracking-wider uppercase -mt-1">
                  Bangladesh Tech & Job Portal
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => navTo('jobs')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'jobs'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>All Jobs</span>
              </button>

              <button
                onClick={() => navTo('applications')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
                  activeTab === 'applications'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Applications</span>
                {applicationCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {applicationCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navTo('profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => navTo('deploy-guide')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'deploy-guide'
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Rocket className="w-4 h-4 text-purple-600" />
                <span>Vercel & GitHub</span>
              </button>
            </nav>

            {/* Right Side Controls / Admin Switcher */}
            <div className="hidden md:flex items-center gap-3">
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-xs transition-all ${
                      activeTab === 'admin'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Admin Panel</span>
                  </button>
                  <button
                    onClick={logoutAdmin}
                    title="Logout Admin"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Employer Login</span>
                </button>
              )}

              {/* User Avatar Badge */}
              <button
                onClick={() => navTo('profile')}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {profile.fullName ? profile.fullName.charAt(0) : 'S'}
                </div>
                <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                  {profile.fullName || 'Job Seeker'}
                </span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => navTo('jobs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === 'jobs' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse All Jobs</span>
            </button>

            <button
              onClick={() => navTo('applications')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === 'applications' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>My Applications</span>
              </div>
              {applicationCount > 0 && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {applicationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navTo('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Resume</span>
            </button>

            <button
              onClick={() => navTo('deploy-guide')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === 'deploy-guide' ? 'bg-purple-50 text-purple-700' : 'text-slate-700'
              }`}
            >
              <Rocket className="w-4 h-4 text-purple-600" />
              <span>Vercel / GitHub Setup</span>
            </button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {isAdminLoggedIn ? (
                <button
                  onClick={() => navTo('admin')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Open Admin Panel</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowAdminModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Employer / Admin Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Employer & Admin Login</h3>
                <p className="text-xs text-slate-500">Access job posting & applicant manager</p>
              </div>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (Default: admin123)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  autoFocus
                />
                {passError && <p className="text-xs text-rose-600 mt-1.5 font-medium">{passError}</p>}
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-0.5">Quick Demo Hint:</p>
                Use passcode <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-emerald-700 font-bold">admin123</code> to access Admin features.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="w-1/2 py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-700 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
