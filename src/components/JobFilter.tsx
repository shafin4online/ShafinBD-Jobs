import React from 'react';
import { useJobContext } from '../context/JobContext';
import { Filter, RotateCcw, CheckCircle2, Clock, Layers, Briefcase, MapPin } from 'lucide-react';
import { t } from '../translations';

export const JobFilter: React.FC = () => {
  const { filters, setFilters, resetFilters, lang } = useJobContext();

  const categories = [
    'All',
    'Govt. Job',
    'Private Job',
    'University Admission Notice',
    'Software & IT',
    'Digital Marketing',
    'Graphic Design',
    'Banking & Finance',
    'Customer Support',
    'Engineering',
    'Sales & Business'
  ];

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

  const hasActiveFilters =
    filters.searchKeyword !== '' ||
    filters.category !== 'All' ||
    filters.jobType !== 'All' ||
    filters.location !== 'All' ||
    filters.experienceLevel !== 'All' ||
    filters.status !== 'all';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <h3 className="font-extrabold text-slate-900 text-sm tracking-wide">
            {t('filterJobOpenings', lang)}
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('reset', lang)}</span>
          </button>
        )}
      </div>

      {/* ACTIVE vs INACTIVE JOBS FILTER SELECTOR */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>সার্কুলার স্ট্যাটাস ফিল্টার (Active / Inactive Jobs)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, status: 'all' }))}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filters.status === 'all'
                ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>সকল সার্কুলার</span>
          </button>

          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, status: 'active' }))}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filters.status === 'active'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>সক্রিয় জবস (Active)</span>
          </button>

          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, status: 'closed' }))}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filters.status === 'closed'
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>নিষ্ক্রিয়/মেয়াদ শেষ (Inactive)</span>
          </button>
        </div>
      </div>

      {/* ADDITIONAL SUB FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('category', lang)}</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? t('allCategories', lang) : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('jobType', lang)}</span>
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? t('all', lang) : type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
