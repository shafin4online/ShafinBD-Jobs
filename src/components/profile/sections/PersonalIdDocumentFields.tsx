import React from 'react';

interface PersonalIdDocumentFieldsProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const PersonalIdDocumentFields: React.FC<PersonalIdDocumentFieldsProps> = ({
  formData,
  updateField,
}) => {
  return (
    <>
      {/* National ID Select & Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          National ID *
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={formData.hasNid || 'Select'}
            onChange={(e) => updateField('hasNid', e.target.value)}
            className="col-span-1 px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input
            type="text"
            disabled={formData.hasNid !== 'Yes'}
            value={formData.nidNumber || ''}
            onChange={(e) => updateField('nidNumber', e.target.value)}
            placeholder={formData.hasNid === 'Yes' ? 'NID No.' : 'N/A'}
            className="col-span-2 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Birth Registration Select & Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Birth Registration *
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={formData.hasBirthReg || 'Select'}
            onChange={(e) => updateField('hasBirthReg', e.target.value)}
            className="col-span-1 px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input
            type="text"
            disabled={formData.hasBirthReg !== 'Yes'}
            value={formData.birthRegNumber || ''}
            onChange={(e) => updateField('birthRegNumber', e.target.value)}
            placeholder={formData.hasBirthReg === 'Yes' ? 'Birth Reg No.' : 'N/A'}
            className="col-span-2 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Passport ID Select & Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Passport ID *
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={formData.hasPassport || 'Select'}
            onChange={(e) => updateField('hasPassport', e.target.value)}
            className="col-span-1 px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input
            type="text"
            disabled={formData.hasPassport !== 'Yes'}
            value={formData.passportNumber || ''}
            onChange={(e) => updateField('passportNumber', e.target.value)}
            placeholder={formData.hasPassport === 'Yes' ? 'Passport No.' : 'N/A'}
            className="col-span-2 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>
      </div>
    </>
  );
};
