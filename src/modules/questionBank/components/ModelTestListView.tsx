import React, { useState, useMemo } from 'react';
import {
  Award,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  PlayCircle,
  Trophy,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Search,
} from 'lucide-react';
import {
  LiveModelTest,
  ModelTestCategory,
  ModelTestStatus,
} from '../../../types/modelTest';

interface ModelTestListViewProps {
  modelTests: LiveModelTest[];
  userId?: string | null;
  onSelectTest: (test: LiveModelTest) => void;
  onViewLeaderboard: (test: LiveModelTest) => void;
  onOpenAuthModal?: () => void;
}

export const ModelTestListView: React.FC<ModelTestListViewProps> = ({
  modelTests,
  userId,
  onSelectTest,
  onViewLeaderboard,
  onOpenAuthModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | ModelTestStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live count
  const liveCount = useMemo(
    () => modelTests.filter((t) => t.status === 'live').length,
    [modelTests]
  );

  // Filtered list
  const filteredTests = useMemo(() => {
    return modelTests.filter((t) => {
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCategory && matchSearch;
    });
  }, [modelTests, statusFilter, categoryFilter, searchQuery]);

  // Format date helper
  const formatDate = (ts: any): string => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>লাইভ কম্পিটিটিভ মডেল টেস্ট প্ল্যাটফর্ম</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              সারাদেশের পরীক্ষার্থীদের সাথে লাইভ মডেল টেস্ট
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              সরাসরি নির্ধারিত সময়ে রিয়েল পরীক্ষার নিয়মে অংশ নিন, নেগেটিভ মার্কিংয়ের সঠিক হিসাব জানুন এবং পরীক্ষা শেষে জাতীয় মেধা তালিকা (Merit List) ও পারসেন্টাইল দেখুন।
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs flex-wrap">
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>রিয়েল-টাইম মেধা তালিকা (Merit List)</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                <span>কাট-অফ মার্কস ও পারসেন্টাইল</span>
              </div>
              {liveCount > 0 && (
                <div className="bg-rose-500/30 border border-rose-400/40 px-3 py-1 rounded-xl flex items-center gap-1.5 text-rose-200 font-bold">
                  <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>বর্তমানে {liveCount}টি লাইভ পরীক্ষা চলছে!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            সকল ({modelTests.length})
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              statusFilter === 'live'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>লাইভ ({modelTests.filter((t) => t.status === 'live').length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'upcoming'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            আসন্ন ({modelTests.filter((t) => t.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setStatusFilter('ended')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'ended'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            আর্কাইভ / ফলাফল ({modelTests.filter((t) => t.status === 'ended').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="মডেল টেস্ট খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Model Test Cards Grid */}
      {filteredTests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-3">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">কোনো মডেল টেস্ট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500">
            অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা পরবর্তীতে আবার চেক করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTests.map((test) => {
            const isLive = test.status === 'live';
            const isUpcoming = test.status === 'upcoming';
            const isEnded = test.status === 'ended';

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header Status */}
                  <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-100">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                      {test.categoryName}
                    </span>

                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span>লাইভ চলছে</span>
                      </span>
                    )}

                    {isUpcoming && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>আসন্ন</span>
                      </span>
                    )}

                    {isEnded && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>সম্পন্ন</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <div className="text-[11px] text-slate-400 font-medium">প্রশ্ন</div>
                        <div className="text-xs font-extrabold text-slate-800">
                          {test.totalQuestions}টি
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <div className="text-[11px] text-slate-400 font-medium">সময়</div>
                        <div className="text-xs font-extrabold text-slate-800">
                          {test.durationMinutes} মি.
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <div className="text-[11px] text-slate-400 font-medium">নেগেটিভ</div>
                        <div className="text-xs font-extrabold text-rose-600">
                          -{test.negativeMarking}
                        </div>
                      </div>
                    </div>

                    {/* Timing Schedule */}
                    <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>শুরু: {formatDate(test.startsAt)}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Users className="w-3 h-3 text-indigo-500" />
                        <span>{test.totalParticipants} জন</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  {isLive && (
                    <button
                      onClick={() => onSelectTest(test)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 active:scale-98 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>এখনই পরীক্ষায় অংশ নিন</span>
                    </button>
                  )}

                  {isUpcoming && (
                    <button
                      onClick={() => onSelectTest(test)}
                      className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-indigo-200"
                    >
                      <Clock className="w-4 h-4" />
                      <span>পরীক্ষার নিয়ম ও প্রস্তুতি</span>
                    </button>
                  )}

                  {isEnded && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewLeaderboard(test)}
                        className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>মেধা তালিকা</span>
                      </button>
                      <button
                        onClick={() => onSelectTest(test)}
                        className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>প্রশ্ন ও সমাধান</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
