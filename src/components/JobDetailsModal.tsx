import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import {
  X,
  MapPin,
  Clock,
  Banknote,
  Briefcase,
  Building2,
  CheckCircle2,
  Bookmark,
  Send,
  User,
  FileText,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const JobDetailsModal: React.FC = () => {
  const {
    selectedJobForModal,
    setSelectedJobForModal,
    profile,
    toggleSaveJob,
    applyForJob,
    applications,
    setActiveTab
  } = useJobContext();

  const [coverNote, setCoverNote] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!selectedJobForModal) return null;

  const job = selectedJobForModal;
  const isSaved = profile.savedJobs.includes(job.id);
  const hasApplied = applications.some((a) => a.jobId === job.id && a.userId === profile.id);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setFeedback(null);

    setTimeout(() => {
      const res = applyForJob(job.id, coverNote);
      setIsApplying(false);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Header Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  {job.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  {job.jobType}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-snug">
                {job.title}
              </h2>
              <p className="text-xs text-slate-300 font-medium">{job.company} • {job.location}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedJobForModal(null);
              setFeedback(null);
            }}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800">

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Offered Salary</span>
              <span className="text-slate-900 text-sm font-extrabold text-emerald-700">{job.salaryRange}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience Level</span>
              <span className="text-slate-800 text-sm">{job.experienceLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Deadline</span>
              <span className="text-rose-600 text-sm font-bold">{job.deadline}</span>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Job Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Key Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Requirements
              </h4>
              <ul className="space-y-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Responsibilities
              </h4>
              <ul className="space-y-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Form / Quick Status Section */}
          <div className="border-t border-slate-200 pt-6">
            {feedback && (
              <div
                className={`p-4 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {hasApplied ? (
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-700 mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-teal-900">Application Already Submitted</h4>
                <p className="text-xs text-teal-700 mt-1">
                  You can track your application status anytime in your "My Applications" tab.
                </p>
                <button
                  onClick={() => {
                    setSelectedJobForModal(null);
                    setActiveTab('applications');
                  }}
                  className="mt-3 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  View My Applications
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Apply for this position</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Applying as: {profile.fullName || 'Job Seeker'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                  <p><strong className="text-slate-800">Email:</strong> {profile.email}</p>
                  <p><strong className="text-slate-800">Phone:</strong> {profile.phone}</p>
                  <p><strong className="text-slate-800">Skills:</strong> {profile.skills.join(', ')}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover Note / Message to Recruiter (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly state why you are a great fit for this role..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSaveJob(job.id)}
                    className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      isSaved
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-rose-600' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save Job'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isApplying}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isApplying ? 'Submitting...' : 'Submit Application Now'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
