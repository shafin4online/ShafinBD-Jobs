import React from 'react';
import { ChevronRight, Home, BookOpen, Layers, HelpCircle, Bookmark, Award, BarChart3, Trophy, Flame } from 'lucide-react';
import { QuestionBankSubject, QuestionBankTopic } from '../../../types/questionBank';

interface BreadcrumbProps {
  currentView: 'subjects' | 'topics' | 'practice' | 'favorites' | 'quiz' | 'analytics' | 'modelTests' | 'modelTestPlayer' | 'modelTestLeaderboard';
  selectedSubject: QuestionBankSubject | null;
  selectedTopic: QuestionBankTopic | null;
  onNavigateHome: () => void;
  onNavigateSubjects: () => void;
  onNavigateTopics: () => void;
  onNavigateModelTests?: () => void;
}

export const QuestionBankBreadcrumb: React.FC<BreadcrumbProps> = ({
  currentView,
  selectedSubject,
  selectedTopic,
  onNavigateHome,
  onNavigateSubjects,
  onNavigateTopics,
  onNavigateModelTests,
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

      {currentView === 'analytics' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>পারফরম্যান্স অ্যানালিটিক্স (Performance Analytics)</span>
          </span>
        </>
      )}

      {currentView === 'modelTests' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-indigo-700">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>লাইভ মডেল টেস্ট (Live Model Tests)</span>
          </span>
        </>
      )}

      {currentView === 'modelTestPlayer' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {onNavigateModelTests ? (
            <button
              onClick={onNavigateModelTests}
              className="hover:text-indigo-600 text-slate-600 font-medium cursor-pointer"
            >
              লাইভ মডেল টেস্ট
            </button>
          ) : (
            <span className="text-slate-600">লাইভ মডেল টেস্ট</span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-rose-600">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>লাইভ পরীক্ষা চলমান</span>
          </span>
        </>
      )}

      {currentView === 'modelTestLeaderboard' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {onNavigateModelTests ? (
            <button
              onClick={onNavigateModelTests}
              className="hover:text-indigo-600 text-slate-600 font-medium cursor-pointer"
            >
              লাইভ মডেল টেস্ট
            </button>
          ) : (
            <span className="text-slate-600">লাইভ মডেল টেস্ট</span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-amber-600">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>জাতীয় মেধা তালিকা (Merit List)</span>
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
