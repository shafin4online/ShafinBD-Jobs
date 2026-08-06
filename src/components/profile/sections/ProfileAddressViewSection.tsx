import React from 'react';
import { Edit3, MapPin, Save, X } from 'lucide-react';
import { AddressDetailsSection } from './AddressDetailsSection';
import { DetailItem } from '../ProfileDetailHelpers';

interface ProfileAddressViewSectionProps {
  formData: any;
  editingSection: string | null;
  handleStartSectionEdit: (sectionKey: string) => void;
  handleCancelSectionEdit: () => void;
  handleSaveSection: (sectionNameBangla: string, sectionHandle?: string) => void;
  updateField: (field: string, value: any) => void;
}

export const ProfileAddressViewSection: React.FC<ProfileAddressViewSectionProps> = ({
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
              onClick={() => handleSaveSection('ঠিকানা বিবরণী', 'address')}
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
  );
};
