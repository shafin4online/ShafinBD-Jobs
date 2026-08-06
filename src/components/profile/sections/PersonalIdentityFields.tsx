import React from 'react';

interface PersonalIdentityFieldsProps {
  formData: any;
  updateField: (field: string, value: any) => void;
  isLocked: boolean;
}

export const PersonalIdentityFields: React.FC<PersonalIdentityFieldsProps> = ({
  formData,
  updateField,
  isLocked,
}) => {
  return (
    <>
      {/* Applicant Name */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-700">
            Applicant's Name *
          </label>
          {isLocked && <span className="text-[10px] text-slate-500 font-bold">🔒 Locked</span>}
        </div>
        <input
          type="text"
          required
          disabled={isLocked}
          value={formData.fullName || ''}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="e.g. MOHAMMAD SHAFIN"
          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none transition-all ${
            isLocked
              ? 'bg-slate-100 text-slate-600 border-slate-300 cursor-not-allowed'
              : 'text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white'
          }`}
        />
      </div>

      {/* Applicant Name Bangla */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          আবেদনকারীর নাম (বাংলায়) *
        </label>
        <input
          type="text"
          required
          value={formData.fullNameBangla || ''}
          onChange={(e) => updateField('fullNameBangla', e.target.value)}
          placeholder="যেমন: মোহাম্মদ শাফিন"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Father's Name */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Father's Name *
        </label>
        <input
          type="text"
          required
          value={formData.fatherName || ''}
          onChange={(e) => updateField('fatherName', e.target.value)}
          placeholder="Father's full name in English"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Father's Name Bangla */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          পিতার নাম (বাংলায়) *
        </label>
        <input
          type="text"
          required
          value={formData.fatherNameBangla || ''}
          onChange={(e) => updateField('fatherNameBangla', e.target.value)}
          placeholder="পিতার নাম বাংলা লিখুন"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Mother's Name */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Mother's Name *
        </label>
        <input
          type="text"
          required
          value={formData.motherName || ''}
          onChange={(e) => updateField('motherName', e.target.value)}
          placeholder="Mother's full name in English"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Mother's Name Bangla */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          মাতার নাম (বাংলায়) *
        </label>
        <input
          type="text"
          required
          value={formData.motherNameBangla || ''}
          onChange={(e) => updateField('motherNameBangla', e.target.value)}
          placeholder="মাতার নাম বাংলা লিখুন"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>
    </>
  );
};
