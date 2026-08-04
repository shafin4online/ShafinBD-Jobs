import React, { useState, useEffect } from 'react';
import { useJobContext } from '../context/JobContext';
import { ShieldCheck, User, Phone, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { APP_LOGO_URL } from '../constants';

interface AccountActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountActivationModal: React.FC<AccountActivationModalProps> = ({ isOpen, onClose }) => {
  const { authUser, profile, updateProfile, setActiveTab } = useJobContext();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authUser || profile) {
      setFullName(profile?.fullName || authUser?.displayName || '');
      setPhone(profile?.phone || '');
    }
  }, [authUser, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('অনুগ্রহ করে ইংরেজিতে আপনার নাম লিখুন (Name in English is required)');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setError('অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর লিখুন (Valid phone number is required)');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        isAccountActive: true,
      });

      // Navigate to user profile page and update URL to /profile
      setActiveTab('profile');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'অ্যাক্টিভেশন সম্পন্ন করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">অ্যাকাউন্ট সক্রিয়করণ</h3>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            অ্যাকাউন্ট অ্যাক্টিভ করার জন্য ইংরেজি নাম এবং ফোন নম্বর নিশ্চিত করুন
          </p>

          {authUser?.email && (
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold mt-3 border border-emerald-400/30">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{authUser.email}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Input: Name in English */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Name in English (ইংরেজি নাম) <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Md. Shafin Ahmed"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Input: Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Phone Number (মোবাইল নম্বর) <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            তথ্য প্রদান সম্পন্ন হলে আপনার অ্যাকাউন্টটি অ্যাক্টিভ হবে এবং সরাসরি আপনার প্রোফাইলে নিয়ে যাওয়া হবে।
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer mt-2"
          >
            <span>{isSubmitting ? 'অ্যাক্টিভ করা হচ্ছে...' : 'অ্যাকাউন্ট অ্যাক্টিভ করুন ও প্রোফাইলে যান'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
