import React, { useState } from 'react';
import { useJobContext } from '../../context/JobContext';
import { FolderKanban, Plus, Trash2, CheckCircle, Briefcase } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categoriesList, addCategory, deleteCategory, jobs } = useJobContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [notice, setNotice] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const res = addCategory(newCategoryName.trim());
    if (res.success) {
      setNotice(`"${newCategoryName}" ক্যাটাগরি সফলভাবে যোগ হয়েছে!`);
      setNewCategoryName('');
    } else {
      setNotice(res.message);
    }

    setTimeout(() => setNotice(''), 4000);
  };

  const handleDelete = (categoryName: string) => {
    if (confirm(`আপনি কি "${categoryName}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
      const res = deleteCategory(categoryName);
      setNotice(res.message);
      setTimeout(() => setNotice(''), 4000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-purple-600" />
          <span>ক্যাটাগরি ম্যানেজমেন্ট (Category Management)</span>
        </h3>
        <p className="text-xs text-slate-500">চাকরি ও সার্কুলার ফিল্টার ক্যাটাগরি যোগ ও পরিচালনা করুন</p>
      </div>

      {notice && (
        <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-purple-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add New Category Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          required
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="নতুন ক্যাটাগরির নাম লিখুন (যেমন: ব্যাংক ও এনজিও / প্রাইমারি শিক্ষকতা)"
          className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-purple-500"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি যোগ করুন</span>
        </button>
      </form>

      {/* Categories Grid */}
      <div className="pt-2">
        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">
          বর্তমান সক্রিয় ক্যাটাগরি সমূহ ({categoriesList.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoriesList.map((cat) => {
            const count = jobs.filter((j) => j.category === cat).length;
            const isProtected = ['Govt. Job', 'Private Job', 'University Admission Notice'].includes(cat);

            return (
              <div
                key={cat}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 group hover:border-purple-300 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{cat}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{count} টি সার্কুলার যুক্ত</p>
                  </div>
                </div>

                {!isProtected && (
                  <button
                    onClick={() => handleDelete(cat)}
                    title="ক্যাটাগরি মুছুন"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
