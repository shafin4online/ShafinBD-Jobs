import React, { useState } from 'react';
import {
  User,
  Edit3,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  Lock,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { PhotoSignatureSection } from './sections/PhotoSignatureSection';
import { PersonalDetailsSection } from './sections/PersonalDetailsSection';
import { AddressDetailsSection } from './sections/AddressDetailsSection';
import { EducationSscSection } from './sections/EducationSscSection';
import { EducationHscSection } from './sections/EducationHscSection';
import { EducationGraduationSection } from './sections/EducationGraduationSection';
import { EducationMastersSection } from './sections/EducationMastersSection';

interface ProfileDetailsViewProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  completeness: number;
  onEditClick: () => void;
  onSaveProfile: (updatedData?: any) => void;
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
  const handleSaveSection = (sectionNameBangla: string) => {
    const isContactEdited = Boolean(
      formData.fullName || formData.email || formData.phone
    );

    const finalData = {
      ...formData,
      isContactLocked: isContactEdited ? true : formData.isContactLocked,
    };

    setFormData(finalData);
    onSaveProfile(finalData);

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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8 relative">
      {/* Toast Notification for Section Updates */}
      {sectionToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-emerald-500">
          <Check className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{sectionToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            {formData.photoUrl ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-500 overflow-hidden bg-white shrink-0 p-0.5 shadow-lg">
                <img
                  src={formData.photoUrl}
                  alt={formData.fullName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
                <User className="w-9 h-9 text-slate-400" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {formData.fullName || 'নাম প্রদান করা হয়নি'}
                </h2>
                {formData.isContactLocked && (
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> সংরক্ষিত
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">
                {formData.fullNameBangla || 'আবেদনকারীর নাম (বাংলা)'}
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />{' '}
                  {formData.email || 'N/A'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />{' '}
                  {formData.phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onEditClick}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>সকল তথ্য একসাথে এডিট (Full Edit)</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="pt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>
              প্রোফাইল পূর্ণতা:{' '}
              <strong className="text-emerald-400 font-extrabold">
                {completeness}%
              </strong>
            </span>
            <span className="text-[11px] text-slate-400">
              {completeness === 100
                ? '✅ ১০০% তথ্য হালনাগাদ করা হয়েছে'
                : 'প্রতিটি সেকশনের "এডিট" বাটনে ক্লিক করে তথ্য আলাদাভাবে আপডেট করা যাবে'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {/* 1. SECTION: Photo and Signature */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>ছবি ও স্বাক্ষর (Attached Media)</span>
          </h3>

          {editingSection !== 'media' ? (
            <button
              onClick={() => handleStartSectionEdit('media')}
              className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ছবি ও স্বাক্ষর এডিট</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
              ✏️ এডিট করা হচ্ছে...
            </span>
          )}
        </div>

        {editingSection === 'media' ? (
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 space-y-4 shadow-md">
            <PhotoSignatureSection formData={formData} updateField={updateField} />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancelSectionEdit}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>বাতিল (Cancel)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveSection('ছবি ও স্বাক্ষর')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সেভ ও আপডেট করুন</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photo */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-[90px] h-[90px] border border-slate-300 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Applicant Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-slate-400 text-center p-1">
                    300x300px
                    <br />
                    ছবি নেই
                  </span>
                )}
              </div>
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-slate-900 block">
                  আবেদনকারীর ছবি
                </span>
                <p className="text-[11px] text-slate-500">
                  সাইজ: 300px × 300px (Max 100 KB)
                </p>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    formData.photoUrl
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {formData.photoUrl ? '✅ সংযুক্ত রয়েছে' : '❌ সংযুক্ত নেই'}
                </span>
              </div>
            </div>

            {/* Signature */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-[140px] h-[50px] border border-slate-300 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 p-1">
                {formData.signatureUrl ? (
                  <img
                    src={formData.signatureUrl}
                    alt="Applicant Signature"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-[10px] text-slate-400 text-center">
                    300x80px স্বাক্ষর নেই
                  </span>
                )}
              </div>
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-slate-900 block">
                  আবেদনকারীর স্বাক্ষর
                </span>
                <p className="text-[11px] text-slate-500">
                  সাইজ: 300px × 80px (Max 60 KB)
                </p>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    formData.signatureUrl
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {formData.signatureUrl ? '✅ সংযুক্ত রয়েছে' : '❌ সংযুক্ত নেই'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SECTION: Personal Details */}
      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>১. ব্যক্তিগত তথ্য বিবরণী (Personal Details)</span>
          </h3>

          {editingSection !== 'personal' ? (
            <button
              onClick={() => handleStartSectionEdit('personal')}
              className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ব্যক্তিগত তথ্য এডিট</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
              ✏️ এডিট করা হচ্ছে...
            </span>
          )}
        </div>

        {editingSection === 'personal' ? (
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 space-y-4 shadow-md">
            <PersonalDetailsSection formData={formData} updateField={updateField} />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancelSectionEdit}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>বাতিল (Cancel)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveSection('ব্যক্তিগত তথ্য')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সেভ ও আপডেট করুন</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <DetailItem
              label="Applicant's Name (English)"
              value={formData.fullName}
              highlight
            />
            <DetailItem
              label="আবেদনকারীর নাম (বাংলা)"
              value={formData.fullNameBangla}
              highlight
            />
            <DetailItem label="Father's Name" value={formData.fatherName} />
            <DetailItem
              label="পিতার নাম (বাংলা)"
              value={formData.fatherNameBangla}
            />
            <DetailItem label="Mother's Name" value={formData.motherName} />
            <DetailItem
              label="মাতার নাম (বাংলা)"
              value={formData.motherNameBangla}
            />
            <DetailItem label="Date of Birth" value={formData.dateOfBirth} />
            <DetailItem label="Gender" value={formData.gender} />
            <DetailItem label="Religion" value={formData.religion} />
            <DetailItem
              label="Nationality"
              value={formData.nationality || 'Bangladeshi'}
            />
            <DetailItem
              label="National ID No"
              value={formData.hasNid === 'Yes' ? formData.nidNumber : 'N/A'}
            />
            <DetailItem
              label="Birth Registration No"
              value={
                formData.hasBirthReg === 'Yes' ? formData.birthRegNumber : 'N/A'
              }
            />
            <DetailItem
              label="Passport No"
              value={
                formData.hasPassport === 'Yes' ? formData.passportNumber : 'N/A'
              }
            />
            <DetailItem label="Marital Status" value={formData.maritalStatus} />
            <DetailItem label="Mobile Number" value={formData.phone} highlight />
            <DetailItem label="Email Address" value={formData.email} highlight />
            <DetailItem label="Quota (কোটা)" value={formData.quota} />
            <DetailItem
              label="Departmental Status"
              value={formData.deptStatus}
            />
          </div>
        )}
      </div>

      {/* 3. SECTION: Address Details */}
      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>২. ঠিকানা বিবরণী (Address Details)</span>
          </h3>

          {editingSection !== 'address' ? (
            <button
              onClick={() => handleStartSectionEdit('address')}
              className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ঠিকানা এডিট</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
              ✏️ এডিট করা হচ্ছে...
            </span>
          )}
        </div>

        {editingSection === 'address' ? (
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 space-y-4 shadow-md">
            <AddressDetailsSection formData={formData} updateField={updateField} />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancelSectionEdit}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>বাতিল (Cancel)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveSection('ঠিকানা বিবরণী')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সেভ ও আপডেট করুন</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <DetailItem label="Care Of" value={formData.careOf} />
            <DetailItem
              label="Village / Road / House"
              value={formData.villageRoad}
            />
            <DetailItem label="District (জেলা)" value={formData.district} />
            <DetailItem
              label="Upazila / P.S. (উপজেলা/থানা)"
              value={formData.upazila}
            />
            <DetailItem
              label="Post Office (ডাকঘর)"
              value={formData.postOffice}
            />
            <DetailItem
              label="Post Code (পোস্ট কোড)"
              value={formData.postCode}
            />
          </div>
        )}
      </div>

      {/* 4. SECTION: Educational Qualifications */}
      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="pb-2 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>৩. শিক্ষাগত যোগ্যতা (Educational Qualifications)</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-500">
            নিচে প্রতিটি শিক্ষাগত স্তর আলাদাভাবে এডিট করা যাবে
          </span>
        </div>

        <div className="space-y-4">
          {/* SSC SECTION */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                SSC / Equivalent Level (এসএসসি / সমমান)
              </span>

              {editingSection !== 'ssc' ? (
                <button
                  onClick={() => handleStartSectionEdit('ssc')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>SSC এডিট</span>
                </button>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ✏️ এডিট মোড
                </span>
              )}
            </div>

            {editingSection === 'ssc' ? (
              <div className="space-y-4 pt-1">
                <EducationSscSection formData={formData} updateField={updateField} />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancelSectionEdit}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>বাতিল</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('SSC')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেভ SSC</span>
                  </button>
                </div>
              </div>
            ) : (
              <EducationCard
                level="SSC / Equivalent Level"
                exam={formData.sscExam}
                roll={formData.sscRoll}
                reg={formData.sscRegistration}
                group={formData.sscGroup}
                board={formData.sscBoard}
                result={formData.sscResult}
                year={formData.sscYear}
                required
              />
            )}
          </div>

          {/* HSC SECTION */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                HSC / Equivalent Level (এইচএসসি / সমমান)
              </span>

              {editingSection !== 'hsc' ? (
                <button
                  onClick={() => handleStartSectionEdit('hsc')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>HSC এডিট</span>
                </button>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ✏️ এডিট মোড
                </span>
              )}
            </div>

            {editingSection === 'hsc' ? (
              <div className="space-y-4 pt-1">
                <EducationHscSection formData={formData} updateField={updateField} />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancelSectionEdit}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>বাতিল</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('HSC')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেভ HSC</span>
                  </button>
                </div>
              </div>
            ) : (
              <EducationCard
                level="HSC / Equivalent Level"
                exam={formData.hscExam}
                roll={formData.hscRoll}
                reg={formData.hscRegistration}
                group={formData.hscGroup}
                board={formData.hscBoard}
                result={formData.hscResult}
                year={formData.hscYear}
                required
              />
            )}
          </div>

          {/* GRADUATION SECTION */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Graduation Level (স্নাতক / ডিগ্রি - Optional)
              </span>

              {editingSection !== 'grad' ? (
                <button
                  onClick={() => handleStartSectionEdit('grad')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Graduation এডিট</span>
                </button>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ✏️ এডিট মোড
                </span>
              )}
            </div>

            {editingSection === 'grad' ? (
              <div className="space-y-4 pt-1">
                <EducationGraduationSection
                  formData={formData}
                  updateField={updateField}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancelSectionEdit}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>বাতিল</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('Graduation')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেভ Graduation</span>
                  </button>
                </div>
              </div>
            ) : (
              <EducationCard
                level="Graduation / Equivalent Level"
                exam={formData.gradExam}
                roll={formData.gradRoll}
                reg={formData.gradRegistration}
                institute={formData.gradInstitute}
                subject={formData.gradSubject}
                result={formData.gradResult}
                year={formData.gradYear}
                duration={formData.gradDuration}
                optional
              />
            )}
          </div>

          {/* MASTERS SECTION */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Masters Level (স্নাতকোত্তর / মাস্টার্স - Optional)
              </span>

              {editingSection !== 'masters' ? (
                <button
                  onClick={() => handleStartSectionEdit('masters')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Masters এডিট</span>
                </button>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ✏️ এডিট মোড
                </span>
              )}
            </div>

            {editingSection === 'masters' ? (
              <div className="space-y-4 pt-1">
                <EducationMastersSection
                  formData={formData}
                  updateField={updateField}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancelSectionEdit}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>বাতিল</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('Masters')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেভ Masters</span>
                  </button>
                </div>
              </div>
            ) : (
              <EducationCard
                level="Masters / Equivalent Level"
                exam={formData.mastersExam}
                roll={formData.mastersRoll}
                reg={formData.mastersRegistration}
                institute={formData.mastersInstitute}
                subject={formData.mastersSubject}
                result={formData.mastersResult}
                year={formData.mastersYear}
                duration={formData.mastersDuration}
                optional
              />
            )}
          </div>
        </div>
      </div>

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

// Helper for Detail Items
const DetailItem: React.FC<{
  label: string;
  value?: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div
    className={`p-3 rounded-xl border ${
      highlight
        ? 'bg-emerald-50/50 border-emerald-200'
        : 'bg-slate-50 border-slate-200'
    }`}
  >
    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
      {label}
    </span>
    <span
      className={`font-extrabold block text-xs ${
        value ? 'text-slate-900' : 'text-slate-400 italic'
      }`}
    >
      {value || 'Not Provided'}
    </span>
  </div>
);

// Helper for Education Item Card
const EducationCard: React.FC<{
  level: string;
  exam?: string;
  roll?: string;
  reg?: string;
  group?: string;
  board?: string;
  institute?: string;
  subject?: string;
  result?: string;
  year?: string;
  duration?: string;
  required?: boolean;
  optional?: boolean;
}> = ({
  level,
  exam,
  roll,
  reg,
  group,
  board,
  institute,
  subject,
  result,
  year,
  duration,
  optional,
}) => {
  const hasData = Boolean(exam && exam !== 'Select');

  return (
    <div
      className={`p-4 rounded-xl border text-xs space-y-2 ${
        hasData
          ? 'bg-slate-50 border-slate-200'
          : 'bg-slate-50/50 border-slate-200/60 opacity-80'
      }`}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
        <span className="font-bold text-slate-700 text-[11px]">
          {level} summary
        </span>
        {optional ? (
          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
            Optional / ঐচ্ছিক
          </span>
        ) : (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            Required / আবশ্যিক
          </span>
        )}
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1 text-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">
              Exam:
            </span>{' '}
            <strong className="text-slate-900">{exam}</strong>
          </div>
          {roll && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Roll No:
              </span>{' '}
              <strong className="text-slate-900">{roll}</strong>
            </div>
          )}
          {reg && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Reg No:
              </span>{' '}
              <strong className="text-slate-900">{reg}</strong>
            </div>
          )}
          {group && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Group/Subject:
              </span>{' '}
              <strong className="text-slate-900">{group}</strong>
            </div>
          )}
          {subject && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Subject/Degree:
              </span>{' '}
              <strong className="text-slate-900">{subject}</strong>
            </div>
          )}
          {board && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Board:
              </span>{' '}
              <strong className="text-slate-900">{board}</strong>
            </div>
          )}
          {institute && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                University/Inst:
              </span>{' '}
              <strong className="text-slate-900">{institute}</strong>
            </div>
          )}
          {result && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Result:
              </span>{' '}
              <strong className="text-emerald-700 font-extrabold">
                {result}
              </strong>
            </div>
          )}
          {year && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Passing Year:
              </span>{' '}
              <strong className="text-slate-900">{year}</strong>
            </div>
          )}
          {duration && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Duration:
              </span>{' '}
              <strong className="text-slate-900">{duration}</strong>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 font-medium py-1">
          {optional ? 'তথ্য প্রদান করা হয়নি (ঐচ্ছিক)' : 'তথ্য যুক্ত করা হয়নি'}
        </p>
      )}
    </div>
  );
};
