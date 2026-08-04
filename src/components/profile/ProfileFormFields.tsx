import React from 'react';
import { Save, User } from 'lucide-react';
import { PersonalDetailsSection } from './sections/PersonalDetailsSection';
import { PhotoSignatureSection } from './sections/PhotoSignatureSection';
import { AddressDetailsSection } from './sections/AddressDetailsSection';
import { EducationSscSection } from './sections/EducationSscSection';
import { EducationHscSection } from './sections/EducationHscSection';
import { EducationGraduationSection } from './sections/EducationGraduationSection';
import { EducationMastersSection } from './sections/EducationMastersSection';

interface ProfileFormFieldsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  completeness: number;
  skillsList?: string[];
  newSkill?: string;
  setNewSkill?: (s: string) => void;
  handleSkillAdd?: (e: React.FormEvent) => void;
  handleRemoveSkill?: (s: string) => void;
  handleSubmitProfile: (e: React.FormEvent) => void;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  formData,
  setFormData,
  completeness,
  handleSubmitProfile,
}) => {
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmitProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
      {/* Header & Progress */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-emerald-400" />
              <span>আবেদনকারীর প্রোফাইল তথ্য ফরম (Application Form)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              সরকারি ও বেসরকারী চাকরির ফরম পূরণের স্ট্যান্ডার্ড তথ্য প্রদান করুন
            </p>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>তথ্য সেভ করুন</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              প্রোফাইল পূর্ণতা (Profile Completeness): <strong className="text-emerald-400 font-extrabold">{completeness}%</strong>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {completeness === 100 ? '✅ সকল তথ্য সম্পন্ন হয়েছে' : 'সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 1. Personal Details Section */}
      <PersonalDetailsSection formData={formData} updateField={updateField} />

      {/* 1.1 Photo and Signature Section (300x300 photo <=100KB, 300x80 signature <=60KB, .jpg format) */}
      <PhotoSignatureSection formData={formData} updateField={updateField} />

      {/* 2. Address Details Section (Includes Dynamic Upazila Filter) */}
      <AddressDetailsSection formData={formData} updateField={updateField} />

      {/* 3. SSC/Equivalent Level */}
      <EducationSscSection formData={formData} updateField={updateField} />

      {/* 4. HSC/Equivalent Level */}
      <EducationHscSection formData={formData} updateField={updateField} />

      {/* 5. Graduation/Equivalent Level */}
      <EducationGraduationSection formData={formData} updateField={updateField} />

      {/* 6. Masters/Equivalent Level */}
      <EducationMastersSection formData={formData} updateField={updateField} />

      {/* Save Button Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
          * চিহ্নিত তথ্যসমূহ বাধ্যতামূলক। সঠিক তথ্য প্রদান করে "তথ্য সেভ করুন" বাটনে ক্লিক করুন।
        </p>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>তথ্য সেভ করুন (Save Profile Information)</span>
        </button>
      </div>
    </form>
  );
};
