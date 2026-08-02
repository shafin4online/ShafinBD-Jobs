import React from 'react';
import { useJobContext } from '../context/JobContext';
import { Search, MapPin, Briefcase, TrendingUp, CheckCircle, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { filters, setFilters, jobs } = useJobContext();

  const categories = [
    'Software & IT',
    'Digital Marketing',
    'Graphic Design',
    'Banking & Finance',
    'Customer Support',
    'Sales & Business'
  ];

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl mb-8 shadow-xl">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>#1 Job Portal for Bangladeshi Professionals</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Discover Tech, Creative & Corporate <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Jobs Across Bangladesh
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
          Explore {activeJobsCount}+ verified openings in Dhaka, Chattogram, Sylhet & Remote positions. Apply effortlessly with your profile.
        </p>

        {/* Search Bar Container */}
        <div className="bg-white p-2 sm:p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2 border border-slate-700/20 text-slate-900">
          {/* Keyword Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 w-full sm:w-1/2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="text"
              placeholder="Job title, skill, or company..."
              value={filters.searchKeyword}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchKeyword: e.target.value }))
              }
              className="bg-transparent text-sm w-full outline-hidden text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 px-3 py-2.5 w-full sm:w-1/3 bg-slate-50 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              className="bg-transparent text-sm w-full outline-hidden text-slate-800 font-medium cursor-pointer"
            >
              <option value="All">All Locations</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Remote">Remote Only</option>
            </select>
          </div>

          {/* Search CTA button */}
          <button
            onClick={() => {
              // Filters automatically update via state
            }}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>

        {/* Quick Category Chips */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Popular Categories:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, category: 'All' }))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.category === 'All'
                  ? 'bg-emerald-500 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.category === cat
                    ? 'bg-emerald-500 text-slate-900 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Highlights */}
        <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-slate-800/80 text-center">
          <div>
            <span className="block text-xl font-black text-emerald-400">{activeJobsCount}+</span>
            <span className="text-[11px] text-slate-400 font-medium uppercase">Active Openings</span>
          </div>
          <div>
            <span className="block text-xl font-black text-teal-300">100%</span>
            <span className="text-[11px] text-slate-400 font-medium uppercase">Verified Employers</span>
          </div>
          <div>
            <span className="block text-xl font-black text-cyan-300">1-Click</span>
            <span className="text-[11px] text-slate-400 font-medium uppercase">Profile Application</span>
          </div>
        </div>
      </div>
    </div>
  );
};
