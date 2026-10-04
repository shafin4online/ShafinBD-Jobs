import React from 'react';
import { ChevronRight, Home, BookOpen, Layers, HelpCircle, Bookmark, Award } from 'lucide-react';
import { QuestionBankSubject, QuestionBankTopic } from '../../../types/questionBank';

interface BreadcrumbProps {
  currentView: 'subjects' | 'topics' | 'practice' | 'favorites' | 'quiz';
  selectedSubject: QuestionBankSubject | null;
  selectedTopic: QuestionBankTopic | null;
  onNavigateHome: () => void;
  onNavigateSubjects: () => void;
  onNavigateTopics: () => void;
}

export const QuestionBankBreadcrumb: React.FC<BreadcrumbProps> = ({
  currentView,
  selectedSubject,
  selectedTopic,
  onNavigateHome,
  onNavigateSubjects,
  onNavigateTopics,
}) => {
  return (
    <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-slate-500 bg-white/80 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-xs mb-4">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-emerald-600 transition-colors text-slate-600 font-medium cursor-pointer"
        title="হোম পেজে ফিরুন"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>হোম</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

      <button
        onClick={onNavigateSubjects}
        className={`flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer ${
          currentView === 'subjects' ? 'font-semibold text-emerald-700' : 'text-slate-600'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>প্রশ্নব্যাংক (Question Bank)</span>
      </button>

      {currentView === 'favorites' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-rose-600">
            <Bookmark className="w-3.5 h-3.5" />
            <span>সংরক্ষিত ও প্রিয় প্রশ্নসমূহ</span>
          </span>
        </>
      )}

      {currentView === 'quiz' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>কুইজ পরীক্ষা (Active Quiz)</span>
          </span>
        </>
      )}

      {selectedSubject && (currentView === 'topics' || currentView === 'practice') && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={onNavigateTopics}
            className={`truncate max-w-[140px] sm:max-w-[200px] hover:text-emerald-600 transition-colors cursor-pointer ${
              currentView === 'topics' ? 'font-semibold text-emerald-700' : 'text-slate-600'
            }`}
          >
            {selectedSubject.name}
          </button>
        </>
      )}

      {selectedTopic && currentView === 'practice' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-emerald-700 truncate max-w-[140px] sm:max-w-[220px]">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{selectedTopic.name}</span>
          </span>
        </>
      )}

      {currentView === 'practice' && !selectedTopic && selectedSubject && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>সকল প্রশ্ন অনুশীলন</span>
          </span>
        </>
      )}
    </nav>
  );
};
