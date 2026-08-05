import React, { useState, useEffect, useRef } from 'react';
import { Building2, Upload, Search, Check, Trash2, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useJobContext } from '../../context/JobContext';

export interface SavedInstituteLogo {
  id: string;
  name: string;
  logoUrl: string;
  category?: string;
}

// Default popular institutes in Bangladesh with clean vector / SVG badges
const DEFAULT_INSTITUTE_LOGOS: SavedInstituteLogo[] = [
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

const LOCAL_STORAGE_LOGOS_KEY = 'SAVED_INSTITUTE_LOGOS_GALLERY';

interface InstituteLogoSelectorProps {
  jobForm: any;
  setJobForm: React.Dispatch<React.SetStateAction<any>>;
}

export const InstituteLogoSelector: React.FC<InstituteLogoSelectorProps> = ({
  jobForm,
  setJobForm,
}) => {
  const { jobs } = useJobContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedLogos, setSavedLogos] = useState<SavedInstituteLogo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Load saved logos from LocalStorage & jobs on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LOGOS_KEY);
      let localList: SavedInstituteLogo[] = stored ? JSON.parse(stored) : [];

      // Extract logos from existing jobs
      const jobLogosMap = new Map<string, SavedInstituteLogo>();
      (jobs || []).forEach((j) => {
        if (j.company && j.companyLogo && j.companyLogo.length > 20) {
          const key = j.company.trim().toLowerCase();
          if (!jobLogosMap.has(key)) {
            jobLogosMap.set(key, {
              id: `job-logo-${j.id}`,
              name: j.company.trim(),
              logoUrl: j.companyLogo,
              category: j.category,
            });
          }
        }
      });

      // Combine defaults + custom saved + job extracted logos
      const combinedMap = new Map<string, SavedInstituteLogo>();
      DEFAULT_INSTITUTE_LOGOS.forEach((item) => {
        combinedMap.set(item.name.trim().toLowerCase(), item);
      });
      jobLogosMap.forEach((item, key) => {
        if (!combinedMap.has(key)) combinedMap.set(key, item);
      });
      localList.forEach((item) => {
        if (item.name && item.logoUrl) {
          combinedMap.set(item.name.trim().toLowerCase(), item);
        }
      });

      setSavedLogos(Array.from(combinedMap.values()));
    } catch (e) {
      console.error('Failed to load saved institute logos:', e);
      setSavedLogos(DEFAULT_INSTITUTE_LOGOS);
    }
  }, [jobs]);

  // Save new custom logo
  const saveCustomLogo = (name: string, logoUrl: string) => {
    if (!name || !logoUrl) return;
    const newEntry: SavedInstituteLogo = {
      id: `custom-logo-${Date.now()}`,
      name: name.trim(),
      logoUrl,
    };

    setSavedLogos((prev) => {
      const updated = [newEntry, ...prev.filter((p) => p.name.trim().toLowerCase() !== name.trim().toLowerCase())];
      try {
        localStorage.setItem(LOCAL_STORAGE_LOGOS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save logo to localStorage:', e);
      }
      return updated;
    });
  };

  // Upload new logo handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('ইন্সটিটিউট লোগোর সাইজ সর্বাধিক 3 MB হওয়া আবশ্যক!');
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const instituteName = jobForm.company?.trim() || prompt('প্রতিষ্ঠানের নাম দিন (যেমন: বাংলাদেশ ব্যাংক):') || 'নতুন প্রতিষ্ঠান';

        setJobForm((prev: any) => ({
          ...prev,
          companyLogo: base64,
          company: prev.company || instituteName,
        }));

        saveCustomLogo(instituteName, base64);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select logo from gallery
  const handleSelectLogo = (item: SavedInstituteLogo) => {
    setJobForm((prev: any) => ({
      ...prev,
      companyLogo: item.logoUrl,
      // Auto fill company name if empty or if requested
      company: prev.company ? prev.company : item.name,
    }));
  };

  // Remove logo from gallery
  const handleDeleteCustomLogo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('এই সেভ করা লোগোটি তালিকা থেকে মুছে ফেলতে চান?')) {
      setSavedLogos((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        try {
          localStorage.setItem(LOCAL_STORAGE_LOGOS_KEY, JSON.stringify(filtered));
        } catch (err) {
          console.error(err);
        }
        return filtered;
      });
    }
  };

  // Filter logos for search
  const filteredLogos = savedLogos.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const selectedLogoUrl = jobForm.companyLogo || '';

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white border border-slate-700 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
        <div>
          <h4 className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>ইন্সটিটিউট / প্রতিষ্ঠানের লোগো (Institute Logo Management)</span>
          </h4>
          <p className="text-[11px] text-slate-300 font-medium">
            পূর্বে ব্যবহৃত লোগো থেকে ১-ক্লিকে সিলেক্ট করুন অথবা নতুন লোগো আপলোড করুন (বারবার আপলোড করা লাগবে না)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="institute-logo-upload-input"
          />
          <label
            htmlFor="institute-logo-upload-input"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'আপলোড হচ্ছে...' : 'নতুন লোগো আপলোড'}</span>
          </label>
        </div>
      </div>

      {/* SELECTED LOGO PREVIEW & ACTIVE STATUS */}
      {selectedLogoUrl ? (
        <div className="p-3 bg-slate-800/90 rounded-xl border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <img
              src={selectedLogoUrl}
              alt="Institute Logo"
              className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-emerald-400 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>লোগো যুক্ত আছে ({jobForm.company || 'প্রতিষ্ঠানের নাম'})</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                সার্কুলার কার্ডে এবং ডিটেইলস পেজে এই লোগোটি প্রদর্শিত হবে
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setJobForm((prev: any) => ({ ...prev, companyLogo: '' }))}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>লোগো সরান</span>
          </button>
        </div>
      ) : (
        <div className="p-3 bg-slate-800/50 rounded-xl border border-dashed border-slate-600 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-300">কোনো ইন্সটিটিউট লোগো সিলেক্ট করা হয়নি</p>
            <p className="text-[10px] text-slate-400">নিচের সাজেশন গ্যালারি থেকে ক্লিক করে লোগো নির্বাচন করুন</p>
          </div>
        </div>
      )}

      {/* SUGGESTED LOGOS GALLERY & SEARCH */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>সেভ করা ও প্রস্তাবিত ইন্সটিটিউট লোগো সমূহ ({filteredLogos.length} টি)</span>
          </label>

          {/* Search Field */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্রতিষ্ঠানের নাম খুঁজুন..."
              className="w-full sm:w-56 pl-8 pr-3 py-1.5 bg-slate-800 text-xs text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* LOGO GRID CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredLogos.map((item) => {
            const isSelected = selectedLogoUrl === item.logoUrl;
            const isCustom = item.id.startsWith('custom-');

            return (
              <div
                key={item.id}
                onClick={() => handleSelectLogo(item)}
                className={`relative group p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-md ring-2 ring-emerald-500/50'
                    : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 hover:border-slate-500'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                )}

                {isCustom && !isSelected && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCustomLogo(item.id, e)}
                    title="লোগোটি মুছুন"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-md transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-slate-600 shadow-xs"
                />

                <p className="text-[10px] font-bold text-slate-200 line-clamp-2 leading-tight">
                  {item.name}
                </p>
              </div>
            );
          })}

          {filteredLogos.length === 0 && (
            <div className="col-span-full py-6 text-center text-xs text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700">
              কোনো ম্যাচিং লোগো পাওয়া যায়নি। ওপরের "নতুন লোগো আপলোড" বাটন ব্যবহার করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
