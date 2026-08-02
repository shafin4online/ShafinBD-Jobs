import React from 'react';
import { Job } from '../types';
import { useJobContext } from '../context/JobContext';
import {
  MapPin,
  Clock,
  Banknote,
  Bookmark,
  Sparkles,
  Building2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { profile, toggleSaveJob, setSelectedJobForModal, applications } = useJobContext();

  const isSaved = profile.savedJobs.includes(job.id);
  const hasApplied = applications.some((a) => a.jobId === job.id && a.userId === profile.id);

  // Calculate days remaining
  const calculateDeadline = (dateStr: string) => {
    const today = new Date();
    const deadline = new Date(dateStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: 'text-rose-600 bg-rose-50' };
    if (diffDays === 0) return { label: 'Expires Today', color: 'text-amber-700 bg-amber-50' };
    return { label: `${diffDays} days left`, color: 'text-slate-600 bg-slate-100' };
  };

  const deadlineInfo = calculateDeadline(job.deadline);

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        job.featured
          ? 'border-emerald-200 shadow-md ring-1 ring-emerald-500/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Company Logo / Placeholder */}
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
              onError={(e) => {
                // Fallback to initial
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
            <Building2 className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {job.title}
              </h3>
              {job.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Featured
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>{job.company}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{job.category}</span>
            </p>
          </div>
        </div>

        {/* Bookmark Heart / Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveJob(job.id);
          }}
          title={isSaved ? 'Remove from Saved' : 'Save Job'}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
              : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Description Snippet */}
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
        {job.description}
      </p>

      {/* Badges / Job Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-900 truncate">{job.salaryRange}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${deadlineInfo.color}`}>
            {deadlineInfo.label}
          </span>
        </div>
      </div>

      {/* Bottom CTA & Applied Indicator */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {job.jobType}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
            {job.experienceLevel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasApplied ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Applied
            </span>
          ) : null}

          <button
            onClick={() => setSelectedJobForModal(job)}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-xs group-hover:bg-emerald-600 cursor-pointer"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
