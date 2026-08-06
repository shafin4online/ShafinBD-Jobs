import React, { useRef } from 'react';
import { Job, PostCategoryType } from '../../types';
import { Sparkles, Save, RotateCcw, Upload, Image as ImageIcon, Trash2, Building2 } from 'lucide-react';
import { GovtJobForm } from './forms/GovtJobForm';
import { PrivateJobForm } from './forms/PrivateJobForm';
import { ExamResultForm } from './forms/ExamResultForm';
import { UniversityAdmissionForm } from './forms/UniversityAdmissionForm';
import { InstituteLogoSelector } from './InstituteLogoSelector';

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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const validFiles = fileList.filter((f: File) => {
      if (f.size > 5 * 1024 * 1024) {
        alert(`"${f.name}" ফাইলের সাইজ সর্বাধিক ৫ MB হওয়া আবশ্যক!`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const readPromises = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newBase64s) => {
      setJobForm((prev: any) => {
        const existingList =
          prev.imageUrls && Array.isArray(prev.imageUrls) && prev.imageUrls.length > 0
            ? prev.imageUrls
            : prev.imageUrl
            ? [prev.imageUrl]
            : [];

        const updatedList = [...existingList, ...newBase64s];
        return {
          ...prev,
          imageUrls: updatedList,
          imageUrl: updatedList[0] || '',
        };
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setJobForm((prev: any) => {
      const existingList =
        prev.imageUrls && Array.isArray(prev.imageUrls) && prev.imageUrls.length > 0
          ? prev.imageUrls
          : prev.imageUrl
          ? [prev.imageUrl]
          : [];

      const updatedList = existingList.filter((_: any, i: number) => i !== indexToRemove);
      return {
        ...prev,
        imageUrls: updatedList,
        imageUrl: updatedList[0] || '',
      };
    });
  };

  const handleClearAllImages = () => {
    setJobForm((prev: any) => ({
      ...prev,
      imageUrls: [],
      imageUrl: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentImages: string[] =
    jobForm.imageUrls && Array.isArray(jobForm.imageUrls) && jobForm.imageUrls.length > 0
      ? jobForm.imageUrls
      : jobForm.imageUrl
      ? [jobForm.imageUrl]
      : [];

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

      {/* STEP 2: INSTITUTE / ORGANIZATION LOGO MANAGEMENT */}
      <InstituteLogoSelector jobForm={jobForm} setJobForm={setJobForm} />

      {/* STEP 3: DYNAMIC MODULAR FORM FIELDS BASED ON SELECTED POST TYPE */}
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

      {/* IMAGE UPLOAD SECTION (Saved in Base64) - Multiple Images Supported */}
      <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div>
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>সার্কুলার / ফলাফলের ছবি যুক্ত করুন (এক বা একাধিক ছবি)</span>
            </label>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              বহুপৃষ্ঠা সার্কুলার বা রেজাল্টের জন্য একাধিক ছবি একসঙ্গে বা একের পর এক আপলোড করতে পারবেন (Base64)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="hidden"
              id="circular-image-upload"
            />

            <label
              htmlFor="circular-image-upload"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>
                {currentImages.length > 0 ? 'আরও ছবি যুক্ত করুন (Upload More)' : 'ছবি আপলোড করুন (Upload Images)'}
              </span>
            </label>

            {currentImages.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllImages}
                className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1 border border-rose-200 cursor-pointer transition-all"
                title="সব ছবি মুছুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সব মুছুন</span>
              </button>
            )}
          </div>
        </div>

        {/* THUMBNAILS GALLERY GRID FOR UPLOADED IMAGES */}
        {currentImages.length > 0 ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>মোট {currentImages.length} টি সার্কুলার / রেজাল্টের ছবি সংযুক্ত আছে</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                (ছবিতে মাউস রেখে নির্দিষ্ট ছবিটি মুছে ফেলতে পারবেন)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currentImages.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  className="relative group bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-between gap-1.5 hover:border-emerald-400 hover:shadow-md transition-all"
                >
                  <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
                    <img
                      src={imgUrl}
                      alt={`Circular page ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      পৃষ্ঠা {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="এই ছবিটি মুছুন"
                      className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-md transition-all opacity-90 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    ছবি #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">
              এখনো কোনো সার্কুলার বা ফলাফলের ছবি যুক্ত করা হয়নি
            </p>
            <p className="text-[11px] text-slate-400">
              উপরের "ছবি আপলোড করুন" বাটনে ক্লিক করে এক বা একাধিক ছবি নির্বাচন করতে পারেন (JPEG, PNG, WebP)
            </p>
          </div>
        )}
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
