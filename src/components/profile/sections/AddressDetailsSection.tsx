import React from 'react';
import { DISTRICTS, DISTRICT_UPAZILAS_MAP } from '../../../data/bdLocationData';

interface AddressDetailsSectionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({
  formData,
  updateField,
}) => {
  const selectedDistrict = formData.district || 'Select';
  const availableUpazilas = DISTRICT_UPAZILAS_MAP[selectedDistrict] || [];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    updateField('district', newDistrict);
    // Reset upazila when district changes if not matching
    updateField('upazila', '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">২</span>
        <h4 className="text-sm font-bold text-slate-900">ঠিকানা বিবরণী (Address Details)</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Care Of */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Care Of *
          </label>
          <input
            type="text"
            required
            value={formData.careOf || ''}
            onChange={(e) => updateField('careOf', e.target.value)}
            placeholder="e.g. Father's or Guardian Name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Village/ Road/ House/ Flat */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Village/ Road/ House/ Flat *
          </label>
          <input
            type="text"
            required
            value={formData.villageRoad || ''}
            onChange={(e) => updateField('villageRoad', e.target.value)}
            placeholder="House #12, Road #4, Village/Area"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            District *
          </label>
          <select
            required
            value={formData.district || 'Select'}
            onChange={handleDistrictChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white cursor-pointer"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Upazila/P.S. (Auto populated dropdown based on District) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Upazila/P.S. *
            </label>
            {selectedDistrict !== 'Select' && (
              <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Auto-Filtered for {selectedDistrict}
              </span>
            )}
          </div>

          {availableUpazilas.length > 0 ? (
            <select
              required
              value={formData.upazila || ''}
              onChange={(e) => updateField('upazila', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white cursor-pointer"
            >
              <option value="">Select Upazila / Police Station</option>
              {availableUpazilas.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              required
              value={formData.upazila || ''}
              onChange={(e) => updateField('upazila', e.target.value)}
              placeholder={selectedDistrict === 'Select' ? 'প্রথমে District নির্বাচন করুন' : 'Upazila / Police Station'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          )}
        </div>

        {/* Post Office */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Post Office *
          </label>
          <input
            type="text"
            required
            value={formData.postOffice || ''}
            onChange={(e) => updateField('postOffice', e.target.value)}
            placeholder="Post Office Name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Post Code */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Post Code *
          </label>
          <input
            type="text"
            required
            value={formData.postCode || ''}
            onChange={(e) => updateField('postCode', e.target.value)}
            placeholder="e.g. 1230"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
