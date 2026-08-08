/**
 * ShafinBD Teletalk AutoFill Engine (v3 Enterprise)
 * Priority-based selector matching with domain overrides, label text fallbacks, validator/formatter integration, and rich reporting
 */

// Structured Logger Utility
window.ShafinBDLogger = {
  enabled: true,
  info: function (...args) { if (this.enabled) console.log('[ShafinBD Engine]', ...args); },
  warn: function (...args) { if (this.enabled) console.warn('[ShafinBD Engine]', ...args); },
  error: function (...args) { if (this.enabled) console.error('[ShafinBD Engine]', ...args); }
};

window.ShafinBDAutoFillEngine = {
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  // Master Configuration Matrix
  // Format: [fieldKey, profileKey, labelName]
  FIELD_BINDINGS: [
    ['applicantName', 'fullName', 'Applicant Name'],
    ['applicantNameBangla', 'fullNameBangla', 'Applicant Name (Bangla)'],
    ['fatherName', 'fatherName', 'Father Name'],
    ['fatherNameBangla', 'fatherNameBangla', 'Father Name (Bangla)'],
    ['motherName', 'motherName', 'Mother Name'],
    ['motherNameBangla', 'motherNameBangla', 'Mother Name (Bangla)'],
    ['dob', 'dateOfBirth', 'Date of Birth'],
    ['nationality', 'nationality', 'Nationality'],
    ['religion', 'religion', 'Religion'],
    ['gender', 'gender', 'Gender'],
    ['maritalStatus', 'maritalStatus', 'Marital Status'],
    ['spouseName', 'spouseName', 'Spouse Name'],
    ['phone', 'phone', 'Mobile Phone'],
    ['confirmPhone', 'phone', 'Confirm Mobile Phone'],
    ['email', 'email', 'Email Address'],
    ['quota', 'quota', 'Quota'],
    ['deptStatus', 'deptStatus', 'Departmental Status'],

    // Addresses
    ['presentCareOf', 'careOf', 'Care Of'],
    ['presentVillage', 'villageRoad', 'Village / Road'],
    ['presentPostOffice', 'postOffice', 'Post Office'],
    ['presentPostCode', 'postCode', 'Post Code'],

    // SSC
    ['sscExam', 'sscExam', 'SSC Exam'],
    ['sscBoard', 'sscBoard', 'SSC Board'],
    ['sscRoll', 'sscRoll', 'SSC Roll'],
    ['sscReg', 'sscRegistration', 'SSC Registration'],
    ['sscGroup', 'sscGroup', 'SSC Group'],
    ['sscResult', 'sscResult', 'SSC Result'],
    ['sscGpaPoint', 'sscGpaPoint', 'SSC GPA Point'],
    ['sscYear', 'sscYear', 'SSC Year'],

    // HSC
    ['hscExam', 'hscExam', 'HSC Exam'],
    ['hscBoard', 'hscBoard', 'HSC Board'],
    ['hscRoll', 'hscRoll', 'HSC Roll'],
    ['hscReg', 'hscRegistration', 'HSC Registration'],
    ['hscGroup', 'hscGroup', 'HSC Group'],
    ['hscResult', 'hscResult', 'HSC Result'],
    ['hscGpaPoint', 'hscGpaPoint', 'HSC GPA Point'],
    ['hscYear', 'hscYear', 'HSC Year'],

    // Graduation
    ['gradExam', 'gradExam', 'Graduation Exam'],
    ['gradSubject', 'gradSubject', 'Graduation Subject'],
    ['gradInstitute', 'gradInstitute', 'Graduation Institute'],
    ['gradResult', 'gradResult', 'Graduation Result'],
    ['gradGpaPoint', 'gradGpaPoint', 'Graduation CGPA Point'],
    ['gradYear', 'gradYear', 'Graduation Year'],
    ['gradDuration', 'gradDuration', 'Graduation Duration'],

    // Masters
    ['mastersExam', 'mastersExam', 'Masters Exam'],
    ['mastersSubject', 'mastersSubject', 'Masters Subject'],
    ['mastersInstitute', 'mastersInstitute', 'Masters Institute'],
    ['mastersResult', 'mastersResult', 'Masters Result'],
    ['mastersGpaPoint', 'mastersGpaPoint', 'Masters CGPA Point'],
    ['mastersYear', 'mastersYear', 'Masters Year'],
    ['mastersDuration', 'mastersDuration', 'Masters Duration']
  ],

  // Trigger standard DOM events for framework form state synchronization
  triggerEvents: (el) => {
    if (!el) return;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  },

  // Enterprise Multi-Layer Smart Field Detector & Element Resolver
  findElement: function (fieldKey) {
    const domain = window.location.hostname;
    const config = window.TELETALK_FIELD_MAP.getFieldConfig ? window.TELETALK_FIELD_MAP.getFieldConfig(fieldKey, domain) : null;

    if (!config) return null;

    // Layer 1: Priority-sorted CSS Selectors matching
    if (config.selectors && Array.isArray(config.selectors)) {
      for (const item of config.selectors) {
        const selStr = typeof item === 'string' ? item : item.selector;
        if (!selStr) continue;
        const el = document.querySelector(selStr);
        if (el) return { element: el, type: config.type || 'input', source: 'CSS Selector' };
      }
    }

    const labelTexts = (config.labels || []).map(l => l.toLowerCase());
    const placeholderTexts = (config.placeholders || []).map(p => p.toLowerCase());

    // Layer 2: Explicit <label> or htmlFor matching
    if (labelTexts.length > 0) {
      const explicitLabels = document.querySelectorAll('label');
      for (const lbl of explicitLabels) {
        const txt = lbl.textContent ? lbl.textContent.trim().toLowerCase() : '';
        if (labelTexts.some(lt => txt.includes(lt))) {
          let targetEl = null;
          if (lbl.htmlFor) {
            targetEl = document.getElementById(lbl.htmlFor);
          }
          if (!targetEl) {
            targetEl = lbl.querySelector('input, select, textarea');
          }
          if (targetEl) {
            window.ShafinBDLogger.info(`Found element for ${fieldKey} via <label> text match`);
            return { element: targetEl, type: config.type || 'input', source: 'Label Tag' };
          }
        }
      }

      // Layer 3: Teletalk Table Cell Structure Matching (<tr><td class="label">Name</td><td><input></td></tr>)
      const tableCells = document.querySelectorAll('td, th');
      for (const cell of tableCells) {
        const txt = cell.textContent ? cell.textContent.trim().toLowerCase() : '';
        if (labelTexts.some(lt => txt.includes(lt))) {
          // Check inside current cell
          let targetEl = cell.querySelector('input, select, textarea');
          // Check next sibling cell in table row
          if (!targetEl && cell.nextElementSibling) {
            targetEl = cell.nextElementSibling.querySelector('input, select, textarea');
            if (!targetEl && ['INPUT', 'SELECT', 'TEXTAREA'].includes(cell.nextElementSibling.tagName)) {
              targetEl = cell.nextElementSibling;
            }
          }
          // Check parent row's remaining cells
          if (!targetEl && cell.parentElement && cell.parentElement.tagName === 'TR') {
            const rowCells = cell.parentElement.children;
            for (let i = 0; i < rowCells.length; i++) {
              if (rowCells[i] !== cell) {
                targetEl = rowCells[i].querySelector('input, select, textarea');
                if (targetEl) break;
              }
            }
          }
          if (targetEl) {
            window.ShafinBDLogger.info(`Found element for ${fieldKey} via Table Cell structure match`);
            return { element: targetEl, type: config.type || 'input', source: 'Table Cell' };
          }
        }
      }

      // Layer 4: Preceding Sibling / Parent Container text scanning (span, div, b, font)
      const textContainers = document.querySelectorAll('span, div, b, strong, font');
      for (const container of textContainers) {
        // Skip large wrappers with many child elements
        if (container.children.length > 3) continue;
        const txt = container.textContent ? container.textContent.trim().toLowerCase() : '';
        if (labelTexts.some(lt => txt.includes(lt))) {
          let targetEl = container.querySelector('input, select, textarea') ||
            container.nextElementSibling?.querySelector('input, select, textarea') ||
            (container.nextElementSibling && ['INPUT', 'SELECT', 'TEXTAREA'].includes(container.nextElementSibling.tagName) ? container.nextElementSibling : null);
          if (targetEl) {
            window.ShafinBDLogger.info(`Found element for ${fieldKey} via Container text match`);
            return { element: targetEl, type: config.type || 'input', source: 'Container Text' };
          }
        }
      }
    }

    // Layer 5: Placeholder, Title, & Aria-Label attribute matching
    const inputs = document.querySelectorAll('input, select, textarea');
    for (const el of inputs) {
      const ph = el.getAttribute('placeholder') ? el.getAttribute('placeholder').toLowerCase() : '';
      const title = el.getAttribute('title') ? el.getAttribute('title').toLowerCase() : '';
      const aria = el.getAttribute('aria-label') ? el.getAttribute('aria-label').toLowerCase() : '';

      if (placeholderTexts.length > 0 && placeholderTexts.some(p => ph.includes(p))) {
        window.ShafinBDLogger.info(`Found element for ${fieldKey} via Placeholder match`);
        return { element: el, type: config.type || 'input', source: 'Placeholder' };
      }
      if (labelTexts.length > 0 && labelTexts.some(l => title.includes(l) || aria.includes(l))) {
        window.ShafinBDLogger.info(`Found element for ${fieldKey} via Title/Aria-label match`);
        return { element: el, type: config.type || 'input', source: 'Title/Aria' };
      }
    }

    // Layer 6: Fuzzy Attribute Regex matching on id / name
    const keyLower = fieldKey.toLowerCase();
    for (const el of inputs) {
      const id = el.id ? el.id.toLowerCase() : '';
      const name = el.name ? el.name.toLowerCase() : '';
      if ((id && id.includes(keyLower)) || (name && name.includes(keyLower))) {
        window.ShafinBDLogger.info(`Found element for ${fieldKey} via Fuzzy ID/Name match`);
        return { element: el, type: config.type || 'input', source: 'Fuzzy Attribute' };
      }
    }

    return null;
  },

  // Set input or textarea value
  setInputValue: function (fieldKey, value) {
    if (!value) return false;
    const res = this.findElement(fieldKey);
    if (!res || !res.element) return false;

    const el = res.element;
    const formattedVal = window.ShafinBDFormatter ? window.ShafinBDFormatter.cleanText(value) : value;
    el.value = formattedVal;
    this.triggerEvents(el);
    el.style.border = '2px solid #10b981';
    el.style.backgroundColor = '#f0fdf4';
    return true;
  },

  // Select option in dropdown by value or text
  setSelectValue: function (fieldKey, textOrVal) {
    if (!textOrVal) return false;
    const res = this.findElement(fieldKey);
    if (!res || !res.element || res.element.tagName !== 'SELECT') return false;

    const el = res.element;
    const target = String(textOrVal).trim().toLowerCase();
    let matched = false;

    for (let i = 0; i < el.options.length; i++) {
      const opt = el.options[i];
      const optVal = opt.value.trim().toLowerCase();
      const optText = opt.text.trim().toLowerCase();

      if (optVal === target || optText === target || optText.includes(target) || target.includes(optText)) {
        el.selectedIndex = i;
        matched = true;
        break;
      }
    }

    if (matched) {
      this.triggerEvents(el);
      el.style.border = '2px solid #10b981';
      el.style.backgroundColor = '#f0fdf4';
    }
    return matched;
  },

  // Wait until dynamic AJAX dropdown options load
  waitUntilOptionsLoaded: async function (selectElement, initialCount = 1, timeoutMs = 3000) {
    if (!selectElement) return false;
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (selectElement.options && selectElement.options.length > initialCount) {
        return true;
      }
      await this.sleep(100);
    }
    return selectElement.options && selectElement.options.length > initialCount;
  },

  // Process conditional identity fields (NID, Birth Reg, Passport)
  processConditionalFields: async function (profile, settings, report) {
    const delay = settings?.conditionalDelayMs || 250;

    // National ID
    if (profile.hasNid || profile.nidNumber) {
      const nidVal = profile.hasNid || (profile.nidNumber ? 'Yes' : 'No');
      if (this.setSelectValue('hasNid', nidVal)) {
        report.filled.push('NID Status');
        if (nidVal === 'Yes') {
          await this.sleep(delay);
          if (profile.nidNumber && this.setInputValue('nidNumber', profile.nidNumber)) {
            report.filled.push('NID Number');
          }
        }
      }
    }

    // Birth Registration
    if (profile.hasBirthReg || profile.birthRegNumber) {
      const bregVal = profile.hasBirthReg || (profile.birthRegNumber ? 'Yes' : 'No');
      if (this.setSelectValue('hasBirthReg', bregVal)) {
        report.filled.push('Birth Reg Status');
        if (bregVal === 'Yes') {
          await this.sleep(delay);
          if (profile.birthRegNumber && this.setInputValue('birthRegNumber', profile.birthRegNumber)) {
            report.filled.push('Birth Reg Number');
          }
        }
      }
    }

    // Passport
    if (profile.hasPassport || profile.passportNumber) {
      const passVal = profile.hasPassport || (profile.passportNumber ? 'Yes' : 'No');
      if (this.setSelectValue('hasPassport', passVal)) {
        report.filled.push('Passport Status');
        if (passVal === 'Yes') {
          await this.sleep(delay);
          if (profile.passportNumber && this.setInputValue('passportNumber', profile.passportNumber)) {
            report.filled.push('Passport Number');
          }
        }
      }
    }
  },

  // Address Cascades
  processCascadingAddresses: async function (profile, settings, report) {
    if (profile.district) {
      const distRes = this.findElement('presentDistrict');
      if (distRes && this.setSelectValue('presentDistrict', profile.district)) {
        report.filled.push('Present District');

        if (profile.upazila) {
          const upRes = this.findElement('presentUpazila');
          if (upRes && upRes.element) {
            const initialCount = upRes.element.options ? upRes.element.options.length : 1;
            await this.waitUntilOptionsLoaded(upRes.element, initialCount, settings?.cascadingDelayMs || 2500);

            if (this.setSelectValue('presentUpazila', profile.upazila)) {
              report.filled.push('Present Upazila/Thana');
            } else {
              report.failed.push('Present Upazila/Thana');
            }
          }
        }
      } else {
        report.failed.push('Present District');
      }
    }

    const permDistVal = profile.permanentDistrict || profile.district;
    if (permDistVal) {
      const permDistRes = this.findElement('permDistrict');
      if (permDistRes && this.setSelectValue('permDistrict', permDistVal)) {
        report.filled.push('Permanent District');

        const permUpVal = profile.permanentUpazila || profile.upazila;
        if (permUpVal) {
          const permUpRes = this.findElement('permUpazila');
          if (permUpRes && permUpRes.element) {
            const initialCount = permUpRes.element.options ? permUpRes.element.options.length : 1;
            await this.waitUntilOptionsLoaded(permUpRes.element, initialCount, settings?.cascadingDelayMs || 2500);

            if (this.setSelectValue('permUpazila', permUpVal)) {
              report.filled.push('Permanent Upazila/Thana');
            } else {
              report.failed.push('Permanent Upazila/Thana');
            }
          }
        }
      }
    }
  },

  // Main Configuration-Driven AutoFill Entrypoint
  fillForm: async function (profile, settings) {
    if (!profile) return { success: false, message: 'প্রোফাইল তথ্য পাওয়া যায়নি' };

    window.ShafinBDLogger.info('Executing AutoFill for candidate:', profile.fullName);

    const report = {
      filled: [],
      skipped: [],
      failed: [],
      validationWarnings: []
    };

    // Pre-flight profile validation
    if (window.ShafinBDValidator) {
      const valResult = window.ShafinBDValidator.validateProfileCompleteness(profile);
      if (!valResult.complete) {
        report.validationWarnings.push(...valResult.issues);
      }
    }

    // Pre-flight media upload check
    if (window.ShafinBDUploader) {
      const mediaRes = window.ShafinBDUploader.inspectMediaInputs(profile);
      if (mediaRes.warnings.length > 0) {
        report.validationWarnings.push(...mediaRes.warnings);
      }
    }

    // Formatted profile phone number
    const formattedPhone = window.ShafinBDFormatter 
      ? window.ShafinBDFormatter.formatPhone(profile.phone || profile.mobile || profile.mobileNumber)
      : (profile.phone || profile.mobile || '');

    const normalizedProfile = {
      ...profile,
      phone: formattedPhone
    };

    // 1. Field Bindings Loop
    for (const [fieldKey, profKey, labelName] of this.FIELD_BINDINGS) {
      const val = normalizedProfile[profKey];

      if (!val) {
        report.skipped.push(labelName);
        continue;
      }

      const res = this.findElement(fieldKey);
      if (!res) continue;

      let success = false;
      if (res.type === 'input') {
        success = this.setInputValue(fieldKey, val);
      } else if (res.type === 'select') {
        success = this.setSelectValue(fieldKey, val);
      }

      if (success) {
        report.filled.push(labelName);
      } else {
        report.failed.push(labelName);
      }
    }

    // 2. Conditional Toggles
    await this.processConditionalFields(normalizedProfile, settings, report);

    // 3. Address Cascades
    await this.processCascadingAddresses(normalizedProfile, settings, report);

    // 4. Media Input Processing (Photo & Signature via Canvas Engine)
    if (window.ShafinBDUploader) {
      const photoRes = this.findElement('photoInput');
      if (photoRes && photoRes.element && normalizedProfile.photoUrl) {
        window.ShafinBDLogger.info('Processing & attaching photo via Canvas Engine...');
        const attachRes = await window.ShafinBDUploader.processAndAttachMedia(photoRes.element, normalizedProfile.photoUrl, 'photo');
        if (attachRes.success) {
          report.filled.push('Applicant Photo (300x300 JPG)');
        } else {
          report.failed.push('Applicant Photo');
          report.validationWarnings.push(`ছবি প্রসেস করা যায়নি: ${attachRes.message}`);
        }
      }

      const sigRes = this.findElement('signatureInput');
      if (sigRes && sigRes.element && normalizedProfile.signatureUrl) {
        window.ShafinBDLogger.info('Processing & attaching signature via Canvas Engine...');
        const attachRes = await window.ShafinBDUploader.processAndAttachMedia(sigRes.element, normalizedProfile.signatureUrl, 'signature');
        if (attachRes.success) {
          report.filled.push('Applicant Signature (300x80 JPG)');
        } else {
          report.failed.push('Applicant Signature');
          report.validationWarnings.push(`স্বাক্ষর প্রসেস করা যায়নি: ${attachRes.message}`);
        }
      }
    }

    const filledCount = report.filled.length;
    window.ShafinBDLogger.info(`Fill completed (${filledCount} fields filled). Warnings:`, report.validationWarnings);

    return {
      success: true,
      filledCount: filledCount,
      report: report,
      message: `ফরম পূরণ সম্পন্ন হয়েছে (${filledCount} টি ফিল্ড)`
    };
  }
};
