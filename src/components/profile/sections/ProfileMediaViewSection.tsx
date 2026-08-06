import React from 'react';
import { Edit3, Image as ImageIcon, Save, X } from 'lucide-react';
import { PhotoSignatureSection } from './PhotoSignatureSection';

interface ProfileMediaViewSectionProps {
  formData: any;
  editingSection: string | null;
  handleStartSectionEdit: (sectionKey: string) => void;
  handleCancelSectionEdit: () => void;
  handleSaveSection: (sectionNameBangla: string, sectionHandle?: string) => void;
  updateField: (field: string, value: any) => void;
}

export const ProfileMediaViewSection: React.FC<ProfileMediaViewSectionProps> = ({
  formData,
  editingSection,
  handleStartSectionEdit,
  handleCancelSectionEdit,
  handleSaveSection,
  updateField,
}) => {
  return (
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
              onClick={() => handleSaveSection('ছবি ও স্বাক্ষর', 'media')}
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
  );
};
