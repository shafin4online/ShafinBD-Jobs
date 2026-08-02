import React from 'react';
import { useJobContext } from '../context/JobContext';
import { Briefcase, Heart, Github, Rocket, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useJobContext();

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
              Connecting Bangladeshi talent with verified employers in Software, Marketing, Banking & Design.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-semibold text-slate-300">
            <button onClick={() => setActiveTab('jobs')} className="hover:text-emerald-400">
              Browse Jobs
            </button>
            <button onClick={() => setActiveTab('profile')} className="hover:text-emerald-400">
              Candidate Profile
            </button>
            <button onClick={() => setActiveTab('applications')} className="hover:text-emerald-400">
              My Applications
            </button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-400">
              Employer Login
            </button>
            <button onClick={() => setActiveTab('deploy-guide')} className="hover:text-purple-400 text-purple-300 font-bold">
              Deploy to Vercel
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} ShafinBD Jobs. Designed & Built for Bangladesh Job Seekers & Employers.</p>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              <Rocket className="w-3.5 h-3.5 text-purple-400" />
              <span>Vercel & GitHub Ready</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
