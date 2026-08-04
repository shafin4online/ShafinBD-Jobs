import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { CheckCircle2 } from 'lucide-react';
import { ProfileBanner } from './profile/ProfileBanner';
import { ProfileFormFields } from './profile/ProfileFormFields';
import { MyApplicationsList } from './profile/MyApplicationsList';
import { SavedJobsList } from './profile/SavedJobsList';

export const UserProfile: React.FC = () => {
  const { profile, updateProfile, applications, jobs, authUser } = useJobContext();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'applications' | 'saved'>('profile');
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
    sscGroup: profile.sscGroup || '',
    sscBoard: profile.sscBoard || '',
    sscResult: profile.sscResult || '',
    sscYear: profile.sscYear || '',

    // HSC
    hscExam: profile.hscExam || '',
    hscRoll: profile.hscRoll || '',
    hscGroup: profile.hscGroup || '',
    hscBoard: profile.hscBoard || '',
    hscResult: profile.hscResult || '',
    hscYear: profile.hscYear || '',

    // Graduation
    gradExam: profile.gradExam || '',
    gradInstitute: profile.gradInstitute || '',
    gradYear: profile.gradYear || '',
    gradSubject: profile.gradSubject || '',
    gradResult: profile.gradResult || '',
    gradDuration: profile.gradDuration || '',

    // Masters
    mastersExam: profile.mastersExam || '',
    mastersInstitute: profile.mastersInstitute || '',
    mastersYear: profile.mastersYear || '',
    mastersSubject: profile.mastersSubject || '',
    mastersResult: profile.mastersResult || '',
    mastersDuration: profile.mastersDuration || '',

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
      formData.hscExam,
      formData.hscRoll,
      formData.gradExam,
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
    updateProfile({
      ...formData,
      skills: skillsList,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const savedJobsList = (jobs || []).filter((j) => (profile?.savedJobs || []).includes(j.id));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProfileBanner
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        formData={formData}
        applicationsCount={applications.length}
        savedJobsCount={savedJobsList.length}
      />

      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>প্রার্থী রেজিস্ট্রেশন প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!</span>
        </div>
      )}

      {activeSubTab === 'profile' && (
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
