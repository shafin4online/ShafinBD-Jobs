import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Flag,
  Send,
  Grid,
  X,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  QuizAttempt,
  QuizConfigOptions,
  QuizQuestionSnapshot,
  CorrectAnswer,
  QuestionDifficulty,
} from '../../../types/questionBank';
import {
  submitQuizAttemptWithAnswers,
  abandonQuizAttempt,
  saveQuizAnswer,
  markForReview,
} from '../services/quizService';
import { QuizResultView } from './QuizResultView';

interface QuizPlayerViewProps {
  initialAttempt: QuizAttempt;
  questions: QuizQuestionSnapshot[];
  config: QuizConfigOptions;
  userId?: string | null;
  onExit: () => void;
  onOpenAuthModal?: () => void;
}

export const QuizPlayerView: React.FC<QuizPlayerViewProps> = ({
  initialAttempt,
  questions,
  config,
  userId,
  onExit,
  onOpenAuthModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<string, { selectedAnswer: CorrectAnswer | null; timeSpentSeconds?: number }>
  >({});
  const [markedQuestionIds, setMarkedQuestionIds] = useState<string[]>([]);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'answered' | 'unanswered' | 'marked'>('all');

  // Submit Modal & Completion State
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);

  // Timer State (Server-anchored, reload-safe UX)
  const initialDuration = config.durationSeconds || 0;
  const calculateRemainingSeconds = () => {
    if (initialDuration <= 0) return 0;
    const startedAtMs = initialAttempt.startedAt?.toDate
      ? initialAttempt.startedAt.toDate().getTime()
      : (initialAttempt.startedAt?.seconds ? initialAttempt.startedAt.seconds * 1000 : Date.now());
    const elapsed = Math.floor((Date.now() - startedAtMs) / 1000);
    return Math.max(0, initialDuration - elapsed);
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateRemainingSeconds);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];

  // Initialize Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      if (initialDuration > 0) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initialDuration]);

  // Answer counts
  const answeredCount = useMemo(() => {
    const list = Object.values(userAnswers) as Array<{ selectedAnswer: CorrectAnswer | null }>;
    return list.filter((a) => a.selectedAnswer !== null).length;
  }, [userAnswers]);

  const unansweredCount = questions.length - answeredCount;
  const markedCount = markedQuestionIds.length;

  // Answer selection handler with incremental auto-saving
  const handleSelectOption = (optionKey: CorrectAnswer) => {
    if (!currentQuestion) return;
    const timeSpent = (userAnswers[currentQuestion.id]?.timeSpentSeconds || 0) + 1;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedAnswer: optionKey,
        timeSpentSeconds: timeSpent,
      },
    }));

    if (userId && initialAttempt.id) {
      saveQuizAnswer(userId, initialAttempt.id, currentQuestion.id, optionKey, timeSpent);
    }
  };

  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedAnswer: null,
      },
    }));

    if (userId && initialAttempt.id) {
      saveQuizAnswer(userId, initialAttempt.id, currentQuestion.id, null);
    }
  };

  const handleToggleMark = () => {
    if (!currentQuestion) return;
    const nextMarked = markedQuestionIds.includes(currentQuestion.id)
      ? markedQuestionIds.filter((id) => id !== currentQuestion.id)
      : [...markedQuestionIds, currentQuestion.id];

    setMarkedQuestionIds(nextMarked);
    if (userId && initialAttempt.id) {
      markForReview(userId, initialAttempt.id, nextMarked);
    }
  };

  // Submit Logic
  const executeSubmit = async (isAutoTimedOut = false) => {
    if (!userId) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuizAttemptWithAnswers({
        userId,
        attemptId: initialAttempt.id,
        questions,
        userAnswers,
        markedQuestionIds,
        timeTakenSeconds: secondsElapsed,
        negativeMarkingPerWrong: config.negativeMarkingPerWrong ?? 0,
        status: isAutoTimedOut ? 'timed-out' : 'completed',
      });

      if (timerRef.current) clearInterval(timerRef.current);
      setCompletedAttempt(res.attempt);
      setShowSubmitModal(false);
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      alert('পরীক্ষা জমা দিতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    executeSubmit(true);
  };

  const handleAbandon = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে কুইজ ছেড়ে যেতে চান? আপনার অগ্রগতি সংরক্ষিত হবে না।')) {
      if (userId && initialAttempt.id) {
        await abandonQuizAttempt(userId, initialAttempt.id, secondsElapsed);
      }
      onExit();
    }
  };

  // Format Time Helper
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If Quiz Completed, render QuizResultView
  if (completedAttempt) {
    return (
      <QuizResultView
        attempt={completedAttempt}
        questions={
          completedAttempt.questionsSnapshot && completedAttempt.questionsSnapshot.length > 0
            ? completedAttempt.questionsSnapshot
            : questions
        }
        userId={userId}
        onRetake={() => {
          setCompletedAttempt(null);
          setUserAnswers({});
          setMarkedQuestionIds([]);
          setCurrentIndex(0);
          setTimeRemaining(initialDuration);
          setSecondsElapsed(0);
        }}
        onNewQuiz={onExit}
        onBackToMain={onExit}
        onOpenAuthModal={onOpenAuthModal}
      />
    );
  }

  const isCurrentMarked = currentQuestion && markedQuestionIds.includes(currentQuestion.id);
  const currentAnswer = currentQuestion ? userAnswers[currentQuestion.id]?.selectedAnswer : null;

  // Filtered Question list for palette
  const filteredPaletteQuestions = questions.filter((q, idx) => {
    const hasAnswer = userAnswers[q.id]?.selectedAnswer !== null && userAnswers[q.id]?.selectedAnswer !== undefined;
    const isMarked = markedQuestionIds.includes(q.id);

    if (paletteFilter === 'answered') return hasAnswer;
    if (paletteFilter === 'unanswered') return !hasAnswer;
    if (paletteFilter === 'marked') return isMarked;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 animate-fade-in text-slate-800">
      {/* Top Bar: Progress, Timer, Submit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Title & Badge */}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold uppercase tracking-wider">
              কুইজ মোড
            </span>
            <span className="text-xs text-slate-500 font-medium">
              উত্তর: {answeredCount}/{questions.length}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 mt-0.5">
            {config.title || 'কুইজ পরীক্ষা'}
          </h1>
        </div>

        {/* Right Tools: Timer, Palette, Submit */}
        <div className="flex items-center gap-2.5">
          {/* Timer Display */}
          {initialDuration > 0 ? (
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-sm font-bold transition-all ${
                timeRemaining < 60
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : timeRemaining < 180
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>
          )}

          {/* Question Palette Toggle */}
          <button
            onClick={() => setShowPalette(!showPalette)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              showPalette
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="প্রশ্ন তালিকা দেখুন"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">প্রশ্ন তালিকা</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>জমা দিন</span>
          </button>

          <button
            onClick={handleAbandon}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="পরীক্ষা ত্যাগ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          {/* Question Meta Header */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold">
                প্রশ্ন {currentIndex + 1} / {questions.length}
              </span>

              {currentQuestion.difficulty && (
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                    currentQuestion.difficulty === 'easy'
                      ? 'bg-emerald-50 text-emerald-700'
                      : currentQuestion.difficulty === 'medium'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {currentQuestion.difficulty === 'easy'
                    ? 'সহজ'
                    : currentQuestion.difficulty === 'medium'
                    ? 'মধ্যম'
                    : 'কঠিন'}
                </span>
              )}

              {currentQuestion.topicName && (
                <span className="text-xs text-slate-500 font-medium">
                  {currentQuestion.topicName}
                </span>
              )}
            </div>

            {/* Mark for Review Button */}
            <button
              onClick={handleToggleMark}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isCurrentMarked
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isCurrentMarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isCurrentMarked ? 'রিভিউ চিহ্নিত' : 'মার্ক করুন'}</span>
            </button>
          </div>

          {/* Question Text Prompt */}
          <div className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </div>

          {/* 4 Interactive Selectable Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
              const optText = currentQuestion.options[optKey];
              if (!optText) return null;

              const isSelected = currentAnswer === optKey;
              const banglaLetters: Record<CorrectAnswer, string> = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' };

              return (
                <button
                  key={optKey}
                  type="button"
                  onClick={() => handleSelectOption(optKey)}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950 font-medium'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 bg-white text-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {banglaLetters[optKey]}
                  </span>
                  <span className="text-sm sm:text-base leading-snug pt-0.5">{optText}</span>
                </button>
              );
            })}
          </div>

          {/* Clear Answer Option */}
          {currentAnswer && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleClearAnswer}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
              >
                উত্তর মুছুন (Clear Answer)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী
        </button>

        <div className="text-xs text-slate-500 font-medium">
          প্রশ্ন {currentIndex + 1} / {questions.length}
        </div>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            পরবর্তী <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            সম্পন্ন করুন <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Collapsible Question Palette Drawer */}
      {showPalette && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-600" />
              সকল প্রশ্নের তালিকা (Question Navigator)
            </h3>
            <button
              onClick={() => setShowPalette(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Palette Filter Chips & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaletteFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  paletteFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                সব ({questions.length})
              </button>
              <button
                onClick={() => setPaletteFilter('answered')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  paletteFilter === 'answered'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                উত্তর ({answeredCount})
              </button>
              <button
                onClick={() => setPaletteFilter('unanswered')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  paletteFilter === 'unanswered'
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                বাকি ({unansweredCount})
              </button>
              <button
                onClick={() => setPaletteFilter('marked')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  paletteFilter === 'marked'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                মার্কড ({markedCount})
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> উত্তর দেওয়া
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> মার্ক করা
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> বাকি
              </span>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1 max-h-60 overflow-y-auto">
            {questions.map((q, idx) => {
              const isAnswered =
                userAnswers[q.id]?.selectedAnswer !== null &&
                userAnswers[q.id]?.selectedAnswer !== undefined;
              const isMarked = markedQuestionIds.includes(q.id);
              const isCurrent = idx === currentIndex;

              // Check if matches palette filter
              let matchesFilter = true;
              if (paletteFilter === 'answered') matchesFilter = isAnswered;
              if (paletteFilter === 'unanswered') matchesFilter = !isAnswered;
              if (paletteFilter === 'marked') matchesFilter = isMarked;

              let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
              if (isAnswered && isMarked) {
                btnStyle = 'bg-amber-500 text-white border-amber-600 ring-2 ring-emerald-500';
              } else if (isAnswered) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-700';
              } else if (isMarked) {
                btnStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
              }

              if (isCurrent) {
                btnStyle += ' ring-2 ring-emerald-500 ring-offset-2';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowPalette(false);
                  }}
                  className={`h-9 rounded-xl border text-xs font-bold transition-all relative flex items-center justify-center ${btnStyle} ${
                    !matchesFilter ? 'opacity-25' : ''
                  }`}
                >
                  {idx + 1}
                  {isMarked && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                আপনি কি পরীক্ষাটি জমা দিতে চান?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                জমা দেওয়ার পর স্বয়ংক্রিয়ভাবে ফলাফল ও সঠিক সমাধান দেখতে পাবেন।
              </p>
            </div>

            {/* Breakdown summary */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>মোট প্রশ্ন:</span>
                <span className="font-bold">{questions.length}টি</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>উত্তর দিয়েছেন:</span>
                <span className="font-bold">{answeredCount}টি</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>বাকি রয়েছে (Skipped):</span>
                <span className="font-bold">{unansweredCount}টি</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>মার্ক করে রেখেছেন:</span>
                <span className="font-bold">{markedCount}টি</span>
              </div>
              {initialDuration > 0 && (
                <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
                  <span>অবশিষ্ট সময়:</span>
                  <span className="font-bold font-mono text-emerald-700">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>

            {unansweredCount > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  আপনার এখনো <strong>{unansweredCount}টি</strong> প্রশ্ন অনুত্তরিত রয়েছে।
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
              >
                পরীক্ষা চালিয়ে যান
              </button>
              <button
                type="button"
                onClick={() => executeSubmit(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    জমা হচ্ছে...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    হ্যাঁ, জমা দিন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
