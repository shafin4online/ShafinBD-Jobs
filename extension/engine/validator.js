/**
 * ShafinBD Profile & Form Field Validator Module
 * Validates profile data before form filling (Dates, Phones, NID, Passports, Photos)
 */

window.ShafinBDValidator = {
  // Validate Mobile Phone format (BD 11-digit format)
  validatePhone: function (phoneStr) {
    if (!phoneStr) return { valid: false, error: 'মোবাইল নম্বর অনুপস্থিত' };
    const cleaned = String(phoneStr).replace(/[^0-9]/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('01')) {
      return { valid: true, formatted: cleaned };
    }
    if (cleaned.length === 13 && cleaned.startsWith('8801')) {
      return { valid: true, formatted: cleaned.substring(2) };
    }
    return { valid: false, error: `অকার্যকর মোবাইল নম্বর: ${phoneStr}` };
  },

  // Validate National ID (BD NID is 10, 13, or 17 digits)
  validateNid: function (nidStr) {
    if (!nidStr) return { valid: false, error: 'এনআইডি নম্বর অনুপস্থিত' };
    const cleaned = String(nidStr).replace(/[^0-9]/g, '');
    if ([10, 13, 17].includes(cleaned.length)) {
      return { valid: true, formatted: cleaned };
    }
    return { valid: false, error: `এনআইডি নম্বর ১০, ১৩ বা ১৭ ডিজিট হতে হবে (বর্তমান: ${cleaned.length} ডিজিট)` };
  },

  // Validate Date of Birth string format
  validateDob: function (dobStr) {
    if (!dobStr) return { valid: false, error: 'জন্ম তারিখ অনুপস্থিত' };
    const dateObj = new Date(dobStr);
    if (isNaN(dateObj.getTime())) {
      return { valid: false, error: `অকার্যকর তারিখ বিন্যাস: ${dobStr}` };
    }
    return {
      valid: true,
      year: dateObj.getFullYear(),
      month: String(dateObj.getMonth() + 1).padStart(2, '0'),
      day: String(dateObj.getDate()).padStart(2, '0')
    };
  },

  // Validate Profile Completeness
  validateProfileCompleteness: function (profile) {
    const issues = [];

    if (!profile) return { complete: false, score: 0, issues: ['প্রোফাইল তথ্য পাওয়া যায়নি'] };

    if (!profile.fullName) issues.push('আবেদনকারীর পূর্ণ নাম অনুপস্থিত');
    if (!profile.fatherName) issues.push('পিতার নাম অনুপস্থিত');
    if (!profile.motherName) issues.push('মাতার নাম অনুপস্থিত');
    
    const phoneRes = this.validatePhone(profile.phone || profile.mobile);
    if (!phoneRes.valid) issues.push(phoneRes.error);

    const dobRes = this.validateDob(profile.dateOfBirth);
    if (!dobRes.valid) issues.push(dobRes.error);

    if (!profile.photoUrl) issues.push('প্রোফাইলে ছবি (300x300 px) সংযোজিত নেই');
    if (!profile.signatureUrl) issues.push('প্রোফাইলে স্বাক্ষর (300x80 px) সংযোজিত নেই');

    const totalCheckpoints = 7;
    const score = Math.round(((totalCheckpoints - issues.length) / totalCheckpoints) * 100);

    return {
      complete: issues.length === 0,
      score: Math.max(score, 0),
      issues: issues
    };
  }
};
