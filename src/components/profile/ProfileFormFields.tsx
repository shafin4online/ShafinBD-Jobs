import React from 'react';
import { Save, User, MapPin, GraduationCap, Award, BookOpen, ShieldCheck, Briefcase } from 'lucide-react';

interface ProfileFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  completeness: number;
  skillsList: string[];
  newSkill: string;
  setNewSkill: (s: string) => void;
  handleSkillAdd: (e: React.FormEvent) => void;
  handleRemoveSkill: (s: string) => void;
  handleSubmitProfile: (e: React.FormEvent) => void;
}

const DISTRICTS = [
  'Select', 'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
  'Bagerhat', 'Bandarban', 'Barguna', 'Bhola', 'Bogra', 'Brahmanbaria', 'Chandpur', 'Chapainawabganj',
  'Chuadanga', 'Comilla', "Cox's Bazar", 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur',
  'Gopalganj', 'Habiganj', 'Jamalpur', 'Jessore', 'Jhalokathi', 'Jhenaidah', 'Joypurhat', 'Khagrachhari',
  'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur',
  'Moulvibazar', 'Munshiganj', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona',
  'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rangamati',
  'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Tangail', 'Thakurgaon'
];

const BOARDS = [
  'Select', 'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
  'Comilla', 'Dinajpur', 'Madrasah', 'Technical', 'Open University'
];

const PASSING_YEARS = Array.from({ length: 35 }, (_, i) => (2026 - i).toString());

const UNIVERSITIES = [
  'Select',
  'University of Dhaka',
  'Bangladesh University of Engineering and Technology (BUET)',
  'Jahangirnagar University',
  'Rajshahi University',
  'Chittagong University',
  'Shahjalal University of Science and Technology (SUST)',
  'Khulna University',
  'Chittagong University of Engineering & Technology (CUET)',
  'Rajshahi University of Engineering & Technology (RUET)',
  'Khulna University of Engineering & Technology (KUET)',
  'Dhaka University of Engineering & Technology (DUET)',
  'Bangladesh Agricultural University',
  'Sher-e-Bangla Agricultural University',
  'Jagannath University',
  'Comilla University',
  'Islamic University, Kushtia',
  'National University',
  'Open University',
  'North South University (NSU)',
  'BRAC University',
  'East West University',
  'Ahsanullah University of Science and Technology',
  'United International University',
  'Daffodil International University',
  'Independent University, Bangladesh (IUB)',
  'International Islamic University Chittagong',
  'Other / Equivalent Institution'
];

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  formData,
  setFormData,
  completeness,
  handleSubmitProfile,
}) => {
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmitProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
      {/* Header & Progress */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-emerald-400" />
              <span>আবেদনকারীর প্রোফাইল তথ্য ফরম (Application Form)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              সরকারি ও বেসরকারী চাকরির ফরম পূরণের স্ট্যান্ডার্ড তথ্য প্রদান করুন
            </p>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>তথ্য সেভ করুন</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              প্রোফাইল পূর্ণতা (Profile Completeness): <strong className="text-emerald-400 font-extrabold">{completeness}%</strong>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {completeness === 100 ? '✅ সকল তথ্য সম্পন্ন হয়েছে' : 'সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Section 1: Basic & Personal Info */}
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

      {/* Section 2: Address Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">২</span>
          <h4 className="text-sm font-bold text-slate-900">ঠিকানা বিবরণী (Address Details)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Care Of */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Care Of *
            </label>
            <input
              type="text"
              required
              value={formData.careOf || ''}
              onChange={(e) => updateField('careOf', e.target.value)}
              placeholder="e.g. Father's or Guardian Name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Village/ Road/ House/ Flat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Village/ Road/ House/ Flat *
            </label>
            <input
              type="text"
              required
              value={formData.villageRoad || ''}
              onChange={(e) => updateField('villageRoad', e.target.value)}
              placeholder="House #12, Road #4, Village/Area"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              District *
            </label>
            <select
              required
              value={formData.district || 'Select'}
              onChange={(e) => updateField('district', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Upazila/P.S. */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Upazila/P.S. *
            </label>
            <input
              type="text"
              required
              value={formData.upazila || ''}
              onChange={(e) => updateField('upazila', e.target.value)}
              placeholder="Upazila / Police Station"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Post Office */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Post Office *
            </label>
            <input
              type="text"
              required
              value={formData.postOffice || ''}
              onChange={(e) => updateField('postOffice', e.target.value)}
              placeholder="Post Office Name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Post Code */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Post Code *
            </label>
            <input
              type="text"
              required
              value={formData.postCode || ''}
              onChange={(e) => updateField('postCode', e.target.value)}
              placeholder="e.g. 1230"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: SSC/Equivalent Level */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৩</span>
            <h4 className="text-sm font-bold text-slate-900">SSC/Equivalent Level</h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">মাধ্যমিক / সমমান</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Examination *
            </label>
            <select
              required
              value={formData.sscExam || 'Select'}
              onChange={(e) => updateField('sscExam', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="Select">Select</option>
              <option value="S.S.C">S.S.C</option>
              <option value="Dakhil">Dakhil</option>
              <option value="S.S.C Vocational">S.S.C Vocational</option>
              <option value="O Level">O Level</option>
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
              value={formData.sscRoll || ''}
              onChange={(e) => updateField('sscRoll', e.target.value)}
              placeholder="SSC Roll Number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Group/Subject *
            </label>
            <select
              required
              value={formData.sscGroup || 'Select'}
              onChange={(e) => updateField('sscGroup', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="Select">Select</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Business Studies">Business Studies</option>
              <option value="General">General</option>
              <option value="Vocational">Vocational</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Board *
            </label>
            <select
              required
              value={formData.sscBoard || 'Select'}
              onChange={(e) => updateField('sscBoard', e.target.value)}
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
              value={formData.sscResult || 'Select'}
              onChange={(e) => updateField('sscResult', e.target.value)}
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
              value={formData.sscYear || 'Select'}
              onChange={(e) => updateField('sscYear', e.target.value)}
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

      {/* Section 4: HSC/Equivalent Level */}
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

      {/* Section 5: Graduation/Equivalent Level */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">৫</span>
            <h4 className="text-sm font-bold text-slate-900">Graduation/Equivalent Level</h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">স্নাতক / ডিগ্রি</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Examination *
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
              University/Inst. *
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
              Passing Year *
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
              Subject/Degree *
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
              Result *
            </label>
            <select
              value={formData.gradResult || 'Select'}
              onChange={(e) => updateField('gradResult', e.target.value)}
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
              Course Duration *
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

      {/* Section 6: Masters/Equivalent Level (If Applicable) */}
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

      {/* Save Button Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
          * চিহ্নিত তথ্যসমূহ বাধ্যতামূলক। সঠিক তথ্য প্রদান করে "তথ্য সেভ করুন" বাটনে ক্লিক করুন।
        </p>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>তথ্য সেভ করুন (Save Profile Information)</span>
        </button>
      </div>
    </form>
  );
};
