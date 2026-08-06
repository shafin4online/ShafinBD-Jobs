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

        <main className="flex-1 p-3 sm:p-6 md:p-8 flex flex-col items-center max-w-4xl w-full mx-auto space-y-6">
          
          {/* Main Title Section - Prominent Cyan/Sky Blue */}
          <div className="text-center pt-2 pb-2 space-y-2 w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-sky-400 leading-snug tracking-wide">
              {job.title}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              পোস্ট আইডি: <span className="font-mono text-slate-300">/job/{job.id}</span>
            </p>
          </div>

          {/* Informational Details Section with Finger Point Emojis (👉) & Flags */}
          <div className="bg-slate-950/90 rounded-2xl p-5 sm:p-7 border border-slate-900 space-y-3 text-sm sm:text-base leading-relaxed text-slate-200 font-medium w-full">
            
            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">Deadline :</strong>{' '}
                <span className="text-amber-300 font-bold">{job.deadline}</span>
              </span>
            </p>

            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">আবেদন শুরুঃ</strong>{' '}
                <span className="text-emerald-400 font-bold">{job.startDate || 'বিজ্ঞপ্তি প্রকাশিত'}</span>
              </span>
            </p>

            <div className="py-2 text-center text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
              <span>🇧🇩</span>
              <span className="text-sky-300 border-b border-sky-500/40 pb-0.5">নিয়োগ বিজ্ঞপ্তি</span>
              <span>🇧🇩</span>
            </div>

            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">প্রতিষ্ঠানঃ</strong> {job.company}
              </span>
            </p>

            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">পদের নামঃ</strong> {job.position || job.title}
              </span>
            </p>

            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">পদ সংখ্যাঃ</strong>{' '}
                <span className="text-emerald-400 font-bold">{job.vacancies || 'বিজ্ঞপ্তিতে উল্লিখিত'}</span>
              </span>
            </p>

            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">আবেদন ফিঃ</strong> {job.applicationFee || 'বিজ্ঞপ্তি অনুযায়ী'}
              </span>
            </p>

            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">আবেদন শুরুঃ</strong> {job.startDate || 'বিজ্ঞপ্তি প্রকাশিত'}
              </span>
            </p>

            {job.applicationUrl && (
              <p className="flex items-start gap-2 break-all">
                <span>👉</span>
                <span>
                  <strong className="text-slate-100">আবেদনের লিংকঃ</strong>{' '}
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline font-semibold"
                  >
                    {job.applicationUrl}
                  </a>
                </span>
              </p>
            )}

            <p className="flex items-start gap-2">
              <span>👉</span>
              <span>
                <strong className="text-slate-100">আবেদনের শেষ তারিখঃ</strong>{' '}
                <span className="text-rose-400 font-bold">{job.deadline}</span>
              </span>
            </p>

            {/* Description Breakdown Lines if provided */}
            {job.description && (
              <div className="pt-3 border-t border-slate-900 space-y-2 text-slate-300">
                {job.description.split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span>👉</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Big Bright Blue Button: "সম্পূর্ণ নিয়োগ বিজ্ঞপ্তি" */}
          <div className="flex justify-center pt-2">
            {(job.circularUrl || job.applicationUrl) ? (
              <a
                href={job.circularUrl || job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>সম্পূর্ণ নিয়োগ বিজ্ঞপ্তি</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <a
                href="#circular-image"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>সম্পূর্ণ নিয়োগ বিজ্ঞপ্তি</span>
              </a>
            )}
          </div>

          {/* Official Circular Notice Image Section */}
          <div id="circular-image" className="pt-4 space-y-3 w-full">
            {job.imageUrl ? (
              <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-xl overflow-hidden border border-slate-800">
                <img
                  src={job.imageUrl}
                  alt={job.title}
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800 space-y-2">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">অফিসিয়াল নিয়োগ বিজ্ঞপ্তির ছবি দেখতে উপরের লিংকে ভিজিট করুন</p>
                {job.company && <p className="text-xs text-slate-500">{job.company}</p>}
              </div>
            )}
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

