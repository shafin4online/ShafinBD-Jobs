import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  BookOpen, 
  HelpCircle, 
  RotateCcw, 
  Eye, 
  Check, 
  Award, 
  TrendingUp,
  Share2,
  BookmarkCheck,
  ListFilter
} from 'lucide-react';
import { 
  QuestionBankQuestion, 
  QuestionBankSubject, 
  QuestionBankTopic, 
  CorrectAnswer 
} from '../../../types/questionBank';
import { markQuestionViewed, saveAnswer } from '../services/progressService';
import { toggleFavorite, isFavorite } from '../services/favoriteService';

interface QuestionPracticeViewProps {
  questions: QuestionBankQuestion[];
  subject: QuestionBankSubject | null;
  topic: QuestionBankTopic | null;
  userId?: string | null;
  title?: string;
  onBack: () => void;
  onComplete?: () => void;
}

export const QuestionPracticeView: React.FC<QuestionPracticeViewProps> = ({
  questions,
  subject,
  topic,
  userId,
  title,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Record user answers: { [questionId]: { selectedAnswer: CorrectAnswer; isCorrect: boolean } }
  const [userAnswers, setUserAnswers] = useState<Record<string, { selectedAnswer: CorrectAnswer; isCorrect: boolean }>>({});
  // Track favorite questions: { [questionId]: boolean }
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  // Mode toggle: 'practice' (test yourself) or 'reading' (see answer & explanation directly)
  const [viewMode, setViewMode] = useState<'practice' | 'reading'>('practice');
  // Jump drawer visibility
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  // Completed test summary state
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex] || null;

  // Sync viewed status and favorite state when current question changes
  useEffect(() => {
    if (!currentQuestion) return;

    if (userId) {
      // Mark as viewed in background
      markQuestionViewed(userId, currentQuestion).catch((err) =>
        console.error('Error marking question viewed:', err)
      );

      // Check favorite status
      isFavorite(userId, currentQuestion.id)
        .then((fav) => {
          setFavorites((prev) => ({ ...prev, [currentQuestion.id]: fav }));
        })
        .catch((err) => console.error('Error checking favorite:', err));
    }
  }, [currentQuestion?.id, userId]);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto my-6 space-y-4 shadow-sm">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">কোনো প্রশ্ন পাওয়া যায়নি</h3>
        <p className="text-sm text-slate-500">এই অধ্যায় বা ফিল্টারে এখনও কোনো প্রশ্ন যুক্ত করা হয়নি।</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>তালিকায় ফিরে যান</span>
        </button>
      </div>
    );
  }

  // Stats calculation
  const totalAnswered = Object.keys(userAnswers).length;
  const answeredList = Object.values(userAnswers) as Array<{ selectedAnswer: CorrectAnswer; isCorrect: boolean }>;
  const correctCount = answeredList.filter((a) => a.isCorrect).length;
  const wrongCount = totalAnswered - correctCount;
  const accuracyPercent = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const currentAnswerRecord = currentQuestion ? userAnswers[currentQuestion.id] : null;
  const hasAnsweredCurrent = !!currentAnswerRecord;

  // Handle Option Select
  const handleSelectOption = async (optionKey: CorrectAnswer) => {
    if (!currentQuestion) return;
    if (viewMode === 'reading') return; // In reading mode, options are informational

    const isCorrect = optionKey === currentQuestion.correctAnswer;

    // Update local state immediately for snappy UI
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedAnswer: optionKey,
        isCorrect,
      },
    }));

    // Save to Firestore if authenticated
    if (userId) {
      try {
        await saveAnswer(userId, currentQuestion, optionKey);
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!currentQuestion) return;
    if (!userId) {
      alert('প্রিয় প্রশ্ন সংরক্ষণ করতে অনুগ্রহ করে সাইন ইন করুন।');
      return;
    }

    const currentFav = !!favorites[currentQuestion.id];
    // Optimistic update
    setFavorites((prev) => ({ ...prev, [currentQuestion.id]: !currentFav }));

    try {
      const nowFav = await toggleFavorite(userId, currentQuestion);
      setFavorites((prev) => ({ ...prev, [currentQuestion.id]: nowFav }));
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setFavorites((prev) => ({ ...prev, [currentQuestion.id]: currentFav }));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  // Difficulty Label & Badge Color
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            সহজ
          </span>
        );
      case 'hard':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            কঠিন
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            মাঝারি
          </span>
        );
    }
  };

  // Option Letter in Bangla
  const getBanglaOptionLetter = (key: CorrectAnswer) => {
    switch (key) {
      case 'A': return 'ক';
      case 'B': return 'খ';
      case 'C': return 'গ';
      case 'D': return 'ঘ';
    }
  };

  // Render Finished Summary Screen
  if (isFinished) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">অনুশীলন সম্পন্ন হয়েছে!</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {topic ? `${topic.name} অধ্যায়ের অনুশীলন সম্পন্ন হয়েছে।` : 'সকল প্রশ্নের অনুশীলন সমাপ্ত হয়েছে।'}
          </p>
        </div>

        {/* Score Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="p-3 bg-white rounded-xl shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">মোট প্রশ্ন</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">{questions.length}</p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-2xs">
            <span className="text-xs text-emerald-600 font-medium">সঠিক উত্তর</span>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{correctCount}</p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-2xs">
            <span className="text-xs text-rose-500 font-medium">ভুল উত্তর</span>
            <p className="text-xl font-black text-rose-600 mt-0.5">{wrongCount}</p>
          </div>
        </div>

        {/* Accuracy Progress */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>আপনার সঠিকতার হার (Accuracy)</span>
            </span>
            <span className="text-emerald-700 text-sm">{accuracyPercent}%</span>
          </div>
          <div className="w-full bg-emerald-200/60 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${accuracyPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>আবার অনুশীলন করুন</span>
          </button>
          <button
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>টপিক তালিকায় ফিরে যান</span>
          </button>
        </div>
      </div>
    );
  }

  const isFavorited = currentQuestion ? !!favorites[currentQuestion.id] : false;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Practice Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ফিরে যান</span>
          </button>

          <div className="text-xs text-slate-500 font-medium">
            <span>প্রশ্ন </span>
            <span className="font-extrabold text-slate-900 text-sm sm:text-base">{currentIndex + 1}</span>
            <span> / {questions.length}</span>
          </div>
        </div>

        {/* Mode Switcher and Quick Tools */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Practice Mode vs Reading Mode Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setViewMode('practice')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'practice'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              পরীক্ষা মোড
            </button>
            <button
              onClick={() => setViewMode('reading')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'reading'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              পড়ার মোড
            </button>
          </div>

          {/* Question Grid Dropdown Trigger */}
          <button
            onClick={() => setShowQuestionGrid((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="প্রশ্নের তালিকা দেখুন"
          >
            <ListFilter className="w-4 h-4" />
          </button>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
              isFavorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
            }`}
            title={isFavorited ? 'প্রিয় তালিকা থেকে বাদ দিন' : 'প্রিয় তালিকায় যুক্ত করুন'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Jump Drawer (if open) */}
      {showQuestionGrid && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">দ্রুত যেকোনো প্রশ্নে যান:</span>
            <span className="text-[11px] text-slate-400">মোট {questions.length}টি প্রশ্ন</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const ans = userAnswers[q.id];
              let btnClass = 'bg-slate-100 text-slate-700 border-slate-200';
              if (ans) {
                btnClass = ans.isCorrect
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                  : 'bg-rose-600 text-white border-rose-600 font-bold';
              }
              if (idx === currentIndex) {
                btnClass += ' ring-2 ring-emerald-500 ring-offset-2';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowQuestionGrid(false);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 sm:p-7 space-y-6">
          {/* Question Metadata Tags */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              {getDifficultyBadge(currentQuestion.difficulty)}

              {currentQuestion.source && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {currentQuestion.source}
                </span>
              )}

              {currentQuestion.examName && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentQuestion.examName}
                  {currentQuestion.examYear ? ` (${currentQuestion.examYear})` : ''}
                </span>
              )}
            </div>

            {currentQuestion.tags && currentQuestion.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentQuestion.tags.slice(0, 2).map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200/60">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Question Prompt */}
          <div>
            <div className="flex items-start gap-2.5">
              <span className="font-extrabold text-emerald-700 text-base sm:text-lg shrink-0 mt-0.5">
                {currentIndex + 1}.
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-sans">
                {currentQuestion.question}
              </h2>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {(['A', 'B', 'C', 'D'] as CorrectAnswer[]).map((optionKey) => {
              const optionText = currentQuestion.options[optionKey];
              if (!optionText) return null;

              const isSelected = currentAnswerRecord?.selectedAnswer === optionKey;
              const isCorrectOption = optionKey === currentQuestion.correctAnswer;
              const showSolution = viewMode === 'reading' || hasAnsweredCurrent;

              let optionStyle = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';
              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

              if (showSolution) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !currentAnswerRecord?.isCorrect) {
                  optionStyle = 'bg-rose-50/90 border-rose-400 text-rose-950 ring-1 ring-rose-400';
                  badgeStyle = 'bg-rose-600 text-white border-rose-600';
                } else {
                  optionStyle = 'bg-slate-50/50 border-slate-200 text-slate-500 opacity-80';
                  badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={optionKey}
                  onClick={() => handleSelectOption(optionKey)}
                  disabled={viewMode === 'reading' || hasAnsweredCurrent}
                  className={`w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${optionStyle} ${
                    viewMode === 'reading' || hasAnsweredCurrent ? 'cursor-default' : 'active:scale-99'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border shrink-0 transition-colors ${badgeStyle}`}>
                      {getBanglaOptionLetter(optionKey)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {optionText}
                    </span>
                  </div>

                  {showSolution && (
                    <div className="shrink-0">
                      {isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isSelected && !currentAnswerRecord?.isCorrect ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Section (Revealed when answered or in Reading Mode) */}
          {(viewMode === 'reading' || hasAnsweredCurrent) && (
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>ব্যাখ্যা ও সঠিক উত্তর:</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                  <Check className="w-3.5 h-3.5" />
                  <span>সঠিক উত্তর: ({getBanglaOptionLetter(currentQuestion.correctAnswer)})</span>
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans pt-1">
                {currentQuestion.explanation ? (
                  currentQuestion.explanation
                ) : (
                  <span className="text-slate-500 italic">এই প্রশ্নের জন্য অতিরিক্ত কোনো ব্যাখ্যা নেই।</span>
                )}
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>

            <div className="text-xs text-slate-400 font-medium">
              সঠিক: <span className="font-bold text-emerald-600">{correctCount}</span> | ভুল: <span className="font-bold text-rose-600">{wrongCount}</span>
            </div>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all cursor-pointer"
            >
              <span>{currentIndex === questions.length - 1 ? 'সমাপ্তি' : 'পরবর্তী'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
