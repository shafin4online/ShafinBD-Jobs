import React from 'react';
import { Building2, Check, X } from 'lucide-react';

interface UploadLogoModalProps {
  pendingLogoUrl: string | null;
  uploadInstituteName: string;
  setUploadInstituteName: (name: string) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export const UploadLogoModal: React.FC<UploadLogoModalProps> = ({
  pendingLogoUrl,
  uploadInstituteName,
  setUploadInstituteName,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white relative animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
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
        <form onSubmit={onSave} className="space-y-4">
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
              onClick={onClose}
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
  );
};
