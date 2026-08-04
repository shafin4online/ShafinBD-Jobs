import React, { useState } from 'react';
import {
  Award,
  Search,
  FileText,
  Download,
  ExternalLink,
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  RefreshCw,
  BookOpen,
  Filter
} from 'lucide-react';

interface ResultNotice {
  id: string;
  title: string;
  organization: string;
  category: 'govt' | 'board' | 'university' | 'bank';
  publishedDate: string;
  pdfUrl?: string;
  rollSearchAvailable: boolean;
  totalPassed?: string;
  description: string;
  isNew?: boolean;
}

const mockResults: ResultNotice[] = [
  {
    id: '1',
    title: '৪৬তম বিসিএস প্রিলিমিনারি পরীক্ষার রেজাল্ট ও লিখিত পরীক্ষার সময়সূচী',
    organization: 'বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)',
    category: 'govt',
    publishedDate: '০৩ আগস্ট, ২০২৬',
    rollSearchAvailable: true,
    totalPassed: '১০,৬৩৮ জন উত্তীর্ণ',
    description: 'বাংলাদেশ সরকারি কর্ম কমিশন (বিপিএসসি) ৪৬তম বিসিএস প্রিলিমিনারি টেস্টের ফলাফল প্রকাশ করেছে। উত্তীর্ণ প্রার্থীদের তালিকা পিডিএফে সংযুক্ত করা হয়েছে।',
    isNew: true,
  },
  {
    id: '2',
    title: 'প্রাথমিক সহকারী শিক্ষক নিয়োগ পরীক্ষা ২০২৬ (৩য় ধাপ) চূড়ান্ত ফলাফল',
    organization: 'প্রাথমিক শিক্ষা অধিদপ্তর (DPE)',
    category: 'govt',
    publishedDate: '০২ আগস্ট, ২০২৬',
    rollSearchAvailable: true,
    totalPassed: '৬,৫৩১ জন নির্বাচিত',
    description: 'ঢাকা ও চট্টগ্রাম বিভাগের ২১টি জেলার প্রাথমিক বিদ্যালয় সহকারী শিক্ষক নিয়োগের চূড়ান্ত মেরিট লিস্ট প্রকাশ করা হয়েছে।',
    isNew: true,
  },
  {
    id: '3',
    title: '১৮তম শিক্ষক নিবন্ধন (NTRCA) লিখিত পরীক্ষার চূড়ান্ত ফলাফল',
    organization: 'বেসরকারি শিক্ষক নিবন্ধন ও প্রত্যয়ন কর্তৃপক্ষ (NTRCA)',
    category: 'govt',
    publishedDate: '২৮ জুলাই, ২০২৬',
    rollSearchAvailable: true,
    totalPassed: '১৮,২৪৫ জন উত্তীর্ণ',
    description: '১৮তম শিক্ষক নিবন্ধনের লিখিত পরীক্ষায় উত্তীর্ণ প্রার্থীদের রোল নম্বর ও জেলা ভিত্তিক তালিকা প্রকাশ করা হয়েছে।',
  },
  {
    id: '4',
    title: 'ঢাকা বিশ্ববিদ্যালয় "ক" ইউনিট (বিজ্ঞান অনুষদ) ভর্তি পরীক্ষার ফলাফল ২০২৬',
    organization: 'ঢাকা বিশ্ববিদ্যালয় (DU)',
    category: 'university',
    publishedDate: '২৬ জুলাই, ২০২৬',
    rollSearchAvailable: true,
    totalPassed: 'মেধা তালিকা প্রকাশিত',
    description: 'ঢাকা বিশ্ববিদ্যালয়ের ২০২৩-২০২৪ শিক্ষাবর্ষের বিজ্ঞান ইউনিটের সমন্বিত ভর্তি পরীক্ষার ফলাফল ও বিষয় পছন্দের বিস্তারিত নির্দেশিকা প্রকাশ করা হয়েছে।',
  },
  {
    id: '5',
    title: 'জাতীয় বিশ্ববিদ্যালয় অনার্স ৪র্থ বর্ষ পরীক্ষা ২০২২ এর রি-স্ক্রুটিনি ফলাফল',
    organization: 'জাতীয় বিশ্ববিদ্যালয় (NU)',
    category: 'board',
    publishedDate: '২৫ জুলাই, ২০২৬',
    rollSearchAvailable: true,
    description: 'জাতীয় বিশ্ববিদ্যালয়ের অনার্স ৪র্থ বর্ষ পরীক্ষার পুনঃনিরীক্ষণের ফলাফল আনুষ্ঠানিকভাবে এনইউ অফিসিয়াল পোর্টালে প্রকাশ করা হলো।',
  },
  {
    id: '6',
    title: 'সম্মিলিত ১০ ব্যাংক অফিসার (ক্যাশ) নিয়োগের লিখিত পরীক্ষার ফলাফল',
    organization: 'ব্যাংকার্স সিলেকশন কমিটি (BSCB)',
    category: 'bank',
    publishedDate: '২০ জুলাই, ২০২৬',
    rollSearchAvailable: true,
    totalPassed: '২,৮৫০ জন উত্তীর্ণ',
    description: 'বাংলাদেশ ব্যাংকের অধীনে ১০টি সরকারি ব্যাংকের অফিসার ক্যাশ পদের ভাইভার জন্য নির্বাচিত প্রার্থীদের তালিকা প্রকাশ করা হয়েছে।',
  },
  {
    id: '7',
    title: 'এইচএসসি ও সমমান পরীক্ষা ২০২৬ সকল শিক্ষা বোর্ডের কেন্দ্র তালিকা ও ফলাফল আপডেট',
    organization: 'মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড',
    category: 'board',
    publishedDate: '১৫ জুলাই, ২০২৬',
    rollSearchAvailable: false,
    description: 'ঢাকা, চট্টগ্রাম, রাজশাহী, কুমিল্লা বোর্ডসহ ১০টি শিক্ষা বোর্ডের এইচএসসি পরীক্ষার্থীদের মূল্যায়ন সংক্রান্ত সার্কুলার।',
  },
];

export const ExamResultsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Interactive Roll Search Form State
  const [selectedExamType, setSelectedExamType] = useState('bcs');
  const [rollInput, setRollInput] = useState('');
  const [regInput, setRegInput] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleRollSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) {
      setSearchError('অনুগ্রহ করে সঠিক রোল নম্বর লিখুন।');
      return;
    }

    setSearchError(null);
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      // Demo generated result
      setSearchResult({
        examName: selectedExamType === 'bcs' ? '৪৬তম বিসিএস প্রিলিমিনারি পরীক্ষা' :
                  selectedExamType === 'primary' ? 'প্রাথমিক সহকারী শিক্ষক নিয়োগ ২০২৬' :
                  selectedExamType === 'ntrca' ? '১৮তম এনটিআরসিএ শিক্ষক নিবন্ধন' : 'এইচএসসি / সমমান পরীক্ষা ২০২৬',
        roll: rollInput,
        reg: regInput || '109823471',
        candidateName: 'আবেদনকারীর নাম (Shafin Candidate)',
        fatherName: 'পিতার নাম (MD. KABIR HOSSAIN)',
        status: 'PASSED',
        remarks: 'উত্তীর্ণ / Passed for Next Stage',
        score: '118.5 / 200',
        meritPosition: '১৮৪ তম',
      });
    }, 800);
  };

  const filteredResults = mockResults.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-extrabold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>বাংলাদেশ পরীক্ষার ফলাফল ও মেধা তালিকা পোর্টাল</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            সকল সরকারি চাকরি, ব্যাংক ও শিক্ষা বোর্ডের পরীক্ষার রেজাল্ট
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            বিসিএস, প্রাথমিক শিক্ষক নিয়োগ, এনটিআরসিএ, বিশ্ববিদ্যালয় ভর্তি ও বোর্ডের সকল অফিসিয়াল রেজাল্ট এবং মেরিট লিস্ট সরাসরি দেখুন ও পিডিএফ ডাউনলোড করুন।
          </p>

          {/* Quick Search */}
          <div className="pt-2 relative max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পরীক্ষার নাম বা প্রতিষ্ঠানের নাম লিখে সার্চ করুন (যেমন: বিসিএস, এনটিআরসিএ)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm font-medium rounded-2xl border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Online Roll Search Interactive Tool */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>ইনস্ট্যান্ট রোল সার্চ ও রেজাল্ট সিস্টেম</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-black">
                LIVE TOOL
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              আপনার রোল এবং রেজিস্ট্রেশন নম্বর দিয়ে দ্রুত রেজাল্ট অনুসন্ধান করুন
            </p>
          </div>
        </div>

        <form onSubmit={handleRollSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পরীক্ষা নির্বাচন করুন
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
            >
              <option value="bcs">বিসিএস পরীক্ষা (BCS)</option>
              <option value="primary">প্রাথমিক শিক্ষক নিয়োগ (DPE)</option>
              <option value="ntrca">শিক্ষক নিবন্ধন (NTRCA)</option>
              <option value="ssc">এসএসসি / সমমান পরীক্ষা</option>
              <option value="hsc">এইচএসসি / সমমান পরীক্ষা</option>
              <option value="university">বিশ্ববিদ্যালয় ভর্তি পরীক্ষা</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              রোল নম্বর (Roll No) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={rollInput}
              onChange={(e) => setRollInput(e.target.value)}
              placeholder="যেমন: ১২৩৪৫৬"
              className="w-full px-3 py-2.5 bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              রেজিস্ট্রেশন নম্বর (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={regInput}
              onChange={(e) => setRegInput(e.target.value)}
              placeholder="যেমন: ১০৯৮২৩৪৭১"
              className="w-full px-3 py-2.5 bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>খোঁজা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>রেজাল্ট দেখুন</span>
                </>
              )}
            </button>
          </div>
        </form>

        {searchError && (
          <p className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
            ⚠️ {searchError}
          </p>
        )}

        {/* Display Simulated Search Result */}
        {searchResult && (
          <div className="mt-4 p-5 bg-emerald-50/70 border-2 border-emerald-500 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ফলাফল পাওয়া গেছে (Result Status)
              </span>
              <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-lg">
                উত্তীর্ণ (PASSED)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 block">পরীক্ষার নাম</span>
                <strong className="text-slate-900">{searchResult.examName}</strong>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 block">রোল / রেজিস্ট্রেশন</span>
                <strong className="text-slate-900">{searchResult.roll} / {searchResult.reg}</strong>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 block">প্রাপ্ত নম্বর / মন্তব্য</span>
                <strong className="text-emerald-700 font-extrabold">{searchResult.score} ({searchResult.remarks})</strong>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 block">মেধা অবস্থান</span>
                <strong className="text-slate-900">{searchResult.meritPosition}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'সব রেজাল্ট', icon: FileText },
          { id: 'govt', label: 'সরকারি চাকরি', icon: Building2 },
          { id: 'board', label: 'শিক্ষা বোর্ড ও এনইউ', icon: BookOpen },
          { id: 'university', label: 'বিশ্ববিদ্যালয় ভর্তি', icon: GraduationCap },
          { id: 'bank', label: 'ব্যাংক ও অন্যান্য', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>সাম্প্রতিক প্রকাশিত পরীক্ষার ফলাফল তালিকা ({filteredResults.length})</span>
          </h3>
        </div>

        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">কোনো রেজাল্ট তথ্য পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredResults.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-extrabold text-[11px] rounded-lg border border-slate-200 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-600" />
                      {item.organization}
                    </span>

                    {item.isNew && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-black text-[10px] rounded-md animate-pulse">
                        NEW RESULT
                      </span>
                    )}

                    {item.totalPassed && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200">
                        ✨ {item.totalPassed}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.publishedDate}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.rollSearchAvailable && (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        অনলাইন রোল সার্চ সুবিধা রয়েছে
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`"${item.title}" রেজাল্ট পিডিএফ ডাউনলোড শুরু হচ্ছে...`)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>PDF ডাউনলোড</span>
                    </button>

                    <button
                      onClick={() => alert(`"${item.title}" রেজাল্ট লিংক খোলা হচ্ছে...`)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>বিস্তারিত দেখুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SMS Result Format Instruction Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-700" />
          <h4 className="text-xs font-extrabold text-amber-900">
            মোবাইল এসএমএস (SMS) এর মাধ্যমে রেজাল্ট পাওয়ার নিয়মাবলী
          </h4>
        </div>

        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          যেকোনো টেলিটক/রবি/গ্রামীণফোন মোবাইল থেকে মেসেজ অপশনে গিয়ে নিচের ফরম্যাটে এসএমএস পাঠিয়ে সহজেই ফলাফল জানতে পারবেন:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
            <span className="font-extrabold text-slate-800 block">SSC / DAKHIL</span>
            <code className="text-emerald-700 font-mono font-bold bg-slate-100 px-2 py-1 rounded block">
              SSC &lt;Space&gt; BOARD &lt;Space&gt; ROLL &lt;Space&gt; YEAR
            </code>
            <span className="text-[10px] text-slate-500 block">Send to 16222</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
            <span className="font-extrabold text-slate-800 block">HSC / ALIM</span>
            <code className="text-emerald-700 font-mono font-bold bg-slate-100 px-2 py-1 rounded block">
              HSC &lt;Space&gt; BOARD &lt;Space&gt; ROLL &lt;Space&gt; YEAR
            </code>
            <span className="text-[10px] text-slate-500 block">Send to 16222</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
            <span className="font-extrabold text-slate-800 block">NTRCA / TEACHER</span>
            <code className="text-emerald-700 font-mono font-bold bg-slate-100 px-2 py-1 rounded block">
              NTRCA &lt;Space&gt; ROLL
            </code>
            <span className="text-[10px] text-slate-500 block">Send to 16222</span>
          </div>
        </div>
      </div>
    </div>
  );
};
