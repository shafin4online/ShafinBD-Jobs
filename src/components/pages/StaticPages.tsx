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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">গোপনীয়তা নীতি (Privacy Policy)</h1>
            <p className="text-xs text-slate-500">সর্বশেষ আপডেট: আগস্ট ২০২৬ | Shafin BD Jobs Portal & Browser Extension</p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <p className="text-sm font-semibold text-slate-800 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100">
            Shafin BD Jobs (শাফিন BD) পোর্টাল এবং "ShafinBD Jobs - Teletalk AutoFill Extension" আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও সুরক্ষাকে সর্বোচ্চ অগ্রাধিকার দেয়। এই নীতিমালায় আমাদের ওয়েব অ্যাপ্লিকেশন এবং ব্রাউজার এক্সটেনশন কর্তৃক তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ এবং সিকিউরিটি কমপ্লায়েন্স সম্পর্কে বিস্তারিত ব্যাখ্যা করা হয়েছে।
          </p>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">১</span>
              ওয়েব পোর্টালে সংগৃহীত তথ্য ও ব্যবহার (Web Application Data Collection)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>ব্যক্তিগত তথ্য (Personal Data):</strong> নাম, পিতা/মাতার নাম, লিঙ্গ, বৈবাহিক অবস্থা, ধর্ম, জন্ম তারিখ, জাতীয় পরিচয়পত্র (NID) / জন্ম নিবন্ধন নম্বর, মোবাইল নম্বর ও ইমেইল ঠিকানা।</li>
              <li><strong>এড্রেস ও একাডেমিক ডাটা (Addresses & Academics):</strong> বর্তমান ও স্থায়ী ঠিকানা (বিভাগ, জেলা, উপজেলা, পোস্ট কোড), SSC, HSC ও স্নাাতক/Graduation পরীক্ষার রোল, রেজিস্ট্রেশন, জিপিএ, বোর্ড, বিভাগ ও পাসের সাল।</li>
              <li><strong>মিডিয়া ও প্রোফাইল ছবি (Media & Canvas Engine):</strong> আবেদনের জন্য ব্যবহৃত ছবি (300x300 px) এবং স্বাক্ষর (300x80 px), যা ক্লায়েন্ট-সাইড HTML Canvas দ্বারা স্বয়ংক্রিয়ভাবে সাইজ ও ফরম্যাট ভ্যালিডেশন করা হয়।</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">২</span>
              ব্রাউজার এক্সটেনশন প্রাইভেসি ও পারমিশন (Browser Extension Privacy Disclosure)
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-slate-600">
              <p>Chrome Web Store এবং Firefox Add-ons ডেভেলপার কমপ্লায়েন্স অনুযায়ী:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>লোকাল স্টোরেজ (Storage Permission):</strong> এক্সটেনশনটি প্রার্থীর সিঙ্ক করা প্রোফাইল ডাটা কেবল ব্রাউজারের এনক্রিপ্টেড <code>chrome.storage.local</code> বা <code>browser.storage.local</code> এ সংরক্ষণ করে।</li>
                <li><strong>ওয়েবসাইট ইন্টারঅ্যাকশন (Host Permissions):</strong> এক্সটেনশনটি শুধুমাত্র সরকারি চাকরির আবেদন পোর্টাল (<code>*.teletalk.com.bd</code>) এবং ShafinBD অফিশিয়াল ডোমেইনে কাজ করে। কোনো অননুমোদিত থার্ড-পার্টি ওয়েবসাইটে ডাটা রিড বা অ্যাক্সেস করা হয় না।</li>
                <li><strong>নো ট্র্যাকিং / নো অ্যানালিটিক্স (Zero Third-Party Telemetry):</strong> এক্সটেনশনটি কোনো প্রকার ইউজার ট্র্যাকিং, ব্রাউজিং হিস্ট্রি ট্র্যাকিং বা বাণিজ্যিক বিজ্ঞাপনের ডাটা সংগ্রাহক ব্যবহার করে না।</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">৩</span>
              ডাটা নিরাপত্তা ও এনক্রিপশন (Data Security & Compliance)
            </h3>
            <p className="text-slate-600">
              আপনার তথ্য Google Firebase সিকিউর ফায়ারস্টোর ডাটাবেজ এবং HTTPS/SSL এনক্রিপ্টেড প্রোটোকলের মাধ্যমে আদান-প্রদান করা হয়। আপনার লিখিত অনুমতি ছাড়া কখনোই কোনো থার্ড-পার্টি বা বাণিজ্যিক প্রতিষ্ঠানের সাথে তথ্য শেয়ার বা বিক্রি করা হয় না।
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">৪</span>
              ব্যবহারকারীর অধিকার ও ডাটা মুছে ফেলা (User Rights & Data Control)
            </h3>
            <p className="text-slate-600">
              যেকোনো সময় ইউজার প্রোফাইল পেজ থেকে আপনার তথ্য পরিবর্তন, সংশোধন বা মুছে ফেলতে পারেন। এক্সটেনশন রিমুভ করার সাথে সাথে ব্রাউজারের ক্যাশ ও লোকাল মেমোরি থেকে আপনার সংসংক্রান্ত সকল ফিল্ড ডাটা স্বয়ংক্রিয়ভাবে মুছে যায়।
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">৫</span>
              যোগাযোগ ও সাপোর্ট (Contact & Support)
            </h3>
            <p className="text-slate-600">
              গোপনীয়তা নীতি সংক্রান্ত যেকোনো প্রশ্ন বা সহায়তার জন্য যোগাযোগ করুন:
            </p>
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-800 font-bold text-xs space-y-1">
              <p>ইমেইল: shafinbd4u@gmail.com</p>
              <p>ওয়েবসাইট: https://www.jobs.shafinbd.com</p>
              <p>অবস্থান: ঢাকা, বাংলাদেশ</p>
            </div>
          </div>
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
