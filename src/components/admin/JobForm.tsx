import React, { useRef } from 'react';
import { Job, PostCategoryType } from '../../types';
import { Sparkles, Save, RotateCcw, Upload, Image as ImageIcon, Trash2, Building2 } from 'lucide-react';
import { GovtJobForm } from './forms/GovtJobForm';
import { PrivateJobForm } from './forms/PrivateJobForm';
import { ExamResultForm } from './forms/ExamResultForm';
import { UniversityAdmissionForm } from './forms/UniversityAdmissionForm';

interface JobFormProps {
  editingJob: Job | null;
  setEditingJob: (job: Job | null) => void;
  jobForm: any;
  setJobForm: React.Dispatch<React.SetStateAction<any>>;
  handleFormSubmit: (e: React.FormEvent) => void;
  handleAiGenerate: () => void;
  isGeneratingAi: boolean;
  aiNotice: string;
  formSuccess: string;
}

export const JobForm: React.FC<JobFormProps> = ({
  editingJob,
  setEditingJob,
  jobForm,
  setJobForm,
  handleFormSubmit,
  handleAiGenerate,
  isGeneratingAi,
  aiNotice,
  formSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const postType: PostCategoryType = jobForm.postType || 'govt';

  const handlePostTypeChange = (newType: PostCategoryType) => {
    let category = 'Govt. Job';
    if (newType === 'private') category = 'Private Job';
    if (newType === 'exam-result') category = 'Software & IT';
    if (newType === 'university') category = 'University Admission Notice';

    setJobForm((prev: any) => ({
      ...prev,
      postType: newType,
      category,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবির সাইজ সর্বাধিক ৫ MB হওয়া আবশ্যক!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setJobForm((prev: any) => ({
          ...prev,
          imageUrl: base64String,
          companyLogo: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setJobForm((prev: any) => ({
      ...prev,
      imageUrl: '',
      companyLogo: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>{editingJob ? 'সার্কুলার সম্পাদনা করুন (Edit Post)' : 'নতুন পোস্ট বা সার্কুলার যুক্ত করুন (Add New Post)'}</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            ক্যাটাগরি অনুযায়ী সরকারি চাকরি, বেসরকারি চাকরি, রেজাল্ট বা ভর্তি বিজ্ঞপ্তি পাবলিশ করুন
          </p>
        </div>

        {editingJob && (
          <button
            type="button"
            onClick={() => {
              setEditingJob(null);
              setJobForm({
                postType: 'govt',
                title: '',
                company: '',
                companyLogo: '',
                location: 'বাংলাদেশ (Bangladesh)',
                jobType: 'Full-time',
                category: 'Govt. Job',
                salaryRange: '',
                experienceLevel: 'Entry Level',
                description: '',
                requirementsText: '',
                responsibilitiesText: '',
                deadline: '',
                startDate: '',
                position: '',
                vacancies: '',
                applicationFee: '',
                applicationUrl: '',
                circularUrl: '',
                resultDate: '',
                examDate: '',
                passedCount: '',
                writtenExamDate: '',
                imageUrl: '',
                status: 'active',
                featured: true,
              });
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>সম্পাদনা বাতিল</span>
          </button>
        )}
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 shadow-sm">
          <span>✅</span>
          <span>{formSuccess}</span>
        </div>
      )}

      {/* STEP 1: CATEGORY / POST TYPE SELECTION DROPDOWN */}
      <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2 border border-slate-800">
        <label className="block text-xs font-black text-emerald-400 uppercase tracking-wider">
          ১. পোস্টের টাইপ বা ক্যাটাগরি নির্বাচন করুন (Select Post Category) *
        </label>
        <select
          value={postType}
          onChange={(e) => handlePostTypeChange(e.target.value as PostCategoryType)}
          className="w-full px-4 py-3 bg-slate-800 text-white font-extrabold text-sm rounded-xl border border-slate-700 focus:border-emerald-500 outline-none cursor-pointer"
        >
          <option value="govt">সরকারি চাকরি (Govt Job)</option>
          <option value="private">বেসরকারি চাকরি (Private Job)</option>
          <option value="exam-result">পরীক্ষার রেজাল্ট (Exam Result)</option>
          <option value="university">বিশ্ববিদ্যালয় ভর্তি (University Admission)</option>
        </select>
        <p className="text-[11px] text-slate-400">
          * নির্বাচিত অপশন অনুযায়ী নিচের প্রয়োজনীয় ফরম ফিন্ডগুলো পরিবর্তিত হবে।
        </p>
      </div>

      {/* STEP 2: DYNAMIC MODULAR FORM FIELDS BASED ON SELECTED POST TYPE */}
      {postType === 'govt' && (
        <GovtJobForm jobForm={jobForm} setJobForm={setJobForm} />
      )}
      {postType === 'private' && (
        <PrivateJobForm jobForm={jobForm} setJobForm={setJobForm} />
      )}
      {postType === 'exam-result' && (
        <ExamResultForm jobForm={jobForm} setJobForm={setJobForm} />
      )}
      {postType === 'university' && (
        <UniversityAdmissionForm jobForm={jobForm} setJobForm={setJobForm} />
      )}

      {/* IMAGE UPLOAD SECTION (Saved in Base64) - Standard Across All Types */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-emerald-600" />
          <span>সার্কুলার / ফলাফলের ছবি যুক্ত করুন (Minimum 1 Image Upload - Saved in Base64)</span>
        </label>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="circular-image-upload"
          />

          <label
            htmlFor="circular-image-upload"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{jobForm.imageUrl ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন (Base64)'}</span>
          </label>

          {jobForm.imageUrl ? (
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200">
              <img
                src={jobForm.imageUrl}
                alt="Uploaded Circular"
                className="w-12 h-12 rounded-lg object-cover border border-emerald-300"
              />
              <div>
                <p className="text-[11px] font-bold text-emerald-700">ছবি আপলোড সফল হয়েছে</p>
                <span className="text-[9px] text-slate-400">Base64 ডাটা স্ট্রাকচারে সংরক্ষিত</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                title="ছবিটি মুছুন"
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg ml-auto cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              কোনো ছবি আপলোড করা হয়নি। (JPEG, PNG বা WebP ফরম্যাট)
            </p>
          )}
        </div>
      </div>

      {/* AI Generate Assistant Box */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI বিবরণী জেনারেটর (AI Content Generator)</span>
          </h4>
          <p className="text-[11px] text-emerald-700 mt-0.5">টাইটেল অনুযায়ী AI দিয়ে বিবরণ তৈরি করতে পারেন</p>
          {aiNotice && <p className="text-[10px] text-emerald-800 font-bold mt-1">{aiNotice}</p>}
        </div>

        <button
          type="button"
          onClick={handleAiGenerate}
          disabled={isGeneratingAi}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGeneratingAi ? 'জেনারেট হচ্ছে...' : 'AI বিবরণ তৈরি করুন'}</span>
        </button>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{editingJob ? 'সার্কুলার / পোস্ট আপডেট করুন' : 'সার্কুলার / পোস্ট পাবলিশ করুন'}</span>
        </button>
      </div>
    </form>
  );
};
