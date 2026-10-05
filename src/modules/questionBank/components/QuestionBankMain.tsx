import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Search, 
  Sparkles, 
  Heart, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  RefreshCw,
  Loader2,
  Flame,
  ArrowRight,
  Award,
  History,
  PlayCircle,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { 
  QuestionBankSubject, 
  QuestionBankTopic, 
  QuestionBankQuestion, 
  SubjectProgressStats,
  QuizAttempt,
  QuizConfigOptions,
  QuizQuestionSnapshot
} from '../../../types/questionBank';
import { LiveModelTest } from '../../../types/modelTest';
import { getSubjects } from '../services/subjectService';
import { getTopics } from '../services/topicService';
import { getQuestions } from '../services/questionService';
import { getSubjectStats } from '../services/progressService';
import { getModelTests, seedSampleModelTestsIfEmpty } from '../services/modelTestService';
import { seedInitialQuestionBankIfEmpty, SEED_SUBJECTS, SEED_QUESTIONS } from '../data/seedData';
import { QuestionBankBreadcrumb } from './QuestionBankBreadcrumb';
import { SubjectCard } from './SubjectCard';
import { TopicListView } from './TopicListView';
import { QuestionPracticeView } from './QuestionPracticeView';
import { FavoritesView } from './FavoritesView';
import { QuizConfigModal } from './QuizConfigModal';
import { QuizPlayerView } from './QuizPlayerView';
import { QuizHistoryModal } from './QuizHistoryModal';
import { StudentAnalyticsDashboard } from './StudentAnalyticsDashboard';
import { ModelTestListView } from './ModelTestListView';
import { LiveModelTestPlayer } from './LiveModelTestPlayer';
import { ModelTestLeaderboardView } from './ModelTestLeaderboardView';

interface QuestionBankMainProps {
  userId?: string | null;
  onOpenAuthModal?: () => void;
}

interface UserProgressSummary {
  viewedCount: number;
  answeredCount: number;
  correctCount: number;
}

export const QuestionBankMain: React.FC<QuestionBankMainProps> = ({
  userId,
  onOpenAuthModal,
}) => {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'subjects' | 'topics' | 'practice' | 'favorites' | 'quiz' | 'analytics' | 'modelTests' | 'modelTestPlayer' | 'modelTestLeaderboard'>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<QuestionBankSubject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<QuestionBankTopic | null>(null);

  // Model Tests State (Phase 5: Live Competitive Model Tests)
  const [modelTests, setModelTests] = useState<LiveModelTest[]>([]);
  const [selectedModelTest, setSelectedModelTest] = useState<LiveModelTest | null>(null);
  const [isLoadingModelTests, setIsLoadingModelTests] = useState<boolean>(false);

  // Quiz Engine State
  const [isQuizConfigOpen, setIsQuizConfigOpen] = useState<boolean>(false);
  const [isQuizHistoryOpen, setIsQuizHistoryOpen] = useState<boolean>(false);
  const [quizPreselectedSubject, setQuizPreselectedSubject] = useState<QuestionBankSubject | null>(null);
  const [quizPreselectedTopic, setQuizPreselectedTopic] = useState<QuestionBankTopic | null>(null);
  const [activeQuizAttempt, setActiveQuizAttempt] = useState<QuizAttempt | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestionSnapshot[]>([]);
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizConfigOptions | null>(null);

  // Data State
  const [subjects, setSubjects] = useState<QuestionBankSubject[]>([]);
  const [topics, setTopics] = useState<QuestionBankTopic[]>([]);
  const [questions, setQuestions] = useState<QuestionBankQuestion[]>([]);
  const [progressStats, setProgressStats] = useState<Record<string, UserProgressSummary>>({});
  
  // Loading & Seeding State
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Practice session title
  const [practiceTitle, setPracticeTitle] = useState('');

  // 1. Fetch Subjects with instant reliable data
  const loadSubjects = async () => {
    setIsLoadingSubjects(true);
    try {
      const subs = await getSubjects(true);
      setSubjects(subs);

      // Load progress stats for current user
      if (userId && subs.length > 0) {
        const statsMap: Record<string, UserProgressSummary> = {};
        for (const sub of subs) {
          try {
            const stats = await getSubjectStats(userId, sub.id);
            if (stats) statsMap[sub.id] = stats;
          } catch {
            // Ignore sub-stat read errors
          }
        }
        setProgressStats(statsMap);
      }
    } catch (err) {
      console.warn('Notice loading question bank subjects:', err);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const loadModelTests = async () => {
    setIsLoadingModelTests(true);
    try {
      const list = await getModelTests();
      setModelTests(list);
    } catch (err) {
      console.warn('Notice loading model tests:', err);
    } finally {
      setIsLoadingModelTests(false);
    }
  };

  useEffect(() => {
    loadSubjects();
    loadModelTests();
  }, [userId]);

  // 2. Select Subject -> Load Topics
  const handleSelectSubject = async (subject: QuestionBankSubject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setCurrentView('topics');
    setIsLoadingTopics(true);

    try {
      const tops = await getTopics(subject.id, true);
      setTopics(tops);
    } catch (err) {
      console.warn('Notice fetching topics:', err);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  // 3. Select Topic -> Load Questions for that topic
  const handleSelectTopic = async (topic: QuestionBankTopic) => {
    setSelectedTopic(topic);
    setCurrentView('practice');
    setIsLoadingQuestions(true);
    setPracticeTitle(`${topic.name} অনুশীলন`);

    try {
      const res = await getQuestions({
        subjectId: topic.subjectId,
        topicId: topic.id,
        limitCount: 50,
        onlyActive: true,
      });

      // Fallback to local demo questions if Firestore has none for this topic
      if (res.questions.length === 0) {
        const fallback = SEED_QUESTIONS.filter((q) => q.topicId === topic.id) as any;
        setQuestions(fallback);
      } else {
        setQuestions(res.questions);
      }
    } catch (err) {
      console.warn('Notice fetching questions:', err);
      const fallback = SEED_QUESTIONS.filter((q) => q.topicId === topic.id) as any;
      setQuestions(fallback);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // 4. Practice All Questions of a Subject directly
  const handlePracticeAllSubject = async (subject: QuestionBankSubject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setCurrentView('practice');
    setIsLoadingQuestions(true);
    setPracticeTitle(`${subject.name} - সকল প্রশ্ন অনুশীলন`);

    try {
      const res = await getQuestions({
        subjectId: subject.id,
        limitCount: 60,
        onlyActive: true,
      });

      if (res.questions.length === 0) {
        const fallback = SEED_QUESTIONS.filter((q) => q.subjectId === subject.id) as any;
        setQuestions(fallback);
      } else {
        setQuestions(res.questions);
      }
    } catch (err) {
      console.warn('Notice loading subject questions:', err);
      const fallback = SEED_QUESTIONS.filter((q) => q.subjectId === subject.id) as any;
      setQuestions(fallback);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // 5. Practice custom question list (e.g. from Favorites)
  const handlePracticeCustomQuestions = (customQuestions: QuestionBankQuestion[], title: string) => {
    setQuestions(customQuestions);
    setPracticeTitle(title);
    setCurrentView('practice');
  };

  // 6. Manual Demo Seed Trigger
  const handleManualSeed = async () => {
    setIsSeeding(true);
    try {
      await seedInitialQuestionBankIfEmpty();
      await loadSubjects();
      await loadModelTests();
    } catch (err) {
      console.warn('Notice seeding questions:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // 7. Quiz Engine Handlers
  const handleOpenQuizSetup = (
    subject?: QuestionBankSubject | null,
    topic?: QuestionBankTopic | null
  ) => {
    setQuizPreselectedSubject(subject || null);
    setQuizPreselectedTopic(topic || null);
    setIsQuizConfigOpen(true);
  };

  const handleStartQuiz = (
    attempt: QuizAttempt,
    questionsList: QuestionBankQuestion[],
    config: QuizConfigOptions
  ) => {
    setActiveQuizAttempt(attempt);
    const snapshots: QuizQuestionSnapshot[] =
      attempt.questionsSnapshot && attempt.questionsSnapshot.length > 0
        ? attempt.questionsSnapshot
        : questionsList.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: (attempt.status === 'completed' ? q.correctAnswer : '') as any,
            explanation: attempt.status === 'completed' ? q.explanation : '',
            subjectId: q.subjectId,
            subjectName: config.subjectName,
            topicId: q.topicId,
            topicName: config.topicName,
            difficulty: q.difficulty,
            source: q.source,
            examName: q.examName,
            examYear: q.examYear,
          }));
    setActiveQuizQuestions(snapshots);
    setActiveQuizConfig(config);
    setCurrentView('quiz');
  };

  const handleExitQuiz = () => {
    setActiveQuizAttempt(null);
    setActiveQuizQuestions([]);
    setActiveQuizConfig(null);
    setCurrentView('subjects');
    loadSubjects();
  };

  const handleViewHistoryAttempt = (attempt: QuizAttempt) => {
    if (attempt.questionsSnapshot && attempt.questionsSnapshot.length > 0) {
      setActiveQuizAttempt(attempt);
      setActiveQuizQuestions(attempt.questionsSnapshot);
      setActiveQuizConfig({
        title: attempt.title,
        mode: attempt.mode,
        subjectId: attempt.subjectId,
        subjectName: attempt.subjectName,
        questionCount: attempt.totalQuestions,
        durationSeconds: attempt.durationSeconds,
        negativeMarkingPerWrong: attempt.negativeMarkingPerWrong,
      });
      setCurrentView('quiz');
    }
  };

  // Filter subjects by search
  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Overall question stats across all subjects
  const totalQuestionsInBank = subjects.reduce((acc, s) => acc + (s.questionCount || 0), 0);
  const statsList = Object.values(progressStats) as UserProgressSummary[];
  const totalViewedCount = statsList.reduce((acc, s) => acc + (s.viewedCount || 0), 0);
  const totalAnsweredCount = statsList.reduce((acc, s) => acc + (s.answeredCount || 0), 0);
  const totalCorrectCount = statsList.reduce((acc, s) => acc + (s.correctCount || 0), 0);
  const overallAccuracy = totalAnsweredCount > 0 ? Math.round((totalCorrectCount / totalAnsweredCount) * 100) : 0;

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Universal Breadcrumb */}
      <QuestionBankBreadcrumb
        currentView={currentView}
        selectedSubject={selectedSubject}
        selectedTopic={selectedTopic}
        onNavigateHome={() => setCurrentView('subjects')}
        onNavigateSubjects={() => {
          setSelectedSubject(null);
          setSelectedTopic(null);
          setCurrentView('subjects');
        }}
        onNavigateTopics={() => {
          if (selectedSubject) {
            handleSelectSubject(selectedSubject);
          }
        }}
        onNavigateModelTests={() => setCurrentView('modelTests')}
      />

      {/* VIEW: SUBJECTS DASHBOARD */}
      {currentView === 'subjects' && (
        <div className="space-y-5 sm:space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-900/40">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
                  <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>চাকরি ও বিসিএস প্রস্তুতি প্রশ্নব্যাংক</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  স্মার্ট প্রশ্নব্যাংক ও প্রস্তুতি পোর্টাল
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  বিসিএস, প্রাথমিক সহকারী শিক্ষক, সরকারি ব্যাংক ও বিভিন্ন মন্ত্রণালয় নিয়োগ পরীক্ষার বিষয়ভিত্তিক প্রশ্ন পড়ুন, অনুশীলন করুন এবং নিজের প্রস্তুতি যাচাই করুন।
                </p>

                {/* Overall Stats Pills */}
                <div className="flex items-center gap-3 pt-2 text-xs flex-wrap">
                  <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{subjects.length}টি প্রধান বিষয়</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-300" />
                    <span>মোট {totalQuestionsInBank}টি প্রশ্ন</span>
                  </div>
                  {totalViewedCount > 0 && (
                    <div className="bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-xl flex items-center gap-1.5 text-emerald-300 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{totalViewedCount}টি পড়া হয়েছে ({overallAccuracy}% সঠিক)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons in Hero Banner */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleOpenQuizSetup()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-98"
                  >
                    <Award className="w-4 h-4 text-emerald-950" />
                    <span>কুইজ পরীক্ষা</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('modelTests')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-rose-600/20 active:scale-98"
                  >
                    <Trophy className="w-4 h-4 text-amber-200" />
                    <span>লাইভ মডেল টেস্ট</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      if (!userId && onOpenAuthModal) {
                        onOpenAuthModal();
                        return;
                      }
                      setCurrentView('analytics');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                    title="পারফরম্যান্স অ্যানালিটিক্স ও দুর্বল টপিক"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>অ্যানালিটিক্স</span>
                  </button>

                  <button
                    onClick={() => setIsQuizHistoryOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                    title="পূর্ববর্তী কুইজ পরীক্ষার ইতিহাস"
                  >
                    <History className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ইতিহাস</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('favorites')}
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                    title="সংরক্ষিত প্রিয় প্রশ্নসমূহ"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>সংরক্ষিত</span>
                  </button>
                </div>

                {subjects.length === 0 && (
                  <button
                    onClick={handleManualSeed}
                    disabled={isSeeding}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSeeding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>নমুনা প্রশ্নব্যাংক লোড করুন</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="বিষয় খুঁজুন (যেমন: বাংলা সাহিত্য, বাংলাদেশ বিষয়াবলি, ইংরেজি)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 px-1">
              <span>{filteredSubjects.length}টি বিষয় প্রদর্শিত হচ্ছে</span>
            </div>
          </div>

          {/* Subjects Grid */}
          {isLoadingSubjects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center max-w-md mx-auto space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">কোনো বিষয় পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500">
                অনুগ্রহ করে অন্য কোনো নাম দিয়ে সার্চ করুন অথবা নমুনা ডাটা লোড করুন।
              </p>
              <button
                onClick={handleManualSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>নমুনা প্রশ্নব্যাংক লোড করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredSubjects.map((sub) => (
                <SubjectCard
                  key={sub.id}
                  subject={sub}
                  progress={progressStats[sub.id] || null}
                  onSelectSubject={handleSelectSubject}
                  onDirectPractice={handlePracticeAllSubject}
                  onTakeQuiz={(subject) => handleOpenQuizSetup(subject)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: TOPICS LIST */}
      {currentView === 'topics' && selectedSubject && (
        <TopicListView
          subject={selectedSubject}
          topics={topics}
          isLoading={isLoadingTopics}
          onBack={() => {
            setSelectedSubject(null);
            setCurrentView('subjects');
          }}
          onSelectTopic={handleSelectTopic}
          onPracticeAllSubject={() => handlePracticeAllSubject(selectedSubject)}
          onTakeSubjectQuiz={() => handleOpenQuizSetup(selectedSubject)}
          onTakeTopicQuiz={(topic) => handleOpenQuizSetup(selectedSubject, topic)}
        />
      )}

      {/* VIEW: QUESTION PRACTICE / READER */}
      {currentView === 'practice' && (
        <QuestionPracticeView
          questions={questions}
          subject={selectedSubject}
          topic={selectedTopic}
          userId={userId}
          title={practiceTitle}
          onBack={() => {
            if (selectedTopic && selectedSubject) {
              setCurrentView('topics');
            } else {
              setCurrentView('subjects');
            }
          }}
        />
      )}

      {/* VIEW: FAVORITES */}
      {currentView === 'favorites' && (
        <FavoritesView
          userId={userId || null}
          subjects={subjects}
          onBack={() => setCurrentView('subjects')}
          onPracticeQuestions={handlePracticeCustomQuestions}
          onOpenAuthModal={() => {
            if (onOpenAuthModal) onOpenAuthModal();
          }}
        />
      )}

      {/* VIEW: STUDENT PERFORMANCE ANALYTICS */}
      {currentView === 'analytics' && userId && (
        <StudentAnalyticsDashboard
          userId={userId}
          subjects={subjects}
          onBack={() => setCurrentView('subjects')}
          onOpenAuthModal={onOpenAuthModal}
          onStartQuizWithConfig={(sub, top) => {
            handleOpenQuizSetup(sub, top);
          }}
          onViewQuizHistory={() => setIsQuizHistoryOpen(true)}
        />
      )}

      {currentView === 'analytics' && !userId && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto my-8 animate-fade-in shadow-xs">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            লগইন করে আপনার অ্যানালিটিক্স দেখুন
          </h2>
          <p className="text-xs text-slate-500">
            আপনার প্রস্তুতি বিশ্লেষণ, দুর্বল ও শক্তিশালী টপিকের সঠিক ডেটা দেখতে সাইন ইন করুন।
          </p>
          <button
            onClick={onOpenAuthModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            সাইন ইন করুন
          </button>
        </div>
      )}

      {/* VIEW: ACTIVE QUIZ PLAYER & EXAM ENGINE */}
      {currentView === 'quiz' && activeQuizAttempt && activeQuizConfig && (
        <QuizPlayerView
          initialAttempt={activeQuizAttempt}
          questions={activeQuizQuestions}
          config={activeQuizConfig}
          userId={userId}
          onExit={handleExitQuiz}
          onOpenAuthModal={onOpenAuthModal}
          onViewAnalytics={() => setCurrentView('analytics')}
        />
      )}

      {/* VIEW: LIVE MODEL TESTS LIST */}
      {currentView === 'modelTests' && (
        <ModelTestListView
          modelTests={modelTests}
          userId={userId}
          onSelectTest={(test) => {
            setSelectedModelTest(test);
            if (test.status === 'live') {
              if (!userId && onOpenAuthModal) {
                onOpenAuthModal();
                return;
              }
              setCurrentView('modelTestPlayer');
            } else if (test.status === 'ended') {
              setCurrentView('modelTestLeaderboard');
            } else {
              // Upcoming test: show info modal or scroll
              alert(`এই পরীক্ষাটি শুরু হবে: ${test.startsAt?.toDate ? test.startsAt.toDate().toLocaleString('bn-BD') : ''}`);
            }
          }}
          onViewLeaderboard={(test) => {
            setSelectedModelTest(test);
            setCurrentView('modelTestLeaderboard');
          }}
          onOpenAuthModal={onOpenAuthModal}
        />
      )}

      {/* VIEW: LIVE MODEL TEST PLAYER */}
      {currentView === 'modelTestPlayer' && selectedModelTest && userId && (
        <LiveModelTestPlayer
          test={selectedModelTest}
          questions={
            selectedModelTest.questionsSnapshot && selectedModelTest.questionsSnapshot.length > 0
              ? selectedModelTest.questionsSnapshot
              : questions.slice(0, selectedModelTest.totalQuestions || 20).map((q, idx) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation || '',
                  subjectId: q.subjectId,
                  subjectName: q.subjectName || '',
                  topicId: q.topicId,
                  topicName: q.topicName || '',
                  subtopicId: q.subtopicId || null,
                  difficulty: q.difficulty || 'medium',
                  order: idx + 1,
                }))
          }
          userId={userId}
          userName="পরীক্ষার্থী"
          onExit={() => {
            setCurrentView('modelTests');
            loadModelTests();
          }}
          onViewLeaderboard={() => {
            setCurrentView('modelTestLeaderboard');
            loadModelTests();
          }}
        />
      )}

      {/* VIEW: MODEL TEST LEADERBOARD & MERIT LIST */}
      {currentView === 'modelTestLeaderboard' && selectedModelTest && (
        <ModelTestLeaderboardView
          test={selectedModelTest}
          userId={userId}
          onBack={() => setCurrentView('modelTests')}
        />
      )}

      {/* QUIZ CONFIGURATION MODAL */}
      <QuizConfigModal
        isOpen={isQuizConfigOpen}
        onClose={() => setIsQuizConfigOpen(false)}
        subjects={subjects}
        preselectedSubject={quizPreselectedSubject}
        preselectedTopic={quizPreselectedTopic}
        userId={userId}
        onOpenAuthModal={onOpenAuthModal}
        onStartQuiz={handleStartQuiz}
      />

      {/* QUIZ HISTORY MODAL */}
      <QuizHistoryModal
        isOpen={isQuizHistoryOpen}
        onClose={() => setIsQuizHistoryOpen(false)}
        userId={userId}
        onViewAttempt={handleViewHistoryAttempt}
      />
    </div>
  );
};
