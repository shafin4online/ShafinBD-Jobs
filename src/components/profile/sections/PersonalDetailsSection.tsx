import React from 'react';

interface PersonalDetailsSectionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  formData,
  updateField,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">১</span>
        <h4 className="text-sm font-bold text-slate-900">ব্যক্তিগত তথ্য (Personal Details)</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Applicant Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Applicant's Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName || ''}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="e.g. MOHAMMAD SHAFIN"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
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

        {/* Marital Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Marital Status *
          </label>
          <select
            required
            value={formData.maritalStatus || 'Select'}
            onChange={(e) => updateField('maritalStatus', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mobile Number *
          </label>
          <input
            type="text"
            required
            value={formData.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="017XXXXXXXX"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Confirm Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Confirm Mobile Number *
          </label>
          <input
            type="text"
            required
            value={formData.confirmPhone || ''}
            onChange={(e) => updateField('confirmPhone', e.target.value)}
            placeholder="017XXXXXXXX"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="applicant@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

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
      </div>
    </div>
  );
};
