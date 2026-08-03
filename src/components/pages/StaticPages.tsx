import React, { useState } from 'react';
import { ShieldAlert, Lock, Info, PhoneCall, Mail, MapPin, CheckCircle, Send } from 'lucide-react';

interface StaticPagesProps {
  type: 'privacy-policy' | 'terms' | 'about' | 'contact';
}

export const StaticPages: React.FC<StaticPagesProps> = ({ type }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  if (type === 'privacy-policy') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">গোপনীয়তা নীতি (Privacy Policy)</h1>
            <p className="text-xs text-slate-500">সর্বশেষ আপডেট: আগস্ট ২০২৬ | Shafin BD Jobs</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <p>
            Shafin BD (শাফিন BD) চাকরি ও শিক্ষা পোর্টালে আপনার তথ্যের সুরক্ষা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। এই গোপনীয়তা নীতিতে বিস্তারিত আলোচনা করা হয়েছে কীভাবে আমরা আপনার তথ্য সংগ্রহ, সংরক্ষণ ও ব্যবহার করি।
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">১. যেসকল তথ্য আমরা সংগ্রহ করি</h3>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li><strong>ব্যক্তিগত তথ্য:</strong> নাম, ইমেইল, মোবাইল নম্বর, জন্ম তারিখ, স্থায়ী ও বর্তমান ঠিকানা।</li>
            <li><strong>পেশাগত তথ্য:</strong> শিক্ষাগত যোগ্যতা, কাজের অভিজ্ঞতা, রেজুমে / CV বিবরণ।</li>
            <li><strong>অ্যাকাউন্ট তথ্য:</strong> গুগল সাইন ইন তথ্য ও প্রোফাইল ছবি।</li>
          </ul>

          <h3 className="text-sm font-bold text-slate-900 pt-2">২. তথ্যের ব্যবহার</h3>
          <p className="text-xs text-slate-600">
            আপনার প্রদানকৃত তথ্য শুধুমাত্র আপনার অ্যাকাউন্টে ১-ক্লিক চাকরির আবেদন প্রক্রিয়া সুগম করতে, বিজ্ঞপ্তির আপডেট প্রদান করতে এবং চাকরির মালিক বা নিয়োগকর্তাদের সাথে সংযোগ করিয়ে দিতে ব্যবহৃত হয়।
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">৩. তথ্য সুরক্ষা</h3>
          <p className="text-xs text-slate-600">
            আপনার সকল ডাটা Firebase ও এনক্রিপ্টেড ডাটাবেজে সুরক্ষিত রাখা হয়। আমরা কখনোই আপনার ব্যক্তিগত তথ্য কোনো থার্ড-পার্টি প্রতিষ্ঠানের কাছে বিক্রি বা হস্তান্তর করি না।
          </p>
        </div>
      </div>
    );
  }

  if (type === 'terms') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">ব্যবহারের শর্তাবলী (Terms & Conditions)</h1>
            <p className="text-xs text-slate-500">Shafin BD Jobs প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <p>
            Shafin BD পোর্টালে স্বাগতম। আমাদের পরিষেবা ব্যবহার করার পূর্বে নিচের শর্তাবলী মনোযোগ দিয়ে পড়ুন।
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">১. সঠিক তথ্য প্রদান</h3>
          <p className="text-xs text-slate-600">
            পোর্টালে নিবন্ধনের সময় এবং চাকরির আবেদন করার সময় প্রার্থীকে সঠিক ও নির্ভুল তথ্য প্রদান করতে হবে। ভুল বা বিভ্রান্তিকর তথ্য প্রদানের কারণে অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে স্থগিত হতে পারে।
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">২. নিয়োগ সংক্রান্ত সতর্কতা</h3>
          <p className="text-xs text-slate-600">
            Shafin BD কোনো চাকরির বিনিময়ে সরাসরি কোনো অর্থ লেনদেন গ্রহণ করে না। যেকোনো নিয়োগ সংক্রান্ত আর্থিক লেনদেন থেকে বিরত থাকার জন্য বিশেষভাবে অনুরোধ করা হচ্ছে।
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">৩. কপিরাইট ও কনটেন্ট</h3>
          <p className="text-xs text-slate-600">
            প্ল্যাটফর্মের সকল সরকারি ও বেসরকারি নিয়োগ বিজ্ঞপ্তির স্বত্ব তাদের নিজ নিজ প্রতিষ্ঠানের। Shafin BD শুধুমাত্র প্রার্থীদের সহায়তায় সঠিক তথ্য সংকলন ও পরিবেশন করে।
          </p>
        </div>
      </div>
    );
  }

  if (type === 'about') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">আমাদের সম্পর্কে (About Us)</h1>
            <p className="text-xs text-slate-500">Shafin BD (শাফিন BD) - বাংলাদেশের অন্যতম ডিজিটাল প্ল্যাটফর্ম</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <p>
            Shafin BD হলো বাংলাদেশের চাকরিপ্রার্থী এবং শিক্ষার্থীদের জন্য একটি আধুনিক ও স্বয়ংসম্পূর্ণ পোর্টাল। এখানে সরকারি চাকরি, বেসরকারি চাকরি, ব্যাংক ও আইটি সেক্টরের নিয়োগ বিজ্ঞপ্তি এবং বিশ্ববিদ্যালয়ের ভর্তি সহায়তার সর্বাধুনিক তথ্য খুব সহজে ও দ্রুত প্রদান করা হয়।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <h4 className="text-lg font-black text-emerald-600">১০০% ভেরিফাইড</h4>
              <p className="text-xs text-slate-500 mt-1">সঠিক ও নির্ভরযোগ্য নিয়োগ বিজ্ঞপ্তি</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <h4 className="text-lg font-black text-emerald-600">১-ক্লিক আবেদন</h4>
              <p className="text-xs text-slate-500 mt-1">সহজে অনলাইনে জীবনবৃত্তান্ত জমা</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <h4 className="text-lg font-black text-emerald-600">২৪/৭ আপডেট</h4>
              <p className="text-xs text-slate-500 mt-1">সর্বশেষ ভর্তি ও চাকরির সময়সূচী</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">যোগাযোগ করুন (Contact Us)</h1>
          <p className="text-xs text-slate-500">যেকোনো প্রশ্ন বা সহযোগিতার জন্য বার্তা পাঠান</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            আপনার কোনো প্রশ্ন, পরামর্শ বা বিজ্ঞাপনের জন্য আমাদের সাথে সরাসরি ইমেইল বা বার্তার মাধ্যমে যোগাযোগ করতে পারেন।
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <Mail className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">ইমেইল ঠিকানা</span>
                <span className="text-xs font-bold text-slate-900">shafinbd4u@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">হটলাইন / মোবাইল</span>
                <span className="text-xs font-bold text-slate-900">+880 1700-000000</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">প্রধান কার্যালয়</span>
                <span className="text-xs font-bold text-slate-900">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          {contactSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">ধন্যবাদ! বার্তাটি সফলভাবে পাঠানো হয়েছে</h3>
              <p className="text-xs text-slate-500">আমাদের প্রতিনিধি শীঘ্রই আপনার ইমেইলে উত্তর প্রদান করবেন।</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="আপনার পূর্ণ নাম"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আপনার ইমেইল *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বার্তার বিষয়</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="যেমন: জব পোস্ট সংক্রান্ত তথ্য"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বার্তা (Message) *</label>
                <textarea
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
