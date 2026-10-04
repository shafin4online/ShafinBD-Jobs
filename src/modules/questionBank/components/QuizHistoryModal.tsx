import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Award,
  Clock,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { QuizAttempt } from '../../../types/questionBank';
import { getUserQuizAttempts, getQuizAttemptById } from '../services/quizService';

interface QuizHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  onViewAttempt: (attempt: QuizAttempt) => void;
}

export const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  onViewAttempt,
}) => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openingId, setOpeningId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      getUserQuizAttempts(userId, 30)
        .then((data) => setAttempts(data))
        .catch((err) => console.error('Error fetching quiz history:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId]);

  const handleSelectAttempt = async (att: QuizAttempt) => {
    if (!userId) return;
    setOpeningId(att.id);
    try {
      const fullAttempt = await getQuizAttemptById(userId, att.id);
      if (fullAttempt) {
        onViewAttempt(fullAttempt);
        onClose();
      }
    } catch (err) {
      console.error('Error fetching full quiz attempt:', err);
    } finally {
      setOpeningId(null);
    }
  };

  if (!isOpen) return null;

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSeconds = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} মি. ${secs} সে.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">কুইজ পরীক্ষার ইতিহাস (Quiz History)</h2>
              <p className="text-xs text-slate-300">
                আপনার দেওয়া সকল পরীক্ষার ফলাফল ও স্কোর
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-xs">ইতিহাস লোড করা হচ্ছে...</span>
            </div>
          ) : attempts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <History className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                আপনি এখনো কোনো কুইজ পরীক্ষায় অংশ নেননি।
              </p>
              <p className="text-xs text-slate-400">
                নতুন কুইজ শুরু করে আপনার প্রস্তুতি যাচাই করুন!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.map((att) => {
                const isCompleted = att.status === 'completed' || att.status === 'timed-out';

                return (
                  <div
                    key={att.id}
                    onClick={() => handleSelectAttempt(att)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-sm cursor-pointer bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {att.title || 'কুইজ পরীক্ষা'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {att.status === 'completed'
                            ? 'সম্পন্ন'
                            : att.status === 'timed-out'
                            ? 'সময় শেষ'
                            : 'পরিত্যক্ত'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(att.completedAt || att.startedAt)}
                        </span>
                        <span>•</span>
                        <span>{att.totalQuestions}টি প্রশ্ন</span>
                        {att.timeTakenSeconds > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatSeconds(att.timeTakenSeconds)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-black text-emerald-700">
                          {att.score} <span className="text-xs font-normal text-slate-500">স্কোর</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          সঠিকতা: {att.percentage}%
                        </div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-emerald-600">
                        {openingId === att.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
