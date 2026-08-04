import React from 'react';
import { UNIVERSITIES, PASSING_YEARS } from '../../../data/bdLocationData';

interface EducationMastersSectionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const EducationMastersSection: React.FC<EducationMastersSectionProps> = ({
  formData,
  updateField,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৬</span>
          <h4 className="text-sm font-bold text-slate-900">Masters/Equivalent Level</h4>
        </div>
        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
          If Applicable (প্রযোজ্য ক্ষেত্রে)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Examination
          </label>
          <select
            value={formData.mastersExam || 'Select'}
            onChange={(e) => updateField('mastersExam', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="M.Sc">M.Sc</option>
            <option value="M.A">M.A</option>
            <option value="M.B.A">M.B.A</option>
            <option value="M.S.S">M.S.S</option>
            <option value="M.Sc in Engineering">M.Sc in Engineering</option>
            <option value="Masters Degree">Masters Degree</option>
            <option value="Equivalent">Equivalent</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            University/Inst.
          </label>
          <select
            value={formData.mastersInstitute || 'Select'}
            onChange={(e) => updateField('mastersInstitute', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            {UNIVERSITIES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Passing Year
          </label>
          <select
            value={formData.mastersYear || 'Select'}
            onChange={(e) => updateField('mastersYear', e.target.value)}
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
            Subject/Degree
          </label>
          <input
            type="text"
            value={formData.mastersSubject || ''}
            onChange={(e) => updateField('mastersSubject', e.target.value)}
            placeholder="e.g. Master of Computer Applications"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Result
          </label>
          <select
            value={formData.mastersResult || 'Select'}
            onChange={(e) => updateField('mastersResult', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="CGPA (Out of 4.00)">CGPA (Out of 4.00)</option>
            <option value="1st Class">1st Class</option>
            <option value="2nd Class">2nd Class</option>
            <option value="3rd Class">3rd Class</option>
            <option value="Passed">Passed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Course Duration
          </label>
          <select
            value={formData.mastersDuration || 'Select'}
            onChange={(e) => updateField('mastersDuration', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="1 Year">1 Year</option>
            <option value="2 Years">2 Years</option>
          </select>
        </div>
      </div>
    </div>
  );
};
