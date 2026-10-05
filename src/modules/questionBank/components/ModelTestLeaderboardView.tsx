import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Clock,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Users,
  Target,
  Sparkles,
  Download,
  Share2,
  Loader2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  LiveModelTest,
  ModelTestLeaderboardEntry,
  UserLiveModelTestSubmission,
} from '../../../types/modelTest';
import {
  getModelTestLeaderboard,
  getUserModelTestSubmission,
} from '../services/modelTestService';

interface ModelTestLeaderboardViewProps {
  test: LiveModelTest;
  userId?: string | null;
  onBack: () => void;
  onViewQuestions?: () => void;
}

export const ModelTestLeaderboardView: React.FC<ModelTestLeaderboardViewProps> = ({
  test,
  userId,
  onBack,
  onViewQuestions,
}) => {
  const [entries, setEntries] = useState<ModelTestLeaderboardEntry[]>([]);
  const [userSubmission, setUserSubmission] = useState<UserLiveModelTestSubmission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [board, mySub] = await Promise.all([
          getModelTestLeaderboard(test.id, userId),
          userId ? getUserModelTestSubmission(test.id, userId) : Promise.resolve(null),
        ]);
        setEntries(board);
        setUserSubmission(mySub);
      } catch (err) {
        console.warn('Leaderboard fetch notice:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [test.id, userId]);

  // Find user's entry in leaderboard
  const myRankEntry = useMemo(() => {
    if (!userId) return null;
    return entries.find((e) => e.userId === userId) || null;
  }, [entries, userId]);

  // Filtered entries for search
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter((e) => e.userName.toLowerCase().includes(query));
  }, [entries, searchQuery]);

  // Top 3 Podium
  const top1 = entries[0] || null;
  const top2 = entries[1] || null;
  const top3 = entries[2] || null;

  const formatSeconds = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} মি. ${s} সে.`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in text-slate-800">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> মডেল টেস্ট তালিকায় ফিরুন
        </button>

        {onViewQuestions && (
          <button
            onClick={onViewQuestions}
            className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>প্রশ্ন ও সমাধান দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-amber-100">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>জাতীয় মেধা তালিকা ও ফলাফল (Merit List)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{test.title}</h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              সর্বমোট {entries.length} জন পরীক্ষার্থীর মধ্যে প্রতিযোগিতামূলক স্কোর, নির্ভুলতা ও সময়ের ভিত্তিতে মেধা তালিকা প্রণীত।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 text-center min-w-[110px]">
              <div className="text-2xl sm:text-3xl font-black text-amber-200">
                {test.highestScore || (entries[0] ? entries[0].score : 0)}
              </div>
              <div className="text-[11px] text-amber-100 font-medium">সর্বোচ্চ স্কোর</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 text-center min-w-[110px]">
              <div className="text-2xl sm:text-3xl font-black text-white">
                {entries.length}
              </div>
              <div className="text-[11px] text-amber-100 font-medium">মোট অংশগ্রহণকারী</div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Own Result Banner (If user participated) */}
      {myRankEntry && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-xl font-black">
              #{myRankEntry.rank}
            </div>
            <div>
              <div className="text-xs text-emerald-200 font-medium">আপনার মেধা স্থান ও ফলাফল</div>
              <h3 className="text-base sm:text-lg font-bold">
                {myRankEntry.userName} — স্কোর: {myRankEntry.score} / {test.totalMarks}
              </h3>
              <div className="text-xs text-emerald-100 mt-0.5">
                সঠিক: {myRankEntry.correctAnswers} • ভুল: {myRankEntry.wrongAnswers} • পারসেন্টাইল: শীর্ষ {100 - (myRankEntry.percentile || 0)}%
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                myRankEntry.isPassed ? 'bg-white text-emerald-800' : 'bg-rose-500 text-white'
              }`}
            >
              {myRankEntry.isPassed ? 'উত্তীর্ণ (Passed)' : 'অনুত্তীর্ণ (Failed)'}
            </span>
          </div>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center space-y-2 order-2 md:order-1 relative">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center mx-auto">
              🥈 2
            </div>
            <h4 className="font-bold text-slate-900 text-sm truncate">{top2?.userName}</h4>
            <div className="text-xl font-black text-slate-900">{top2?.score} মার্কস</div>
            <div className="text-[11px] text-slate-500">
              সঠিক: {top2?.correctAnswers} • সময়: {top2 ? formatSeconds(top2.timeTakenSeconds) : ''}
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-300 p-6 shadow-md text-center space-y-2.5 order-1 md:order-2 relative -translate-y-1">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 font-black text-base flex items-center justify-center mx-auto shadow-sm">
              🥇 1
            </div>
            <div className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              চ্যাম্পিয়ন (১ম স্থান)
            </div>
            <h4 className="font-extrabold text-slate-900 text-base truncate">{top1?.userName}</h4>
            <div className="text-2xl font-black text-amber-700">{top1?.score} মার্কস</div>
            <div className="text-xs text-slate-600 font-medium">
              সঠিক: {top1?.correctAnswers} • সময়: {top1 ? formatSeconds(top1.timeTakenSeconds) : ''}
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center space-y-2 order-3 md:order-3 relative">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center mx-auto">
              🥉 3
            </div>
            <h4 className="font-bold text-slate-900 text-sm truncate">{top3?.userName}</h4>
            <div className="text-xl font-black text-slate-900">{top3?.score} মার্কস</div>
            <div className="text-[11px] text-slate-500">
              সঠিক: {top3?.correctAnswers} • সময়: {top3 ? formatSeconds(top3.timeTakenSeconds) : ''}
            </div>
          </div>
        </div>
      )}

      {/* Complete Merit List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              সম্পূর্ণ মেধা তালিকা ({entries.length} জন)
            </h3>
            <p className="text-xs text-slate-500">
              টাই-ব্রেকিং নিয়ম: সর্বোচ্চ স্কোর → কম ভুল উত্তর → দ্রুততম সমাপ্তি
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
            <div className="text-xs text-slate-500">মেধা তালিকা লোড হচ্ছে...</div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            কোনো পরীক্ষার্থী পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">মেধা স্থান</th>
                  <th className="py-3 px-4">পরীক্ষার্থীর নাম</th>
                  <th className="py-3 px-4 text-center">স্কোর</th>
                  <th className="py-3 px-4 text-center">সঠিক / ভুল</th>
                  <th className="py-3 px-4 text-center">ব্যয়িত সময়</th>
                  <th className="py-3 px-4 text-center">পারসেন্টাইল</th>
                  <th className="py-3 px-4 text-right">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => {
                  const isMe = entry.userId === userId;
                  return (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-slate-50 transition-colors ${
                        isMe ? 'bg-indigo-50/70 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                            entry.rank === 1
                              ? 'bg-amber-400 text-amber-950'
                              : entry.rank === 2
                              ? 'bg-slate-300 text-slate-800'
                              : entry.rank === 3
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {entry.rank}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{entry.userName}</span>
                          {isMe && (
                            <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[10px]">
                              আপনি
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-black text-slate-900">
                        {entry.score}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-600 font-bold">{entry.correctAnswers}</span> /{' '}
                        <span className="text-rose-600 font-bold">{entry.wrongAnswers}</span>
                      </td>

                      <td className="py-3 px-4 text-center text-slate-600 font-mono">
                        {formatSeconds(entry.timeTakenSeconds)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          শীর্ষ {Math.max(1, 100 - (entry.percentile || 0))}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            entry.isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {entry.isPassed ? 'পাস' : 'ফেল'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
