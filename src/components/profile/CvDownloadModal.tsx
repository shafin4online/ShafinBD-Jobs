import React from 'react';
import { X, Printer, Download, User, Mail, Phone, MapPin, GraduationCap, Award, FileText } from 'lucide-react';

interface CvDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
}

export const CvDownloadModal: React.FC<CvDownloadModalProps> = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white print:static print:block overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:shadow-none print:border-none print:max-w-none print:my-0 print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Curriculum Vitae (CV / Resume) Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / PDF ডাউনলোড</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Document Container */}
        <div className="p-8 sm:p-12 space-y-6 bg-white font-sans text-slate-800 print:p-6" id="cv-print-area">
          
          {/* Header Section */}
          <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-6 gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {formData.fullName || 'Candidate Name'}
              </h1>
              {formData.fullNameBangla && (
                <p className="text-sm font-semibold text-emerald-700">{formData.fullNameBangla}</p>
              )}
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {formData.title || 'Job Candidate'}
              </p>

              <div className="pt-2 text-xs space-y-1 text-slate-600 font-medium">
                {formData.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{formData.email}</span>
                  </p>
                )}
                {formData.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{formData.phone}</span>
                  </p>
                )}
                {(formData.district || formData.villageRoad) && (
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{[formData.villageRoad, formData.upazila, formData.district].filter(Boolean).join(', ')}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Candidate Photo */}
            <div className="shrink-0">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.fullName}
                  className="w-28 h-32 object-cover rounded-xl border-2 border-slate-300 shadow-xs"
                />
              ) : (
                <div className="w-28 h-32 rounded-xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>

          {/* Career Objective / Bio */}
          {formData.bio && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1">
                Career Objective / Summary
              </h2>
              <p className="text-xs leading-relaxed text-slate-700 font-normal">{formData.bio}</p>
            </div>
          )}

          {/* Academic Qualifications Table */}
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Educational Qualifications</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                    <th className="p-2 border border-slate-300">Exam</th>
                    <th className="p-2 border border-slate-300">Group / Subject</th>
                    <th className="p-2 border border-slate-300">Board / University</th>
                    <th className="p-2 border border-slate-300">Passing Year</th>
                    <th className="p-2 border border-slate-300">GPA / CGPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {formData.mastersExam && (
                    <tr>
                      <td className="p-2 border border-slate-300 font-semibold">{formData.mastersExam}</td>
                      <td className="p-2 border border-slate-300">{formData.mastersSubject || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.mastersInstitute || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.mastersYear || '-'}</td>
                      <td className="p-2 border border-slate-300 font-bold text-emerald-700">{formData.mastersResult || '-'}</td>
                    </tr>
                  )}
                  {formData.gradExam && (
                    <tr>
                      <td className="p-2 border border-slate-300 font-semibold">{formData.gradExam}</td>
                      <td className="p-2 border border-slate-300">{formData.gradSubject || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.gradInstitute || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.gradYear || '-'}</td>
                      <td className="p-2 border border-slate-300 font-bold text-emerald-700">{formData.gradResult || '-'}</td>
                    </tr>
                  )}
                  {formData.hscExam && (
                    <tr>
                      <td className="p-2 border border-slate-300 font-semibold">{formData.hscExam}</td>
                      <td className="p-2 border border-slate-300">{formData.hscGroup || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.hscBoard || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.hscYear || '-'}</td>
                      <td className="p-2 border border-slate-300 font-bold text-emerald-700">{formData.hscResult || '-'}</td>
                    </tr>
                  )}
                  {formData.sscExam && (
                    <tr>
                      <td className="p-2 border border-slate-300 font-semibold">{formData.sscExam}</td>
                      <td className="p-2 border border-slate-300">{formData.sscGroup || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.sscBoard || '-'}</td>
                      <td className="p-2 border border-slate-300">{formData.sscYear || '-'}</td>
                      <td className="p-2 border border-slate-300 font-bold text-emerald-700">{formData.sscResult || '-'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Personal Information Grid */}
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Father's Name: </span>
                <span className="font-bold text-slate-800">{formData.fatherName || '-'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Mother's Name: </span>
                <span className="font-bold text-slate-800">{formData.motherName || '-'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Date of Birth: </span>
                <span className="font-bold text-slate-800">{formData.dateOfBirth || '-'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Gender: </span>
                <span className="font-bold text-slate-800">{formData.gender || '-'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Religion: </span>
                <span className="font-bold text-slate-800">{formData.religion || '-'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Nationality: </span>
                <span className="font-bold text-slate-800">{formData.nationality || 'Bangladeshi'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">NID / Birth Reg: </span>
                <span className="font-bold text-slate-800">{formData.nidNumber || formData.birthRegNumber || '-'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Marital Status: </span>
                <span className="font-bold text-slate-800">{formData.maritalStatus || '-'}</span>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="pt-8 flex items-end justify-between">
            <div className="text-[11px] text-slate-400 font-medium">
              Generated via ShafinBD Jobs Portal
            </div>
            <div className="text-center space-y-1">
              {formData.signatureUrl ? (
                <img src={formData.signatureUrl} alt="Signature" className="h-10 mx-auto object-contain" />
              ) : (
                <div className="h-10 w-32 border-b border-slate-400"></div>
              )}
              <p className="text-[11px] font-bold text-slate-700">Applicant Signature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
