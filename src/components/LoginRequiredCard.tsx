import React from 'react';
import { UserCheck, FileText, User as UserIcon } from 'lucide-react';
import { useJobContext } from '../context/JobContext';

interface LoginRequiredCardProps {
  iconType: 'profile' | 'applications';
  title: string;
  description: string;
}

export const LoginRequiredCard: React.FC<LoginRequiredCardProps> = ({
  iconType,
  title,
  description,
}) => {
  const { setShowAuthModal } = useJobContext();

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-md mx-auto my-8">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
        {iconType === 'profile' ? (
          <UserCheck className="w-8 h-8" />
        ) : (
          <FileText className="w-8 h-8" />
        )}
      </div>
      <h3 className="text-base font-extrabold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      <button
        onClick={() => setShowAuthModal(true)}
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
      >
        <UserIcon className="w-4 h-4" />
        <span>সাইন ইন / রেজিস্ট্রেশন করুন</span>
      </button>
    </div>
  );
};
