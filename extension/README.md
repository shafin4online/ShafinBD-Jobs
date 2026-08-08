# ShafinBD Jobs - Teletalk AutoFill Extension

**ShafinBD Jobs (Teletalk AutoFiller)** হলো একটি ইউনিভার্সাল ব্রাউজার এক্সটেনশন যা **Google Chrome, Mozilla Firefox, Brave Browser, Microsoft Edge** এবং **Opera** ব্রাউজারে কাজ করে।

এই এক্সটেনশনটি আমাদের **ShafinBD Jobs** ওয়েব পোর্টালের সাথে কানেক্টেড থাকে এবং ইউজার পোর্টালে লগইন থাকলে টেলিটক সরকারি/আধাসরকারি চাকরির আবেদন ফরমগুলো (`*.teletalk.com.bd`) এক ক্লিকে অটো-ফিল (AutoFill) করে দেয়।

---

## 🌟 বৈশিষ্ট্যসমূহ (Features)

1. **পোর্টেবল ও ক্রস-ব্রাউজার সাপোর্টেড**: Chrome, Firefox, Brave, Edge ব্রাউজারে সহজে ইনস্টল করা যায় (Manifest V3 Standard)।
2. **ওয়েব পোর্টাল সিঙ্ক (Web Portal Auth Sync)**:
   - ইউজার আমাদের ShafinBD Jobs পোর্টালে লগইন করলে এক্সটেনশনটি স্বয়ংক্রিয়ভাবে ইউজারের প্রোফাইল ডাটা সংগ্রহ করে প্রসেস করে।
   - পোর্টালে লগইন না থাকলে এক্সটেনশনে `পোর্টালে যান` বাটন দেখায়।
3. **স্মার্ট কন্ডিশনাল ইনপুট রিভিল (Conditional Toggle Support)**:
   - National ID, Birth Registration, Passport সিলেক্ট করার সময় "Yes" সিলেক্ট করার পর ডাইনামিক ইনপুট ফিল্ড রিভিল হওয়া পর্যন্ত অপেক্ষা করে এনআইডি নম্বর ইনপুট দেয়।
4. **ক্যাসকেডিং অ্যাড্রেস সিঙ্ক (District ➔ Upazila Cascading Select)**:
   - জেলা (District) নির্বাচন করার পর Teletalk এর সার্ভার থেকে ড্রপডাউনে উপজেলা (Upazila/P.S.) অপশন লোড হওয়ার জন্য এডজাস্টেবল ডিলে (Delay) দিয়ে নির্ভুলভাবে উপজেলা সিলেক্ট করে।
5. **ফ্লোটিং হেলপার উইজেট (Floating Widget)**:
   - টেলিটকের ফরম পেজে ঢুকলেই স্ক্রিনের নিচে ডানে `⚡ অটো-ফিল ফরম` সুন্দর প্যানেল চলে আসে।
6. **নিরাপত্তা ও প্রাইভেসি (Security Standards)**:
   - Captcha (ক্যাপচা) এবং Form Submit বাটন ব্যবহারকারী নিজে ম্যানুয়ালি সিকিউরিটির জন্য পূরণ ও সাবমিট করবেন।

---

## 🚀 এক্সটেনশন ইনস্টলেশন গাইড (Installation Guide)

### ১. Google Chrome / Brave Browser / Microsoft Edge-এ ইনস্টল করার নিয়ম:
1. ব্রাউজার খুলে অ্যাড্রেস বারে যান:
   - Chrome-এর জন্য: `chrome://extensions`
   - Brave-এর জন্য: `brave://extensions`
   - Edge-এর জন্য: `edge://extensions`
2. উপরে ডান কোণায় **Developer mode** অন (ON) করুন।
3. **Load unpacked** বাটনে ক্লিক করুন।
4. আমাদের প্রোজেক্টের `extension` ফোল্ডারটি সিলেক্ট করুন।
5. ব্যাস! এক্সটেনশনটি আপনার ব্রাউজারে যুক্ত হয়ে যাবে।

### ২. Mozilla Firefox-এ ইনস্টল করার নিয়ম:
1. Firefox ব্রাউজারে অ্যাড্রেস বারে যান: `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on...** বাটনে ক্লিক করুন।
3. `extension/manifest.json` ফাইলটি নির্বাচন করুন।

---

## ⚙️ অ্যাডভান্সড ডিল সেটিংস (Delay Settings)

যদি আপনার ইন্টারনেটের গতি ধীরগতির হয় এবং জেলা সিলেক্ট করার পর উপজেলা লোড হতে সময় নেয়:
1. ব্রাউজারের উপরে এক্সটেনশন আইকনে ক্লিক করুন।
2. **⚙️ অ্যাডভান্সড ডিল ফার্ম সেটিংস**-এ ক্লিক করুন।
3. **জেলা ➔ উপজেলা লোডিং ডিলে** আপনার পছন্দমতো (যেমন: 800ms বা 1000ms) বাড়িয়ে **সেভ** করুন।

---

## 📁 ফাইল স্ট্রাকচার (File Structure)

```
extension/
├── manifest.json            # Manifest V3 Configuration
├── popup/
│   ├── popup.html          # Extension Popup Interface
│   ├── popup.js            # Popup Logic & State Sync
│   └── popup.css           # Modern Dark UI Styles
├── scripts/
│   ├── background.js       # Service Worker for state storage
│   ├── content.js          # Injected Content Script on Teletalk pages
│   ├── content.css         # Floating Widget Styling
│   ├── autofill-engine.js  # Async Form Fill Engine
│   └── teletalk-mappers.js # Selectors Dictionary for Teletalk
├── bridge/
│   └── web-bridge.js       # Bridge connecting Portal LocalStorage to Extension
├── icons/                  # Extension App Icons
└── README.md               # User Documentation & Installation Guide
```
