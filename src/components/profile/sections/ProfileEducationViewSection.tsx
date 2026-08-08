import React from 'react';
import { BookOpen, Edit3, GraduationCap, Save, X } from 'lucide-react';
import { EducationSscSection } from './EducationSscSection';
import { EducationHscSection } from './EducationHscSection';
import { EducationGraduationSection } from './EducationGraduationSection';
import { EducationMastersSection } from './EducationMastersSection';
import { EducationCard } from '../ProfileDetailHelpers';

interface ProfileEducationViewSectionProps {
  formData: any;
  editingSection: string | null;
  handleStartSectionEdit: (sectionKey: string) => void;
  handleCancelSectionEdit: () => void;
  handleSaveSection: (sectionNameBangla: string, sectionHandle?: string) => void;
  updateField: (field: string, value: any) => void;
}

export const ProfileEducationViewSection: React.FC<ProfileEducationViewSectionProps> = ({
  formData,
  editingSection,
  handleStartSectionEdit,
  handleCancelSectionEdit,
  handleSaveSection,
  updateField,
}) => {
  return (
    <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 space-y-4">
      <div className="pb-2 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>৩. শিক্ষাগত যোগ্যতা (Educational Qualifications)</span>
        </h3>
        <span className="text-[11px] font-bold text-slate-500">
          নিচে প্রতিটি শিক্ষাগত স্তর আলাদাভাবে এডিট করা যাবে
        </span>
      </div>

      <div className="space-y-4">
        {/* SSC SECTION */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              SSC / Equivalent Level (এসএসসি / সমমান)
            </span>

            {editingSection !== 'ssc' ? (
              <button
                onClick={() => handleStartSectionEdit('ssc')}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>SSC এডিট</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ✏️ এডিট মোড
              </span>
            )}
          </div>

          {editingSection === 'ssc' ? (
            <div className="space-y-4 pt-1">
              <EducationSscSection formData={formData} updateField={updateField} />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelSectionEdit}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection('SSC', 'education_ssc')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সেভ SSC</span>
                </button>
              </div>
            </div>
          ) : (
            <EducationCard
              level="SSC / Equivalent Level"
              exam={formData.sscExam}
              roll={formData.sscRoll}
              reg={formData.sscRegistration}
              group={formData.sscGroup}
              board={formData.sscBoard}
              result={formData.sscResult}
              gpaPoint={formData.sscGpaPoint}
              year={formData.sscYear}
              required
            />
          )}
        </div>

        {/* HSC SECTION */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              HSC / Equivalent Level (এইচএসসি / সমমান)
            </span>

            {editingSection !== 'hsc' ? (
              <button
                onClick={() => handleStartSectionEdit('hsc')}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>HSC এডিট</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ✏️ এডিট মোড
              </span>
            )}
          </div>

          {editingSection === 'hsc' ? (
            <div className="space-y-4 pt-1">
              <EducationHscSection formData={formData} updateField={updateField} />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelSectionEdit}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection('HSC', 'education_hsc')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সেভ HSC</span>
                </button>
              </div>
            </div>
          ) : (
            <EducationCard
              level="HSC / Equivalent Level"
              exam={formData.hscExam}
              roll={formData.hscRoll}
              reg={formData.hscRegistration}
              group={formData.hscGroup}
              board={formData.hscBoard}
              result={formData.hscResult}
              gpaPoint={formData.hscGpaPoint}
              year={formData.hscYear}
              required
            />
          )}
        </div>

        {/* GRADUATION SECTION */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Graduation Level (স্নাতক / ডিগ্রি - Optional)
            </span>

            {editingSection !== 'grad' ? (
              <button
                onClick={() => handleStartSectionEdit('grad')}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Graduation এডিট</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ✏️ এডিট মোড
              </span>
            )}
          </div>

          {editingSection === 'grad' ? (
            <div className="space-y-4 pt-1">
              <EducationGraduationSection
                formData={formData}
                updateField={updateField}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelSectionEdit}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection('Graduation', 'education_grad')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সেভ Graduation</span>
                </button>
              </div>
            </div>
          ) : (
            <EducationCard
              level="Graduation / Equivalent Level"
              exam={formData.gradExam}
              roll={formData.gradRoll}
              reg={formData.gradRegistration}
              institute={formData.gradInstitute}
              subject={formData.gradSubject}
              result={formData.gradResult}
              gpaPoint={formData.gradGpaPoint}
              year={formData.gradYear}
              duration={formData.gradDuration}
              optional
            />
          )}
        </div>

        {/* MASTERS SECTION */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Masters Level (স্নাতকোত্তর / মাস্টার্স - Optional)
            </span>

            {editingSection !== 'masters' ? (
              <button
                onClick={() => handleStartSectionEdit('masters')}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Masters এডিট</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ✏️ এডিট মোড
              </span>
            )}
          </div>

          {editingSection === 'masters' ? (
            <div className="space-y-4 pt-1">
              <EducationMastersSection
                formData={formData}
                updateField={updateField}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelSectionEdit}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection('Masters', 'education_masters')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সেভ Masters</span>
                </button>
              </div>
            </div>
          ) : (
            <EducationCard
              level="Masters / Equivalent Level"
              exam={formData.mastersExam}
              roll={formData.mastersRoll}
              reg={formData.mastersRegistration}
              institute={formData.mastersInstitute}
              subject={formData.mastersSubject}
              result={formData.mastersResult}
              gpaPoint={formData.mastersGpaPoint}
              year={formData.mastersYear}
              duration={formData.mastersDuration}
              optional
            />
          )}
        </div>
      </div>
    </div>
  );
};
