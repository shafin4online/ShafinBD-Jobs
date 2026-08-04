import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { ProfileBanner } from './profile/ProfileBanner';
import { ProfileFormFields } from './profile/ProfileFormFields';
import { ProfileDetailsView } from './profile/ProfileDetailsView';
import { MyApplicationsList } from './profile/MyApplicationsList';
import { SavedJobsList } from './profile/SavedJobsList';
import { CvDownloadModal } from './profile/CvDownloadModal';

export const UserProfile: React.FC = () => {
  const { profile, updateProfile, applications, jobs, authUser } = useJobContext();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'applications' | 'saved'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: profile.fullName || authUser?.displayName || '',
    fullNameBangla: profile.fullNameBangla || '',
    fatherName: profile.fatherName || '',
    fatherNameBangla: profile.fatherNameBangla || '',
    motherName: profile.motherName || '',
    motherNameBangla: profile.motherNameBangla || '',
    dateOfBirth: profile.dateOfBirth || '',
    nationality: profile.nationality || 'Bangladeshi',
    religion: profile.religion || '',
    gender: profile.gender || '',
    hasNid: profile.hasNid || 'Select',
    nidNumber: profile.nidNumber || '',
    hasBirthReg: profile.hasBirthReg || 'Select',
    birthRegNumber: profile.birthRegNumber || '',
    hasPassport: profile.hasPassport || 'Select',
    passportNumber: profile.passportNumber || '',
    maritalStatus: profile.maritalStatus || '',
    phone: profile.phone || '',
    confirmPhone: profile.confirmPhone || profile.phone || '',
    email: profile.email || authUser?.email || '',
    quota: profile.quota || '',
    deptStatus: profile.deptStatus || '',

    // Address
    careOf: profile.careOf || '',
    villageRoad: profile.villageRoad || '',
    district: profile.district || '',
    upazila: profile.upazila || '',
    postOffice: profile.postOffice || '',
    postCode: profile.postCode || '',

    // SSC
    sscExam: profile.sscExam || '',
    sscRoll: profile.sscRoll || '',
    sscRegistration: profile.sscRegistration || '',
    sscGroup: profile.sscGroup || '',
    sscBoard: profile.sscBoard || '',
    sscResult: profile.sscResult || '',
    sscYear: profile.sscYear || '',

    // HSC
    hscExam: profile.hscExam || '',
    hscRoll: profile.hscRoll || '',
    hscRegistration: profile.hscRegistration || '',
    hscGroup: profile.hscGroup || '',
    hscBoard: profile.hscBoard || '',
    hscResult: profile.hscResult || '',
    hscYear: profile.hscYear || '',

    // Graduation
    gradExam: profile.gradExam || '',
    gradRoll: profile.gradRoll || '',
    gradRegistration: profile.gradRegistration || '',
    gradInstitute: profile.gradInstitute || '',
    gradYear: profile.gradYear || '',
    gradSubject: profile.gradSubject || '',
    gradResult: profile.gradResult || '',
    gradDuration: profile.gradDuration || '',

    // Masters
    mastersExam: profile.mastersExam || '',
    mastersRoll: profile.mastersRoll || '',
    mastersRegistration: profile.mastersRegistration || '',
    mastersInstitute: profile.mastersInstitute || '',
    mastersYear: profile.mastersYear || '',
    mastersSubject: profile.mastersSubject || '',
    mastersResult: profile.mastersResult || '',
    mastersDuration: profile.mastersDuration || '',

    // Contact Locking
    isContactLocked: profile.isContactLocked || false,

    // Legacy/Additional
    title: profile.title || 'Job Candidate',
    location: profile.location || 'Bangladesh',
    presentAddress: profile.presentAddress || '',
    permanentAddress: profile.permanentAddress || '',
    expectedSalary: profile.expectedSalary || '',
    experience: profile.experience || '',
    education: profile.education || '',
    bio: profile.bio || '',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    resumeFileName: profile.resumeFileName || '',
    photoUrl: profile.photoUrl || '',
    signatureUrl: profile.signatureUrl || '',
  });

  React.useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || authUser.displayName || '',
        email: authUser.email || prev.email,
      }));
    }
  }, [authUser]);

  // Keep formData synced if profile updates externally
  React.useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        ...profile,
        fullName: profile.fullName || prev.fullName,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        sscRegistration: profile.sscRegistration || prev.sscRegistration,
        hscRegistration: profile.hscRegistration || prev.hscRegistration,
        gradRoll: profile.gradRoll || prev.gradRoll,
        gradRegistration: profile.gradRegistration || prev.gradRegistration,
        mastersRoll: profile.mastersRoll || prev.mastersRoll,
        mastersRegistration: profile.mastersRegistration || prev.mastersRegistration,
        isContactLocked: profile.isContactLocked ?? prev.isContactLocked,
      }));
    }
  }, [profile]);

  const [skillsList, setSkillsList] = useState<string[]>(profile.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const calculateCompleteness = () => {
    const fields = [
      formData.fullName,
      formData.fullNameBangla,
      formData.fatherName,
      formData.motherName,
      formData.dateOfBirth,
      formData.gender,
      formData.phone,
      formData.email,
      formData.district,
      formData.upazila,
      formData.sscExam,
      formData.sscRoll,
      formData.sscRegistration,
      formData.hscExam,
      formData.hscRoll,
      formData.hscRegistration,
      formData.photoUrl,
      formData.signatureUrl,
    ];
    const filledCount = fields.filter((f) => f && f.trim().length > 0 && f !== 'Select').length;
    return Math.min(100, Math.round((filledCount / fields.length) * 100));
  };

  const completeness = calculateCompleteness();

  const handleSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Lock contact info once updated with valid data
    const updatedData = {
      ...formData,
      isContactLocked: true,
      skills: skillsList,
    };

    setFormData(updatedData);
    updateProfile(updatedData);

    setSaveToast(true);
    setIsEditingProfile(false); // Switch back to attractive profile view!
    setTimeout(() => setSaveToast(false), 4000);
  };

  const savedJobsList = (jobs || []).filter((j) => (profile?.savedJobs || []).includes(j.id));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProfileBanner
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        formData={formData}
        completeness={completeness}
        applicationsCount={applications.length}
        savedJobsCount={savedJobsList.length}
        isEditingProfile={isEditingProfile}
        setIsEditingProfile={setIsEditingProfile}
        onDownloadCvClick={() => setIsCvModalOpen(true)}
      />

      <CvDownloadModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        formData={formData}
      />

      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>প্রার্থী রেজিস্ট্রেশন প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!</span>
        </div>
      )}

      {activeSubTab === 'profile' && (
        <>
          {!isEditingProfile ? (
            <ProfileDetailsView
              formData={formData}
              setFormData={setFormData}
              completeness={completeness}
              onEditClick={() => setIsEditingProfile(true)}
              onSaveProfile={(updatedData) => {
                const dataToSave = updatedData || formData;
                updateProfile(dataToSave);
                setSaveToast(true);
                setTimeout(() => setSaveToast(false), 3000);
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-extrabold text-slate-800">
                  ✏️ প্রোফাইল তথ্য এডিট মোড (Editing Mode)
                </span>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>পূর্বে ফিরে যান (View Profile)</span>
                </button>
              </div>

              <ProfileFormFields
                formData={formData}
                setFormData={setFormData}
                completeness={completeness}
                skillsList={skillsList}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                handleSkillAdd={handleSkillAdd}
                handleRemoveSkill={handleRemoveSkill}
                handleSubmitProfile={handleSubmitProfile}
              />
            </div>
          )}
        </>
      )}

      {activeSubTab === 'applications' && (
        <MyApplicationsList applications={applications} />
      )}

      {activeSubTab === 'saved' && (
        <SavedJobsList jobs={savedJobsList} />
      )}
    </div>
  );
};
