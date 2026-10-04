import React, { useState, useEffect } from 'react';
import {
  X,
  PlayCircle,
  Clock,
  Sparkles,
  Sliders,
  Flame,
  Award,
  AlertCircle,
  BookOpen,
  Layers,
  ShieldAlert,
  Loader2,
  Check,
} from 'lucide-react';
import {
  QuestionBankSubject,
  QuestionBankTopic,
  QuestionBankQuestion,
  QuestionDifficulty,
  QuizConfigOptions,
  QuizMode,
} from '../../../types/questionBank';
import { getTopicsBySubject } from '../services/topicService';
import { getRandomQuestions } from '../services/questionService';
import { startQuizAttempt } from '../services/quizService';

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: QuestionBankSubject[];
  preselectedSubject?: QuestionBankSubject | null;
  preselectedTopic?: QuestionBankTopic | null;
  userId?: string | null;
  onOpenAuthModal?: () => void;
  onStartQuiz: (
    attempt: any,
    questions: QuestionBankQuestion[],
    config: QuizConfigOptions
  ) => void;
}

export const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  isOpen,
  onClose,
  subjects,
  preselectedSubject = null,
  preselectedTopic = null,
  userId,
  onOpenAuthModal,
  onStartQuiz,
}) => {
  const [mode, setMode] = useState<QuizMode>(preselectedSubject ? 'subject' : 'mixed');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    preselectedSubject?.id || ''
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    preselectedTopic?.id || ''
  );
  const [topics, setTopics] = useState<QuestionBankTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);

  const [questionCount, setQuestionCount] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | 'mixed'>('mixed');
  const [timerOption, setTimerOption] = useState<'none' | 'per-30s' | 'per-60s' | 'total-10m' | 'total-20m'>('per-60s');
  const [negativeMarking, setNegativeMarking] = useState<number>(0.25);

  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync preselected props
  useEffect(() => {
    if (preselectedSubject) {
      setSelectedSubjectId(preselectedSubject.id);
      setMode('subject');
    }
    if (preselectedTopic) {
      setSelectedTopicId(preselectedTopic.id);
    }
  }, [preselectedSubject, preselectedTopic]);

  // Load topics when subject changes
  useEffect(() => {
    if (selectedSubjectId && mode === 'subject') {
      setLoadingTopics(true);
      getTopicsBySubject(selectedSubjectId)
        .then((data) => {
          setTopics(data);
          if (!data.some((t) => t.id === selectedTopicId)) {
            setSelectedTopicId('');
          }
        })
        .catch((err) => console.error('Error fetching topics:', err))
        .finally(() => setLoadingTopics(false));
    } else {
      setTopics([]);
      setSelectedTopicId('');
    }
  }, [selectedSubjectId, mode]);

  if (!isOpen) return null;

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  // Calculate duration in seconds based on selection
  const calculateDurationSeconds = (): number => {
    switch (timerOption) {
      case 'none':
        return 0;
      case 'per-30s':
        return questionCount * 30;
      case 'per-60s':
        return questionCount * 60;
      case 'total-10m':
        return 10 * 60;
      case 'total-20m':
        return 20 * 60;
      default:
        return questionCount * 60;
    }
  };

  const handleStart = async () => {
    if (!userId && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }

    if (mode === 'subject' && !selectedSubjectId) {
      setErrorMessage('দয়া করে একটি বিষয় নির্বাচন করুন।');
      return;
    }

    setErrorMessage(null);
    setIsStarting(true);

    try {
      // 1. Fetch randomized questions
      const fetchParams: any = {
        count: questionCount,
        difficulty: difficulty === 'mixed' ? undefined : difficulty,
      };

      if (mode === 'subject' && selectedSubjectId) {
        fetchParams.subjectId = selectedSubjectId;
        if (selectedTopicId) {
          fetchParams.topicId = selectedTopicId;
        }
      }

      const questions = await getRandomQuestions(fetchParams);

      if (questions.length === 0) {
        setErrorMessage('নির্বাচিত ফিল্টারের আওতায় কোনো প্রশ্ন পাওয়া যায়নি। অন্য বিষয় বা ফিল্টার চেষ্টা করুন।');
        setIsStarting(false);
        return;
      }

      // 2. Prepare Config
      const durationSeconds = calculateDurationSeconds();
      const config: QuizConfigOptions = {
        title:
          mode === 'subject'
            ? `${currentSubject?.name || 'বিষয়ভিত্তিক'} কুইজ${
                currentTopic ? ` (${currentTopic.name})` : ''
              }`
            : 'সমন্বিত বিষয়ভিত্তিক কুইজ (Mixed Quiz)',
        mode,
        subjectId: mode === 'subject' ? selectedSubjectId : undefined,
        subjectName: mode === 'subject' ? currentSubject?.name : undefined,
        topicId: mode === 'subject' && selectedTopicId ? selectedTopicId : undefined,
        topicName: mode === 'subject' && currentTopic ? currentTopic.name : undefined,
        difficulty,
        questionCount: questions.length,
        durationSeconds,
        negativeMarkingPerWrong: negativeMarking,
      };

      // 3. Create persistent Attempt Snapshot
      const attempt = await startQuizAttempt(userId!, config, questions);

      // 4. Launch Quiz Player
      onStartQuiz(attempt, questions, config);
      onClose();
    } catch (err: any) {
      console.error('Error starting quiz:', err);
      setErrorMessage(err?.message || 'কুইজ শুরু করতে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">কুইজ কনফিগারেশন (Exam Setup)</h2>
              <p className="text-xs text-emerald-100">
                আপনার প্রস্তুতি যাচাই করতে কাস্টম কুইজ তৈরি করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              কুইজের ধরণ (Quiz Mode)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('subject')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  mode === 'subject'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <BookOpen
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    mode === 'subject' ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">বিষয়ভিত্তিক</div>
                  <div className="text-xs text-slate-500">নির্দিষ্ট বিষয় ও টপিক</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('mixed')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  mode === 'mixed'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Flame
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    mode === 'mixed' ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">সমন্বিত (Mixed)</div>
                  <div className="text-xs text-slate-500">সব বিষয় মিলিয়ে প্রশ্ন</div>
                </div>
              </button>
            </div>
          </div>

          {/* Subject & Topic Selectors (if Subject Mode) */}
          {mode === 'subject' && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  বিষয় নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">-- বিষয় বেছে নিন --</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.questionCount || 0}টি প্রশ্ন)
                    </option>
                  ))}
                </select>
              </div>

              {selectedSubjectId && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>টপিক (ঐচ্ছিক)</span>
                    {loadingTopics && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> লোড হচ্ছে...
                      </span>
                    )}
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    disabled={loadingTopics || topics.length === 0}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50"
                  >
                    <option value="">সকল টপিক মিলিয়ে</option>
                    {topics.map((top) => (
                      <option key={top.id} value={top.id}>
                        {top.name} ({top.questionCount || 0})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Question Count Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              প্রশ্নের সংখ্যা (Question Count)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 50, 100].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-sm transition-all ${
                    questionCount === count
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {count}টি
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              কঠিনতার মাত্রা (Difficulty)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'mixed', label: 'সকল/মিশ্র' },
                { id: 'easy', label: 'সহজ' },
                { id: 'medium', label: 'মধ্যম' },
                { id: 'hard', label: 'কঠিন' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id as any)}
                  className={`py-2 px-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    difficulty === diff.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              সময় নির্ধারণ (Timer)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'per-60s', label: 'প্রশ্ন প্রতি ১ মিনিট' },
                { id: 'per-30s', label: 'প্রশ্ন প্রতি ৩০ সেকেন্ড' },
                { id: 'total-10m', label: 'ফিক্সড ১০ মিনিট' },
                { id: 'total-20m', label: 'ফিক্সড ২০ মিনিট' },
                { id: 'none', label: 'সময়সীমা নেই (Untimed)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimerOption(t.id as any)}
                  className={`p-2 rounded-xl border text-center text-xs font-medium transition-all ${
                    timerOption === t.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Negative Marking Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              নেগেটিভ মার্কিং (ভুল উত্তরের জন্য কাটা যাবে)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0.25, label: '০.২৫ মার্ক (BCS স্ট্যান্ডার্ড)' },
                { val: 0.5, label: '০.৫০ মার্ক' },
                { val: 0, label: 'নেই (০.০০ মার্ক)' },
              ].map((neg) => (
                <button
                  key={neg.val}
                  type="button"
                  onClick={() => setNegativeMarking(neg.val)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                    negativeMarking === neg.val
                      ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {neg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={isStarting}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                প্রশ্ন লোড হচ্ছে...
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                কুইজ শুরু করুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
