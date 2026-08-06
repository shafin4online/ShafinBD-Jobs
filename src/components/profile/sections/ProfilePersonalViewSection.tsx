import React from 'react';
import { Edit3, User, Save, X } from 'lucide-react';
import { PersonalDetailsSection } from './PersonalDetailsSection';
import { DetailItem } from '../ProfileDetailHelpers';

interface ProfilePersonalViewSectionProps {
  formData: any;
  editingSection: string | null;
  handleStartSectionEdit: (sectionKey: string) => void;
  handleCancelSectionEdit: () => void;
  handleSaveSection: (sectionNameBangla: string, sectionHandle?: string) => void;
  updateField: (field: string, value: any) => void;
}

export const ProfilePersonalViewSection: React.FC<ProfilePersonalViewSectionProps> = ({
  formData,
  editingSection,
  handleStartSectionEdit,
  handleCancelSectionEdit,
  handleSaveSection,
  updateField,
}) => {
  return (
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
              onClick={() => handleSaveSection('ব্যক্তিগত তথ্য', 'personal')}
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
  );
};
