import React from 'react';
import { useJobContext } from '../context/JobContext';
import { Filter, RotateCcw, Search, MapPin, Briefcase, DollarSign, Layers } from 'lucide-react';

export const JobFilter: React.FC = () => {
  const { filters, setFilters, resetFilters, jobs } = useJobContext();

  const categories = [
    'All',
    'Software & IT',
    'Digital Marketing',
    'Graphic Design',
    'Banking & Finance',
    'Customer Support',
    'Data Entry',
    'Engineering',
    'Sales & Business'
  ];

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
  const locations = ['All', 'Dhaka', 'Chattogram', 'Sylhet', 'Remote'];
  const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  const hasActiveFilters =
    filters.searchKeyword !== '' ||
    filters.category !== 'All' ||
    filters.jobType !== 'All' ||
    filters.location !== 'All' ||
    filters.experienceLevel !== 'All';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <h3 className="font-extrabold text-slate-900 text-sm tracking-wide">Filter Job Openings</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Category</span>
        </label>
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type Radio / Chips */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          <span>Job Type</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilters((prev) => ({ ...prev, jobType: type }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filters.jobType === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Location</span>
        </label>
        <select
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc === 'All' ? 'All Locations' : loc}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Experience Level
        </label>
        <select
          value={filters.experienceLevel}
          onChange={(e) => setFilters((prev) => ({ ...prev, experienceLevel: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
        >
          {experienceLevels.map((exp) => (
            <option key={exp} value={exp}>
              {exp === 'All' ? 'All Experience Levels' : exp}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
