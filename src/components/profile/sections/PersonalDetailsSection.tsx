import React from 'react';
import { PersonalNoticeBanner } from './PersonalNoticeBanner';
import { PersonalIdentityFields } from './PersonalIdentityFields';
import { PersonalContactFields } from './PersonalContactFields';
import { PersonalDemographicFields } from './PersonalDemographicFields';
import { PersonalIdDocumentFields } from './PersonalIdDocumentFields';

interface PersonalDetailsSectionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  formData,
  updateField,
}) => {
  const isLocked = Boolean(formData.isContactLocked);

  return (
    <div className="space-y-4">
      <PersonalNoticeBanner isLocked={isLocked} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Applicant, Father, Mother names (English & Bangla) */}
        <PersonalIdentityFields
          formData={formData}
          updateField={updateField}
          isLocked={isLocked}
        />

        {/* Date of Birth, Nationality, Religion, Gender */}
        <PersonalDemographicFields
          formData={formData}
          updateField={updateField}
        />

        {/* NID, Birth Reg, Passport ID */}
        <PersonalIdDocumentFields
          formData={formData}
          updateField={updateField}
        />

        {/* Mobile, Confirm Mobile, Email */}
        <PersonalContactFields
          formData={formData}
          updateField={updateField}
          isLocked={isLocked}
        />
      </div>
    </div>
  );
};
