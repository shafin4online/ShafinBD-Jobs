import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Github,
  Linkedin,
  Save,
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { JobCard } from './JobCard';

export const UserProfile: React.FC = () => {
  const { profile, updateProfile, applications, jobs, setSelectedJobForModal } = useJobContext();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'applications' | 'saved'>('profile');
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    title: profile.title,
    location: profile.location,
    experience: profile.experience,
    education: profile.education,
    bio: profile.bio,
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    resumeFileName: profile.resumeFileName || '',
  });

  const [skillsList, setSkillsList] = useState<string[]>(profile.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      skills: skillsList,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const savedJobsList = jobs.filter((j) => profile.savedJobs.includes(j.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'Hired':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-600/30">
            {formData.fullName ? formData.fullName.charAt(0) : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{formData.fullName || 'Job Seeker Profile'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Candidate
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{formData.title || 'Add your professional title'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formData.email} • {formData.phone}</p>
          </div>
        </div>

        {/* Subtab Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeSubTab === 'applications'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            My Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'saved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Saved ({savedJobsList.length})
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Candidate registration profile updated successfully!</span>
        </div>
      )}

      {/* Subtab Content: Profile Registration Form */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSubmitProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Candidate Profile Details</span>
              </h3>
              <p className="text-xs text-slate-500">Keep your details updated for 1-click job application</p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Shafin Ahmed"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Title / Headline *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Frontend React Developer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="shafin@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 1712-345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dhaka, Bangladesh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Resume / CV File Name
              </label>
              <input
                type="text"
                value={formData.resumeFileName}
                onChange={(e) => setFormData({ ...formData, resumeFileName: e.target.value })}
                placeholder="Shafin_CV.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Professional Bio / Summary
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell employers about your goals, key achievements, and background..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Experience Summary
              </label>
              <textarea
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="2+ years experience building web apps..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Education
              </label>
              <textarea
                rows={3}
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="B.Sc in Computer Science..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Technical Skills & Keywords
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g. React, SEO, Figma)"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 min-h-[50px]">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skillsList.length === 0 && (
                <span className="text-xs text-slate-400 italic">No skills added yet. Add your top skills above!</span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/shafinbd4u"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/shafinbd"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Registration</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtab Content: My Applications Tracker */}
      {activeSubTab === 'applications' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>My Job Applications ({applications.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Track real-time status of your job submissions</p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No applications submitted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Browse our job listings and apply with 1-click using your profile.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{app.jobTitle}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{app.companyName} • Applied on {app.appliedAt}</p>
                    {app.resumeNote && (
                      <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200 mt-1">
                        "{app.resumeNote}"
                      </p>
                    )}
                    {app.notes && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-semibold mt-1">
                        <strong>Employer Feedback:</strong> {app.notes}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      const job = jobs.find((j) => j.id === app.jobId);
                      if (job) setSelectedJobForModal(job);
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 shrink-0"
                  >
                    View Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab Content: Saved Bookmarks */}
      {activeSubTab === 'saved' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-emerald-600" />
                <span>Saved Jobs ({savedJobsList.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Positions you bookmarked for later</p>
            </div>
          </div>

          {savedJobsList.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No saved jobs</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Click the bookmark icon on any job card to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobsList.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
