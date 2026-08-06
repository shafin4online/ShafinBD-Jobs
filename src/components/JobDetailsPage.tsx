import React, { useState } from 'react';
import { Job } from '../types';
import { ExternalLink, Building2, Share2, Send, MessageCircle } from 'lucide-react';
import { TopHeader } from './TopHeader';
import { Sidebar } from './Sidebar';
import { AdminSidebar } from './AdminSidebar';
import { MobileFilterModal } from './MobileFilterModal';
import { Footer } from './Footer';
import { useJobContext, ADMIN_EMAILS } from '../context/JobContext';

interface JobDetailsPageProps {
  job: Job;
  onBack: () => void;
}

export const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ job, onBack }) => {
  const { authUser, activeTab } = useJobContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const userEmail = authUser?.email ? authUser.email.trim().toLowerCase() : '';
  const isUserAdmin = !!userEmail && ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === userEmail);

  const shareableUrl = `${window.location.origin}${window.location.pathname}#/job/${job.id}`;
  const shareText = `${job.title} - ${job.company || 'চাকরির বিজ্ঞপ্তি'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: shareText,
          url: shareableUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`;
  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareableUrl}`)}`;
  const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col">
      {/* Fixed Sidebar */}
      {isUserAdmin && activeTab === 'admin' ? (
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      ) : (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-64 sm:lg:pl-72 flex flex-col min-h-screen">
        <TopHeader 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
          onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
          hideMobileSubNav={true}
        />

        <main className="flex-1 p-2 sm:p-4 md:p-6 flex flex-col items-center max-w-4xl w-full mx-auto space-y-3">
          
          {/* Main Title Section - Prominent Cyan/Sky Blue */}
          <div className="text-center pt-1 pb-1 space-y-1 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-sky-400 leading-snug tracking-wide">
              {job.title}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              পোস্ট আইডি: <span className="font-mono text-slate-300">/job/{job.id}</span>
            </p>
          </div>

          {/* Informational Details Section with Finger Point Emojis (👉) & Flags - Minimal Padding & Compact Spacing */}
          <div className="bg-slate-950/90 rounded-xl p-3 sm:p-4 border border-slate-900 space-y-1 sm:space-y-1.5 text-xs sm:text-sm leading-tight text-slate-200 font-medium w-full">
            
            {/* Header Banner */}
            <div className="py-1 my-0.5 text-center text-sm sm:text-base font-bold text-slate-100 flex items-center justify-center gap-2">
              <span>🇧🇩</span>
              <span className="text-sky-300 border-b border-sky-500/40 pb-0.5">নিয়োগ বিজ্ঞপ্তি</span>
              <span>🇧🇩</span>
            </div>

            {/* Company / Institution */}
            {job.company && job.company.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">প্রতিষ্ঠানঃ</strong> {job.company.trim()}
                </span>
              </p>
            )}

            {/* Position */}
            {job.position && job.position.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">পদের নামঃ</strong> {job.position.trim()}
                </span>
              </p>
            )}

            {/* Vacancies */}
            {job.vacancies && job.vacancies.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">পদ সংখ্যাঃ</strong>{' '}
                  <span className="text-emerald-400 font-bold">{job.vacancies.trim()}</span>
                </span>
              </p>
            )}

            {/* Application Fee */}
            {job.applicationFee && job.applicationFee.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">আবেদন ফিঃ</strong> {job.applicationFee.trim()}
                </span>
              </p>
            )}

            {/* Start Date */}
            {job.startDate && job.startDate.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">আবেদন শুরুঃ</strong>{' '}
                  <span className="text-emerald-400 font-bold">{job.startDate.trim()}</span>
                </span>
              </p>
            )}

            {/* Application Link */}
            {job.applicationUrl && job.applicationUrl.trim() && (
              <p className="flex items-start gap-1.5 break-all">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">আবেদনের লিংকঃ</strong>{' '}
                  <a
                    href={job.applicationUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline font-semibold"
                  >
                    {job.applicationUrl.trim()}
                  </a>
                </span>
              </p>
            )}

            {/* Deadline */}
            {job.deadline && job.deadline.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">আবেদনের শেষ তারিখঃ</strong>{' '}
                  <span className="text-rose-400 font-bold">{job.deadline.trim()}</span>
                </span>
              </p>
            )}

            {/* Exam Date if present */}
            {job.examDate && job.examDate.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">পরীক্ষার তারিখঃ</strong>{' '}
                  <span className="text-amber-300 font-bold">{job.examDate.trim()}</span>
                </span>
              </p>
            )}

            {/* Result Date if present */}
            {job.resultDate && job.resultDate.trim() && (
              <p className="flex items-start gap-1.5">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">ফলাফল প্রকাশের তারিখঃ</strong>{' '}
                  <span className="text-emerald-400 font-bold">{job.resultDate.trim()}</span>
                </span>
              </p>
            )}

            {/* Description Breakdown Lines if provided */}
            {job.description && job.description.trim() && (
              <div className="pt-1.5 border-t border-slate-900 space-y-1 text-slate-300">
                {job.description.trim().split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="flex items-start gap-1.5">
                    <span>👉</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Big Bright Blue Button: "সম্পূর্ণ নিয়োগ বিজ্ঞপ্তি" - ONLY shown if a link exists */}
          {(job.circularUrl?.trim() || job.applicationUrl?.trim()) && (
            <div className="flex justify-center pt-2">
              <a
                href={(job.circularUrl?.trim() || job.applicationUrl?.trim())}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>সম্পূর্ণ নিয়োগ বিজ্ঞপ্তি</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}

          {/* Official Circular Notice Image Section */}
          <div id="circular-image" className="pt-4 space-y-4 w-full">
            {(() => {
              const imagesList =
                job.imageUrls && Array.isArray(job.imageUrls) && job.imageUrls.length > 0
                  ? job.imageUrls
                  : job.imageUrl
                  ? [job.imageUrl]
                  : [];

              if (imagesList.length === 0) {
                return (
                  <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800 space-y-2">
                    <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">অফিসিয়াল নিয়োগ বিজ্ঞপ্তির ছবি দেখতে উপরের লিংকে ভিজিট করুন</p>
                    {job.company && <p className="text-xs text-slate-500">{job.company}</p>}
                  </div>
                );
              }

              return (
                <div className="space-y-4 -mx-2 sm:mx-0">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-3 sm:px-1">
                    <span>অফিসিয়াল নিয়োগ / ফলাফল বিজ্ঞপ্তি ({imagesList.length} টি পৃষ্ঠা)</span>
                    <span className="text-emerald-400">নিচে স্ক্রোল করে সব পৃষ্ঠা দেখুন ↓</span>
                  </div>

                  {imagesList.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-none sm:rounded-2xl p-0 sm:p-4 shadow-xl overflow-hidden border-y sm:border border-slate-800 space-y-2"
                    >
                      {imagesList.length > 1 && (
                        <div className="bg-slate-900 text-emerald-400 font-black text-xs px-3 py-1.5 m-2 rounded-xl w-fit">
                          বিজ্ঞপ্তি পৃষ্ঠা {idx + 1} / {imagesList.length}
                        </div>
                      )}
                      <img
                        src={imgUrl}
                        alt={`${job.title} - Page ${idx + 1}`}
                        className="w-full h-auto block rounded-none sm:rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Social Share Section at the bottom */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-900 text-center space-y-4 w-full">
            <div className="flex items-center justify-center gap-2 text-slate-300 font-extrabold text-sm sm:text-base">
              <Share2 className="w-5 h-5 text-sky-400" />
              <span>বন্ধুদের সাথে শেয়ার করুন (Share Job Circular)</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* WhatsApp */}
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={fbShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              {/* Telegram */}
              <a
                href={tgShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              {/* Native Share / Copy */}
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm transition-all border border-slate-700 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>
                  {copied ? 'লিংক কপি হয়েছে!' : 'আরও শেয়ার / কপি'}
                </span>
              </button>
            </div>
          </div>

        </main>

        <Footer />
      </div>

      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
    </div>
  );
};

