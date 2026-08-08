/**
 * ShafinBD Teletalk Form Selectors & Field Dictionary (v4 Enterprise)
 * Comprehensive Field Mappings with Field Types, Priorities, Domain Overrides,
 * Table Structure Patterns, Placeholders, and Bengali/English Labels.
 */

window.TELETALK_FIELD_MAP = {
  version: 4,

  // Domain Overrides for specific Teletalk subdomains
  SITE_OVERRIDES: {
    'police.teletalk.com.bd': {
      applicantName: {
        type: 'input',
        selectors: [
          { selector: '#txtApplicantName', priority: 100 },
          { selector: 'input[name="applicant_name"]', priority: 90 }
        ]
      }
    },
    'dgfood.teletalk.com.bd': {
      applicantName: {
        type: 'input',
        selectors: [
          { selector: '#appName', priority: 100 },
          { selector: 'input[name="appName"]', priority: 90 }
        ]
      }
    },
    'dpe.teletalk.com.bd': {
      applicantName: {
        type: 'input',
        selectors: [
          { selector: '#applicantName', priority: 100 },
          { selector: 'input[name="applicantName"]', priority: 90 }
        ]
      }
    },
    'bpsc.teletalk.com.bd': {
      applicantName: {
        type: 'input',
        selectors: [
          { selector: '#cand_name', priority: 100 },
          { selector: 'input[name="cand_name"]', priority: 90 }
        ]
      }
    }
  },

  // Field Dictionary with types, priorities, placeholders, and label fallbacks
  fields: {
    // Basic Info
    applicantName: {
      type: 'input',
      required: true,
      labels: ['applicant name', 'name of applicant', 'candidate name', 'applicant\'s name', 'আবেদনকারীর নাম', 'প্রার্থীর নাম'],
      placeholders: ['applicant name', 'candidate name', 'enter name', 'আবেদনকারীর নাম'],
      selectors: [
        { selector: '#applicant_name', priority: 100 },
        { selector: '#txtApplicantName', priority: 98 },
        { selector: '#appName', priority: 96 },
        { selector: 'input[name*="applicant_name" i]', priority: 90 },
        { selector: 'input[id*="applicant_name" i]', priority: 85 },
        { selector: 'input[name="name"]', priority: 80 },
        { selector: 'input[name*="name" i]:not([name*="bangla"]):not([name*="bn"]):not([name*="father"]):not([name*="mother"]):not([name*="post"]):not([name*="inst"])', priority: 50 }
      ]
    },
    applicantNameBangla: {
      type: 'input',
      labels: ['applicant name (bangla)', 'name in bangla', 'applicant name in bangla', 'আবেদনকারীর নাম (বাংলা)', 'প্রার্থীর নাম (বাংলা)'],
      placeholders: ['বাংলায় নাম', 'আবেদনকারীর নাম (বাংলা)'],
      selectors: [
        { selector: 'input[name*="name_bn" i]', priority: 95 },
        { selector: 'input[name*="applicant_name_bangla" i]', priority: 92 },
        { selector: 'input[name*="name_bangla" i]', priority: 88 },
        { selector: 'input[name*="bangla_name" i]', priority: 85 }
      ]
    },
    fatherName: {
      type: 'input',
      required: true,
      labels: ["father's name", 'father name', 'fathers name', 'পিতার নাম', 'বাবার নাম'],
      placeholders: ["father's name", 'father name', 'পিতার নাম'],
      selectors: [
        { selector: '#father_name', priority: 100 },
        { selector: '#txtFatherName', priority: 98 },
        { selector: 'input[name*="father_name" i]:not([name*="bangla"]):not([name*="bn"])', priority: 90 },
        { selector: 'input[id*="father_name" i]', priority: 85 }
      ]
    },
    fatherNameBangla: {
      type: 'input',
      labels: ["father's name (bangla)", 'father name in bangla', 'পিতার নাম (বাংলা)'],
      placeholders: ['পিতার নাম (বাংলা)'],
      selectors: [
        { selector: 'input[name*="father_name_bn" i]', priority: 95 },
        { selector: 'input[name*="father_name_bangla" i]', priority: 90 },
        { selector: 'input[name*="father_bn" i]', priority: 85 }
      ]
    },
    motherName: {
      type: 'input',
      required: true,
      labels: ["mother's name", 'mother name', 'mothers name', 'মাতার নাম', 'মায়ের নাম'],
      placeholders: ["mother's name", 'mother name', 'মাতার নাম'],
      selectors: [
        { selector: '#mother_name', priority: 100 },
        { selector: '#txtMotherName', priority: 98 },
        { selector: 'input[name*="mother_name" i]:not([name*="bangla"]):not([name*="bn"])', priority: 90 },
        { selector: 'input[id*="mother_name" i]', priority: 85 }
      ]
    },
    motherNameBangla: {
      type: 'input',
      labels: ["mother's name (bangla)", 'mother name in bangla', 'মাতার নাম (বাংলা)'],
      placeholders: ['মাতার নাম (বাংলা)'],
      selectors: [
        { selector: 'input[name*="mother_name_bn" i]', priority: 95 },
        { selector: 'input[name*="mother_name_bangla" i]', priority: 90 },
        { selector: 'input[name*="mother_bn" i]', priority: 85 }
      ]
    },
    dob: {
      type: 'input',
      required: true,
      labels: ['date of birth', 'dob', 'date_of_birth', 'birth date', 'জন্ম তারিখ'],
      placeholders: ['dd/mm/yyyy', 'yyyy-mm-dd', 'dob', 'জন্ম তারিখ'],
      selectors: [
        { selector: '#dob', priority: 100 },
        { selector: 'input[name*="dob" i]', priority: 90 },
        { selector: 'input[name*="date_of_birth" i]', priority: 85 },
        { selector: 'input[type="date"]', priority: 70 }
      ]
    },
    nationality: {
      type: 'select',
      labels: ['nationality', 'জাতীয়তা'],
      selectors: [
        { selector: '#nationality', priority: 100 },
        { selector: 'select[name*="nationality" i]', priority: 90 },
        { selector: 'select[id*="nationality" i]', priority: 85 }
      ]
    },
    religion: {
      type: 'select',
      labels: ['religion', 'ধর্ম'],
      selectors: [
        { selector: '#religion', priority: 100 },
        { selector: 'select[name*="religion" i]', priority: 90 },
        { selector: 'select[id*="religion" i]', priority: 85 }
      ]
    },
    gender: {
      type: 'select',
      labels: ['gender', 'sex', 'লিঙ্গ'],
      selectors: [
        { selector: '#gender', priority: 100 },
        { selector: '#sex', priority: 98 },
        { selector: 'select[name*="gender" i]', priority: 90 },
        { selector: 'select[name*="sex" i]', priority: 88 },
        { selector: 'select[id*="gender" i]', priority: 85 }
      ]
    },
    maritalStatus: {
      type: 'select',
      labels: ['marital status', 'marital_status', 'বৈবাহিক অবস্থা'],
      selectors: [
        { selector: '#marital_status', priority: 100 },
        { selector: 'select[name*="marital_status" i]', priority: 90 },
        { selector: 'select[name*="marital" i]', priority: 88 },
        { selector: 'select[id*="marital" i]', priority: 85 }
      ]
    },
    spouseName: {
      type: 'input',
      labels: ["spouse's name", 'spouse name', 'spouse_name', 'স্বামী/স্ত্রীর নাম', 'স্বামী বা স্ত্রীর নাম', 'স্ত্রীর নাম', 'স্বামীর নাম'],
      placeholders: ["spouse name", "spouse's name", 'স্বামী/স্ত্রীর নাম'],
      selectors: [
        { selector: '#spouse_name', priority: 100 },
        { selector: '#txtSpouseName', priority: 98 },
        { selector: 'input[name*="spouse" i]', priority: 90 },
        { selector: 'input[id*="spouse" i]', priority: 85 }
      ]
    },
    phone: {
      type: 'input',
      required: true,
      labels: ['mobile number', 'mobile no', 'phone number', 'contact no', 'মোবাইল নম্বর', 'মোবাইল নং'],
      placeholders: ['017xxxxxxxx', 'mobile number', 'মোবাইল নম্বর'],
      selectors: [
        { selector: '#mobile', priority: 100 },
        { selector: '#mobile_no', priority: 98 },
        { selector: 'input[name*="mobile" i]:not([name*="confirm"])', priority: 90 },
        { selector: 'input[name*="phone" i]:not([name*="alt"]):not([name*="confirm"])', priority: 80 }
      ]
    },
    confirmPhone: {
      type: 'input',
      labels: ['confirm mobile', 're-type mobile', 'confirm phone', 'মোবাইল নম্বর পুনরায় নিশ্চিত করুন', 'কনফার্ম মোবাইল'],
      placeholders: ['confirm mobile', 'পুনরায় মোবাইল নম্বর'],
      selectors: [
        { selector: '#confirm_mobile', priority: 100 },
        { selector: 'input[name*="confirm_mobile" i]', priority: 90 },
        { selector: 'input[name*="confirm_phone" i]', priority: 85 },
        { selector: 'input[name*="re_mobile" i]', priority: 80 }
      ]
    },
    email: {
      type: 'input',
      labels: ['email address', 'email id', 'e-mail', 'ইমেইল'],
      placeholders: ['example@mail.com', 'email address', 'ইমেইল'],
      selectors: [
        { selector: '#email', priority: 100 },
        { selector: 'input[name*="email" i]', priority: 90 },
        { selector: 'input[type="email"]', priority: 85 }
      ]
    },
    quota: {
      type: 'select',
      labels: ['quota', 'কোটা'],
      selectors: [
        { selector: '#quota', priority: 100 },
        { selector: 'select[name*="quota" i]', priority: 90 }
      ]
    },
    deptStatus: {
      type: 'select',
      labels: ['departmental status', 'department candidate', 'বিভাগীয় প্রার্থীর অবস্থা'],
      selectors: [
        { selector: '#dept_status', priority: 100 },
        { selector: 'select[name*="dept" i]', priority: 90 },
        { selector: 'select[name*="departmental" i]', priority: 85 }
      ]
    },

    // Identity Toggles & Numbers
    hasNid: {
      type: 'select',
      labels: ['national id', 'nid status', 'এনআইডি আছে কি না', 'জাতীয় পরিচয়পত্র'],
      selectors: [
        { selector: '#has_nid', priority: 100 },
        { selector: 'select[name*="nid" i]:not([name*="no" i]):not([name*="number" i])', priority: 90 }
      ]
    },
    nidNumber: {
      type: 'input',
      labels: ['national id no', 'nid no', 'nid number', 'এনআইডি নম্বর', 'জাতীয় পরিচয়পত্র নং'],
      placeholders: ['nid number', '১০, ১৩ বা ১৭ ডিজিট'],
      selectors: [
        { selector: '#nid_no', priority: 100 },
        { selector: 'input[name*="nid_no" i]', priority: 90 },
        { selector: 'input[name*="nid_number" i]', priority: 88 },
        { selector: 'input[name*="nid" i]:not([name*="has"]):not([name*="status"])', priority: 80 }
      ]
    },
    hasBirthReg: {
      type: 'select',
      labels: ['birth registration', 'breg status', 'জন্ম নিবন্ধন আছে কি না'],
      selectors: [
        { selector: '#has_breg', priority: 100 },
        { selector: 'select[name*="breg" i]:not([name*="no" i])', priority: 90 }
      ]
    },
    birthRegNumber: {
      type: 'input',
      labels: ['birth reg no', 'birth registration number', 'জন্ম নিবন্ধন নম্বর'],
      placeholders: ['birth registration no', '১৭ ডিজিট'],
      selectors: [
        { selector: '#breg_no', priority: 100 },
        { selector: 'input[name*="breg_no" i]', priority: 90 },
        { selector: 'input[name*="birth_reg" i]', priority: 85 }
      ]
    },
    hasPassport: {
      type: 'select',
      labels: ['passport status', 'has passport', 'পাসপোর্ট আছে কি না'],
      selectors: [
        { selector: '#has_passport', priority: 100 },
        { selector: 'select[name*="passport" i]:not([name*="no" i])', priority: 90 }
      ]
    },
    passportNumber: {
      type: 'input',
      labels: ['passport no', 'passport number', 'পাসপোর্ট নম্বর'],
      placeholders: ['passport number', 'পাসপোর্ট নম্বর'],
      selectors: [
        { selector: '#passport_no', priority: 100 },
        { selector: 'input[name*="passport_no" i]', priority: 90 },
        { selector: 'input[name*="passport_number" i]', priority: 85 }
      ]
    },

    // Present Address
    presentCareOf: {
      type: 'input',
      labels: ['care of', 'c/o', 'অভিভাবকের নাম / কেয়ার অফ'],
      placeholders: ['care of', 'কেয়ার অফ'],
      selectors: [
        { selector: '#care_of', priority: 100 },
        { selector: 'input[name*="care_of" i]:not([name*="perm"])', priority: 90 },
        { selector: 'input[name*="present_care" i]', priority: 88 }
      ]
    },
    presentVillage: {
      type: 'input',
      labels: ['village/town/road', 'village / road', 'গ্রাম / রাস্তা'],
      placeholders: ['village/road/house', 'গ্রাম/রাস্তা'],
      selectors: [
        { selector: '#village', priority: 100 },
        { selector: 'input[name*="village" i]:not([name*="perm"])', priority: 90 },
        { selector: 'input[name*="present_village" i]', priority: 88 }
      ]
    },
    presentDistrict: {
      type: 'select',
      labels: ['district', 'জেলা'],
      selectors: [
        { selector: '#district', priority: 100 },
        { selector: 'select[name*="district" i]:not([name*="perm"])', priority: 90 },
        { selector: 'select[name*="present_district" i]', priority: 88 }
      ]
    },
    presentUpazila: {
      type: 'select',
      labels: ['upazila/thana', 'upazila', 'thana', 'উপজেলা / থানা'],
      selectors: [
        { selector: '#upazila', priority: 100 },
        { selector: 'select[name*="upazila" i]:not([name*="perm"])', priority: 90 },
        { selector: 'select[name*="thana" i]:not([name*="perm"])', priority: 88 },
        { selector: 'select[name*="present_upazila" i]', priority: 85 }
      ]
    },
    presentPostOffice: {
      type: 'input',
      labels: ['post office', 'ডাকঘর'],
      placeholders: ['post office', 'ডাকঘর'],
      selectors: [
        { selector: '#post_office', priority: 100 },
        { selector: 'input[name*="post_office" i]:not([name*="perm"])', priority: 90 },
        { selector: 'input[name*="present_post_office" i]', priority: 88 }
      ]
    },
    presentPostCode: {
      type: 'input',
      labels: ['post code', 'postal code', 'পোস্ট কোড'],
      placeholders: ['post code', 'পোস্ট কোড'],
      selectors: [
        { selector: '#post_code', priority: 100 },
        { selector: 'input[name*="post_code" i]:not([name*="perm"])', priority: 90 },
        { selector: 'input[name*="postal_code" i]:not([name*="perm"])', priority: 85 }
      ]
    },

    // Permanent Address
    permCareOf: {
      type: 'input',
      labels: ['permanent care of', 'perm care of', 'স্থায়ী অভিভাবক'],
      selectors: [
        { selector: '#perm_care_of', priority: 100 },
        { selector: 'input[name*="perm_care" i]', priority: 90 },
        { selector: 'input[name*="permanent_care" i]', priority: 88 }
      ]
    },
    permVillage: {
      type: 'input',
      labels: ['permanent village', 'perm village', 'স্থায়ী গ্রাম / রাস্তা'],
      selectors: [
        { selector: '#perm_village', priority: 100 },
        { selector: 'input[name*="perm_village" i]', priority: 90 },
        { selector: 'input[name*="permanent_village" i]', priority: 88 }
      ]
    },
    permDistrict: {
      type: 'select',
      labels: ['permanent district', 'perm district', 'স্থায়ী জেলা'],
      selectors: [
        { selector: '#perm_district', priority: 100 },
        { selector: 'select[name*="perm_district" i]', priority: 90 },
        { selector: 'select[name*="permanent_district" i]', priority: 88 }
      ]
    },
    permUpazila: {
      type: 'select',
      labels: ['permanent upazila', 'perm upazila', 'স্থায়ী উপজেলা / থানা'],
      selectors: [
        { selector: '#perm_upazila', priority: 100 },
        { selector: 'select[name*="perm_upazila" i]', priority: 90 },
        { selector: 'select[name*="perm_thana" i]', priority: 88 }
      ]
    },
    permPostOffice: {
      type: 'input',
      labels: ['permanent post office', 'perm post office', 'স্থায়ী ডাকঘর'],
      selectors: [
        { selector: '#perm_post_office', priority: 100 },
        { selector: 'input[name*="perm_post_office" i]', priority: 90 }
      ]
    },
    permPostCode: {
      type: 'input',
      labels: ['permanent post code', 'perm post code', 'স্থায়ী পোস্ট কোড'],
      selectors: [
        { selector: '#perm_post_code', priority: 100 },
        { selector: 'input[name*="perm_post_code" i]', priority: 90 }
      ]
    },

    // Academic SSC
    sscExam: {
      type: 'select',
      labels: ['ssc examination', 'ssc exam', 'এসএসসি পরীক্ষা'],
      selectors: [
        { selector: '#ssc_exam', priority: 100 },
        { selector: 'select[name*="ssc_exam" i]', priority: 90 },
        { selector: 'select[name*="ssc_name" i]', priority: 85 }
      ]
    },
    sscBoard: {
      type: 'select',
      labels: ['ssc board', 'এসএসসি বোর্ড'],
      selectors: [
        { selector: '#ssc_board', priority: 100 },
        { selector: 'select[name*="ssc_board" i]', priority: 90 }
      ]
    },
    sscRoll: {
      type: 'input',
      labels: ['ssc roll', 'ssc roll no', 'এসএসসি রোল'],
      selectors: [
        { selector: '#ssc_roll', priority: 100 },
        { selector: 'input[name*="ssc_roll" i]', priority: 90 }
      ]
    },
    sscReg: {
      type: 'input',
      labels: ['ssc reg', 'ssc registration no', 'এসএসসি রেজিস্ট্রেশন'],
      selectors: [
        { selector: '#ssc_reg', priority: 100 },
        { selector: 'input[name*="ssc_reg" i]', priority: 90 }
      ]
    },
    sscGroup: {
      type: 'select',
      labels: ['ssc group', 'ssc subject', 'এসএসসি গ্রুপ / বিভাগ'],
      selectors: [
        { selector: '#ssc_group', priority: 100 },
        { selector: 'select[name*="ssc_group" i]', priority: 90 },
        { selector: 'select[name*="ssc_subject" i]', priority: 85 }
      ]
    },
    sscResult: {
      type: 'select',
      labels: ['ssc result', 'ssc gpa', 'এসএসসি ফলাফল'],
      selectors: [
        { selector: '#ssc_result', priority: 100 },
        { selector: 'select[name*="ssc_result" i]', priority: 90 }
      ]
    },
    sscGpaPoint: {
      type: 'input',
      labels: ['ssc gpa point', 'ssc gpa', 'ssc cgpa', 'প্রাপ্ত জিপিএ (এসএসসি)'],
      placeholders: ['gpa', '5.00', 'প্রাপ্ত জিপিএ'],
      selectors: [
        { selector: '#ssc_gpa', priority: 100 },
        { selector: '#ssc_cgpa', priority: 98 },
        { selector: 'input[name*="ssc_gpa" i]', priority: 90 },
        { selector: 'input[name*="ssc_cgpa" i]', priority: 88 }
      ]
    },
    sscYear: {
      type: 'select',
      labels: ['ssc passing year', 'ssc year', 'এসএসসি পাসের সন'],
      selectors: [
        { selector: '#ssc_year', priority: 100 },
        { selector: 'select[name*="ssc_year" i]', priority: 90 },
        { selector: 'select[name*="ssc_pass_year" i]', priority: 85 }
      ]
    },

    // Academic HSC
    hscExam: {
      type: 'select',
      labels: ['hsc examination', 'hsc exam', 'এইচএসসি পরীক্ষা'],
      selectors: [
        { selector: '#hsc_exam', priority: 100 },
        { selector: 'select[name*="hsc_exam" i]', priority: 90 }
      ]
    },
    hscBoard: {
      type: 'select',
      labels: ['hsc board', 'এইচএসসি বোর্ড'],
      selectors: [
        { selector: '#hsc_board', priority: 100 },
        { selector: 'select[name*="hsc_board" i]', priority: 90 }
      ]
    },
    hscRoll: {
      type: 'input',
      labels: ['hsc roll', 'hsc roll no', 'এইচএসসি রোল'],
      selectors: [
        { selector: '#hsc_roll', priority: 100 },
        { selector: 'input[name*="hsc_roll" i]', priority: 90 }
      ]
    },
    hscReg: {
      type: 'input',
      labels: ['hsc reg', 'hsc registration no', 'এইচএসসি রেজিস্ট্রেশন'],
      selectors: [
        { selector: '#hsc_reg', priority: 100 },
        { selector: 'input[name*="hsc_reg" i]', priority: 90 }
      ]
    },
    hscGroup: {
      type: 'select',
      labels: ['hsc group', 'hsc subject', 'এইচএসসি গ্রুপ / বিভাগ'],
      selectors: [
        { selector: '#hsc_group', priority: 100 },
        { selector: 'select[name*="hsc_group" i]', priority: 90 }
      ]
    },
    hscResult: {
      type: 'select',
      labels: ['hsc result', 'hsc gpa', 'এইচএসসি ফলাফল'],
      selectors: [
        { selector: '#hsc_result', priority: 100 },
        { selector: 'select[name*="hsc_result" i]', priority: 90 }
      ]
    },
    hscGpaPoint: {
      type: 'input',
      labels: ['hsc gpa point', 'hsc gpa', 'hsc cgpa', 'প্রাপ্ত জিপিএ (এইচএসসি)'],
      placeholders: ['gpa', '5.00', 'প্রাপ্ত জিপিএ'],
      selectors: [
        { selector: '#hsc_gpa', priority: 100 },
        { selector: '#hsc_cgpa', priority: 98 },
        { selector: 'input[name*="hsc_gpa" i]', priority: 90 },
        { selector: 'input[name*="hsc_cgpa" i]', priority: 88 }
      ]
    },
    hscYear: {
      type: 'select',
      labels: ['hsc passing year', 'hsc year', 'এইচএসসি পাসের সন'],
      selectors: [
        { selector: '#hsc_year', priority: 100 },
        { selector: 'select[name*="hsc_year" i]', priority: 90 }
      ]
    },

    // Academic Graduation
    gradExam: {
      type: 'select',
      labels: ['graduation examination', 'graduation degree', 'স্নাতক / ডিগ্রী পরীক্ষা'],
      selectors: [
        { selector: '#grad_exam', priority: 100 },
        { selector: 'select[name*="grad_exam" i]', priority: 90 }
      ]
    },
    gradSubject: {
      type: 'select',
      labels: ['graduation subject', 'graduation discipline', 'স্নাতকের বিষয়'],
      selectors: [
        { selector: '#grad_subject', priority: 100 },
        { selector: 'select[name*="grad_subject" i]', priority: 90 }
      ]
    },
    gradInstitute: {
      type: 'input',
      labels: ['graduation university', 'institute name', 'বিশ্ববিদ্যালয় / প্রতিষ্ঠানের নাম'],
      selectors: [
        { selector: '#grad_inst', priority: 100 },
        { selector: 'select[name*="grad_university" i]', priority: 90 },
        { selector: 'input[name*="grad_inst" i]', priority: 85 }
      ]
    },
    gradResult: {
      type: 'select',
      labels: ['graduation result', 'graduation cgpa', 'স্নাতকের ফলাফল'],
      selectors: [
        { selector: '#grad_result', priority: 100 },
        { selector: 'select[name*="grad_result" i]', priority: 90 }
      ]
    },
    gradGpaPoint: {
      type: 'input',
      labels: ['graduation cgpa point', 'grad cgpa', 'graduation gpa', 'প্রাপ্ত সিজিপিএ'],
      placeholders: ['cgpa', '4.00', 'প্রাপ্ত সিজিপিএ'],
      selectors: [
        { selector: '#grad_cgpa', priority: 100 },
        { selector: '#grad_gpa', priority: 98 },
        { selector: 'input[name*="grad_cgpa" i]', priority: 90 },
        { selector: 'input[name*="grad_gpa" i]', priority: 88 }
      ]
    },
    gradYear: {
      type: 'select',
      labels: ['graduation passing year', 'grad year', 'স্নাতক পাসের সন'],
      selectors: [
        { selector: '#grad_year', priority: 100 },
        { selector: 'select[name*="grad_year" i]', priority: 90 }
      ]
    },
    gradDuration: {
      type: 'select',
      labels: ['course duration', 'grad duration', 'কোর্সের মেয়াদ'],
      selectors: [
        { selector: '#grad_duration', priority: 100 },
        { selector: 'select[name*="grad_duration" i]', priority: 90 }
      ]
    },

    // Academic Masters
    mastersExam: {
      type: 'select',
      labels: ['masters examination', 'masters degree', 'মাস্টার্স পরীক্ষা'],
      selectors: [
        { selector: '#masters_exam', priority: 100 },
        { selector: 'select[name*="masters_exam" i]', priority: 90 }
      ]
    },
    mastersSubject: {
      type: 'select',
      labels: ['masters subject', 'masters discipline', 'মাস্টার্সের বিষয়'],
      selectors: [
        { selector: '#masters_subject', priority: 100 },
        { selector: 'select[name*="masters_subject" i]', priority: 90 }
      ]
    },
    mastersInstitute: {
      type: 'input',
      labels: ['masters university', 'masters institute name', 'মাস্টার্স বিশ্ববিদ্যালয়'],
      selectors: [
        { selector: '#masters_inst', priority: 100 },
        { selector: 'select[name*="masters_university" i]', priority: 90 },
        { selector: 'input[name*="masters_inst" i]', priority: 85 }
      ]
    },
    mastersResult: {
      type: 'select',
      labels: ['masters result', 'masters cgpa', 'মাস্টার্সের ফলাফল'],
      selectors: [
        { selector: '#masters_result', priority: 100 },
        { selector: 'select[name*="masters_result" i]', priority: 90 }
      ]
    },
    mastersGpaPoint: {
      type: 'input',
      labels: ['masters cgpa point', 'masters cgpa', 'masters gpa'],
      placeholders: ['cgpa', '4.00'],
      selectors: [
        { selector: '#masters_cgpa', priority: 100 },
        { selector: '#masters_gpa', priority: 98 },
        { selector: 'input[name*="masters_cgpa" i]', priority: 90 },
        { selector: 'input[name*="masters_gpa" i]', priority: 88 }
      ]
    },
    mastersYear: {
      type: 'select',
      labels: ['masters passing year', 'masters year', 'মাস্টার্স পাসের সন'],
      selectors: [
        { selector: '#masters_year', priority: 100 },
        { selector: 'select[name*="masters_year" i]', priority: 90 }
      ]
    },
    mastersDuration: {
      type: 'select',
      labels: ['masters course duration', 'masters duration', 'কোর্সের মেয়াদ'],
      selectors: [
        { selector: '#masters_duration', priority: 100 },
        { selector: 'select[name*="masters_duration" i]', priority: 90 }
      ]
    },

    // File Uploads
    photoInput: {
      type: 'file',
      labels: ['photo', 'applicant photo', 'আবেদনকারীর ছবি'],
      selectors: [
        { selector: 'input[type="file"][name*="photo" i]', priority: 100 },
        { selector: 'input[type="file"][id*="photo" i]', priority: 90 }
      ]
    },
    signatureInput: {
      type: 'file',
      labels: ['signature', 'applicant signature', 'আবেদনকারীর স্বাক্ষর'],
      selectors: [
        { selector: 'input[type="file"][name*="signature" i]', priority: 100 },
        { selector: 'input[type="file"][id*="signature" i]', priority: 90 },
        { selector: 'input[type="file"][name*="sig" i]', priority: 80 }
      ]
    }
  },

  // Helper method to retrieve resolved configuration for current domain
  getFieldConfig: function (fieldKey, domain) {
    const defaultField = this.fields[fieldKey];
    if (!defaultField) return null;

    if (domain && this.SITE_OVERRIDES[domain] && this.SITE_OVERRIDES[domain][fieldKey]) {
      const override = this.SITE_OVERRIDES[domain][fieldKey];
      return {
        ...defaultField,
        ...override,
        selectors: (override.selectors || defaultField.selectors).sort((a, b) => (b.priority || 0) - (a.priority || 0))
      };
    }

    return {
      ...defaultField,
      selectors: (defaultField.selectors || []).slice().sort((a, b) => (b.priority || 0) - (a.priority || 0))
    };
  }
};

