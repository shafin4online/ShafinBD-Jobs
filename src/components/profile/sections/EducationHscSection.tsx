import React from 'react';
import { BOARDS, PASSING_YEARS } from '../../../data/bdLocationData';

interface EducationHscSectionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const EducationHscSection: React.FC<EducationHscSectionProps> = ({
  formData,
  updateField,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৪</span>
          <h4 className="text-sm font-bold text-slate-900">HSC/Equivalent Level</h4>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">উচ্চ মাধ্যমিক / সমমান</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Examination *
          </label>
          <select
            required
            value={formData.hscExam || 'Select'}
            onChange={(e) => updateField('hscExam', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="H.S.C">H.S.C</option>
            <option value="Alim">Alim</option>
            <option value="H.S.C Vocational">H.S.C Vocational</option>
            <option value="Diploma in Engineering">Diploma in Engineering</option>
            <option value="A Level">A Level</option>
            <option value="Equivalent">Equivalent</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Roll No *
          </label>
          <input
            type="text"
            required
            value={formData.hscRoll || ''}
            onChange={(e) => updateField('hscRoll', e.target.value)}
            placeholder="HSC Roll Number"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Group/Subject *
          </label>
          <select
            required
            value={formData.hscGroup || 'Select'}
            onChange={(e) => updateField('hscGroup', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="Science">Science</option>
            <option value="Humanities">Humanities</option>
            <option value="Business Studies">Business Studies</option>
            <option value="General">General</option>
            <option value="Technical">Technical</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Board *
          </label>
          <select
            required
            value={formData.hscBoard || 'Select'}
            onChange={(e) => updateField('hscBoard', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            {BOARDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Result *
          </label>
          <select
            required
            value={formData.hscResult || 'Select'}
            onChange={(e) => updateField('hscResult', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            <option value="GPA (Out of 5.00)">GPA (Out of 5.00)</option>
            <option value="1st Division">1st Division</option>
            <option value="2nd Division">2nd Division</option>
            <option value="3rd Division">3rd Division</option>
            <option value="Passed">Passed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Passing Year *
          </label>
          <select
            required
            value={formData.hscYear || 'Select'}
            onChange={(e) => updateField('hscYear', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="Select">Select</option>
            {PASSING_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
