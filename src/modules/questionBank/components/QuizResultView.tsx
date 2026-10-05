import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Filter,
  Lightbulb,
  Heart,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Zap,
  Check,
  BarChart3,
} from 'lucide-react';
import {
  QuizAttempt,
  QuizQuestionSnapshot,
  CorrectAnswer,
} from '../../../types/questionBank';
import { toggleFavorite } from '../services/favoriteService';

interface QuizResultViewProps {
  attempt: QuizAttempt;
  questions: QuizQuestionSnapshot[];
  userId?: string | null;
  onRetake: () => void;
  onNewQuiz: () => void;
  onBackToMain: () => void;
  onOpenAuthModal?: () => void;
  onViewAnalytics?: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  attempt,
  questions,
  userId,
  onRetake,
  onNewQuiz,
  onBackToMain,
  onOpenAuthModal,
  onViewAnalytics,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});
  const [copiedShareToast, setCopiedShareToast] = useState<boolean>(false);

  // Authoritative question list: server-provided snapshot preferred
  const reviewQuestions =
    attempt.questionsSnapshot && attempt.questionsSnapshot.length > 0
      ? attempt.questionsSnapshot
      : questions;

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} মি. ${secs} সে.`;
  };

  const toggleExplanation = (questionId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleToggleFavorite = async (question: QuizQuestionSnapshot) => {
    if (!userId) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    try {
      const isFav = await toggleFavorite(userId, question as any);
      setFavoriteMap((prev) => ({ ...prev, [question.id]: isFav }));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Performance Assessment
  const percentage = attempt.percentage || 0;
  let gradeText = 'আরও অনুশীলন প্রয়োজন';
  let gradeBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  let gradeIcon = AlertTriangle;

  if (percentage >= 80) {
    gradeText = 'অসাধারণ প্রস্তুতি! (Outstanding)';
    gradeBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    gradeIcon = Award;
  } else if (percentage >= 60) {
    gradeText = 'বেশ ভালো প্রচেষ্টা! (Good Job)';
    gradeBadgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
    gradeIcon = Sparkles;
  }

  const GradeIconComponent = gradeIcon;

  // Time & Speed Analysis
  const totalQuestionsCount = attempt.totalQuestions || reviewQuestions.length || 1;
  const timeTaken = attempt.timeTakenSeconds || 0;
  const avgSecondsPerQ = Math.round(timeTaken / totalQuestionsCount);

  let speedBadge = 'স্বাভাবিক গতি (Normal Pace)';
  let speedColor = 'text-blue-600 bg-blue-50 border-blue-200';
  if (avgSecondsPerQ > 0 && avgSecondsPerQ <= 30) {
    speedBadge = 'খুব দ্রুত গতি (Fast Pace)';
    speedColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (avgSecondsPerQ > 60) {
    speedBadge = 'ধীরস্থির ও সতর্ক (Careful Pace)';
    speedColor = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  // Question Filter
  const filteredQuestions = reviewQuestions.filter((q) => {
    const ans = attempt.answers[q.id];
    if (filterMode === 'correct') return ans?.isCorrect;
    if (filterMode === 'wrong') return ans?.selectedAnswer && !ans.isCorrect;
    if (filterMode === 'skipped') return !ans?.selectedAnswer;
    return true;
  });

  // Share Result Handler
  const handleShareResult = async () => {
    const shareText = `🎯 ${attempt.title || 'কুইজ পরীক্ষা'}\n🏆 প্রাপ্ত স্কোর: ${attempt.score} (সঠিকতার হার: ${attempt.percentage}%)\n✅ সঠিক: ${attempt.correctAnswers} | ❌ ভুল: ${attempt.wrongAnswers} | ⏳ অনুত্তরিত: ${attempt.skippedAnswers}\n⏱️ সময়: ${formatTime(timeTaken)}\n\nShafin BD Jobs কুইজ ও প্রশ্নব্যাংক দিয়ে আপনার প্রস্তুতি যাচাই করুন!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: attempt.title || 'কুইজ ফলাফল',
          text: shareText,
        });
        return;
      } catch (e) {
        // User cancelled or share unavailable, fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShareToast(true);
      setTimeout(() => setCopiedShareToast(false), 3000);
    } catch (clipErr) {
      console.error('Clipboard copy error:', clipErr);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToMain}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> প্রশ্নব্যাংকে ফিরে যান
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShareResult}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors shadow-xs"
            title="ফলাফল শেয়ার করুন"
          >
            {copiedShareToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>শেয়ার করুন</span>
              </>
            )}
          </button>
          {onViewAnalytics && (
            <button
              onClick={onViewAnalytics}
              className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="পারফরম্যান্স অ্যানালিটিক্স ও দুর্বল টপিক দেখুন"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>অ্যানালিটিক্স</span>
            </button>
          )}
          <button
            onClick={onRetake}
            className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> পুনরায় পরীক্ষা
          </button>
          <button
            onClick={onNewQuiz}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> নতুন কুইজ
          </button>
        </div>
      </div>

      {/* Main Scorecard Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 p-6 text-white text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold mb-3">
            <GradeIconComponent className="w-3.5 h-3.5" />
            <span>{gradeText}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">
            {attempt.title || 'কুইজ ফলাফল'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            {attempt.subjectName ? `${attempt.subjectName}` : 'সমন্বিত কুইজ'} • {attempt.totalQuestions}টি প্রশ্ন
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-6 py-4 min-w-[140px]">
              <div className="text-3xl sm:text-4xl font-black text-amber-300">
                {attempt.score}
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-0.5">মোট প্রাপ্ত স্কোর</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-6 py-4 min-w-[140px]">
              <div className="text-3xl sm:text-4xl font-black text-white">
                {attempt.percentage}%
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-0.5">সঠিকতার হার (Accuracy)</div>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">সঠিক উত্তর</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{attempt.correctAnswers}</div>
            <div className="text-[11px] text-slate-500">+{attempt.correctAnswers} মার্ক</div>
          </div>

          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-rose-600 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">ভুল উত্তর</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{attempt.wrongAnswers}</div>
            <div className="text-[11px] text-rose-500">
              -{((attempt.negativeMarkingPerWrong || 0) * attempt.wrongAnswers).toFixed(2)} নেগেটিভ
            </div>
          </div>

          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">অনুত্তরিত (Skipped)</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{attempt.skippedAnswers}</div>
            <div className="text-[11px] text-slate-500">০.০০ মার্ক</div>
          </div>

          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">ব্যয়িত সময়</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              {formatTime(timeTaken)}
            </div>
            <div className="text-[11px] text-slate-500">
              {attempt.durationSeconds > 0 ? `বরাদ্দ: ${formatTime(attempt.durationSeconds)}` : 'আনলিমিটেড'}
            </div>
          </div>
        </div>

        {/* Time Analysis Banner */}
        <div className="p-4 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>
              প্রশ্নপ্রতি গড় ব্যয়িত সময়: <strong>{avgSecondsPerQ} সেকেন্ড</strong>
            </span>
          </div>
          <div className={`px-2.5 py-1 rounded-lg border font-semibold text-xs ${speedColor}`}>
            {speedBadge}
          </div>
        </div>

        {/* Actionable Analytics Callout */}
        {onViewAnalytics && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                  আপনার দুর্বল ও শক্তিশালী টপিক বিশ্লেষণ দেখুন
                </strong>
                <span className="text-slate-600 text-[11px]">
                  কোন কোন বিষয়ে আরও অনুশীলন দরকার তা জানতে পারফরম্যান্স অ্যানালিটিক্স দেখুন
                </span>
              </div>
            </div>
            <button
              onClick={onViewAnalytics}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <span>অ্যানালিটিক্স ড্যাশবোর্ড</span>
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              উত্তর ও পূর্ণাঙ্গ সমাধান পর্যালোচনা (Question Review)
            </h2>
            <p className="text-xs text-slate-500">
              প্রতিটি প্রশ্নের সঠিক উত্তর ও বিশদ ব্যাখ্যা দেখে প্রস্তুতি ঝালাই করুন
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সব ({reviewQuestions.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                filterMode === 'correct'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              সঠিক ({attempt.correctAnswers})
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                filterMode === 'wrong'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              ভুল ({attempt.wrongAnswers})
            </button>
            <button
              onClick={() => setFilterMode('skipped')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                filterMode === 'skipped'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              অনুত্তরিত ({attempt.skippedAnswers})
            </button>
          </div>
        </div>

        {/* Question Review Cards List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const ansRecord = attempt.answers[q.id];
            const userSelection = ansRecord?.selectedAnswer;
            const isCorrect = ansRecord?.isCorrect;
            const isSkipped = !userSelection;
            const isExpanded = expandedExplanations[q.id] ?? true; // expanded by default in review
            const isFav = favoriteMap[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                      প্রশ্ন #{idx + 1}
                    </span>

                    {/* Status Badge */}
                    {isCorrect ? (
                      <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক উত্তর (+১.০০)
                      </span>
                    ) : isSkipped ? (
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium">
                        উত্তর দেননি (০.০০)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> ভুল উত্তর (-{attempt.negativeMarkingPerWrong || 0})
                      </span>
                    )}

                    {q.topicName && (
                      <span className="text-xs text-slate-500 font-medium">
                        • {q.topicName}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(q)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isFav
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:border-slate-300'
                    }`}
                    title={isFav ? 'সংরক্ষিত তালিকা থেকে মুছুন' : 'ফেভারিটে যুক্ত করুন'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Question Prompt */}
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {q.question}
                </div>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const optText = q.options[optKey];
                    if (!optText) return null;

                    const isThisCorrect = q.correctAnswer === optKey;
                    const isThisUserSelected = userSelection === optKey;

                    let optBg = 'bg-slate-50 border-slate-200 text-slate-700';
                    let badgeBg = 'bg-slate-200 text-slate-700';

                    if (isThisCorrect) {
                      optBg = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20';
                      badgeBg = 'bg-emerald-600 text-white font-bold';
                    } else if (isThisUserSelected && !isThisCorrect) {
                      optBg = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20';
                      badgeBg = 'bg-rose-600 text-white font-bold';
                    }

                    const banglaLetters: Record<CorrectAnswer, string> = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' };

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-xl border flex items-center justify-between text-sm transition-all ${optBg}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 ${badgeBg}`}>
                            {banglaLetters[optKey]}
                          </span>
                          <span className="font-medium">{optText}</span>
                        </div>
                        {isThisCorrect && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-4 h-4" /> সঠিক
                          </span>
                        )}
                        {isThisUserSelected && !isThisCorrect && (
                          <span className="text-xs font-bold text-rose-700 flex items-center gap-1 shrink-0">
                            <XCircle className="w-4 h-4" /> আপনার উত্তর
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {q.explanation && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mb-2"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'ব্যাখ্যা লুকান' : 'ব্যাখ্যা দেখুন'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1.5 animate-fade-in">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          বিশদ ব্যাখ্যা:
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">{q.explanation}</p>
                        {q.source && (
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-amber-200/40">
                            সূত্র: <span className="font-medium text-slate-700">{q.source}</span>
                            {q.examName && ` • ${q.examName}`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
