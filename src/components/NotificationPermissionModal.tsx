import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, CheckCircle2, AlertTriangle, ShieldCheck, Zap, ChevronRight, Settings } from 'lucide-react';
import { PWA_ICON_192, APP_NAME } from '../constants';
import { requestPushPermission, getNotificationPermission } from '../lib/pushNotification';

export const NotificationPermissionModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    // Check current notification permission status
    const currentPermission = getNotificationPermission();

    if (currentPermission === 'granted') {
      // Permission already granted, ensure token is fresh
      return;
    }

    if (currentPermission === 'denied') {
      setIsDenied(true);
    }

    // Check if user recently dismissed the modal in this session/day
    const lastDismissed = localStorage.getItem('shafinbd_notification_modal_dismissed');
    const dismissedTime = lastDismissed ? parseInt(lastDismissed, 10) : 0;
    const now = Date.now();

    // Show popup after 2.5 seconds delay on load if permission is not granted
    // (If dismissed, wait at least 12 hours before showing prompt again)
    if (!lastDismissed || now - dismissedTime > 12 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowClick = async () => {
    setLoading(true);
    setStatusMsg(null);

    const result = await requestPushPermission();
    setLoading(false);

    if (result.success) {
      setStatusMsg({
        type: 'success',
        text: 'অভিনন্দন! নোটিফিকেশন সফলভাবে চালু হয়েছে। নতুন সার্কুলার সাথে সাথেই আপনার মোবাইলে পাবেন।'
      });
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } else {
      if (result.reason === 'permission_denied' || Notification.permission === 'denied') {
        setIsDenied(true);
        setStatusMsg({
          type: 'error',
          text: 'ব্রাউজার সেটিংস থেকে নোটিফিকেশন ব্লক করা রয়েছে। নিচে দেওয়া নিয়ম ফলো করে এলাউ (Allow) করুন।'
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: result.reason || 'অনুমতি নেওয়া সম্ভব হয়নি। আবার চেষ্টা করুন।'
        });
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('shafinbd_notification_modal_dismissed', Date.now().toString());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden">
        {/* Glowing Background Backdrop Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-xl p-2 relative z-10">
              <img
                src={PWA_ICON_192}
                alt={APP_NAME}
                className="w-14 h-14 rounded-xl object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Animated Pulse Bell Badge */}
            <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-2 rounded-full shadow-lg animate-bounce z-20 border-2 border-slate-900">
              <Bell className="w-4 h-4 fill-slate-950" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              ইনস্ট্যান্ট জব এলার্ট
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
              নোটিফিকেশন অন করুন!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              অ্যাপ বন্ধ থাকলেও সরকারি ও বেসরকারি চাকরির খবর সবার আগে আপনার মোবাইলের স্ক্রিনে পাবেন।
            </p>
          </div>
        </div>

        {/* Feature Benefits List */}
        <div className="my-5 bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-200">
              <strong className="text-white font-extrabold">সবার আগে বিজ্ঞপ্তি:</strong> নতুন চাকরির নিয়োগ সার্কুলার পাবলিশ হলেই সাথে সাথে নোটিফিকেশন।
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-200">
              <strong className="text-white font-extrabold">পরীক্ষার আপডেট:</strong> এডমিট কার্ড, পরীক্ষার তারিখ ও বিশ্ববিদ্যালয় ভর্তি রেজাল্ট।
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-200">
              <strong className="text-white font-extrabold">ব্যাকগ্রাউন্ড সার্ভিস:</strong> ডাটা বা ওয়াইফাই চালু থাকলেই মোবাইল স্ক্রিনে চাকরি ভেসে উঠবে।
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-bold mb-4 flex items-start gap-2 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Instructions if Notification Permission was previously denied */}
        {isDenied && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 space-y-1.5">
            <p className="font-extrabold flex items-center gap-1.5 text-amber-300">
              <Settings className="w-3.5 h-3.5" />
              কীভাবে ব্রাউজারে নোটিফিকেশন চালু করবেন:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-normal pl-1">
              <li>ব্রাউজারের এড্রেস বারে বাম পাশে থাকা 🔒 বা ⚙️ মেনু আইকনে চাপ দিন।</li>
              <li><strong className="text-amber-300">Permissions</strong> বা <strong className="text-amber-300">Site Settings</strong> সিলেক্ট করুন।</li>
              <li><strong className="text-amber-300">Notifications</strong> ক্লিক করে <strong className="text-emerald-400">Allow (অনুমতি দিন)</strong> করে দিন।</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleAllowClick}
            disabled={loading}
            className="w-full py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Bell className="w-4 h-4 fill-slate-950" />
            <span>{loading ? 'প্রসেসিং হচ্ছে...' : '🔔 নোটিফিকেশন এলাউ করুন (Allow)'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
          >
            পরে মনে করিয়ে দিন
          </button>
        </div>
      </div>
    </div>
  );
};
