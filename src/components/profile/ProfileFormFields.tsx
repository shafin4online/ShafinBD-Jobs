import React from 'react';
import { Save, Plus, User } from 'lucide-react';

interface ProfileFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  completeness: number;
  skillsList: string[];
  newSkill: string;
  setNewSkill: (s: string) => void;
  handleSkillAdd: (e: React.FormEvent) => void;
  handleRemoveSkill: (s: string) => void;
  handleSubmitProfile: (e: React.FormEvent) => void;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  formData,
  setFormData,
  completeness,
  skillsList,
  newSkill,
  setNewSkill,
  handleSkillAdd,
  handleRemoveSkill,
  handleSubmitProfile,
}) => {
  return (
    <form onSubmit={handleSubmitProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
      {/* Header & Completeness Progress Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-emerald-400" />
              <span>প্রার্থী প্রোফাইল ও রেজিস্ট্রেশন বিবরণী (Candidate Profile)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">১-ক্লিক জব আবেদনের সুবিধার্থে সকল তথ্য নির্ভুলভাবে পুরণ করুন</p>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>প্রোফাইল সেভ করুন</span>
          </button>
        </div>

        {/* Completeness Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              প্রোফাইল পূর্ণতা (Profile Completeness): <strong className="text-emerald-400 font-extrabold">{completeness}%</strong>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {completeness === 100 ? '✅ সকল তথ্য সম্পন্ন হয়েছে' : 'সম্পূর্ণ তথ্যে চাকরির সম্ভাবনা বাড়ে'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Section 1: Personal Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">১</span>
          <h4 className="text-sm font-bold text-slate-900">ব্যক্তিগত তথ্য (Personal Information)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Name in English (ইংরেজি নাম) *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Shafin Ahmed"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Name in Bangla (বাংলা নাম)
            </label>
            <input
              type="text"
              value={formData.fullNameBangla}
              onChange={(e) => setFormData({ ...formData, fullNameBangla: e.target.value })}
              placeholder="যেমন: মোঃ শাফিন আহমেদ"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Date of Birth (জন্ম তারিখ)
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gender (লিঙ্গ)
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            >
              <option value="Male">পুরুষ (Male)</option>
              <option value="Female">মহিলা (Female)</option>
              <option value="Other">অন্যান্য (Other)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Father's Name (পিতার নাম)
            </label>
            <input
              type="text"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              placeholder="পিতার নাম লিখুন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mother's Name (মাতার নাম)
            </label>
            <input
              type="text"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              placeholder="মাতার নাম লিখুন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              NID / Passport No. (জাতীয় পরিচয়পত্র/পাসপোর্ট)
            </label>
            <input
              type="text"
              value={formData.nidOrPassport}
              onChange={(e) => setFormData({ ...formData, nidOrPassport: e.target.value })}
              placeholder="NID বা পাসপোর্ট নম্বর"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Contact & Address */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">২</span>
          <h4 className="text-sm font-bold text-slate-900">যোগাযোগ ও ঠিকানা (Contact & Address Details)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Email (প্রধান ইমেইল) *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="shafin@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Phone Number (মোবাইল নম্বর) *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+880 1712-345678"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alternative Phone (বিকল্প মোবাইল নম্বর)
            </label>
            <input
              type="text"
              value={formData.altPhone}
              onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
              placeholder="+880 1812-987654"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Present Address (বর্তমান ঠিকানা)
            </label>
            <input
              type="text"
              value={formData.presentAddress}
              onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
              placeholder="যেমন: বাড়ি ১২, রোড ৫, গুলশান-১, ঢাকা"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Permanent Address (স্থায়ী ঠিকানা)
            </label>
            <input
              type="text"
              value={formData.permanentAddress}
              onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
              placeholder="গ্রাম/রোড, থানা, জেলা"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Location / City (শহর / জেলা)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Dhaka, Bangladesh"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Professional & Academic Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৩</span>
          <h4 className="text-sm font-bold text-slate-900">পেশাগত তথ্য ও যোগ্যতা (Professional & Academic Details)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Professional Title / Headline (বর্তমান পদবী) *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="যেমন: Senior Full Stack Developer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Expected Salary (প্রত্যাশিত বেতন / মাস)
            </label>
            <input
              type="text"
              value={formData.expectedSalary}
              onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
              placeholder="যেমন: ৳৫০,০০০ - ৳৭০,০০০ / মাস"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Educational Qualification (শিক্ষাগত যোগ্যতা)
            </label>
            <textarea
              rows={3}
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="যেমন: B.Sc in CSE, University of Dhaka (Pass: 2022)"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Work Experience Summary (অভিজ্ঞতার বিবরণ)
            </label>
            <textarea
              rows={3}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="যেমন: ৩ বছর ধরে React.js & Node.js ডেভেলপমেন্টের কাজ করছি..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Short Bio / Self Summary (নিজের সম্পর্কে সংক্ষেপে)
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="আপনার ক্যারিয়ারের লক্ষ্য ও প্রধান অর্জনসমূহ লিখুন..."
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>
      </div>

      {/* Section 4: Skills */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৪</span>
          <h4 className="text-sm font-bold text-slate-900">দক্ষতা ও টেকনোলজি (Technical Skills)</h4>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="নতুন দক্ষতা যোগ করুন (যেমন: React, SEO, Digital Marketing, Python)"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
          />
          <button
            type="button"
            onClick={handleSkillAdd}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>যোগ করুন</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {skillsList.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-rose-600 font-bold text-sm"
              >
                ×
              </button>
            </span>
          ))}
          {skillsList.length === 0 && (
            <span className="text-xs text-slate-400 italic">কোনো দক্ষতা যুক্ত করা হয়নি। ওপরে লিখে যোগ করুন!</span>
          )}
        </div>
      </div>

      {/* Section 5: Resume & Social Links */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৫</span>
          <h4 className="text-sm font-bold text-slate-900">রেজুমে ও লিংক (Resume & Portfolios)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resume / CV File Name or Link
            </label>
            <input
              type="text"
              value={formData.resumeFileName}
              onChange={(e) => setFormData({ ...formData, resumeFileName: e.target.value })}
              placeholder="Shafin_CV_2026.pdf"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              GitHub Profile Link
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/shafinbd4u"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              LinkedIn Profile Link
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/shafinbd"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          * চিহ্নিত তথ্যগুলো বাধ্যতামূলক
        </span>
        <button
          type="submit"
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all active:scale-98"
        >
          <Save className="w-4 h-4" />
          <span>প্রোফাইল সেভ করুন (Save Profile)</span>
        </button>
      </div>
    </form>
  );
};
