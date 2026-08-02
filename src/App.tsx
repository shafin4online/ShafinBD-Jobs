import React from 'react';
import { JobProvider, useJobContext } from './context/JobContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JobCard } from './components/JobCard';
import { JobFilter } from './components/JobFilter';
import { JobDetailsModal } from './components/JobDetailsModal';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { VercelDeployModal } from './components/VercelDeployModal';
import { Footer } from './components/Footer';
import { Briefcase, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, jobs, filters, resetFilters } = useJobContext();

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    // Search keyword
    if (filters.searchKeyword) {
      const query = filters.searchKeyword.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(query);
      const matchCompany = job.company.toLowerCase().includes(query);
      const matchCategory = job.category.toLowerCase().includes(query);
      const matchDesc = job.description.toLowerCase().includes(query);
      if (!matchTitle && !matchCompany && !matchCategory && !matchDesc) {
        return false;
      }
    }

    // Category
    if (filters.category !== 'All' && job.category !== filters.category) {
      return false;
    }

    // Job Type
    if (filters.jobType !== 'All' && job.jobType !== filters.jobType) {
      return false;
    }

    // Location
    if (filters.location !== 'All') {
      if (filters.location === 'Remote') {
        if (job.jobType !== 'Remote' && !job.location.toLowerCase().includes('remote')) {
          return false;
        }
      } else if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    // Experience
    if (filters.experienceLevel !== 'All' && job.experienceLevel !== filters.experienceLevel) {
      return false;
    }

    return true;
  });

  const featuredJobs = filteredJobs.filter((j) => j.featured && j.status === 'active');
  const regularJobs = filteredJobs.filter((j) => !j.featured || j.status !== 'active');

  return (
    <main className="min-h-screen bg-slate-50/70 text-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB: JOBS BOARD */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <HeroSection />

            {/* 2 Column Layout: Filter + Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Sidebar Filter */}
              <div className="lg:col-span-1 sticky top-20">
                <JobFilter />
              </div>

              {/* Main Jobs Listing */}
              <div className="lg:col-span-3 space-y-6">
                {/* Header count */}
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                      <span>Available Job Openings</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showing <strong className="text-slate-900">{filteredJobs.length}</strong> matching positions
                    </p>
                  </div>

                  {(filters.category !== 'All' || filters.searchKeyword !== '' || filters.jobType !== 'All' || filters.location !== 'All') && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Search</span>
                    </button>
                  )}
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No jobs match your search criteria</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      Try clearing your search terms or selecting a different location/category filter.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Featured Openings */}
                    {featuredJobs.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Featured Openings
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {featuredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All / Regular Listings */}
                    {regularJobs.length > 0 && (
                      <div className="space-y-3">
                        {featuredJobs.length > 0 && (
                          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pt-2">
                            All Other Listings
                          </h3>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {regularJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MY PROFILE */}
        {activeTab === 'profile' && <UserProfile />}

        {/* TAB: MY APPLICATIONS */}
        {activeTab === 'applications' && <UserProfile />}

        {/* TAB: ADMIN PANEL */}
        {activeTab === 'admin' && <AdminPanel />}

        {/* TAB: DEPLOY GUIDE */}
        {activeTab === 'deploy-guide' && <VercelDeployModal />}
      </div>

      <JobDetailsModal />
      <Footer />
    </main>
  );
};

export default function App() {
  return (
    <JobProvider>
      <MainContent />
    </JobProvider>
  );
}
