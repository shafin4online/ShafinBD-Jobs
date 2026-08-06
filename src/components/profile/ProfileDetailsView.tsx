import React, { useState } from 'react';
import { Edit3, Check } from 'lucide-react';
import { ProfileMediaViewSection } from './sections/ProfileMediaViewSection';
import { ProfilePersonalViewSection } from './sections/ProfilePersonalViewSection';
import { ProfileAddressViewSection } from './sections/ProfileAddressViewSection';
import { ProfileEducationViewSection } from './sections/ProfileEducationViewSection';

interface ProfileDetailsViewProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  completeness: number;
  onEditClick: () => void;
  onSaveProfile: (updatedData?: any, sectionHandle?: string) => void;
}

export const ProfileDetailsView: React.FC<ProfileDetailsViewProps> = ({
  formData,
  setFormData,
  completeness,
  onEditClick,
  onSaveProfile,
}) => {
  // Track currently active section being edited inline (null = view mode)
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionToast, setSectionToast] = useState<string | null>(null);
  const [tempFormData, setTempFormData] = useState<any>(null);

  // Start editing a specific section
  const handleStartSectionEdit = (sectionKey: string) => {
    setTempFormData({ ...formData });
    setEditingSection(sectionKey);
  };

  // Cancel editing a specific section
  const handleCancelSectionEdit = () => {
    if (tempFormData) {
      setFormData(tempFormData); // Restore original
    }
    setEditingSection(null);
    setTempFormData(null);
  };

  // Save changes for a specific section
  const handleSaveSection = (sectionNameBangla: string, sectionHandle?: string) => {
    const isContactEdited = Boolean(
      formData.fullName || formData.email || formData.phone
    );

    const finalData = {
      ...formData,
      isContactLocked: isContactEdited ? true : formData.isContactLocked,
    };

    setFormData(finalData);
    onSaveProfile(finalData, sectionHandle);

    setEditingSection(null);
    setTempFormData(null);

    setSectionToast(`${sectionNameBangla} তথ্য সফলভাবে আপডেট করা হয়েছে!`);
    setTimeout(() => setSectionToast(null), 3500);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8 relative transition-colors">
      {/* Toast Notification for Section Updates */}
      {sectionToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-emerald-500">
          <Check className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{sectionToast}</span>
        </div>
      )}

      {/* Action bar for full edit */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span>📋 প্রোফাইল তথ্যাবলী (Profile Summary)</span>
        </div>
        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>সকল তথ্য একসাথে এডিট (Full Edit)</span>
        </button>
      </div>

      {/* 1. SECTION: Photo and Signature */}
      <ProfileMediaViewSection
        formData={formData}
        editingSection={editingSection}
        handleStartSectionEdit={handleStartSectionEdit}
        handleCancelSectionEdit={handleCancelSectionEdit}
        handleSaveSection={handleSaveSection}
        updateField={updateField}
      />

      {/* 2. SECTION: Personal Details */}
      <ProfilePersonalViewSection
        formData={formData}
        editingSection={editingSection}
        handleStartSectionEdit={handleStartSectionEdit}
        handleCancelSectionEdit={handleCancelSectionEdit}
        handleSaveSection={handleSaveSection}
        updateField={updateField}
      />

      {/* 3. SECTION: Address Details */}
      <ProfileAddressViewSection
        formData={formData}
        editingSection={editingSection}
        handleStartSectionEdit={handleStartSectionEdit}
        handleCancelSectionEdit={handleCancelSectionEdit}
        handleSaveSection={handleSaveSection}
        updateField={updateField}
      />

      {/* 4. SECTION: Educational Qualifications */}
      <ProfileEducationViewSection
        formData={formData}
        editingSection={editingSection}
        handleStartSectionEdit={handleStartSectionEdit}
        handleCancelSectionEdit={handleCancelSectionEdit}
        handleSaveSection={handleSaveSection}
        updateField={updateField}
      />

      {/* Bottom Action Bar */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium">
          যেকোনো নির্দিষ্ট সেকশন এডিট করতে সেই সেকশনের "এডিট" বাটনে অথবা একসাথে সব তথ্য এডিট করতে ডানদিকের বাটনে ক্লিক করুন।
        </p>

        <button
          onClick={onEditClick}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>সকল তথ্য একসাথে এডিট (Full Edit Mode)</span>
        </button>
      </div>
    </div>
  );
};
