import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { PWA_ICON_192, APP_NAME } from '../constants';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instructions if native prompt isn't directly triggered
      alert('অ্যাপটি ইনস্টল করতে ব্রাউজারের থ্রি-ডট (⋮) মেনুতে গিয়ে "Add to Home screen" বা "Install app" সিলেক্ট করুন।');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (isDismissed || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-700 shadow-2xl z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={PWA_ICON_192}
            alt={APP_NAME}
            className="w-12 h-12 rounded-xl object-contain bg-slate-950 p-1 border border-slate-800 shrink-0 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{APP_NAME} অ্যাপ ইনস্টল করুন</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              মোবাইলে যেকোনো সময় দ্রুত চাকরির খবর পেতে অ্যাপস ডাউনলোড করুন
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isInstallable ? 'অ্যাপস ইনস্টল করুন' : 'হোম স্ক্রীনে যুক্ত করুন'}</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          পরে
        </button>
      </div>
    </div>
  );
};
