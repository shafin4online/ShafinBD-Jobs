import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { SavedInstituteLogo } from './instituteLogoData';

interface DeleteLogoModalProps {
  logoToDelete: SavedInstituteLogo | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteLogoModal: React.FC<DeleteLogoModalProps> = ({
  logoToDelete,
  onClose,
  onConfirm,
}) => {
  if (!logoToDelete) return null;

  return (
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
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>হ্যাঁ, স্থায়ীভাবে মুছুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
