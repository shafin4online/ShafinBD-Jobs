import React from 'react';
import { UNIVERSITIES, PASSING_YEARS } from '../../../data/bdLocationData';
import { sanitizeGpaInput } from '../../../utils/gpa';

interface EducationGraduationSectionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const EducationGraduationSection: React.FC<EducationGraduationSectionProps> = ({
  formData,
  updateField,
}) => {
  const isCgpaSelected = formData.gradResult?.includes('CGPA') || formData.gradResult?.includes('GPA');
  const maxScale = formData.gradResult?.includes('5.00') ? 5.00 : 4.00;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৫</span>
          <h4 className="text-sm font-bold text-slate-900">Graduation/Equivalent Level</h4>
        </div>
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
          Optional (ঐচ্ছিক / প্রযোজ্য ক্ষেত্রে)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Examination (Optional)
          </label>
          <select
            value={formData.gradExam || 'Select'}
            onChange={(e) => updateField('gradExam', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="B.Sc">B.Sc</option>
            <option value="B.A">B.A</option>
            <option value="B.B.A">B.B.A</option>
            <option value="B.S.S">B.S.S</option>
            <option value="MBBS / BDS">MBBS / BDS</option>
            <option value="B.Sc in Engineering">B.Sc in Engineering</option>
            <option value="Honours Degree">Honours Degree</option>
            <option value="Pass Course">Pass Course</option>
            <option value="Equivalent">Equivalent</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Roll No (Optional)
          </label>
          <input
            type="text"
            value={formData.gradRoll || ''}
            onChange={(e) => updateField('gradRoll', e.target.value)}
            placeholder="Graduation Roll"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Registration No (Optional)
          </label>
          <input
            type="text"
            value={formData.gradRegistration || ''}
            onChange={(e) => updateField('gradRegistration', e.target.value)}
            placeholder="Graduation Reg Number"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            University/Inst. (Optional)
          </label>
          <select
            value={formData.gradInstitute || 'Select'}
            onChange={(e) => updateField('gradInstitute', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            {UNIVERSITIES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Passing Year (Optional)
          </label>
          <select
            value={formData.gradYear || 'Select'}
            onChange={(e) => updateField('gradYear', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            {PASSING_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Subject/Degree (Optional)
          </label>
          <input
            type="text"
            value={formData.gradSubject || ''}
            onChange={(e) => updateField('gradSubject', e.target.value)}
            placeholder="e.g. Computer Science, English, Accounting"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Result (Optional)
          </label>
          <select
            value={formData.gradResult || 'Select'}
            onChange={(e) => {
              const res = e.target.value;
              updateField('gradResult', res);
              if (!res.includes('GPA') && !res.includes('CGPA')) {
                updateField('gradGpaPoint', '');
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="CGPA (Out of 4.00)">CGPA (Out of 4.00)</option>
            <option value="GPA (Out of 5.00)">GPA (Out of 5.00)</option>
            <option value="1st Class">1st Class</option>
            <option value="2nd Class">2nd Class</option>
            <option value="3rd Class">3rd Class</option>
            <option value="Passed">Passed</option>
          </select>
        </div>

        {/* Conditional CGPA Input */}
        {isCgpaSelected && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CGPA / GPA Point (প্রাপ্ত জিপিএ)
            </label>
            <input
              type="text"
              placeholder={`e.g. ${maxScale.toFixed(2)}`}
              value={formData.gradGpaPoint || ''}
              onChange={(e) => {
                const sanitized = sanitizeGpaInput(e.target.value, maxScale);
                updateField('gradGpaPoint', sanitized);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/20"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">সর্বোচ্চ মান: {maxScale.toFixed(2)}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Course Duration (Optional)
          </label>
          <select
            value={formData.gradDuration || 'Select'}
            onChange={(e) => updateField('gradDuration', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="3 Years">3 Years</option>
            <option value="4 Years">4 Years</option>
            <option value="5 Years">5 Years</option>
          </select>
        </div>
      </div>
    </div>
  );
};
