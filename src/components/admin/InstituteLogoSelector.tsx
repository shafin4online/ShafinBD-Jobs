import React, { useState, useEffect, useRef } from 'react';
import { Building2, Upload, Search, Check, Trash2, Sparkles, Image as ImageIcon, X, AlertTriangle, RefreshCw } from 'lucide-react';
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
const DELETED_LOGOS_KEY = 'DELETED_INSTITUTE_LOGOS_GALLERY_IDS';

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
  const [isUploading, setIsUploading] = useState(false);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingLogoUrl, setPendingLogoUrl] = useState<string | null>(null);
  const [uploadInstituteName, setUploadInstituteName] = useState('');
  const [logoToDelete, setLogoToDelete] = useState<SavedInstituteLogo | null>(null);

  // Helper to read deleted logo IDs/Names from localStorage
  const getDeletedKeys = (): string[] => {
    try {
      const stored = localStorage.getItem(DELETED_LOGOS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Load saved logos from LocalStorage & jobs on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LOGOS_KEY);
      let localList: SavedInstituteLogo[] = stored ? JSON.parse(stored) : [];
      const deletedKeys = new Set(getDeletedKeys().map((k) => k.toLowerCase()));

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

      // Combine defaults + custom saved + job extracted logos (excluding deleted)
      const combinedMap = new Map<string, SavedInstituteLogo>();
      
      DEFAULT_INSTITUTE_LOGOS.forEach((item) => {
        const normName = item.name.trim().toLowerCase();
        if (!deletedKeys.has(item.id.toLowerCase()) && !deletedKeys.has(normName)) {
          combinedMap.set(normName, item);
        }
      });

      jobLogosMap.forEach((item, normName) => {
        if (!deletedKeys.has(item.id.toLowerCase()) && !deletedKeys.has(normName)) {
          if (!combinedMap.has(normName)) combinedMap.set(normName, item);
        }
      });

      localList.forEach((item) => {
        if (item.name && item.logoUrl) {
          const normName = item.name.trim().toLowerCase();
          if (!deletedKeys.has(item.id.toLowerCase()) && !deletedKeys.has(normName)) {
            combinedMap.set(normName, item);
          }
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

  // Upload new logo file handler -> opens beautiful custom popup modal
  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setPendingLogoUrl(base64);
        setUploadInstituteName(jobForm.company?.trim() || '');
        setShowUploadModal(true);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle save from upload modal
  const handleSaveUploadedLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingLogoUrl || !uploadInstituteName.trim()) return;

    const name = uploadInstituteName.trim();
    const logoUrl = pendingLogoUrl;

    setJobForm((prev: any) => ({
      ...prev,
      companyLogo: logoUrl,
      company: prev.company ? prev.company : name,
    }));

    saveCustomLogo(name, logoUrl);

    setShowUploadModal(false);
    setPendingLogoUrl(null);
    setUploadInstituteName('');
  };

  // Select logo from gallery
  const handleSelectLogo = (item: SavedInstituteLogo) => {
    setJobForm((prev: any) => ({
      ...prev,
      companyLogo: item.logoUrl,
      company: prev.company ? prev.company : item.name,
    }));
  };

  // Permanently delete logo handler
  const handleConfirmPermanentDelete = () => {
    if (!logoToDelete) return;

    const item = logoToDelete;
    const normName = item.name.trim().toLowerCase();

    // Store in deleted keys list in localStorage
    try {
      const deletedKeys = getDeletedKeys();
      const updatedDeleted = Array.from(new Set([...deletedKeys, item.id.toLowerCase(), normName]));
      localStorage.setItem(DELETED_LOGOS_KEY, JSON.stringify(updatedDeleted));
    } catch (err) {
      console.error('Failed to update deleted keys:', err);
    }

    // Update custom saved logos list in localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LOGOS_KEY);
      if (stored) {
        const list: SavedInstituteLogo[] = JSON.parse(stored);
        const filtered = list.filter((l) => l.id !== item.id && l.name.trim().toLowerCase() !== normName);
        localStorage.setItem(LOCAL_STORAGE_LOGOS_KEY, JSON.stringify(filtered));
      }
    } catch (err) {
      console.error('Failed to remove custom logo from localStorage:', err);
    }

    // Remove from state
    setSavedLogos((prev) => prev.filter((l) => l.id !== item.id && l.name.trim().toLowerCase() !== normName));

    // Clear from current form if selected
    if (jobForm.companyLogo === item.logoUrl) {
      setJobForm((prev: any) => ({ ...prev, companyLogo: '' }));
    }

    setLogoToDelete(null);
  };

  // Reset logo gallery to defaults
  const handleResetGallery = () => {
    if (window.confirm('গ্যালারি রিসেট করলে ডিফল্ট সব ইন্সটিটিউট লোগো পুনরায় যুক্ত হবে। আপনি কি রিসেট করতে চান?')) {
      try {
        localStorage.removeItem(DELETED_LOGOS_KEY);
        localStorage.removeItem(LOCAL_STORAGE_LOGOS_KEY);
      } catch (e) {
        console.error(e);
      }
      setSavedLogos(DEFAULT_INSTITUTE_LOGOS);
    }
  };

  // Filter logos for search
  const filteredLogos = savedLogos.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedLogoUrl = jobForm.companyLogo || '';

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl text-white border border-slate-700/90 shadow-lg space-y-4 relative">
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
            onChange={handleLogoFileSelect}
            className="hidden"
            id="institute-logo-upload-input"
          />
          <label
            htmlFor="institute-logo-upload-input"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'প্রসেসিং হচ্ছে...' : 'নতুন লোগো আপলোড'}</span>
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
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>সেভ করা ও প্রস্তাবিত ইন্সটিটিউট লোগো সমূহ ({filteredLogos.length} টি)</span>
            </label>
            <button
              type="button"
              onClick={handleResetGallery}
              title="ডিফল্ট লোগো গ্যালারি রিসেট করুন"
              className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors underline cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>রিসেট</span>
            </button>
          </div>

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredLogos.map((item) => {
            const isSelected = selectedLogoUrl === item.logoUrl;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectLogo(item)}
                className={`relative group p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-md ring-2 ring-emerald-500/50'
                    : 'bg-slate-800/80 hover:bg-slate-700/90 border-slate-700 hover:border-slate-500'
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <span className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center text-[10px] font-black shadow-sm z-10">
                    ✓
                  </span>
                )}

                {/* Permanent Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoToDelete(item);
                  }}
                  title="গ্যালারি থেকে স্থায়ীভাবে মুছে ফেলুন"
                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 hover:bg-rose-500 text-white rounded-md transition-all opacity-80 group-hover:opacity-100 hover:scale-110 shadow-sm z-10 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-slate-600 shadow-xs mt-1"
                />

                <p className="text-[10px] font-bold text-slate-200 line-clamp-2 leading-tight">
                  {item.name}
                </p>
              </div>
            );
          })}

          {filteredLogos.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700">
              কোনো ম্যাচিং লোগো পাওয়া যায়নি। ওপরের "নতুন লোগো আপলোড" বাটন ব্যবহার করে যুক্ত করুন।
            </div>
          )}
        </div>
      </div>

      {/* BEAUTIFUL POPUP MODAL: NEW LOGO UPLOAD (INSTITUTE NAME INPUT) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white relative animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setShowUploadModal(false);
                setPendingLogoUrl(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">নতুন ইন্সটিটিউট লোগো যুক্ত করুন</h3>
                <p className="text-xs text-slate-400">প্রতিষ্ঠানের নাম দিয়ে লোগোটি স্থায়ীভাবে গ্যালারিতে সেভ করুন</p>
              </div>
            </div>

            {/* Logo Preview */}
            {pendingLogoUrl && (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70 gap-2">
                <img
                  src={pendingLogoUrl}
                  alt="Uploaded Logo Preview"
                  className="w-16 h-16 rounded-2xl object-contain bg-white p-2 border-2 border-emerald-400 shadow-md"
                />
                <span className="text-[11px] text-emerald-400 font-bold">লোগো প্রিভিউ সফল</span>
              </div>
            )}

            {/* Form Form */}
            <form onSubmit={handleSaveUploadedLogo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  প্রতিষ্ঠানের নাম (Institute Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={uploadInstituteName}
                  onChange={(e) => setUploadInstituteName(e.target.value)}
                  placeholder="যেমন: বাংলাদেশ ব্যাংক, ঢাকা বিশ্ববিদ্যালয়, বিআরডিবি..."
                  className="w-full px-4 py-2.5 bg-slate-800 text-sm text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ভবিষ্যতে যেকোনো পোস্টের জন্য এই নামেই লোগোটি ১-ক্লিকে সিলেক্ট করতে পারবেন।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setPendingLogoUrl(null);
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={!uploadInstituteName.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষণ ও ব্যবহার করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {logoToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-white relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">স্থায়ীভাবে মুছে ফেলার নিশ্চিতকরণ</h3>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
              <img
                src={logoToDelete.logoUrl}
                alt={logoToDelete.name}
                className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-slate-600"
              />
              <p className="text-xs font-bold text-slate-200 line-clamp-2">
                {logoToDelete.name}
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              আপনি কি নিশ্চিত যে এই ইন্সটিটিউট লোগোটি স্থায়ীভাবে গ্যালারি থেকে মুছে ফেলতে চান? এটি আর প্রদর্শিত হবে না।
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLogoToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>হ্যাঁ, স্থায়ীভাবে মুছুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

