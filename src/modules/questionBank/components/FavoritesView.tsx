import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Trash2, 
  PlayCircle, 
  HelpCircle, 
  ArrowLeft, 
  Filter, 
  BookOpen, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { QuestionBankQuestion, QuestionBankSubject } from '../../../types/questionBank';
import { getUserFavoriteQuestions, removeFavorite } from '../services/favoriteService';

interface FavoritesViewProps {
  userId: string | null;
  subjects: QuestionBankSubject[];
  onBack: () => void;
  onPracticeQuestions: (questions: QuestionBankQuestion[], title: string) => void;
  onOpenAuthModal: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  userId,
  subjects,
  onBack,
  onPracticeQuestions,
  onOpenAuthModal,
}) => {
  const [favoriteQuestions, setFavoriteQuestions] = useState<QuestionBankQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getUserFavoriteQuestions(userId, 100)
      .then((qs) => {
        setFavoriteQuestions(qs);
      })
      .catch((err) => console.error('Error loading favorite questions:', err))
      .finally(() => setIsLoading(false));
  }, [userId]);

  const handleRemoveFavorite = async (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    // Optimistic remove
    setFavoriteQuestions((prev) => prev.filter((q) => q.id !== questionId));
    try {
      await removeFavorite(userId, questionId);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const filteredQuestions = selectedSubjectId === 'all'
    ? favoriteQuestions
    : favoriteQuestions.filter((q) => q.subjectId === selectedSubjectId);

  if (!userId) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">লগইন প্রয়োজন</h3>
        <p className="text-xs sm:text-sm text-slate-500">
          আপনার সংরক্ষিত এবং প্রিয় প্রশ্নসমূহ দেখতে অনুগ্রহ করে সাইন ইন করুন।
        </p>
        <button
          onClick={onOpenAuthModal}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 shadow-xs cursor-pointer"
        >
          <span>সাইন ইন / রেজিস্ট্রেশন করুন</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-100 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>প্রশ্নব্যাংকে ফিরুন</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Heart className="w-6 h-6 fill-white text-rose-600" />
            <span>আমার সংরক্ষিত ও প্রিয় প্রশ্নসমূহ</span>
          </h2>
          <p className="text-xs sm:text-sm text-rose-100/90 mt-1">
            যে প্রশ্নগুলো পরবর্তীতে রিভিশন দিতে সেভ করেছেন।
          </p>
        </div>

        {favoriteQuestions.length > 0 && (
          <button
            onClick={() => onPracticeQuestions(filteredQuestions, 'সংরক্ষিত প্রশ্ন রিভিশন')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-rose-700 font-bold text-xs sm:text-sm hover:bg-rose-50 shadow-md transition-all cursor-pointer shrink-0"
          >
            <PlayCircle className="w-4 h-4 text-rose-600" />
            <span>সব প্রিয় প্রশ্ন একসাথে পড়ুন</span>
          </button>
        )}
      </div>

      {/* Filter by Subject Tabs */}
      {favoriteQuestions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedSubjectId === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            সকল বিষয় ({favoriteQuestions.length})
          </button>

          {subjects.map((sub) => {
            const count = favoriteQuestions.filter((q) => q.subjectId === sub.id).length;
            if (count === 0) return null;

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedSubjectId === sub.id
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sub.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">কোনো প্রিয় প্রশ্ন সংরক্ষিত নেই</h3>
          <p className="text-xs text-slate-500">
            প্রশ্ন পড়ার সময় উপরের হার্ট (Heart) আইকনে ক্লিক করে প্রিয় প্রশ্ন তালিকায় যোগ করতে পারেন।
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>প্রশ্নব্যাংক ব্রাউজ করুন</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => onPracticeQuestions([q, ...filteredQuestions.filter((item) => item.id !== q.id)], 'প্রিয় প্রশ্ন রিভিশন')}
              className="group bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {q.question}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                      {q.examName && (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {q.examName}
                        </span>
                      )}
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        সঠিক উত্তর: ({q.correctAnswer}) {q.options[q.correctAnswer]}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleRemoveFavorite(q.id, e)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer shrink-0"
                  title="প্রিয় তালিকা থেকে মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
