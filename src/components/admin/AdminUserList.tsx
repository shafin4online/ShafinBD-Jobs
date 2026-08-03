import React, { useState } from 'react';
import { useJobContext } from '../../context/JobContext';
import { Users, Search, Mail, Phone, MapPin, Award, Send, CheckCircle } from 'lucide-react';

export const AdminUserList: React.FC = () => {
  const { userList, applications } = useJobContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserForMsg, setSelectedUserForMsg] = useState<string | null>(null);
  const [quickMsg, setQuickMsg] = useState('');
  const [msgSentNotice, setMsgSentNotice] = useState('');

  const filteredUsers = userList.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.title && u.title.toLowerCase().includes(term)) ||
      (u.skills && u.skills.some((s) => s.toLowerCase().includes(term)))
    );
  });

  const handleSendQuickMsg = (e: React.FormEvent, userName: string) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;
    setMsgSentNotice(`"${userName}" কে বার্তা সফলভাবে পাঠানো হয়েছে!`);
    setQuickMsg('');
    setSelectedUserForMsg(null);
    setTimeout(() => setMsgSentNotice(''), 4000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>ইউজার তালিকা (User & Candidate List)</span>
          </h3>
          <p className="text-xs text-slate-500">নিবন্ধিত সকল চাকরিপ্রার্থী এবং তাদের দক্ষতা পর্যালোচনা করুন ({userList.length} প্রার্থী)</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম, ইমেইল বা স্কিল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-emerald-500"
          />
        </div>
      </div>

      {msgSentNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{msgSentNotice}</span>
        </div>
      )}

      {/* User Table / Cards */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold">কোনো ইউজার পাওয়া যায়নি!</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const userApps = applications.filter(
              (a) => a.applicantEmail.toLowerCase() === user.email.toLowerCase()
            );

            return (
              <div
                key={user.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                    {user.fullName[0] || 'U'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-extrabold text-slate-900">{user.fullName}</h4>
                      {user.title && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">
                          {user.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{user.email}</span>
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{user.phone}</span>
                        </span>
                      )}
                      {user.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{user.location}</span>
                        </span>
                      )}
                    </div>

                    {user.skills && user.skills.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <Award className="w-3 h-3 text-emerald-600 shrink-0" />
                        {user.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold">মোট আবেদন</p>
                    <p className="text-xs font-black text-emerald-600">{userApps.length} টি জব</p>
                  </div>

                  <button
                    onClick={() => setSelectedUserForMsg(selectedUserForMsg === user.id ? null : user.id)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>মেসেজ দিন</span>
                  </button>
                </div>

                {/* Direct Message Form inline */}
                {selectedUserForMsg === user.id && (
                  <form
                    onSubmit={(e) => handleSendQuickMsg(e, user.fullName)}
                    className="w-full mt-3 p-3 bg-white rounded-xl border border-slate-300 space-y-2 col-span-full"
                  >
                    <p className="text-xs font-bold text-slate-800">
                      "{user.fullName}" কে নোটিফিকেশন পাঠাচ্ছেন:
                    </p>
                    <input
                      type="text"
                      required
                      value={quickMsg}
                      onChange={(e) => setQuickMsg(e.target.value)}
                      placeholder="এখানে বার্তার বিষয়টি লিখুন..."
                      className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-medium"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUserForMsg(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-bold cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        পাঠান
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
