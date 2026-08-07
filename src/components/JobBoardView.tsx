import React from 'react';
import { Job } from '../types';
import { JobCard } from './JobCard';
import { JobFilter } from './JobFilter';
import { Filter, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';
import { t } from '../translations';
import { useJobContext } from '../context/JobContext';

interface JobBoardViewProps {
  sortedJobs: Job[];
  displayedJobs: Job[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  isLoadingMore: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
  filterCollapsed: boolean;
  setFilterCollapsed: (collapsed: boolean) => void;
}

export const JobBoardView: React.FC<JobBoardViewProps> = ({
  sortedJobs,
  displayedJobs,
  visibleCount,
  setVisibleCount,
  isLoadingMore,
  observerRef,
  filterCollapsed,
  setFilterCollapsed,
}) => {
  const { lang, resetFilters } = useJobContext();

  return (
    <div className="space-y-6">
      {/* Collapsible Search & Filter Bar for Large Screens (Hidden on Mobile View) */}
      <div className="hidden md:block bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('filterAndSearch', lang)} {filterCollapsed ? t('collapsed', lang) : t('expanded', lang)}
            </h3>
          </div>

          <button
            onClick={() => setFilterCollapsed(!filterCollapsed)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{filterCollapsed ? t('showFilters', lang) : t('hideFilters', lang)}</span>
            {filterCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {!filterCollapsed && <JobFilter />}
      </div>

      {/* Job List Content */}
      <div className="space-y-6">
        {sortedJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">{t('noJobsFound', lang)}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t('noJobsSub', lang)}
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              {t('resetAllFilters', lang)}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Responsive 3-Column (Large), 2-Column (Medium), 1-Column (Mobile) Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-5">
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Infinite Scroll Load Trigger */}
            {visibleCount < sortedJobs.length && (
              <div ref={observerRef} className="text-center py-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />}
                  <span>আরও পোস্ট লোড করুন (Infinite Scroll)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
