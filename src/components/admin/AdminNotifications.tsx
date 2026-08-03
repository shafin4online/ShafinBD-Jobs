import React, { useState } from 'react';
import { useJobContext } from '../../context/JobContext';
import { Bell, Send, CheckCircle2, History, AlertCircle } from 'lucide-react';

export const AdminNotifications: React.FC = () => {
  const { notificationsList, sendNotification } = useJobContext();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('সকল নিবন্ধিত চাকরিপ্রার্থী (All Candidates)');
  const [type, setType] = useState<'circular' | 'system' | 'update'>('circular');
  const [successNotice, setSuccessNotice] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendNotification({
      title,
      message,
      targetAudience,
      type,
    });

    setSuccessNotice('নোটিফিকেশনটি সফলভাবে ব্রডকাস্ট করা হয়েছে!');
    setTitle('');
    setMessage('');

    setTimeout(() => setSuccessNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>নোটিফিকেশন প্যানেল (Send Announcement & Circular Alert)</span>
          </h3>
          <p className="text-xs text-slate-500">চাকরিপ্রার্থীদের নতুন সার্কুলার বা আপডেট সম্পর্কিত এলার্ট নোটিফিকেশন পাঠান</p>
        </div>

        {successNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নোটিফিকেশনের শিরোনাম (Title) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: বাংলাদেশ ব্যাংকে ৩০০ পদে নিয়োগ বিজ্ঞপ্তি প্রকাশিত!"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রাপক / অডিয়েন্স (Target Audience)</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value="সকল নিবন্ধিত চাকরিপ্রার্থী (All Candidates)">সকল নিবন্ধিত চাকরিপ্রার্থী (All Candidates)</option>
                <option value="সরকারি চাকরি প্রত্যাশীগণ (Govt Aspirants)">সরকারি চাকরি প্রত্যাশীগণ (Govt Aspirants)</option>
                <option value="আইটি ও প্রাইভেট সেক্টর (IT & Private)">আইটি ও প্রাইভেট সেক্টর (IT & Private)</option>
                <option value="বিশ্ববিদ্যালয় ভর্তি শিক্ষার্থী (Admission)">বিশ্ববিদ্যালয় ভর্তি শিক্ষার্থী (Admission)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">নোটিফিকেশনের ক্যাটাগরি (Type)</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('circular')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  type === 'circular' ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                📢 সার্কুলার এলার্ট
              </button>
              <button
                type="button"
                onClick={() => setType('system')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  type === 'system' ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                🔔 সিস্টেম আপডেট
              </button>
              <button
                type="button"
                onClick={() => setType('update')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  type === 'update' ? 'bg-purple-600 text-white border-purple-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                📝 জরুরী বার্তা
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">বার্তার বিস্তারিত বিবরণ (Message Body) *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="প্রার্থীদের জন্য গুরুত্বপূর্ণ তথ্য বা সার্কুলারের লিংক প্রদান করুন..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-amber-600/30 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>নোটিফিকেশন ব্রডকাস্ট করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* History List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <History className="w-4 h-4 text-slate-600" />
          <span>প্রেরিত নোটিফিকেশনের হিস্ট্রি (Broadcast Log)</span>
        </h4>

        {notificationsList.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">এখনো কোনো নোটিফিকেশন ব্রডকাস্ট করা হয়নি।</p>
        ) : (
          <div className="space-y-3">
            {notificationsList.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-slate-900">{item.title}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md">
                    {item.targetAudience}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>সময়: {item.createdAt}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>পাঠানো হয়েছে</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
