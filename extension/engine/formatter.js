/**
 * ShafinBD Formatter Module
 * Auto-formats dates, mobile numbers, names, and academic inputs for Teletalk forms
 */

window.ShafinBDFormatter = {
  // Format mobile phone number to standard BD 11-digit format (017XXXXXXXX)
  formatPhone: function (phoneStr) {
    if (!phoneStr) return '';
    const digits = String(phoneStr).replace(/[^0-9]/g, '');
    if (digits.length === 13 && digits.startsWith('8801')) {
      return digits.substring(2);
    }
    if (digits.length === 11 && digits.startsWith('01')) {
      return digits;
    }
    return phoneStr;
  },

  // Format Date string into components or target format
  formatDate: function (dobStr) {
    if (!dobStr) return { day: '', month: '', year: '', formattedISO: '', formattedBD: '' };

    const d = new Date(dobStr);
    if (isNaN(d.getTime())) {
      // Try string parsing (e.g. DD-MM-YYYY or DD/MM/YYYY)
      const parts = String(dobStr).split(/[-/.]/);
      if (parts.length === 3) {
        let day = parts[0], month = parts[1], year = parts[2];
        if (year.length === 2) year = '19' + year;
        return {
          day: day.padStart(2, '0'),
          month: month.padStart(2, '0'),
          year: year,
          formattedISO: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
          formattedBD: `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
        };
      }
      return { day: '', month: '', year: '', formattedISO: dobStr, formattedBD: dobStr };
    }

    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return {
      day,
      month,
      year,
      formattedISO: `${year}-${month}-${day}`,
      formattedBD: `${day}/${month}/${year}`
    };
  },

  // Sanitize text strings (removes excess white spaces)
  cleanText: function (str) {
    if (!str) return '';
    return String(str).trim().replace(/\s+/g, ' ');
  }
};
