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
    fullName: profile.fullName || authUser?.displayName || '',
    fullNameBangla: profile.fullNameBangla || '',
    email: profile.email || authUser?.email || '',
    phone: profile.phone || '',
    altPhone: profile.altPhone || '',
    title: profile.title || '',
    location: profile.location || 'Bangladesh',
    presentAddress: profile.presentAddress || '',
    permanentAddress: profile.permanentAddress || '',
    fatherName: profile.fatherName || '',
    motherName: profile.motherName || '',
    dateOfBirth: profile.dateOfBirth || '',
    gender: profile.gender || 'Male',
    nidOrPassport: profile.nidOrPassport || '',
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
      formData.email,
      formData.phone,
      formData.title,
      formData.presentAddress,
      formData.permanentAddress,
      formData.fatherName,
      formData.motherName,
      formData.dateOfBirth,
      formData.gender,
      formData.education,
      formData.experience,
      formData.bio,
      formData.expectedSalary,
      formData.resumeFileName,
    ];
    const filledCount = fields.filter((f) => f && f.trim().length > 0).length + (skillsList.length > 0 ? 1 : 0);
    const totalCount = fields.length + 1;
    return Math.round((filledCount / totalCount) * 100);
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
