import React from 'react';

interface PersonalDemographicFieldsProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const PersonalDemographicFields: React.FC<PersonalDemographicFieldsProps> = ({
  formData,
  updateField,
}) => {
  return (
    <>
      {/* Date of Birth */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Date of Birth (mm/dd/yyyy) *
        </label>
        <input
          type="date"
          required
          value={formData.dateOfBirth || ''}
          onChange={(e) => updateField('dateOfBirth', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Nationality */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Nationality
        </label>
        <input
          type="text"
          readOnly
          value={formData.nationality || 'Bangladeshi'}
          onChange={(e) => updateField('nationality', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 outline-none cursor-not-allowed"
        />
      </div>

      {/* Religion */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Religion *
        </label>
        <select
          required
          value={formData.religion || 'Select'}
          onChange={(e) => updateField('religion', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
          <option value="Select">Select</option>
          <option value="Islam">Islam</option>
          <option value="Hinduism">Hinduism</option>
          <option value="Buddhism">Buddhism</option>
          <option value="Christianity">Christianity</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Gender *
        </label>
        <select
          required
          value={formData.gender || 'Select'}
          onChange={(e) => updateField('gender', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
          <option value="Select">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Third Gender">Third Gender / Others</option>
        </select>
      </div>

      {/* Marital Status */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Marital Status *
        </label>
        <select
          required
          value={formData.maritalStatus || 'Select'}
          onChange={(e) => {
            const val = e.target.value;
            updateField('maritalStatus', val);
            if (val !== 'Married') {
              updateField('spouseName', '');
            }
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
          <option value="Select">Select</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>

      {/* Spouse Name (Shown when Married) */}
      {formData.maritalStatus === 'Married' && (
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Spouse Name (স্বামী / স্ত্রীর নাম) *
          </label>
          <input
            type="text"
            required
            placeholder="Enter spouse name"
            value={formData.spouseName || ''}
            onChange={(e) => updateField('spouseName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/20"
          />
        </div>
      )}

      {/* Quota */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Quota *
        </label>
        <select
          required
          value={formData.quota || 'Select'}
          onChange={(e) => updateField('quota', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
          <option value="Select">Select</option>
          <option value="Non Quota">Non Quota / General</option>
          <option value="Freedom Fighter">Freedom Fighter</option>
          <option value="Child of Freedom Fighter">Child of Freedom Fighter</option>
          <option value="Grandchild of Freedom Fighter">Grandchild of Freedom Fighter</option>
          <option value="Tribal">Tribal / Ethnic Minority</option>
          <option value="Physically Handicapped">Physically Handicapped</option>
          <option value="Ansar & VDP">Ansar & VDP</option>
          <option value="Orphan">Orphan</option>
        </select>
      </div>

      {/* Departmental Status */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Departmental Status *
        </label>
        <select
          required
          value={formData.deptStatus || 'Select'}
          onChange={(e) => updateField('deptStatus', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
          <option value="Select">Select</option>
          <option value="None">None / General Applicant</option>
          <option value="Govt. Employee">Govt. Employee</option>
          <option value="Semi-Govt Employee">Semi-Govt Employee</option>
          <option value="Autonomous">Autonomous Organization</option>
          <option value="Departmental Candidate">Departmental Candidate</option>
        </select>
      </div>
    </>
  );
};
