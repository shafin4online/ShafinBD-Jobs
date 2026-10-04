import React from 'react';
import { 
  BookOpen, 
  Flag, 
  Languages, 
  Cpu, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  HelpCircle,
  Award
} from 'lucide-react';
import { QuestionBankSubject, SubjectProgressStats } from '../../../types/questionBank';

interface SubjectCardProps {
  subject: QuestionBankSubject;
  progress?: { viewedCount: number; answeredCount: number; correctCount: number } | null;
  onSelectSubject: (subject: QuestionBankSubject) => void;
  onDirectPractice: (subject: QuestionBankSubject) => void;
  onTakeQuiz?: (subject: QuestionBankSubject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  progress,
  onSelectSubject,
  onDirectPractice,
  onTakeQuiz,
}) => {
  // Render suitable icon based on subject
  const renderIcon = () => {
    switch (subject.icon) {
      case 'Flag':
        return <Flag className="w-6 h-6 text-red-600" />;
      case 'Languages':
        return <Languages className="w-6 h-6 text-blue-600" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-indigo-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getGradient = () => {
    switch (subject.icon) {
      case 'Flag':
        return 'from-red-50 to-orange-50/40 border-red-100 hover:border-red-300';
      case 'Languages':
        return 'from-blue-50 to-indigo-50/40 border-blue-100 hover:border-blue-300';
      case 'Cpu':
        return 'from-indigo-50 to-purple-50/40 border-indigo-100 hover:border-indigo-300';
      default:
        return 'from-emerald-50 to-teal-50/40 border-emerald-100 hover:border-emerald-300';
    }
  };

  const totalQuestions = subject.questionCount || 0;
  const viewedCount = progress?.viewedCount || 0;
  const progressPercent = totalQuestions > 0 
    ? Math.min(100, Math.round((viewedCount / totalQuestions) * 100)) 
    : 0;

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden p-5 ${getGradient()}`}>
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
            {renderIcon()}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white/90 border border-slate-200/90 px-2 py-0.5 rounded-md shadow-2xs">
              <Layers className="w-3 h-3 text-slate-500" />
              <span>{subject.topicCount || 0}টি টপিক</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              <HelpCircle className="w-3 h-3 text-emerald-600" />
              <span>{totalQuestions}টি প্রশ্ন</span>
            </span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1.5">
          {subject.name}
        </h3>

        {subject.description && (
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {subject.description}
          </p>
        )}
      </div>

      {/* Progress & Actions */}
      <div className="pt-3 border-t border-slate-100/90 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>অগ্রগতি (Progress)</span>
            <span className="font-semibold text-slate-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>{viewedCount}টি পড়া হয়েছে</span>
            <span>মোট {totalQuestions}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectSubject(subject)}
              className="flex items-center justify-center gap-1 text-xs font-semibold py-2 px-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
            >
              <span>টপিক তালিকা</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => onDirectPractice(subject)}
              className="flex items-center justify-center gap-1 text-xs font-semibold py-2 px-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 active:scale-98 transition-all cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>পড়ুন ও প্র্যাকটিস</span>
            </button>
          </div>

          {onTakeQuiz && (
            <button
              onClick={() => onTakeQuiz(subject)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 active:scale-98 transition-all cursor-pointer shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>কুইজ পরীক্ষা দিন</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
