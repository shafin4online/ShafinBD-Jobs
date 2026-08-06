import React from 'react';
import { Filter, X } from 'lucide-react';
import { JobFilter } from './JobFilter';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-slate-100 text-sm">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>ফিল্টার ও সার্চ অপশন (Job Search Filters)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <JobFilter />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            ফিল্টার প্রয়োগ করুন (Apply Filters)
          </button>
        </div>
      </div>
    </div>
  );
};
