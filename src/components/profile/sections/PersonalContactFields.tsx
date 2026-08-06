import React from 'react';

interface PersonalContactFieldsProps {
  formData: any;
  updateField: (field: string, value: any) => void;
  isLocked: boolean;
}

export const PersonalContactFields: React.FC<PersonalContactFieldsProps> = ({
  formData,
  updateField,
  isLocked,
}) => {
  return (
    <>
      {/* Mobile Number */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-700">
            Mobile Number *
          </label>
          {isLocked && <span className="text-[10px] text-slate-500 font-bold">🔒 Locked</span>}
        </div>
        <input
          type="text"
          required
          disabled={isLocked}
          value={formData.phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="017XXXXXXXX"
          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none transition-all ${
            isLocked
              ? 'bg-slate-100 text-slate-600 border-slate-300 cursor-not-allowed'
              : 'text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white'
          }`}
        />
      </div>

      {/* Confirm Mobile Number */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-700">
            Confirm Mobile Number *
          </label>
          {isLocked && <span className="text-[10px] text-slate-500 font-bold">🔒 Locked</span>}
        </div>
        <input
          type="text"
          required
          disabled={isLocked}
          value={formData.confirmPhone || ''}
          onChange={(e) => updateField('confirmPhone', e.target.value)}
          placeholder="017XXXXXXXX"
          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none transition-all ${
            isLocked
              ? 'bg-slate-100 text-slate-600 border-slate-300 cursor-not-allowed'
              : 'text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white'
          }`}
        />
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-700">
            Email *
          </label>
          {isLocked && <span className="text-[10px] text-slate-500 font-bold">🔒 Locked</span>}
        </div>
        <input
          type="email"
          required
          disabled={isLocked}
          value={formData.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="applicant@example.com"
          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none transition-all ${
            isLocked
              ? 'bg-slate-100 text-slate-600 border-slate-300 cursor-not-allowed'
              : 'text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white'
          }`}
        />
      </div>
    </>
  );
};
