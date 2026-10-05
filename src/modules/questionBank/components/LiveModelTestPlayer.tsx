import React, { useState, useEffect } from 'react';
import {
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  Loader2,
  Trophy,
  ArrowLeft,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  LiveModelTest,
  UserLiveModelTestSubmission,
} from '../../../types/modelTest';
import { QuizQuestionSnapshot, CorrectAnswer } from '../../../types/questionBank';
import { submitLiveModelTest } from '../services/modelTestService';

interface LiveModelTestPlayerProps {
  test: LiveModelTest;
  questions: QuizQuestionSnapshot[];
  userId: string;
  userName: string;
  userPhoto?: string;
  onExit: () => void;
  onViewLeaderboard: () => void;
}

export const LiveModelTestPlayer: React.FC<LiveModelTestPlayerProps> = ({
  test,
  questions,
  userId,
  userName,
  userPhoto,
  onExit,
  onViewLeaderboard,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<string, { selectedAnswer: CorrectAnswer | null; timeSpentSeconds?: number }>
  >({});
  const [markedIds, setMarkedIds] = useState<string[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<UserLiveModelTestSubmission | null>(null);

  // Synchronized countdown timer
  const initialSeconds = test.durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState<number>(initialSeconds);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    if (submissionResult || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [submissionResult, isSubmitting]);

  // Auto-submit when time expires
  const handleAutoSubmit = async () => {
    if (isSubmitting || submissionResult) return;
    await executeSubmission();
  };

  // Submit handler
  const executeSubmission = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitLiveModelTest(
        test,
        userId,
        userName,
        userPhoto,
        userAnswers,
        secondsElapsed,
        questions
      );
      setSubmissionResult(result);
      setShowSubmitModal(false);
    } catch (err) {
      console.warn('Notice submitting model test:', err);
      // Construct local fallback result so the student never loses exam progress
      let correctCount = 0;
      let wrongCount = 0;
      for (const q of questions) {
        const ans = userAnswers[q.id]?.selectedAnswer;
        if (ans) {
          if (ans === q.correctAnswer) correctCount++;
          else wrongCount++;
        }
      }
      const rawScore = correctCount - wrongCount * (test.negativeMarking || 0);
      const finalScore = parseFloat(Math.max(0, rawScore).toFixed(2));
      const fallbackResult: UserLiveModelTestSubmission = {
        id: userId,
        modelTestId: test.id,
        userId,
        userName,
        userPhoto,
        answers: {},
        score: finalScore,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        skippedAnswers: questions.length - (correctCount + wrongCount),
        percentage: Math.round((correctCount / (questions.length || 1)) * 100),
        timeTakenSeconds: secondsElapsed,
        isPassed: finalScore >= (test.passMarks || 0),
        status: 'completed',
        startedAt: test.startsAt,
        completedAt: test.startsAt,
      };
      setSubmissionResult(fallbackResult);
      setShowSubmitModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (qId: string, opt: CorrectAnswer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedAnswer: prev[qId]?.selectedAnswer === opt ? null : opt,
        timeSpentSeconds: (prev[qId]?.timeSpentSeconds || 0) + 1,
      },
    }));
  };

  const toggleMark = (qId: string) => {
    setMarkedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If completed, show live result summary card
  if (submissionResult) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6 animate-fade-in text-slate-800">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden text-center">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-8 text-white relative">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <h2 className="text-2xl font-black">মডেল টেস্ট সম্পন্ন হয়েছে!</h2>
            <p className="text-xs text-indigo-100 mt-1">{test.title}</p>

            <div className="mt-6 inline-block bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-8 py-4">
              <div className="text-4xl font-black text-amber-300">
                {submissionResult.score}
              </div>
              <div className="text-xs text-indigo-100 mt-0.5">মোট প্রাপ্ত স্কোর (পূর্ণমান {test.totalMarks})</div>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50 p-4 text-center">
            <div>
              <div className="text-emerald-600 font-bold text-lg sm:text-xl">
                {submissionResult.correctAnswers}টি
              </div>
              <div className="text-[11px] text-slate-500">সঠিক উত্তর</div>
            </div>
            <div>
              <div className="text-rose-600 font-bold text-lg sm:text-xl">
                {submissionResult.wrongAnswers}টি
              </div>
              <div className="text-[11px] text-slate-500">ভুল উত্তর (-{((test.negativeMarking || 0) * submissionResult.wrongAnswers).toFixed(2)})</div>
            </div>
            <div>
              <div className="text-slate-700 font-bold text-lg sm:text-xl">
                {submissionResult.skippedAnswers}টি
              </div>
              <div className="text-[11px] text-slate-500">উত্তরহীন</div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>পাস মার্কস: <strong>{test.passMarks}</strong></span>
              <span className={`font-bold px-2.5 py-1 rounded-lg ${
                submissionResult.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {submissionResult.isPassed ? 'উত্তীর্ণ (Passed)' : 'অনুত্তীর্ণ (Failed)'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onViewLeaderboard}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Trophy className="w-4 h-4 text-slate-950" />
                <span>জাতীয় মেধা তালিকা ও র‍্যাংকিং দেখুন</span>
              </button>
              <button
                onClick={onExit}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                মডেল টেস্ট তালিকায় ফিরুন
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isMarked = currentQ && markedIds.includes(currentQ.id);
  const currentSelection = currentQ ? userAnswers[currentQ.id]?.selectedAnswer : null;
  const answeredCount = Object.values(userAnswers).filter(
    (a) => (a as { selectedAnswer: CorrectAnswer | null })?.selectedAnswer !== null
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16 animate-fade-in text-slate-800">
      {/* Live Exam Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            লাইভ পরীক্ষা চলছে
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-md">
            {test.title}
          </h2>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl font-mono text-sm sm:text-base font-black flex items-center gap-2 border shadow-xs ${
            timeRemaining < 300
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>সাবমিট</span>
          </button>
        </div>
      </div>

      {/* Question Palette Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {questions.map((q, idx) => {
            const isAns = userAnswers[q.id]?.selectedAnswer !== null && userAnswers[q.id]?.selectedAnswer !== undefined;
            const isMrk = markedIds.includes(q.id);
            const isCurr = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isCurr
                    ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white'
                    : isMrk
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : isAns
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">
              প্রশ্ন {currentIndex + 1} / {questions.length}
            </span>

            <button
              onClick={() => toggleMark(currentQ.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isMarked
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{isMarked ? 'রিভিউ মার্কড' : 'মার্ক ফর রিভিউ'}</span>
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {(['A', 'B', 'C', 'D'] as CorrectAnswer[]).map((optKey) => {
              const optText = currentQ.options[optKey];
              if (!optText) return null;
              const isSelected = currentSelection === optKey;

              return (
                <button
                  key={optKey}
                  onClick={() => handleSelectOption(currentQ.id, optKey)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {optKey.toUpperCase()}
                  </span>
                  <span className="flex-1">{optText}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> আগের প্রশ্ন
            </button>

            <span className="text-xs text-slate-500">
              উত্তর দেওয়া হয়েছে: <strong>{answeredCount}</strong> / {questions.length}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
            >
              পরের প্রশ্ন <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              মডেল টেস্ট সাবমিট করতে চান?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনি মোট {questions.length}টির মধ্যে <strong>{answeredCount}টি</strong> প্রশ্নের উত্তর দিয়েছেন। সাবমিট করার পর ফলাফল ও জাতীয় মেধা তালিকা গণনা করা হবে।
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                পরীক্ষা চালিয়ে যান
              </button>
              <button
                onClick={executeSubmission}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>হ্যাঁ, সাবমিট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
