import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  PlusCircle,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Trash2,
  Edit3,
  Upload,
  Download,
  AlertCircle,
  FolderPlus,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  X,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import {
  QuestionBankSubject,
  QuestionBankTopic,
  QuestionBankQuestion,
  CreateQuestionInput,
  CorrectAnswer,
  QuestionDifficulty,
} from '../../../types/questionBank';
import { getSubjects, createSubject } from '../../../modules/questionBank/services/subjectService';
import { getTopics, createTopic } from '../../../modules/questionBank/services/topicService';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getLocalCustomQuestions,
} from '../../../modules/questionBank/services/questionService';
import { SEED_QUESTIONS } from '../../../modules/questionBank/data/seedData';

type ActiveTab = 'list' | 'create' | 'subjects' | 'import';

export const AdminQuestionBankManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('list');
  const [subjects, setSubjects] = useState<QuestionBankSubject[]>([]);
  const [topics, setTopics] = useState<QuestionBankTopic[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [questions, setQuestions] = useState<QuestionBankQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit Question State
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankQuestion | null>(null);

  // New / Edit Question Form State
  const [formData, setFormData] = useState<{
    subjectId: string;
    topicId: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: CorrectAnswer;
    explanation: string;
    difficulty: QuestionDifficulty;
    examName: string;
    examYear: string;
    tags: string;
    isActive: boolean;
  }>({
    subjectId: '',
    topicId: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    difficulty: 'medium',
    examName: '',
    examYear: new Date().getFullYear().toString(),
    tags: '',
    isActive: true,
  });

  // New Subject Form State
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);

  // New Topic Form State
  const [newTopicSubjectId, setNewTopicSubjectId] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // Bulk Import State
  const [bulkText, setBulkText] = useState('');
  const [importSubjectId, setImportSubjectId] = useState('');
  const [importTopicId, setImportTopicId] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Load Subjects on mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const subs = await getSubjects(false);
      setSubjects(subs);
      if (subs.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId('');
      }
    } catch {
      // fallback
    }
  };

  // Load topics whenever a subject is selected
  useEffect(() => {
    if (selectedSubjectId) {
      loadTopics(selectedSubjectId);
    } else {
      setTopics([]);
      setSelectedTopicId('');
    }
  }, [selectedSubjectId]);

  const loadTopics = async (subjId: string) => {
    try {
      const tops = await getTopics(subjId, false);
      setTopics(tops);
    } catch {
      setTopics([]);
    }
  };

  // Load topics for form whenever form subject changes
  const [formTopics, setFormTopics] = useState<QuestionBankTopic[]>([]);
  useEffect(() => {
    if (formData.subjectId) {
      getTopics(formData.subjectId, false).then(setFormTopics).catch(() => setFormTopics([]));
    } else {
      setFormTopics([]);
    }
  }, [formData.subjectId]);

  // Load questions
  const loadQuestionList = async () => {
    setIsLoading(true);
    try {
      const res = await getQuestions({
        subjectId: selectedSubjectId || undefined,
        topicId: selectedTopicId || undefined,
        difficulty: selectedDifficulty !== 'all' ? (selectedDifficulty as QuestionDifficulty) : undefined,
        limitCount: 100,
        onlyActive: false,
      });
      setQuestions(res.questions);
    } catch {
      setQuestions([...getLocalCustomQuestions(), ...SEED_QUESTIONS]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionList();
  }, [selectedSubjectId, selectedTopicId, selectedDifficulty]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ message, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Filtered questions based on client search
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const q = searchQuery.toLowerCase().trim();
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.options.A.toLowerCase().includes(q) ||
        item.options.B.toLowerCase().includes(q) ||
        item.options.C.toLowerCase().includes(q) ||
        item.options.D.toLowerCase().includes(q) ||
        (item.examName && item.examName.toLowerCase().includes(q)) ||
        (item.explanation && item.explanation.toLowerCase().includes(q))
    );
  }, [questions, searchQuery]);

  // Handle Form Submit for Create / Update Question
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subjectId) {
      showNotification('অনুগ্রহ করে একটি বিষয় (Subject) নির্বাচন করুন', 'error');
      return;
    }
    if (!formData.topicId) {
      showNotification('অনুগ্রহ করে একটি অধ্যায় বা টপিক (Topic) নির্বাচন করুন', 'error');
      return;
    }
    if (!formData.question.trim()) {
      showNotification('প্রশ্নের বিবরণ বা প্রশ্ন লিখুন', 'error');
      return;
    }
    if (!formData.optionA.trim() || !formData.optionB.trim() || !formData.optionC.trim() || !formData.optionD.trim()) {
      showNotification('প্রশ্নের ৪টি অপশনই (ক, খ, গ, ঘ) সঠিকভাবে পূরণ করুন', 'error');
      return;
    }

    const payload: CreateQuestionInput = {
      subjectId: formData.subjectId,
      topicId: formData.topicId,
      question: formData.question.trim(),
      options: {
        A: formData.optionA.trim(),
        B: formData.optionB.trim(),
        C: formData.optionC.trim(),
        D: formData.optionD.trim(),
      },
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation.trim(),
      difficulty: formData.difficulty,
      examName: formData.examName.trim(),
      examYear: formData.examYear ? parseInt(formData.examYear, 10) : undefined,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isActive: formData.isActive,
    };

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, payload);
        showNotification('প্রশ্নটি সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await createQuestion(payload);
        showNotification('নতুন প্রশ্ন সফলভাবে প্রশ্নব্যাংকে যুক্ত হয়েছে!');
      }

      // Reset form
      setEditingQuestion(null);
      setFormData({
        subjectId: formData.subjectId,
        topicId: formData.topicId,
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        difficulty: 'medium',
        examName: '',
        examYear: new Date().getFullYear().toString(),
        tags: '',
        isActive: true,
      });

      // Reload
      loadQuestionList();
      setActiveTab('list');
    } catch (err: any) {
      showNotification(err?.message || 'সংরক্ষণ করার সময় একটি ত্রুটি ঘটেছে', 'error');
    }
  };

  const handleStartEdit = (q: QuestionBankQuestion) => {
    setEditingQuestion(q);
    setFormData({
      subjectId: q.subjectId,
      topicId: q.topicId,
      question: q.question,
      optionA: q.options.A,
      optionB: q.options.B,
      optionC: q.options.C,
      optionD: q.options.D,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'medium',
      examName: q.examName || '',
      examYear: q.examYear ? q.examYear.toString() : '',
      tags: (q.tags || []).join(', '),
      isActive: q.isActive !== false,
    });
    setActiveTab('create');
  };

  const handleDelete = async (questionId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      await deleteQuestion(questionId, false);
      showNotification('প্রশ্নটি মুছে ফেলা হয়েছে।');
      loadQuestionList();
    } catch (err: any) {
      showNotification(err?.message || 'মুছে ফেলার সময় সমস্যা হয়েছে', 'error');
    }
  };

  const handleToggleStatus = async (q: QuestionBankQuestion) => {
    try {
      const nextActive = !q.isActive;
      await updateQuestion(q.id, { isActive: nextActive });
      setQuestions((prev) =>
        prev.map((item) => (item.id === q.id ? { ...item, isActive: nextActive } : item))
      );
      showNotification(`প্রশ্নটির স্ট্যাটাস ${nextActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`);
    } catch {
      showNotification('স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি', 'error');
    }
  };

  // Add Subject handler
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    setIsCreatingSubject(true);
    try {
      await createSubject({
        name: newSubjectName.trim(),
        description: newSubjectDesc.trim(),
        sortOrder: subjects.length + 1,
        isActive: true,
      });
      setNewSubjectName('');
      setNewSubjectDesc('');
      showNotification('নতুন বিষয় সফলভাবে তৈরি করা হয়েছে!');
      loadSubjects();
    } catch (err: any) {
      showNotification(err?.message || 'বিষয় তৈরিতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsCreatingSubject(false);
    }
  };

  // Add Topic handler
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicSubjectId || !newTopicName.trim()) {
      showNotification('বিষয় এবং অধ্যায়ের নাম লিখুন', 'error');
      return;
    }
    setIsCreatingTopic(true);
    try {
      await createTopic({
        subjectId: newTopicSubjectId,
        name: newTopicName.trim(),
        description: newTopicDesc.trim(),
        sortOrder: 1,
        isActive: true,
      });
      setNewTopicName('');
      setNewTopicDesc('');
      showNotification('নতুন অধ্যায়/টপিক সফলভাবে তৈরি হয়েছে!');
      if (selectedSubjectId === newTopicSubjectId) {
        loadTopics(newTopicSubjectId);
      }
    } catch (err: any) {
      showNotification(err?.message || 'অধ্যায় তৈরিতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsCreatingTopic(false);
    }
  };

  // Parse Bulk text into questions
  const parseBulkCSV = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: any[] = [];

    // Header check
    let startIdx = 0;
    if (lines[0].toLowerCase().includes('question') || lines[0].includes('প্রশ্ন')) {
      startIdx = 1;
    }

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      // Split by tab or comma
      const parts = line.includes('\t')
        ? line.split('\t')
        : line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // CSV regex split
      const clean = parts.map((p) => p.replace(/^"|"$/g, '').trim());

      if (clean.length >= 6) {
        const question = clean[0];
        const optionA = clean[1];
        const optionB = clean[2];
        const optionC = clean[3];
        const optionD = clean[4];
        let ans = clean[5].toUpperCase();
        if (ans === 'ক' || ans === '1') ans = 'A';
        if (ans === 'খ' || ans === '2') ans = 'B';
        if (ans === 'গ' || ans === '3') ans = 'C';
        if (ans === 'ঘ' || ans === '4') ans = 'D';

        const explanation = clean[6] || '';
        const examName = clean[7] || '';

        if (question && optionA && optionB && optionC && optionD && ['A', 'B', 'C', 'D'].includes(ans)) {
          parsed.push({
            question,
            options: { A: optionA, B: optionB, C: optionC, D: optionD },
            correctAnswer: ans as CorrectAnswer,
            explanation,
            examName,
          });
        }
      }
    }

    setParsedRows(parsed);
  };

  const handleExecuteImport = async () => {
    if (!importSubjectId || !importTopicId) {
      showNotification('ইমপোর্টের জন্য বিষয় ও অধ্যায় নির্ধারণ করুন', 'error');
      return;
    }
    if (parsedRows.length === 0) {
      showNotification('ইমপোর্ট করার মতো কোনো বৈধ প্রশ্ন নেই', 'error');
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    try {
      for (const row of parsedRows) {
        await createQuestion({
          subjectId: importSubjectId,
          topicId: importTopicId,
          question: row.question,
          options: row.options,
          correctAnswer: row.correctAnswer,
          explanation: row.explanation,
          difficulty: 'medium',
          examName: row.examName,
          isActive: true,
        });
        successCount++;
      }
      showNotification(`সফলভাবে ${successCount}টি প্রশ্ন ইমপোর্ট করা হয়েছে!`);
      setBulkText('');
      setParsedRows([]);
      loadQuestionList();
      setActiveTab('list');
    } catch (err: any) {
      showNotification(`ইমপোর্ট করার সময় কিছু ত্রুটি ঘটেছে: ${err?.message}`, 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const sampleTemplate = `প্রশ্ন,অপশন ক,অপশন খ,অপশন গ,অপশন ঘ,সঠিক উত্তর,ব্যাখ্যা,পরীক্ষার নাম
চর্যাপদের আদি কবি কে?,লুইপা,শবরপা,ভুসুকুপা,কাহ্নপা,A,চর্যাপদের প্রথম পদটি রচনা করেন লুইপা।,বিসিএস প্রিলিমিনারি
বাংলা ভাষার মূল উৎস কোনটি?,বৈদিক,পালি,প্রাকৃত,অপভ্রংশ,C,প্রাকৃত ভাষা থেকে বাংলা ভাষার জন্ম।,প্রাথমিক শিক্ষক নিয়োগ
সবার উপরে মানুষ সত্য তাহার উপরে নাই কার উক্তি?,বিদ্যাপতি,চণ্ডীদাস,জ্ঞানদাস,রামপ্রসাদ,B,মধ্যযুগের কবি চণ্ডীদাসের অমর বাণী।,৪৭তম বিসিএস`;

  return (
    <div className="space-y-6">
      {/* Action Notification Alert */}
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
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 text-white border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                প্রশ্নব্যাংক ম্যানেজমেন্ট (Question Bank Engine)
                <span className="text-[10px] bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full">
                  1M+ Scalable
                </span>
              </h2>
              <p className="text-xs text-indigo-200/70 mt-0.5">
                বিসিএস, প্রাথমিক শিক্ষক, ব্যাংক ও ভর্তি পরীক্ষার প্রশ্নসমূহ তৈরি, হালনাগাদ ও বাল্ক ইমপোর্ট করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-indigo-500/20 self-stretch md:self-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'list'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>প্রশ্ন তালিকা ({filteredQuestions.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingQuestion(null);
              setActiveTab('create');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{editingQuestion ? 'প্রশ্ন এডিট' : 'নতুন প্রশ্ন যুক্ত'}</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'subjects'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>বিষয় ও অধ্যায়</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'import'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>বাল্ক ইমপোর্ট (CSV)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: QUESTION LIST & FILTERS */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Subject Selector */}
            <div>
              <label className="block text-slate-500 font-bold mb-1">বিষয় (Subject)</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedTopicId('');
                }}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:outline-indigo-500"
              >
                <option value="">সকল বিষয় (All Subjects)</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selector */}
            <div>
              <label className="block text-slate-500 font-bold mb-1">অধ্যায়/টপিক (Topic)</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                disabled={!selectedSubjectId}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:outline-indigo-500 disabled:opacity-50"
              >
                <option value="">সকল অধ্যায় (All Topics)</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-slate-500 font-bold mb-1">কঠিনতার স্তর (Difficulty)</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:outline-indigo-500"
              >
                <option value="all">সকল স্তর</option>
                <option value="easy">সহজ (Easy)</option>
                <option value="medium">মধ্যম (Medium)</option>
                <option value="hard">কঠিন (Hard)</option>
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-slate-500 font-bold mb-1">অনুসন্ধান (Search Query)</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="প্রশ্ন বা উত্তর খুঁজুন..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Question Cards List */}
          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500">প্রশ্নসমূহ লোড হচ্ছে...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-black text-slate-800">কোনো প্রশ্ন পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আপনার নির্বাচিত ফিল্টারে কোনো প্রশ্ন নেই। ফিল্টার পরিবর্তন করুন অথবা নতুন প্রশ্ন যুক্ত করুন।
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                নতুন প্রশ্ন তৈরি করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
                <span>মোট প্রদর্শিত প্রশ্ন: {filteredQuestions.length} টি</span>
                <span>অ্যাকশন: এডিট, ডিলিট বা সক্রিয়/নিষ্ক্রিয় করুন</span>
              </div>

              {filteredQuestions.map((q, idx) => {
                const optKeys: CorrectAnswer[] = ['A', 'B', 'C', 'D'];
                const banglaLabels: Record<CorrectAnswer, string> = {
                  A: 'ক',
                  B: 'খ',
                  C: 'গ',
                  D: 'ঘ',
                };

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl p-5 border transition-all ${
                      q.isActive !== false
                        ? 'border-slate-200 hover:border-indigo-300 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        {/* Meta Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                            #{idx + 1}
                          </span>

                          {q.examName && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                              {q.examName} {q.examYear ? `(${q.examYear})` : ''}
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              q.difficulty === 'hard'
                                ? 'bg-rose-50 text-rose-700'
                                : q.difficulty === 'easy'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {q.difficulty === 'hard' ? 'কঠিন' : q.difficulty === 'easy' ? 'সহজ' : 'মধ্যম'}
                          </span>

                          {q.isActive === false && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                              নিষ্ক্রিয় (Inactive)
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                          {q.question}
                        </h4>

                        {/* 4 Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                          {optKeys.map((key) => {
                            const isCorrect = q.correctAnswer === key;
                            return (
                              <div
                                key={key}
                                className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 font-extrabold'
                                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {banglaLabels[key]}
                                </span>
                                <span className="truncate">{q.options[key]}</span>
                                {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900/90 leading-relaxed mt-2">
                            <span className="font-bold text-amber-800">ব্যাখ্যা: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-start">
                        <button
                          onClick={() => handleStartEdit(q)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="এডিট করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(q)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title={q.isActive !== false ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                        >
                          {q.isActive !== false ? (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(q.id)}
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
        </div>
      )}

      {/* TAB 2: CREATE / EDIT QUESTION FORM */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {editingQuestion ? 'প্রশ্ন এডিট করুন' : 'নতুন প্রশ্ন তৈরি করুন (Add New Question)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                সঠিক অপশন, ব্যাখ্যা এবং পরীক্ষার রেফারেন্স দিয়ে প্রশ্নব্যাংক সমৃদ্ধ করুন।
              </p>
            </div>
            {editingQuestion && (
              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setActiveTab('list');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                বাতিল করুন
              </button>
            )}
          </div>

          <form onSubmit={handleSaveQuestion} className="space-y-5 text-xs">
            {/* Subject and Topic Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">
                  বিষয় নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '' })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-indigo-500"
                >
                  <option value="">বিষয় নির্বাচন করুন...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">
                  অধ্যায় / টপিক নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  disabled={!formData.subjectId}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-indigo-500 disabled:opacity-50"
                >
                  <option value="">অধ্যায় নির্বাচন করুন...</option>
                  {formTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                প্রশ্নের বিবরণ (Question Title / Prompt) <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                rows={3}
                required
                placeholder="যেমন: চর্যাপদ কোন ছন্দে রচিত?"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
              />
            </div>

            {/* 4 Options and Correct Answer Selector */}
            <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800">প্রশ্নের ৪টি অপশন ও সঠিক উত্তর নির্বাচন</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  সঠিক অপশনের রেডিও বাটনে ক্লিক করুন
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option A */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    formData.correctAnswer === 'A'
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <input
                      type="radio"
                      id="optA"
                      name="correctAnswer"
                      checked={formData.correctAnswer === 'A'}
                      onChange={() => setFormData({ ...formData, correctAnswer: 'A' })}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="optA" className="font-extrabold text-slate-800 cursor-pointer">
                      (ক) অপশন A {formData.correctAnswer === 'A' && <span className="text-emerald-600 font-bold">(সঠিক উত্তর)</span>}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    required
                    placeholder="অপশন ক এর উত্তর লিখুন"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                  />
                </div>

                {/* Option B */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    formData.correctAnswer === 'B'
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <input
                      type="radio"
                      id="optB"
                      name="correctAnswer"
                      checked={formData.correctAnswer === 'B'}
                      onChange={() => setFormData({ ...formData, correctAnswer: 'B' })}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="optB" className="font-extrabold text-slate-800 cursor-pointer">
                      (খ) অপশন B {formData.correctAnswer === 'B' && <span className="text-emerald-600 font-bold">(সঠিক উত্তর)</span>}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    required
                    placeholder="অপশন খ এর উত্তর লিখুন"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                  />
                </div>

                {/* Option C */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    formData.correctAnswer === 'C'
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <input
                      type="radio"
                      id="optC"
                      name="correctAnswer"
                      checked={formData.correctAnswer === 'C'}
                      onChange={() => setFormData({ ...formData, correctAnswer: 'C' })}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="optC" className="font-extrabold text-slate-800 cursor-pointer">
                      (গ) অপশন C {formData.correctAnswer === 'C' && <span className="text-emerald-600 font-bold">(সঠিক উত্তর)</span>}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    required
                    placeholder="অপশন গ এর উত্তর লিখুন"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                  />
                </div>

                {/* Option D */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    formData.correctAnswer === 'D'
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <input
                      type="radio"
                      id="optD"
                      name="correctAnswer"
                      checked={formData.correctAnswer === 'D'}
                      onChange={() => setFormData({ ...formData, correctAnswer: 'D' })}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="optD" className="font-extrabold text-slate-800 cursor-pointer">
                      (ঘ) অপশন D {formData.correctAnswer === 'D' && <span className="text-emerald-600 font-bold">(সঠিক উত্তর)</span>}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    required
                    placeholder="অপশন ঘ এর উত্তর লিখুন"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                বিস্তারিত ব্যাখ্যা (Explanation - ঐচ্ছিক কিন্তু শিক্ষার্থীদের জন্য জরুরি)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={2}
                placeholder="প্রশ্নের উত্তরটির বিস্তারিত তথ্য, রেফারেন্স বা উৎস..."
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
              />
            </div>

            {/* Exam metadata & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">কঠিনতার স্তর (Difficulty)</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as QuestionDifficulty })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-indigo-500"
                >
                  <option value="easy">সহজ (Easy)</option>
                  <option value="medium">মধ্যম (Medium)</option>
                  <option value="hard">কঠিন (Hard)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">পরীক্ষার নাম (Exam Name)</label>
                <input
                  type="text"
                  value={formData.examName}
                  onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                  placeholder="যেমন: ৪৪তম বিসিএস প্রিলিমিনারি"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">পরীক্ষার বছর (Year)</label>
                <input
                  type="number"
                  value={formData.examYear}
                  onChange={(e) => setFormData({ ...formData, examYear: e.target.value })}
                  placeholder="2024"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Tags and Active Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">ট্যাগসমূহ (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="যেমন: চর্যাপদ, প্রাচীন যুগ, বাংলা"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-slate-800 font-bold cursor-pointer">
                  প্রশ্নটি সক্রিয় রাখুন (শিক্ষার্থীরা প্র্যাকটিস করতে পারবে)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingQuestion ? 'আপডেট সম্পন্ন করুন' : 'প্রশ্নব্যাংকে যুক্ত করুন'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SUBJECTS & TOPICS MANAGEMENT */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Subject Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">নতুন বিষয় তৈরি করুন (Create Subject)</h3>
              </div>

              <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">বিষয়ের নাম *</label>
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    required
                    placeholder="যেমন: আন্তর্জাতিক বিষয়াবলি"
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <input
                    type="text"
                    value={newSubjectDesc}
                    onChange={(e) => setNewSubjectDesc(e.target.value)}
                    placeholder="যেমন: বিশ্ব ইতিহাস, ভূরাজনীতি, জাতিসংঘ..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingSubject || !newSubjectName.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreatingSubject ? 'তৈরি হচ্ছে...' : 'বিষয় সংরক্ষণ করুন'}
                </button>
              </form>
            </div>

            {/* Create Topic Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">নতুন অধ্যায়/টপিক যুক্ত করুন (Create Topic)</h3>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">মূল বিষয় নির্বাচন করুন *</label>
                  <select
                    value={newTopicSubjectId}
                    onChange={(e) => setNewTopicSubjectId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-indigo-500"
                  >
                    <option value="">বিষয় নির্বাচন করুন...</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">অধ্যায় বা টপিকের নাম *</label>
                  <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    required
                    placeholder="যেমন: জাতিসংঘ ও আন্তর্জাতিক সংস্থাসমূহ"
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <input
                    type="text"
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                    placeholder="টপিকের মূল আলোচ্য বিষয়..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingTopic || !newTopicName.trim() || !newTopicSubjectId}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreatingTopic ? 'যুক্ত হচ্ছে...' : 'অধ্যায় সংরক্ষণ করুন'}
                </button>
              </form>
            </div>
          </div>

          {/* Existing Subjects List Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <h3 className="text-sm font-black text-slate-900">বিদ্যমান বিষয়সমূহ ({subjects.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:bg-indigo-50/50 hover:border-indigo-200 transition-all"
                >
                  <div className="space-y-1">
                    <span className="font-extrabold text-slate-900 text-xs">{s.name}</span>
                    {s.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">{s.description}</p>
                    )}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>আইডি: {s.id}</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">সক্রিয়</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BULK CSV IMPORT */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>বাল্ক প্রশ্ন ইমপোর্ট ইঞ্জিন (Bulk CSV / Excel Uploader)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              একসাথে ৫০ বা ১০০+ প্রশ্ন CSV ফরম্যাটে পেস্ট করে এক ক্লিকে প্রশ্নব্যাংকে আপলোড করুন।
            </p>
          </div>

          {/* Step 1: Select Subject and Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                টার্গেট বিষয় নির্বাচন করুন <span className="text-rose-500">*</span>
              </label>
              <select
                value={importSubjectId}
                onChange={(e) => {
                  setImportSubjectId(e.target.value);
                  setImportTopicId('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-indigo-500 text-xs"
              >
                <option value="">বিষয় নির্বাচন করুন...</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                টার্গেট অধ্যায় / টপিক নির্বাচন করুন <span className="text-rose-500">*</span>
              </label>
              <select
                value={importTopicId}
                onChange={(e) => setImportTopicId(e.target.value)}
                disabled={!importSubjectId}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-indigo-500 text-xs disabled:opacity-50"
              >
                <option value="">অধ্যায় নির্বাচন করুন...</option>
                {formTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sample template box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800">CSV টেমপ্লেট ফরম্যাট (নমুনা কপি করুন):</span>
              <button
                type="button"
                onClick={() => {
                  setBulkText(sampleTemplate);
                  showNotification('নমুনা CSV ডাটা বক্সে বসানো হয়েছে!');
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                নমুনা ডাটা ব্যবহার করুন
              </button>
            </div>
            <pre className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 overflow-x-auto whitespace-pre font-mono">
              {sampleTemplate}
            </pre>
          </div>

          {/* Paste CSV Area */}
          <div className="space-y-2 text-xs">
            <label className="block text-slate-700 font-extrabold">
              CSV ডাটা এখানে পেস্ট করুন (Paste CSV Rows) <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              placeholder="প্রশ্ন,অপশন ক,অপশন খ,অপশন গ,অপশন ঘ,সঠিক উত্তর (A/B/C/D),ব্যাখ্যা,পরীক্ষার নাম..."
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-indigo-500"
            />
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={parseBulkCSV}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                ডাটা যাচাই ও প্রিভিউ করুন (Parse CSV)
              </button>
              {parsedRows.length > 0 && (
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                  ✓ {parsedRows.length}টি বৈধ প্রশ্ন পাওয়া গেছে
                </span>
              )}
            </div>
          </div>

          {/* Parsed Rows Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800">
                প্রিভিউ ({parsedRows.length}টি প্রশ্ন ডাটাবেজে যুক্ত হতে প্রস্তুত):
              </h4>
              <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-2 space-y-2 text-xs">
                {parsedRows.map((r, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                    <p className="font-bold text-slate-900">
                      {i + 1}. {r.question}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px] text-slate-600">
                      <span>ক: {r.options.A}</span>
                      <span>খ: {r.options.B}</span>
                      <span>গ: {r.options.C}</span>
                      <span>ঘ: {r.options.D}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      সঠিক উত্তর: {r.correctAnswer}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={isImporting || !importSubjectId || !importTopicId}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    {isImporting ? 'ইমপোর্ট হচ্ছে...' : `${parsedRows.length}টি প্রশ্ন ইমপোর্ট সম্পন্ন করুন`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
