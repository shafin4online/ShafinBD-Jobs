import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  HelpCircle, 
  Search, 
  PlayCircle, 
  BookOpen, 
  ChevronRight,
  Filter,
  Award
} from 'lucide-react';
import { QuestionBankSubject, QuestionBankTopic } from '../../../types/questionBank';

interface TopicListViewProps {
  subject: QuestionBankSubject;
  topics: QuestionBankTopic[];
  isLoading: boolean;
  onBack: () => void;
  onSelectTopic: (topic: QuestionBankTopic) => void;
  onPracticeAllSubject: () => void;
  onTakeSubjectQuiz?: () => void;
  onTakeTopicQuiz?: (topic: QuestionBankTopic) => void;
}

export const TopicListView: React.FC<TopicListViewProps> = ({
  subject,
  topics,
  isLoading,
  onBack,
  onSelectTopic,
  onPracticeAllSubject,
  onTakeSubjectQuiz,
  onTakeTopicQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics.filter((t) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Subject Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-700/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সকল বিষয়ের তালিকায় ফিরুন</span>
            </button>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-300 shrink-0" />
              <span>{subject.name}</span>
            </h2>

            {subject.description && (
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                {subject.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-200/90 flex-wrap">
              <span className="bg-emerald-700/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-medium">
                {topics.length}টি অধ্যায় / টপিক
              </span>
              <span className="bg-teal-700/60 border border-teal-500/40 px-2.5 py-0.5 rounded-full font-medium">
                মোট {subject.questionCount || 0}টি প্রশ্ন
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <button
              onClick={onPracticeAllSubject}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-300 active:scale-98 transition-all shadow-md cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-emerald-950 text-emerald-400" />
              <span>সকল প্রশ্ন পড়ুন</span>
            </button>

            {onTakeSubjectQuiz && (
              <button
                onClick={onTakeSubjectQuiz}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 active:scale-98 transition-all cursor-pointer shadow-sm"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>বিষয়ভিত্তিক কুইজ দিন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="অধ্যায় বা টপিকের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 px-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>মোট {filteredTopics.length}টি টপিক পাওয়া গেছে</span>
        </div>
      </div>

      {/* Topics Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse border border-slate-200/60" />
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">কোনো টপিক পাওয়া যায়নি</p>
          <p className="text-xs text-slate-500 mt-1">অনুগ্রহ করে অন্য কি-ওয়ার্ড দিয়ে খুঁজুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="group bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-100 shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 text-sm sm:text-base transition-colors line-clamp-1">
                      {topic.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                    <HelpCircle className="w-3 h-3 text-emerald-600" />
                    <span>{topic.questionCount || 0}টি প্রশ্ন</span>
                  </span>
                </div>

                {topic.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed ml-9 mb-4">
                    {topic.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 ml-9 text-xs text-slate-500 font-medium">
                <span className="text-emerald-600 font-semibold group-hover:underline flex items-center gap-1">
                  <span>অনুশীলন শুরু করুন</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                
                <div className="flex items-center gap-2">
                  {onTakeTopicQuiz && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTakeTopicQuiz(topic);
                      }}
                      className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Award className="w-3 h-3 text-amber-600" />
                      <span>কুইজ</span>
                    </button>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {topic.subtopicCount > 0 ? `${topic.subtopicCount}টি সাবটপিক` : 'সরাসরি প্রশ্ন'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
