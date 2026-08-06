import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { useJobContext } from '../context/JobContext';
import { Building2, Hourglass, Calendar } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

// Convert English numbers to Bengali numerals
const toBnNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

// Format English date to English/Bengali date badge
const formatDeadlineDate = (dateStr: string, lang: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const bnMonths = [
      'জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    if (lang === 'EN') {
      return `${date.getDate()} ${enMonths[date.getMonth()]} ${date.getFullYear()}`;
    }

    const day = toBnNumber(date.getDate());
    const month = bnMonths[date.getMonth()];
    const year = toBnNumber(date.getFullYear());
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { setSelectedJobForModal, lang } = useJobContext();

  // Live Timer Countdown Hook
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!job.deadline) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
        return;
      }

      const deadlineDate = new Date(job.deadline);
      // End of deadline day (23:59:59)
      deadlineDate.setHours(23, 59, 59, 999);
      const now = new Date().getTime();
      const diff = deadlineDate.getTime() - now;

      if (diff <= 0 || job.status === 'closed') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [job.deadline, job.status]);

  const formattedDate = formatDeadlineDate(job.deadline, lang);

  return (
    <div
      onClick={() => {
        window.location.hash = `#/job/${job.id}`;
        setSelectedJobForModal(job);
      }}
      className="group relative bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between gap-4"
    >
      {/* Top Section: Institute Logo + Full Title */}
      <div className="flex items-start gap-3.5">
        {/* Institute Logo */}
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-12 h-12 rounded-full object-cover bg-white p-0.5 border-2 border-emerald-500/80 shadow-sm shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center font-bold text-white text-[11px] shrink-0 text-center leading-tight p-1 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
        )}

        {/* Full Job Title */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors leading-snug">
            {job.title}
          </h3>
        </div>
      </div>

      {/* Bottom Row: Live Countdown (Left) & Deadline Badge (Right) */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
        {/* Left Side: Live Timer */}
        <div className="flex items-center gap-1.5 font-bold">
          <Hourglass
            className={`w-3.5 h-3.5 ${
              timeLeft.isExpired ? 'text-rose-500' : 'text-amber-400 animate-pulse'
            } shrink-0`}
          />
          {timeLeft.isExpired ? (
            <span className="text-rose-400 font-extrabold text-[11px]">মেয়াদ শেষ</span>
          ) : (
            <span className="text-amber-300 text-[11px] tracking-wide">
              বাকি {toBnNumber(timeLeft.days)}দিন {toBnNumber(timeLeft.hours)}ঘণ্টা {toBnNumber(timeLeft.minutes)}মি {toBnNumber(timeLeft.seconds)}সে
            </span>
          )}
        </div>

        {/* Right Side: Deadline Badge */}
        <div className="bg-sky-700 hover:bg-sky-600 text-white font-extrabold px-3 py-1 rounded-sm text-[11px] sm:text-xs shrink-0 shadow-xs border border-sky-500 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-sky-200" />
          <span>Deadline: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

