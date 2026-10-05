import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  BookOpen,
  Layers,
  Flame,
  Sparkles,
  RefreshCw,
  Target,
  ChevronRight,
  PlayCircle,
  Filter,
  Brain,
  ShieldCheck,
  Zap,
  RotateCcw,
  Loader2,
  Info,
  Calendar,
} from 'lucide-react';
import {
  UserAnalyticsOverview,
  UserSubjectAnalytics,
  UserTopicAnalytics,
  UserDailyAnalytics,
  SmartInsightRecommendation,
  QuestionBankSubject,
  QuestionBankTopic,
} from '../../../types/questionBank';
import {
  getUserAnalyticsOverview,
  getUserSubjectAnalytics,
  getUserTopicAnalytics,
  getUserDailyTrend,
  generateSmartInsights,
  rebuildUserAnalytics,
} from '../services/analyticsService';

interface StudentAnalyticsDashboardProps {
  userId: string;
  subjects: QuestionBankSubject[];
  onBack: () => void;
  onOpenAuthModal?: () => void;
  onStartQuizWithConfig: (subject?: QuestionBankSubject, topic?: QuestionBankTopic) => void;
  onViewQuizHistory: () => void;
}

export const StudentAnalyticsDashboard: React.FC<StudentAnalyticsDashboardProps> = ({
  userId,
  subjects,
  onBack,
  onOpenAuthModal,
  onStartQuizWithConfig,
  onViewQuizHistory,
}) => {
  const [overview, setOverview] = useState<UserAnalyticsOverview | null>(null);
  const [subjectAnalytics, setSubjectAnalytics] = useState<UserSubjectAnalytics[]>([]);
  const [topicAnalytics, setTopicAnalytics] = useState<UserTopicAnalytics[]>([]);
  const [dailyTrend, setDailyTrend] = useState<UserDailyAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRebuilding, setIsRebuilding] = useState<boolean>(false);
  const [rebuildSuccess, setRebuildSuccess] = useState<boolean>(false);

  // Filters for topic matrix
  const [topicSubjectFilter, setTopicSubjectFilter] = useState<string>('all');
  const [topicStatusFilter, setTopicStatusFilter] = useState<'all' | 'weak' | 'strong' | 'moderate'>('all');

  // Load analytics data
  const loadData = async () => {
    setLoading(true);
    try {
      const [ovData, subData, topData, trendData] = await Promise.all([
        getUserAnalyticsOverview(userId),
        getUserSubjectAnalytics(userId),
        getUserTopicAnalytics(userId),
        getUserDailyTrend(userId, 14),
      ]);

      setOverview(ovData);
      setSubjectAnalytics(subData);
      setTopicAnalytics(topData);
      setDailyTrend(trendData);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  // Handle rebuild reconciliation
  const handleRebuild = async () => {
    if (!userId) return;
    setIsRebuilding(true);
    try {
      await rebuildUserAnalytics(userId);
      await loadData();
      setRebuildSuccess(true);
      setTimeout(() => setRebuildSuccess(false), 3000);
    } catch (err) {
      console.error('Error rebuilding analytics:', err);
    } finally {
      setIsRebuilding(false);
    }
  };

  // Generate Smart Actionable Insights
  const recommendations: SmartInsightRecommendation[] = useMemo(() => {
    return generateSmartInsights(overview, subjectAnalytics, topicAnalytics);
  }, [overview, subjectAnalytics, topicAnalytics]);

  // Weak and strong topic counts
  const weakTopics = useMemo(
    () => topicAnalytics.filter((t) => t.classification === 'weak'),
    [topicAnalytics]
  );
  const strongTopics = useMemo(
    () => topicAnalytics.filter((t) => t.classification === 'strong'),
    [topicAnalytics]
  );

  // Filtered topics for the matrix table
  const filteredTopics = useMemo(() => {
    return topicAnalytics.filter((t) => {
      const matchSubject = topicSubjectFilter === 'all' || t.subjectId === topicSubjectFilter;
      const matchStatus = topicStatusFilter === 'all' || t.classification === topicStatusFilter;
      return matchSubject && matchStatus;
    });
  }, [topicAnalytics, topicSubjectFilter, topicStatusFilter]);

  // Format seconds to human string (e.g. 1h 20m)
  const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} ঘণ্টা ${minutes} মি.`;
    }
    return `${minutes} মিনিট`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">
          আপনার পারফরম্যান্স অ্যানালিটিক্স লোড হচ্ছে...
        </h2>
        <p className="text-xs text-slate-500">
          রিয়েল-টাইম কুইজ ডেটা ও টপিক নির্ভুলতা হিসাব করা হচ্ছে
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in text-slate-800">
      {/* Top Banner Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> প্রশ্নব্যাংকে ফিরে যান
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRebuild}
            disabled={isRebuilding}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            title="কুইজ হিস্ট্রি থেকে অ্যানালিটিক্স ডেটা রি-সিঙ্ক করুন"
          >
            {isRebuilding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{rebuildSuccess ? 'সিঙ্ক সম্পন্ন!' : 'ডেটা রি-সিঙ্ক (Reconcile)'}</span>
          </button>

          <button
            onClick={onViewQuizHistory}
            className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" /> কুইজ হিস্ট্রি
          </button>

          <button
            onClick={() => onStartQuizWithConfig()}
            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5" /> নতুন পরীক্ষা দিন
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 rounded-2xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold text-emerald-100">
              <Brain className="w-3.5 h-3.5 text-amber-300" />
              <span>শিক্ষার্থী পারফরম্যান্স অ্যানালিটিক্স (Actionable Analytics)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              আপনার প্রস্তুতি বিশ্লেষণ ও দুর্বল টপিক গাইড
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              শুধু নম্বর নয়—কোন টপিকে আপনার শক্তি এবং কোথায় ভুল বেশি হচ্ছে তা জেনে সুনির্দিষ্ট প্রস্তুতি নিন।
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
            <div className="text-xs font-medium text-emerald-100 mb-1">সামগ্রিক সঠিকতা</div>
            <div className="text-3xl sm:text-4xl font-black text-amber-300">
              {overview?.overallAccuracy || 0}%
            </div>
            <div className="text-[11px] text-emerald-100 mt-1">
              {overview && overview.overallAccuracy >= 75
                ? 'দারুণ প্রস্তুতি (Strong)'
                : overview && overview.overallAccuracy >= 50
                ? 'সন্তোষজনক (Moderate)'
                : 'আরও অনুশীলন প্রয়োজন'}
            </div>
          </div>
        </div>
      </div>

      {/* 4.3.1 Overall Dashboard KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">মোট উত্তর</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {overview?.totalQuestionsAttempted || 0}
          </div>
          <div className="text-[11px] text-slate-500">
            সঠিক: <strong className="text-emerald-600 font-bold">{overview?.totalCorrect || 0}</strong> • ভুল: <strong className="text-rose-600 font-bold">{overview?.totalWrong || 0}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">পরীক্ষা সম্পন্ন</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {overview?.totalQuizzes || 0}
          </div>
          <div className="text-[11px] text-slate-500">
            গড় স্কোর: <strong className="text-slate-800 font-bold">{overview?.averageScore || 0}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">শক্তিশালী টপিক</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {strongTopics.length}টি
          </div>
          <div className="text-[11px] text-slate-500">সঠিকতা ≥ ৭৫%</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">দুর্বল টপিক</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {weakTopics.length}টি
          </div>
          <div className="text-[11px] text-slate-500">সঠিকতা &lt; ৫০% (নজর দিন)</div>
        </div>
      </div>

      {/* 4.3.6 Smart Actionable Insights & Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                স্মার্ট রিকমেন্ডেশন (Smart Actionable Insights)
              </h2>
              <p className="text-xs text-slate-500">
                আপনার ভুল ও দুর্বল টপিকের ওপর ভিত্তি করে স্বয়ংক্রিয় সাজেশান
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-semibold">
            {recommendations.length}টি পরামর্শ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {recommendations.map((rec) => {
            const isWeak = rec.type === 'weak-topic';
            const matchedSubject = subjects.find((s) => s.id === rec.subjectId);
            const matchedTopic = rec.topicId
              ? { id: rec.topicId, name: rec.topicName || '', subjectId: rec.subjectId || '' }
              : undefined;

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isWeak
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                    : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        isWeak
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isWeak ? 'দুর্বল টপিক' : 'শক্তিশালী টপিক'}
                    </span>
                    {rec.accuracy !== undefined && (
                      <span className="text-xs font-bold text-slate-600">
                        সঠিকতা: {rec.accuracy}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    {rec.subjectName || 'সমন্বিত বিষয়'}
                  </span>
                  <button
                    onClick={() =>
                      onStartQuizWithConfig(
                        matchedSubject,
                        matchedTopic as unknown as QuestionBankTopic
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isWeak
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <span>{rec.actionText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4.3.4 Performance Trend: Daily Activity (Last 14 Days) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                পারফরম্যান্স ট্রেন্ড (Daily Practice Trend)
              </h2>
              <p className="text-xs text-slate-500">গত ১৪ দিনের অনুশীলন ও নির্ভুলতার ধারা</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> প্রতিদিনের অগ্রগতি
          </span>
        </div>

        {dailyTrend.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
            এখনো কোনো ট্রেন্ড ডেটা নেই। কুইজ শেষ করার সাথে সাথে প্রতিদিনের অগ্রগতি এখানে গ্রাফ আকারে দেখা যাবে।
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="h-44 flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-slate-200 overflow-x-auto">
              {dailyTrend.map((d) => {
                const maxQ = Math.max(...dailyTrend.map((t) => t.questionsAttempted), 20);
                const heightPercent = Math.max(12, Math.round((d.questionsAttempted / maxQ) * 100));
                const dateLabel = d.date.slice(5); // MM-DD

                return (
                  <div
                    key={d.date}
                    className="flex-1 min-w-[36px] flex flex-col items-center gap-1.5 group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-slate-800 text-white text-[10px] rounded-lg py-1 px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-md">
                      <div>তারিখ: {d.date}</div>
                      <div>প্রশ্ন: {d.questionsAttempted}টি ({d.accuracy}% সঠিক)</div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-500">
                      {d.accuracy}%
                    </div>

                    <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">{dateLabel}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                বার উচ্চতা: অনুশীলিত প্রশ্নের সংখ্যা
              </span>
              <span>উপরে: সঠিকতার হার (%)</span>
            </div>
          </div>
        )}
      </div>

      {/* 4.3.2 Subject Level Analytics Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                বিষয়ভিত্তিক পারফরম্যান্স (Subject-wise Analytics)
              </h2>
              <p className="text-xs text-slate-500">প্রতিটি বিষয়ের সাফল্য ও প্রশ্ন নির্ভুলতা</p>
            </div>
          </div>
        </div>

        {subjectAnalytics.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
            কোনো বিষয়ের কুইজ এখনো শেষ করা হয়নি। কুইজ শেষ করলেই বিষয়ভিত্তিক অ্যানালিটিক্স দেখতে পাবেন।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {subjectAnalytics.map((sub) => {
              const matchedSub = subjects.find((s) => s.id === sub.subjectId);
              let barColor = 'bg-emerald-500';
              if (sub.accuracy < 50) barColor = 'bg-rose-500';
              else if (sub.accuracy < 70) barColor = 'bg-amber-500';

              return (
                <div
                  key={sub.subjectId}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 bg-slate-50/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{sub.subjectName}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {sub.quizzesCount}টি কুইজ সম্পন্ন
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">{sub.accuracy}%</div>
                      <div className="text-[11px] text-slate-500">সঠিকতা</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${barColor} h-full rounded-full transition-all`}
                        style={{ width: `${sub.accuracy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>সঠিক: {sub.totalCorrect}</span>
                      <span>ভুল: {sub.totalWrong}</span>
                      <span>মোট: {sub.totalAttempted}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => onStartQuizWithConfig(matchedSub)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>এই বিষয়ে কুইজ দিন</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4.3.3 Topic Level Analytics & Weak/Strong Classification Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-800 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                টপিকভিত্তিক বিশদ অ্যানালিটিক্স ও শ্রেণীবিন্যাস
              </h2>
              <p className="text-xs text-slate-500">
                শক্তিশালী, মধ্যম ও দুর্বল টপিকগুলোর তালিকা ও সরাসরি অনুশীলন
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Subject Selector */}
            <select
              value={topicSubjectFilter}
              onChange={(e) => setTopicSubjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="all">সকল বিষয়</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                onClick={() => setTopicStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  topicStatusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সব
              </button>
              <button
                onClick={() => setTopicStatusFilter('weak')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  topicStatusFilter === 'weak'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                দুর্বল ({weakTopics.length})
              </button>
              <button
                onClick={() => setTopicStatusFilter('strong')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  topicStatusFilter === 'strong'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                শক্তিশালী ({strongTopics.length})
              </button>
            </div>
          </div>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
            নির্বাচিত ফিল্টারের আওতায় কোনো টপিক অ্যানালিটিক্স ডেটা পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                  <th className="py-2.5 px-3">টপিকের নাম</th>
                  <th className="py-2.5 px-3">বিষয়</th>
                  <th className="py-2.5 px-3 text-center">অনুশীলিত</th>
                  <th className="py-2.5 px-3 text-center">সঠিক / ভুল</th>
                  <th className="py-2.5 px-3 text-center">সঠিকতা</th>
                  <th className="py-2.5 px-3 text-center">শ্রেণী</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTopics.map((top) => {
                  const matchedSub = subjects.find((s) => s.id === top.subjectId);
                  const topicObj: Partial<QuestionBankTopic> = {
                    id: top.topicId,
                    name: top.topicName,
                    subjectId: top.subjectId,
                  };

                  let badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
                  let badgeText = '⚖️ মধ্যম';
                  if (top.classification === 'strong') {
                    badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                    badgeText = '💪 শক্তিশালী';
                  } else if (top.classification === 'weak') {
                    badgeStyle = 'bg-rose-100 text-rose-800 border-rose-200';
                    badgeText = '⚠️ দুর্বল';
                  }

                  return (
                    <tr key={top.topicId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{top.topicName}</td>
                      <td className="py-3 px-3 text-slate-500">{top.subjectName || '-'}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        {top.totalAttempted}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-emerald-700 font-bold">{top.totalCorrect}</span>
                        {' / '}
                        <span className="text-rose-600 font-bold">{top.totalWrong}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-black text-slate-900">
                        {top.accuracy}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${badgeStyle}`}
                        >
                          {badgeText}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() =>
                            onStartQuizWithConfig(matchedSub, topicObj as QuestionBankTopic)
                          }
                          className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 inline-flex items-center gap-1 transition-colors"
                        >
                          <PlayCircle className="w-3 h-3" />
                          <span>কুইজ</span>
                        </button>
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
