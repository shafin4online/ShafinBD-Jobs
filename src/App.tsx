import React, { useState, useEffect, useRef } from 'react';
import { JobProvider, useJobContext } from './context/JobContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { JobCard } from './components/JobCard';
import { JobFilter } from './components/JobFilter';
import { JobDetailsModal } from './components/JobDetailsModal';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { StaticPages } from './components/pages/StaticPages';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Briefcase, Sparkles, AlertCircle, RotateCcw, Filter, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { t } from './translations';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    jobs, 
    filters, 
    resetFilters, 
    showAuthModal, 
    setShowAuthModal,
    lang
  } = useJobContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterCollapsed, setFilterCollapsed] = useState(true);

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    // Specific Nav Tab filtering
    if (activeTab === 'govt-jobs' && job.category !== 'Govt. Job') return false;
    if (activeTab === 'private-jobs' && job.category !== 'Private Job') return false;
    if (activeTab === 'university-admission' && job.category !== 'University Admission Notice') return false;

    // Search keyword
    if (filters.searchKeyword) {
      const query = filters.searchKeyword.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(query);
      const matchCompany = job.company.toLowerCase().includes(query);
      const matchCategory = job.category.toLowerCase().includes(query);
      const matchDesc = job.description.toLowerCase().includes(query);
      if (!matchTitle && !matchCompany && !matchCategory && !matchDesc) return false;
    }

    // Category Filter
    if (filters.category !== 'All' && job.category !== filters.category) return false;

    // Job Type
    if (filters.jobType !== 'All' && job.jobType !== filters.jobType) return false;

    // Location
    if (filters.location !== 'All') {
      if (filters.location === 'Remote') {
        if (job.jobType !== 'Remote' && !job.location.toLowerCase().includes('remote')) return false;
      } else if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    // Experience
    if (filters.experienceLevel !== 'All' && job.experienceLevel !== filters.experienceLevel) return false;

    return true;
  });

  // Reset visible count when filters or active tab change
  useEffect(() => {
    setVisibleCount(6);
  }, [filters, activeTab]);

  // Infinite scroll observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredJobs.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 6);
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { threshold: 0.2 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredJobs.length]);

  const displayedJobs = filteredJobs.slice(0, visibleCount);
  const featuredJobs = displayedJobs.filter((j) => j.featured && j.status === 'active');
  const regularJobs = displayedJobs.filter((j) => !j.featured || j.status !== 'active');

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'govt-jobs':
        return t('govtTitle', lang);
      case 'private-jobs':
        return t('privateTitle', lang);
      case 'university-admission':
        return t('univTitle', lang);
      default:
        return t('allCircularsTitle', lang);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col">
      {/* Fixed Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Wrapper - Padded on desktop for fixed sidebar */}
      <div className="flex-1 lg:pl-64 sm:lg:pl-72 flex flex-col min-h-screen">
        <TopHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* JOBS BOARD / SPECIFIC CATEGORIES */}
          {['jobs', 'govt-jobs', 'private-jobs', 'university-admission'].includes(activeTab) && (
            <div className="space-y-6">
              {/* Collapsible Search & Filter Bar for Large Screens */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
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
                {/* Header Count Bar */}
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>{getSectionTitle()}</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t('totalText', lang)} <strong className="text-slate-900">{filteredJobs.length}</strong> {t('totalOpenings', lang)}
                    </p>
                  </div>

                  {(filters.category !== 'All' || filters.searchKeyword !== '' || filters.jobType !== 'All') && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('resetFilters', lang)}</span>
                    </button>
                  )}
                </div>

                {filteredJobs.length === 0 ? (
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
                    {/* Featured Openings Grid */}
                    {featuredJobs.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            {t('urgentFeatured', lang)}
                          </h3>
                        </div>

                        {/* Responsive 3-Column / 2-Column / 1-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {featuredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular / All Listings Grid */}
                    {regularJobs.length > 0 && (
                      <div className="space-y-3">
                        {featuredJobs.length > 0 && (
                          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pt-2">
                            {t('allOtherOpenings', lang)}
                          </h3>
                        )}

                        {/* Responsive 3-Column / 2-Column / 1-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {regularJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Infinite Scroll Load Trigger */}
                    {visibleCount < filteredJobs.length && (
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
          )}

          {/* TAB: CANDIDATE PROFILE */}
          {activeTab === 'profile' && <UserProfile />}

          {/* TAB: APPLICATIONS */}
          {activeTab === 'applications' && <UserProfile />}

          {/* TAB: ADMIN PANEL */}
          {activeTab === 'admin' && <AdminPanel />}

          {/* TAB: STATIC PAGES */}
          {['privacy-policy', 'terms', 'about', 'contact'].includes(activeTab) && (
            <StaticPages type={activeTab as any} />
          )}

        </main>

        <Footer />
      </div>

      <JobDetailsModal />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default function App() {
  return (
    <JobProvider>
      <MainContent />
    </JobProvider>
  );
}
