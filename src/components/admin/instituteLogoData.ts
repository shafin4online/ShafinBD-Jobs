export interface SavedInstituteLogo {
  id: string;
  name: string;
  logoUrl: string;
  category?: string;
}

// Default popular institutes in Bangladesh with clean vector / SVG badges
export const DEFAULT_INSTITUTE_LOGOS: SavedInstituteLogo[] = [
  {
    id: 'default-bpsc',
    name: 'বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)',
    category: 'Govt',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23065f46"/><circle cx="50" cy="50" r="32" fill="%23dc2626"/><text x="50" y="56" font-size="22" font-weight="bold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">BPSC</text></svg>',
  },
  {
    id: 'default-bb',
    name: 'বাংলাদেশ ব্যাংক (Bangladesh Bank)',
    category: 'Bank',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%230f172a"/><circle cx="50" cy="50" r="30" fill="%23047857"/><text x="50" y="56" font-size="20" font-weight="bold" fill="%23f59e0b" text-anchor="middle" font-family="sans-serif">BB</text></svg>',
  },
  {
    id: 'default-du',
    name: 'ঢাকা বিশ্ববিদ্যালয় (University of Dhaka)',
    category: 'University',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%231e3a8a"/><circle cx="50" cy="50" r="30" fill="%23ffffff"/><text x="50" y="57" font-size="24" font-weight="bold" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">DU</text></svg>',
  },
  {
    id: 'default-buet',
    name: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (BUET)',
    category: 'University',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23831843"/><circle cx="50" cy="50" r="30" fill="%23fef08a"/><text x="50" y="56" font-size="18" font-weight="bold" fill="%23831843" text-anchor="middle" font-family="sans-serif">BUET</text></svg>',
  },
  {
    id: 'default-dpe',
    name: 'প্রাথমিক শিক্ষা অধিদপ্তর (DPE)',
    category: 'Govt',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23047857"/><circle cx="50" cy="50" r="28" fill="%23fef08a"/><text x="50" y="56" font-size="20" font-weight="bold" fill="%23047857" text-anchor="middle" font-family="sans-serif">DPE</text></svg>',
  },
  {
    id: 'default-gp',
    name: 'গ্রামীণফোন (Grameenphone)',
    category: 'Private',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%230284c7"/><path d="M30 65 Q 50 20 70 65" stroke="%23ffffff" stroke-width="8" fill="none"/><circle cx="50" cy="35" r="10" fill="%2338bdf8"/></svg>',
  },
  {
    id: 'default-brac',
    name: 'ব্র্যাক / ব্র্যাক ব্যাংক (BRAC)',
    category: 'Private',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23e11d48"/><text x="50" y="58" font-size="20" font-weight="extrabold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">BRAC</text></svg>',
  },
  {
    id: 'default-square',
    name: 'স্কয়ার গ্রুপ (Square Group)',
    category: 'Private',
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23059669"/><rect x="25" y="25" width="50" height="50" rx="10" fill="%23ffffff"/><text x="50" y="56" font-size="22" font-weight="bold" fill="%23059669" text-anchor="middle" font-family="sans-serif">SQ</text></svg>',
  },
];

export const LOCAL_STORAGE_LOGOS_KEY = 'SAVED_INSTITUTE_LOGOS_GALLERY';
export const DELETED_LOGOS_KEY = 'DELETED_INSTITUTE_LOGOS_GALLERY_IDS';
