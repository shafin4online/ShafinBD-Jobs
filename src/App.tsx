import React, { useState, useEffect, useRef } from 'react';
import { JobProvider, useJobContext, ADMIN_EMAILS } from './context/JobContext';
import { Sidebar } from './components/Sidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { TopHeader } from './components/TopHeader';
import { JobBoardView } from './components/JobBoardView';
import { JobDetailsPage } from './components/JobDetailsPage';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { StaticPages } from './components/pages/StaticPages';
import { ExamResultsPage } from './components/pages/ExamResultsPage';
import { AuthModal } from './components/AuthModal';
import { AccountActivationModal } from './components/AccountActivationModal';
import { Footer } from './components/Footer';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { NotificationPermissionModal } from './components/NotificationPermissionModal';
import { setupPushBroadcastListener } from './lib/pushNotification';
import { LoginRequiredCard } from './components/LoginRequiredCard';
import { MobileFilterModal } from './components/MobileFilterModal';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    jobs, 
    filters, 
    showAuthModal, 
    setShowAuthModal,
    showActivationModal,
    setShowActivationModal,
    authUser,
    selectedJobForModal,
    setSelectedJobForModal
  } = useJobContext();

  const userEmail = authUser?.email ? authUser.email.trim().toLowerCase() : '';
  const isUserAdmin = !!userEmail && ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === userEmail);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterCollapsed, setFilterCollapsed] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Hash & Popstate Listener for Job Details Page & Mobile Back Button Navigation
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    // Setup real-time push broadcast listener for PWA devices
    const unsubscribe = setupPushBroadcastListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash;
      setCurrentHash(newHash);
      if (!newHash.startsWith('#/job/')) {
        setSelectedJobForModal(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [setSelectedJobForModal]);

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Determine active job from URL hash or context selection
  let currentJobFromHash = null;
  if (currentHash.startsWith('#/job/')) {
    const jobId = currentHash.replace('#/job/', '').split('?')[0];
    currentJobFromHash = jobs.find((j) => j.id === jobId) || selectedJobForModal;
  } else if (selectedJobForModal) {
    currentJobFromHash = selectedJobForModal;
  }

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    // Active vs Inactive Status filter
    if (filters.status === 'active' && job.status === 'closed') return false;
    if (filters.status === 'closed' && job.status !== 'closed') return false;

    // Specific Nav Tab filtering
    if (activeTab === 'govt-jobs' && !job.category.toLowerCase().includes('govt')) return false;
    if (activeTab === 'private-jobs' && !job.category.toLowerCase().includes('private')) return false;
    if (activeTab === 'university-admission' && !job.category.toLowerCase().includes('university') && !job.category.toLowerCase().includes('admission')) return false;

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

  // Sort jobs strictly by application deadline (ending soonest at top)
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const now = new Date().getTime();
    const timeA = a.deadline ? new Date(a.deadline).getTime() : 0;
    const timeB = b.deadline ? new Date(b.deadline).getTime() : 0;

    const isExpiredA = timeA - now <= 0 || a.status === 'closed';
    const isExpiredB = timeB - now <= 0 || b.status === 'closed';

    if (!isExpiredA && !isExpiredB) {
      return timeA - timeB; // Soonest deadline first
    }
    if (isExpiredA && isExpiredB) {
      return timeB - timeA; // Most recently expired first
    }
    return isExpiredA ? 1 : -1; // Active jobs first
  });

  // Reset visible count when filters or active tab change
  useEffect(() => {
    setVisibleCount(6);
  }, [filters, activeTab]);

  // Infinite scroll observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < sortedJobs.length) {
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
  }, [visibleCount, sortedJobs.length]);

  const displayedJobs = sortedJobs.slice(0, visibleCount);

  // If a job page URL or selected job is active, render full-screen Job Details Page
  if (currentJobFromHash) {
    return (
      <JobDetailsPage
        job={currentJobFromHash}
        onBack={() => {
          window.location.hash = '';
          setSelectedJobForModal(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col">
      {/* Fixed Sidebar */}
      {isUserAdmin && activeTab === 'admin' ? (
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      ) : (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Wrapper - Padded on desktop for fixed sidebar */}
      <div className="flex-1 lg:pl-64 sm:lg:pl-72 flex flex-col min-h-screen">
        <TopHeader 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
          onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* JOBS BOARD / SPECIFIC CATEGORIES */}
          {['jobs', 'govt-jobs', 'private-jobs', 'university-admission'].includes(activeTab) && (
            <JobBoardView
              sortedJobs={sortedJobs}
              displayedJobs={displayedJobs}
              visibleCount={visibleCount}
              setVisibleCount={setVisibleCount}
              isLoadingMore={isLoadingMore}
              observerRef={observerRef}
              filterCollapsed={filterCollapsed}
              setFilterCollapsed={setFilterCollapsed}
            />
          )}

          {/* TAB: EXAM RESULTS */}
          {activeTab === 'exam-results' && <ExamResultsPage />}

          {/* TAB: CANDIDATE PROFILE */}
          {activeTab === 'profile' && (
            authUser ? (
              <UserProfile />
            ) : (
              <LoginRequiredCard
                iconType="profile"
                title="লগইন প্রয়োজন (Login Required)"
                description="প্রার্থী প্রোফাইল দেখতে বা তৈরি করতে অনুগ্রহ করে সাইন ইন অথবা নতুন একাউন্ট রেজিস্ট্রেশন করুন।"
              />
            )
          )}

          {/* TAB: APPLICATIONS */}
          {activeTab === 'applications' && (
            authUser ? (
              <UserProfile />
            ) : (
              <LoginRequiredCard
                iconType="applications"
                title="লগইন প্রয়োজন (Login Required)"
                description="আপনার আবেদনের তালিকা ও বিবরণ দেখতে অনুগ্রহ করে সাইন ইন করুন।"
              />
            )
          )}

          {/* TAB: ADMIN PANEL */}
          {activeTab === 'admin' && <AdminPanel />}

          {/* TAB: STATIC PAGES */}
          {['privacy-policy', 'terms', 'about', 'contact'].includes(activeTab) && (
            <StaticPages type={activeTab as any} />
          )}
        </main>

        <Footer />
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <AccountActivationModal isOpen={showActivationModal} onClose={() => setShowActivationModal(false)} />
      <PWAInstallPrompt />
      <NotificationPermissionModal />

      {/* Mobile Filter Sheet Modal */}
      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
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
