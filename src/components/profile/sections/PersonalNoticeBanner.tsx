import React from 'react';

interface PersonalNoticeBannerProps {
  isLocked: boolean;
}

export const PersonalNoticeBanner: React.FC<PersonalNoticeBannerProps> = ({ isLocked }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
            ১
          </span>
          <h4 className="text-sm font-bold text-slate-900">
            ব্যক্তিগত তথ্য (Personal Details)
          </h4>
        </div>
        {isLocked ? (
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
            🔒 নাম, ইমেইল ও ফোন নম্বর সংরক্ষিত ও লকড
          </span>
        ) : (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
            ⚠️ নাম, ইমেইল ও ফোন নম্বর মাত্র একবার ইডিটেবল
          </span>
        )}
      </div>

      {/* One-Time Editable Alert Banner */}
      <div
        className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 transition-all ${
          isLocked
            ? 'bg-slate-100 border-slate-300 text-slate-700'
            : 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm'
        }`}
      >
        <span className="text-base shrink-0">{isLocked ? '🔒' : '⚠️'}</span>
        <div>
          <strong className="block font-bold text-slate-900 mb-0.5">
            {isLocked
              ? 'যোগাযোগ তথ্য সেভড (Non-Editable Fields Notice):'
              : 'গুরুত্বপূর্ণ সতর্কতা (One-Time Update Warning):'}
          </strong>
          {isLocked ? (
            <span>
              আবেদনকারীর <strong>নাম (Name), ইমেইল (Email) এবং মোবাইল নম্বর (Phone Number)</strong> ইতোমধ্যে একবার আপডেট করে লক করা হয়েছে। নিরাপত্তার স্বার্থে এগুলো আর পরিবর্তন সম্ভব নয়।
            </span>
          ) : (
            <span>
              আবেদনকারীর <strong>নাম (Name), ইমেইল (Email) এবং মোবাইল নম্বর (Phone Number)</strong> মাত্র একবারের জন্যই সেভ/আপডেট করা যাবে! সেভ করার পর এগুলো চিরতরে লক হয়ে যাবে। অনুগ্রহ করে নিশ্চিত হয়ে সঠিক তথ্য টাইপ করুন।
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
