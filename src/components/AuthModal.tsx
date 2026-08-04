import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { X, Mail, Lock, AlertTriangle, User as UserIcon, Copy, Check } from 'lucide-react';
import { APP_LOGO_URL } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    registerWithEmail, 
    directProfileLogin,
    isAuthLoading, 
    authError, 
    setAuthError 
  } = useJobContext();

  const [mode, setMode] = useState<'signin' | 'signup' | 'direct'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoogleAuth = async () => {
    setLocalErr(null);
    setAuthError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      // Handled in context
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);
    setAuthError(null);
    if (!email) {
      setLocalErr('ইমেইল অ্যাড্রেস দিন');
      return;
    }

    try {
      if (mode === 'signup') {
        if (!password || password.length < 6) {
          setLocalErr('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে');
          return;
        }
        await registerWithEmail(email, password, name || 'Job Seeker');
      } else if (mode === 'signin') {
        if (!password) {
          setLocalErr('পাসওয়ার্ড দিন');
          return;
        }
        await signInWithEmail(email, password);
      } else {
        directProfileLogin(email, name || email.split('@')[0]);
      }
      onClose();
    } catch (err: any) {
      console.error('Email auth error:', err);
      let msg = err.message || 'অথেন্টিকেশন ব্যর্থ হয়েছে';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'ইমেইল বা পাসওয়ার্ড সঠিক নয়';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'এই ইমেইল দিয়ে ইতিপূর্বে অ্যাকাউন্ট খোলা হয়েছে। লগইন করুন।';
      }
      setLocalErr(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden">
              <img 
                src={APP_LOGO_URL} 
                alt="ShafinBD Jobs Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ShafinBD Jobs Registration & Login</h3>
              <p className="text-[11px] text-slate-300">আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
            </div>
          </div>
          <button
            onClick={() => { setAuthError(null); onClose(); }}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {(authError || localErr) && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>লগইন তথ্য পর্যবেক্ষণ</span>
              </div>
              <p className="text-amber-800 leading-relaxed font-medium">
                {localErr || authError?.message || 'Google Auth ত্রুটি ধরা পড়েছে'}
              </p>
              {(authError?.code === 'auth/unauthorized-domain' || authError?.message?.includes('unauthorized domain')) && (
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-300">
                  <code className="text-[11px] font-mono text-slate-700 flex-1 truncate">
                    {currentDomain}
                  </code>
                  <button
                    onClick={handleCopyDomain}
                    className="flex items-center gap-1 px-2 py-1 bg-amber-600 text-white rounded text-[10px] font-bold"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isAuthLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google অ্যাকাউন্টে সাইন ইন করুন</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase absolute">অথবা</span>
          </div>

          {/* Email / Direct Auth */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="পূর্ণ নাম লিখুন"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shafin@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            {mode !== 'direct' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {mode === 'signup' ? 'রেজিস্ট্রেশন সম্পূর্ণ করুন' : mode === 'signin' ? 'লগইন করুন' : 'সরাসরি প্রফাইল তৈরি করুন'}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            {mode === 'signin' ? (
              <button onClick={() => setMode('signup')} className="font-bold text-emerald-600 hover:underline">
                নতুন অ্যাকাউন্ট খুলুন (Sign Up)
              </button>
            ) : (
              <button onClick={() => setMode('signin')} className="font-bold text-emerald-600 hover:underline">
                ইতিপূর্বে অ্যাকাউন্ট আছে? (Sign In)
              </button>
            )}
            <button onClick={() => setMode('direct')} className="font-bold text-slate-600 hover:underline">
              পাসওয়ার্ড ছাড়া দ্রুত যুক্ত হন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
