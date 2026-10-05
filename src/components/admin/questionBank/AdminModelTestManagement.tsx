import React, { useState, useEffect } from 'react';
import {
  Award,
  PlusCircle,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Search,
  Filter,
  Layers,
  Sparkles,
  Trophy,
  X,
  Check,
  ChevronRight,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import {
  LiveModelTest,
  ModelTestCategory,
  CreateModelTestInput,
  ModelTestLeaderboardEntry,
} from '../../../types/modelTest';
import { QuestionBankQuestion } from '../../../types/questionBank';
import {
  getModelTests,
  createModelTest,
  updateModelTest,
  deleteModelTest,
  toggleModelTestActive,
  getModelTestLeaderboard,
  CATEGORY_NAMES,
} from '../../../modules/questionBank/services/modelTestService';
import { getQuestions } from '../../../modules/questionBank/services/questionService';
import { getSubjects } from '../../../modules/questionBank/services/subjectService';

export const AdminModelTestManagement: React.FC = () => {
  const [modelTests, setModelTests] = useState<LiveModelTest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ModelTestCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LiveModelTest | null>(null);

  // Leaderboard modal state
  const [inspectLeaderboardTest, setInspectLeaderboardTest] = useState<LiveModelTest | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<ModelTestLeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ModelTestCategory>('bcs');
  const [formDesc, setFormDesc] = useState('');
  const [formDuration, setFormDuration] = useState('60');
  const [formNegativeMark, setFormNegativeMark] = useState('0.5');
  const [formPassMarks, setFormPassMarks] = useState('50');
  const [formStartsAt, setFormStartsAt] = useState('');
  const [formEndsAt, setFormEndsAt] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Question Picker state inside create modal
  const [allAvailableQuestions, setAllAvailableQuestions] = useState<QuestionBankQuestion[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerSubjectId, setPickerSubjectId] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);

  useEffect(() => {
    loadTests();
    loadQuestionBankData();
  }, [selectedCategory]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ message, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const tests = await getModelTests(selectedCategory);
      setModelTests(tests);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestionBankData = async () => {
    try {
      const [subs, qRes] = await Promise.all([
        getSubjects(false),
        getQuestions({ limitCount: 150, onlyActive: true }),
      ]);
      setAvailableSubjects(subs);
      setAllAvailableQuestions(qRes.questions);
    } catch {
      // fallback
    }
  };

  // Open Create Modal with sensible defaults
  const handleOpenCreateModal = () => {
    setEditingTest(null);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Format for datetime-local
    const formatDateTime = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setFormTitle('');
    setFormCategory('bcs');
    setFormDesc('পরীক্ষার্থীদের প্রস্তুতি যাচাইয়ের জন্য পূর্ণাঙ্গ লাইভ মডেল টেস্ট। নির্ধারিত সময়ে শুরু হয়ে স্বয়ংক্রিয়ভাবে শেষ হবে।');
    setFormDuration('60');
    setFormNegativeMark('0.5');
    setFormPassMarks('50');
    setFormStartsAt(formatDateTime(tomorrow));
    setFormEndsAt(formatDateTime(dayAfter));
    setSelectedQuestionIds(allAvailableQuestions.slice(0, 20).map((q) => q.id));
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (t: LiveModelTest) => {
    setEditingTest(t);
    setFormTitle(t.title);
    setFormCategory(t.category);
    setFormDesc(t.description);
    setFormDuration(t.durationMinutes.toString());
    setFormNegativeMark(t.negativeMarking.toString());
    setFormPassMarks(t.passMarks.toString());

    const formatFromTimestamp = (ts: any) => {
      const d = ts?.toDate ? ts.toDate() : new Date((ts?.seconds || Date.now() / 1000) * 1000);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setFormStartsAt(formatFromTimestamp(t.startsAt));
    setFormEndsAt(formatFromTimestamp(t.endsAt));
    setSelectedQuestionIds(t.questionIds || []);
    setIsCreateModalOpen(true);
  };

  // Toggle question selection in picker
  const toggleQuestionSelection = (qId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Auto-pick N questions
  const handleAutoPickQuestions = (count: number) => {
    const pool = pickerSubjectId
      ? allAvailableQuestions.filter((q) => q.subjectId === pickerSubjectId)
      : allAvailableQuestions;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, count).map((q) => q.id);
    setSelectedQuestionIds(picked);
    showNotification(`${picked.length}টি প্রশ্ন স্বয়ংক্রিয়ভাবে মডেল টেস্টে যুক্ত করা হয়েছে!`);
  };

  // Handle Save
  const handleSaveModelTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showNotification('মডেল টেস্টের শিরোনাম লিখুন', 'error');
      return;
    }
    if (selectedQuestionIds.length === 0) {
      showNotification('মডেল টেস্টে কমপক্ষে ১টি বা ততোধিক প্রশ্ন যুক্ত করুন', 'error');
      return;
    }

    const startDate = new Date(formStartsAt);
    const endDate = new Date(formEndsAt);

    if (endDate <= startDate) {
      showNotification('মডেল টেস্ট শেষ হওয়ার সময় শুরুর সময়ের পরে হতে হবে', 'error');
      return;
    }

    // Build question snapshots for reliable test taking
    const selectedQuestions = allAvailableQuestions.filter((q) =>
      selectedQuestionIds.includes(q.id)
    );
    const snapshots = selectedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      subjectId: q.subjectId,
      topicId: q.topicId,
      difficulty: q.difficulty,
    }));

    const totalQuestions = selectedQuestionIds.length;
    const totalMarks = totalQuestions * 1; // 1 mark per question
    const durationMinutes = parseInt(formDuration, 10) || 60;
    const negativeMarking = parseFloat(formNegativeMark) || 0.5;
    const passMarks = parseFloat(formPassMarks) || Math.round(totalMarks * 0.4);

    try {
      if (editingTest) {
        await updateModelTest(editingTest.id, {
          title: formTitle.trim(),
          category: formCategory,
          description: formDesc.trim(),
          totalQuestions,
          totalMarks,
          durationMinutes,
          negativeMarking,
          passMarks,
          questionIds: selectedQuestionIds,
          questionsSnapshot: snapshots,
        });
        showNotification('মডেল টেস্ট সফলভাবে আপডেট করা হয়েছে!');
      } else {
        const input: CreateModelTestInput = {
          title: formTitle.trim(),
          category: formCategory,
          description: formDesc.trim(),
          totalQuestions,
          totalMarks,
          durationMinutes,
          negativeMarking,
          passMarks,
          startsAt: startDate,
          endsAt: endDate,
          resultPublishAt: endDate,
          questionIds: selectedQuestionIds,
          questionsSnapshot: snapshots,
          isFeatured: true,
        };
        await createModelTest(input);
        showNotification('নতুন লাইভ মডেল টেস্ট সফলভাবে পাবলিশ করা হয়েছে!');
      }

      setIsCreateModalOpen(false);
      loadTests();
    } catch (err: any) {
      showNotification(err?.message || 'সংরক্ষণ করার সময় একটি ত্রুটি ঘটেছে', 'error');
    }
  };

  // Toggle active/inactive
  const handleToggleActive = async (t: LiveModelTest) => {
    try {
      const nextActive = !t.isActive;
      await toggleModelTestActive(t.id, nextActive);
      setModelTests((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, isActive: nextActive } : item))
      );
      showNotification(`মডেল টেস্টটির স্ট্যাটাস ${nextActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`);
    } catch {
      showNotification('স্ট্যাটাস পরিবর্তন করা যায়নি', 'error');
    }
  };

  // Delete test
  const handleDeleteTest = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই মডেল টেস্টটি মুছে ফেলতে চান?')) return;
    try {
      await deleteModelTest(id);
      showNotification('মডেল টেস্ট মুছে ফেলা হয়েছে।');
      loadTests();
    } catch (err: any) {
      showNotification(err?.message || 'মুছে ফেলার সময় সমস্যা হয়েছে', 'error');
    }
  };

  // View Leaderboard
  const handleOpenLeaderboard = async (t: LiveModelTest) => {
    setInspectLeaderboardTest(t);
    setIsLoadingLeaderboard(true);
    try {
      const entries = await getModelTestLeaderboard(t.id);
      setLeaderboardEntries(entries);
    } catch {
      setLeaderboardEntries([]);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // Filtered available questions in picker
  const filteredPickerQuestions = allAvailableQuestions.filter((q) => {
    if (pickerSubjectId && q.subjectId !== pickerSubjectId) return false;
    if (pickerSearch.trim()) {
      const term = pickerSearch.toLowerCase().trim();
      return (
        q.question.toLowerCase().includes(term) ||
        (q.examName && q.examName.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md transition-all ${
            actionNotice.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-800 border border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{actionNotice.message}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                লাইভ মডেল টেস্ট ম্যানেজমেন্ট (Live Exam Manager)
                <span className="text-[10px] bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                  Real-time Merit List
                </span>
              </h2>
              <p className="text-xs text-amber-200/70 mt-0.5">
                লাইভ মডেল টেস্ট শিডিউল করুন, সময় ও নেগেটিভ মার্কিং নির্ধারণ করুন এবং মেধা তালিকা পর্যবেক্ষণ করুন।
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন মডেল টেস্ট তৈরি করুন</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সকল পরীক্ষা ({modelTests.length})
        </button>

        {(['bcs', 'primary', 'bank', 'ntrca', 'admission', 'special'] as ModelTestCategory[]).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {CATEGORY_NAMES[cat]}
            </button>
          )
        )}
      </div>

      {/* Tests Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
          <Clock className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500">মডেল টেস্ট লোড হচ্ছে...</p>
        </div>
      ) : modelTests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-black text-slate-800">কোনো মডেল টেস্ট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            এই ক্যাটাগরিতে এখনও কোনো মডেল টেস্ট তৈরি করা হয়নি। উপরের বাটন ক্লিক করে নতুন মডেল টেস্ট যোগ করুন।
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            নতুন মডেল টেস্ট তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modelTests.map((t) => {
            const isLive = t.status === 'live';
            const isUpcoming = t.status === 'upcoming';

            return (
              <div
                key={t.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  t.isActive !== false
                    ? 'border-slate-200 hover:border-amber-300 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                      {CATEGORY_NAMES[t.category] || 'মডেল টেস্ট'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isLive && (
                        <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          লাইভ চলছে
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          আসন্ন পরীক্ষা
                        </span>
                      )}
                      {!isLive && !isUpcoming && (
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          সমাপ্ত
                        </span>
                      )}
                      {t.isActive === false && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                          নিষ্ক্রিয়
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">{t.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">প্রশ্ন সংখ্যা</span>
                      <span className="text-xs font-black text-slate-800">{t.totalQuestions} টি</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">মোট নম্বর</span>
                      <span className="text-xs font-black text-slate-800">{t.totalMarks}</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">সময়সীমা</span>
                      <span className="text-xs font-black text-slate-800">{t.durationMinutes} মিনিট</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">নেগেটিভ মার্ক</span>
                      <span className="text-xs font-black text-rose-600">-{t.negativeMarking}</span>
                    </div>
                  </div>

                  {/* Participants & Pass info */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60">
                    <span className="flex items-center gap-1 text-amber-900">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      মোট অংশগ্রহণকারী: {t.totalParticipants || 0} জন
                    </span>
                    <span className="text-slate-600">পাস মার্ক: {t.passMarks}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenLeaderboard(t)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>মেধা তালিকা</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
                      title="এডিট করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(t)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title={t.isActive !== false ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    >
                      {t.isActive !== false ? (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteTest(t.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODEL TEST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8 border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{editingTest ? 'মডেল টেস্ট এডিট করুন' : 'নতুন লাইভ মডেল টেস্ট তৈরি করুন'}</span>
                </h3>
                <p className="text-[11px] text-amber-100 mt-0.5">
                  প্রশ্নের তালিকা, সময়সীমা ও শিডিউল নির্ধারণ করে প্রকাশ করুন।
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveModelTest} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-extrabold mb-1">
                    মডেল টেস্টের নাম/শিরোনাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    placeholder="যেমন: ৪৬তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ লাইভ মডেল টেস্ট - ০১"
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">ক্যাটাগরি</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ModelTestCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-amber-500"
                  >
                    <option value="bcs">বিসিএস প্রিলিমিনারি</option>
                    <option value="primary">প্রাইমারি সহকারী শিক্ষক</option>
                    <option value="bank">ব্যাংক নিয়োগ পরীক্ষা</option>
                    <option value="ntrca">এনটিআরসিএ (নিবন্ধন)</option>
                    <option value="admission">বিশ্ববিদ্যালয় ভর্তি</option>
                    <option value="special">বিশেষ ও মন্ত্রণালয়</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">বিবরণ ও নির্দেশনা</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-amber-500"
                />
              </div>

              {/* Exam Parameters: Duration, Negative, Pass */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">সময়সীমা (মিনিট)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    required
                    min={5}
                    max={300}
                    className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">নেগেটিভ মার্ক (ভুল উত্তরে)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formNegativeMark}
                    onChange={(e) => setFormNegativeMark(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">পাস মার্ক</label>
                  <input
                    type="number"
                    value={formPassMarks}
                    onChange={(e) => setFormPassMarks(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-amber-500"
                  />
                </div>
              </div>

              {/* Live Schedule: Start and End */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">
                    লাইভ শুরুর সময় (Starts At) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formStartsAt}
                    onChange={(e) => setFormStartsAt(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">
                    লাইভ সমাপ্তির সময় (Ends At) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formEndsAt}
                    onChange={(e) => setFormEndsAt(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-amber-500"
                  />
                </div>
              </div>

              {/* Question Picker Tool */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-black text-slate-900 text-sm">প্রশ্ন নির্বাচন করুন (Select Questions)</span>
                    <span className="text-[11px] text-slate-500 block">
                      বর্তমান নির্বাচিত প্রশ্ন: <strong className="text-amber-700">{selectedQuestionIds.length} টি</strong> (মোট নম্বর: {selectedQuestionIds.length})
                    </span>
                  </div>

                  {/* Auto-pick quick buttons */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">কুইক সিলেক্ট:</span>
                    <button
                      type="button"
                      onClick={() => handleAutoPickQuestions(20)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold border border-amber-200"
                    >
                      ২০ টি
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutoPickQuestions(50)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold border border-amber-200"
                    >
                      ৫০ টি
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedQuestionIds([])}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold"
                    >
                      ক্লিয়ার
                    </button>
                  </div>
                </div>

                {/* Filter within question picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={pickerSubjectId}
                    onChange={(e) => setPickerSubjectId(e.target.value)}
                    className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800"
                  >
                    <option value="">সকল বিষয় থেকে বাছুন</option>
                    {availableSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="প্রশ্ন বা পরীক্ষা খুঁজুন..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Scrollable Questions list */}
                <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-2 space-y-2">
                  {filteredPickerQuestions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">কোনো প্রশ্ন পাওয়া যায়নি</div>
                  ) : (
                    filteredPickerQuestions.map((q) => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => toggleQuestionSelection(q.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-1 flex-1">
                            <p className="text-xs leading-snug">{q.question}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                              {q.examName && <span>{q.examName}</span>}
                              <span>সঠিক উত্তর: {q.correctAnswer}</span>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'bg-amber-500 border-amber-600 text-slate-950 font-black'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTest ? 'আপডেট সম্পন্ন করুন' : 'মডেল টেস্ট পাবলিশ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEADERBOARD / MERIT LIST INSPECTOR MODAL */}
      {inspectLeaderboardTest && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8 border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>লাইভ মেধা তালিকা (Merit List & Leaderboard)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{inspectLeaderboardTest.title}</p>
              </div>
              <button
                onClick={() => setInspectLeaderboardTest(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {isLoadingLeaderboard ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                  <Clock className="w-6 h-6 animate-spin text-amber-500" />
                  <span>মেধা তালিকা লোড হচ্ছে...</span>
                </div>
              ) : leaderboardEntries.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-1">
                  <Users className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-bold">এখনও কেউ এই পরীক্ষায় অংশ নেয়নি।</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-[11px] font-black text-slate-400 px-3 pb-1 border-b border-slate-100">
                    <span className="col-span-2">র‍্যাংক</span>
                    <span className="col-span-4">প্রার্থীর নাম</span>
                    <span className="col-span-2 text-center">স্কোর</span>
                    <span className="col-span-2 text-center">সঠিক/ভুল</span>
                    <span className="col-span-2 text-right">সময়</span>
                  </div>

                  {leaderboardEntries.map((e, idx) => {
                    const isTop3 = idx < 3;
                    return (
                      <div
                        key={e.id || idx}
                        className={`grid grid-cols-12 items-center p-3 rounded-xl border text-xs transition-all ${
                          idx === 0
                            ? 'bg-amber-500/10 border-amber-300 font-extrabold'
                            : idx === 1
                            ? 'bg-slate-100 border-slate-300 font-bold'
                            : idx === 2
                            ? 'bg-amber-50 border-amber-200 font-bold'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="col-span-2 flex items-center gap-1.5">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              idx === 0
                                ? 'bg-amber-500 text-slate-950 shadow-xs'
                                : idx === 1
                                ? 'bg-slate-300 text-slate-800'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {e.rank || idx + 1}
                          </span>
                        </div>

                        <span className="col-span-4 font-bold text-slate-900 truncate">
                          {e.userName || 'পরীক্ষার্থী'}
                        </span>

                        <span className="col-span-2 text-center font-black text-amber-700">
                          {e.score}
                        </span>

                        <span className="col-span-2 text-center text-[11px] text-slate-500">
                          {e.correctAnswers} / {e.wrongAnswers}
                        </span>

                        <span className="col-span-2 text-right text-[11px] text-slate-400 font-mono">
                          {Math.floor(e.timeTakenSeconds / 60)}মি {e.timeTakenSeconds % 60}সে
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
