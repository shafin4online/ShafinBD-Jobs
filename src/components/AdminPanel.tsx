import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { Job, JobCategory, JobType, ExperienceLevel, ApplicationStatus } from '../types';
import { GoogleGenAI } from '@google/genai';
import {
  PlusCircle,
  Briefcase,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Save,
  RotateCcw,
  Mail,
  Phone,
  Eye,
  Building2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    toggleJobFeatured,
    applications,
    updateApplicationStatus,
    logoutAdmin,
    resetAllData
  } = useJobContext();

  const [activeAdminTab, setActiveAdminTab] = useState<'post' | 'jobs' | 'applications'>('post');
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    company: 'ShafinBD Tech',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    location: 'Dhaka (Hybrid)',
    jobType: 'Full-time' as JobType,
    category: 'Software & IT' as JobCategory,
    salaryRange: '৳50,000 - ৳75,000 / month',
    experienceLevel: 'Mid Level' as ExperienceLevel,
    description: '',
    requirementsText: '• 2+ years relevant experience\n• Strong communication skills\n• Problem-solving mindset',
    responsibilitiesText: '• Execute daily tasks and deliverables\n• Collaborate with cross-functional teams',
    deadline: '2026-09-15',
    status: 'active' as 'active' | 'closed',
    featured: true,
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // AI Description Helper
  const handleAiGenerate = async () => {
    if (!jobForm.title) {
      alert('Please enter a Job Title first to generate AI requirements!');
      return;
    }

    setIsGeneratingAi(true);
    setAiNotice('');

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Fallback intelligent generator
        setTimeout(() => {
          setJobForm((prev) => ({
            ...prev,
            description: `We are looking for a driven and talented ${jobForm.title} to join our growing team in Bangladesh. You will play a key role in developing high-impact solutions, collaborating with team leads, and delivering exceptional quality.`,
            requirementsText: `• Proven experience working as a ${jobForm.title} or similar role\n• Strong technical proficiency and analytical troubleshooting\n• Excellent teamwork, time-management, and English communication\n• Degree or relevant practical certifications in ${jobForm.category}`,
            responsibilitiesText: `• Lead day-to-day execution for ${jobForm.title} projects\n• Ensure top quality and adherence to industry best practices\n• Participate in team sprint planning and client requirement reviews`,
          }));
          setIsGeneratingAi(false);
          setAiNotice('Generated smart job description & requirements template!');
        }, 600);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a professional job description, key requirements (4 bullet points), and responsibilities (3 bullet points) for a "${jobForm.title}" position in the category "${jobForm.category}" in Bangladesh. Format response clearly with Description, Requirements, Responsibilities.`,
      });

      const text = response.text || '';
      setJobForm((prev) => ({
        ...prev,
        description: text.slice(0, 300) + '...',
        requirementsText: `• Proven experience in ${jobForm.title}\n• Excellent domain knowledge and skills\n• Good team collaboration and problem solving`,
        responsibilitiesText: `• Oversee core tasks for ${jobForm.title}\n• Deliver high quality results on schedule`,
      }));
      setAiNotice('AI generated description successfully!');
    } catch (err) {
      console.error(err);
      setAiNotice('Note: Used template generator for job details.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requirements = jobForm.requirementsText
      .split('\n')
      .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    const responsibilities = jobForm.responsibilitiesText
      .split('\n')
      .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    if (editingJob) {
      updateJob({
        ...editingJob,
        title: jobForm.title,
        company: jobForm.company,
        companyLogo: jobForm.companyLogo,
        location: jobForm.location,
        jobType: jobForm.jobType,
        category: jobForm.category,
        salaryRange: jobForm.salaryRange,
        experienceLevel: jobForm.experienceLevel,
        description: jobForm.description,
        requirements,
        responsibilities,
        deadline: jobForm.deadline,
        status: jobForm.status,
        featured: jobForm.featured,
      });
      setFormSuccess('Job posting updated successfully!');
      setEditingJob(null);
    } else {
      addJob({
        title: jobForm.title,
        company: jobForm.company,
        companyLogo: jobForm.companyLogo,
        location: jobForm.location,
        jobType: jobForm.jobType,
        category: jobForm.category,
        salaryRange: jobForm.salaryRange,
        experienceLevel: jobForm.experienceLevel,
        description: jobForm.description,
        requirements,
        responsibilities,
        deadline: jobForm.deadline,
        status: jobForm.status,
        featured: jobForm.featured,
      });
      setFormSuccess('New Job posted successfully! It is now live for job seekers.');
    }

    // Reset Form
    setJobForm({
      title: '',
      company: 'ShafinBD Tech',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      location: 'Dhaka (Hybrid)',
      jobType: 'Full-time',
      category: 'Software & IT',
      salaryRange: '৳50,000 - ৳75,000 / month',
      experienceLevel: 'Mid Level',
      description: '',
      requirementsText: '• 2+ years relevant experience\n• Strong communication skills',
      responsibilitiesText: '• Execute daily tasks and deliverables',
      deadline: '2026-09-15',
      status: 'active',
      featured: true,
    });

    setTimeout(() => setFormSuccess(''), 4000);
  };

  const startEditJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo || '',
      location: job.location,
      jobType: job.jobType,
      category: job.category,
      salaryRange: job.salaryRange,
      experienceLevel: job.experienceLevel,
      description: job.description,
      requirementsText: job.requirements.map((r) => `• ${r}`).join('\n'),
      responsibilitiesText: job.responsibilities.map((r) => `• ${r}`).join('\n'),
      deadline: job.deadline,
      status: job.status,
      featured: job.featured,
    });
    setActiveAdminTab('post');
  };

  const totalActive = jobs.filter((j) => j.status === 'active').length;
  const totalClosed = jobs.filter((j) => j.status === 'closed').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Admin Dashboard Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Employer & Admin Console</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                Admin Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Post new job openings, manage listings & review job seeker applications</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAllData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 text-xs font-semibold transition-colors"
            title="Reset to sample data"
          >
            Reset Data
          </button>
          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900">{jobs.length}</span>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Total Job Posts</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-teal-700">{totalActive}</span>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Active Openings</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-blue-700">{applications.length}</span>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Applications</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-purple-700">
              {applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Hired').length}
            </span>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase">Shortlisted</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setEditingJob(null);
            setActiveAdminTab('post');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'post'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>{editingJob ? 'Edit Job Posting' : 'Post New Job'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'jobs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Manage Listings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'applications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Applications ({applications.length})</span>
        </button>
      </div>

      {/* TAB 1: POST / EDIT JOB FORM */}
      {activeAdminTab === 'post' && (
        <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>{editingJob ? `Editing: ${editingJob.title}` : 'Post a New Job Opening'}</span>
              </h3>
              <p className="text-xs text-slate-500">Fill in the job information to publish instantly</p>
            </div>

            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGeneratingAi}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingAi ? 'Generating AI...' : 'AI Auto-Fill Description'}</span>
            </button>
          </div>

          {formSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {aiNotice && (
            <div className="bg-purple-50 border border-purple-200 text-purple-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{aiNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={jobForm.company}
                onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                placeholder="e.g. ShafinBD Tech"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={jobForm.category}
                onChange={(e) => setJobForm({ ...jobForm, category: e.target.value as JobCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Software & IT">Software & IT</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Banking & Finance">Banking & Finance</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Data Entry">Data Entry</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales & Business">Sales & Business</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Type *
              </label>
              <select
                value={jobForm.jobType}
                onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value as JobType })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="Gulshan, Dhaka or Remote"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Salary Range *
              </label>
              <input
                type="text"
                required
                value={jobForm.salaryRange}
                onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                placeholder="৳45,000 - ৳65,000 / month"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Experience Level *
              </label>
              <select
                value={jobForm.experienceLevel}
                onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value as ExperienceLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={jobForm.deadline}
                onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Description *
            </label>
            <textarea
              rows={3}
              required
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              placeholder="Describe the role and team culture..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Requirements (One point per line)
              </label>
              <textarea
                rows={4}
                value={jobForm.requirementsText}
                onChange={(e) => setJobForm({ ...jobForm, requirementsText: e.target.value })}
                placeholder="• 3+ years experience&#10;• Strong TypeScript skills"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Responsibilities (One point per line)
              </label>
              <textarea
                rows={4}
                value={jobForm.responsibilitiesText}
                onChange={(e) => setJobForm({ ...jobForm, responsibilitiesText: e.target.value })}
                placeholder="• Architect web apps&#10;• Perform code reviews"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={jobForm.featured}
                onChange={(e) => setJobForm({ ...jobForm, featured: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-800">Highlight as Featured Job</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={jobForm.status === 'active'}
                onChange={(e) => setJobForm({ ...jobForm, status: e.target.checked ? 'active' : 'closed' })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-800">Active (Open for applications)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {editingJob && (
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingJob ? 'Save Job Changes' : 'Publish Job Post'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: MANAGE POSTED JOBS */}
      {activeAdminTab === 'jobs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Job Postings Directory ({jobs.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Toggle active status, mark featured, edit or delete listings</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-extrabold border-b border-slate-200">
                  <th className="p-3">Job & Company</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location & Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Applicants</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                      <div className="text-slate-500">{job.company} • {job.salaryRange}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                        {job.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>{job.location}</div>
                      <div className="text-slate-400">{job.jobType}</div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleJobStatus(job.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer ${
                          job.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {job.status}
                      </button>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-900">
                      {job.applicantCount}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => toggleJobFeatured(job.id)}
                        title="Toggle Featured"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          job.featured
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => startEditJob(job)}
                        title="Edit Job"
                        className="p-1.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${job.title}"?`)) deleteJob(job.id);
                        }}
                        title="Delete Job"
                        className="p-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATIONS MANAGER */}
      {activeAdminTab === 'applications' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Job Seeker Applications ({applications.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Review candidate submissions and update hiring status</p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No applications received yet</h4>
              <p className="text-xs text-slate-500">When users submit job applications, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">
                        {app.userName}
                      </h4>
                      <p className="text-xs text-emerald-700 font-bold">
                        Applied for: {app.jobTitle} ({app.companyName})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">{app.appliedAt}</span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                        }
                        className="px-3 py-1 rounded-xl text-xs font-bold border border-slate-300 bg-white cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hired">Hired</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500"><strong>Email:</strong> {app.userEmail}</p>
                      <p className="text-slate-500"><strong>Phone:</strong> {app.userPhone}</p>
                    </div>
                    <div>
                      <p className="text-slate-500"><strong>Key Skills:</strong> {app.skills.join(', ') || 'N/A'}</p>
                    </div>
                  </div>

                  {app.resumeNote && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong className="block text-slate-900 font-bold mb-0.5">Cover Note:</strong>
                      {app.resumeNote}
                    </div>
                  )}

                  {/* Employer Feedback Note Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add hiring note (e.g. Called for interview on Monday)"
                      defaultValue={app.notes || ''}
                      onBlur={(e) => updateApplicationStatus(app.id, app.status, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
