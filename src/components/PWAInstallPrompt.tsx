import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Info, ExternalLink } from 'lucide-react';
import { PWA_ICON_192, APP_NAME } from '../constants';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

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
      setShowInstructionsModal(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.warn('Native install prompt failed, showing guide modal:', err);
      }
    }

    // If deferredPrompt is not supported (Firefox, Safari) or expired
    setShowInstructionsModal(true);
  };

  const isFirefox = typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (isDismissed || isInstalled) return null;

  return (
    <>
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

      {/* Firefox & Safari Step-by-Step Installation Instruction Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">অ্যাপস ইনস্টল করার নির্দেশিকা</h3>
                <p className="text-xs text-slate-400">
                  {isFirefox ? 'Firefox Mobile Browser' : isIOS ? 'iOS Safari Browser' : 'Android / Web Browser'}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-200">
              {isFirefox ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">১</span>
                    <p>ফায়ারফক্সের অ্যাড্রেস বারের পাশে বা নিচে <strong>থ্রি-ডট (⋮)</strong> মেনু অপশনে ক্লিক করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">২</span>
                    <p>মেনু থেকে <strong>"Install" (ইনস্টল)</strong> অথবা <strong>"Add to Home screen"</strong> অপশনে চাপুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">৩</span>
                    <p>পপআপ উইন্ডোতে <strong>"Add"</strong> চাপলে আপনার হোম স্ক্রিনে ShafinBD Jobs অ্যাপটি আইকন আকারে তৈরি হয়ে যাবে!</p>
                  </div>
                </>
              ) : isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">১</span>
                    <p>সফারি (Safari) ব্রাউজারের নিচে অবস্থিত <strong>Share (শেয়ার)</strong> আইকনে চাপুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">২</span>
                    <p>স্ক্রোল করে <strong>"Add to Home Screen"</strong> অপশনটিতে ক্লিক করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">৩</span>
                    <p>উপরে <strong>"Add"</strong> বাটন চাপলেই অ্যাপটি ইনস্টল হয়ে যাবে।</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">১</span>
                    <p>ব্রাউজারের উপরের ডানদিকের <strong>থ্রি-ডট (⋮)</strong> মেনুতে ক্লিক করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">২</span>
                    <p>মেনু থেকে <strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> নির্বাচন করুন।</p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="mt-5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              বুঝেছি (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
};

