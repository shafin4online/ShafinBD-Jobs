import React, { useState, useRef } from 'react';
import { Camera, FileText, Upload, AlertCircle, CheckCircle2, Trash2, Image as ImageIcon, Sparkles, Crop } from 'lucide-react';

interface PhotoSignatureSectionProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}

export const PhotoSignatureSection: React.FC<PhotoSignatureSectionProps> = ({
  formData,
  updateField,
}) => {
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);
  const [signatureSuccess, setSignatureSuccess] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Helper function to format KB
  const formatSizeKB = (bytes: number) => (bytes / 1024).toFixed(1);

  // Handle Photo Upload Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    setPhotoSuccess(null);

    if (!file) return;

    // 1. Format Validation (.jpg / .jpeg)
    const isJpg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');
    if (!isJpg) {
      const errMsg = 'ছবিটি অবশ্যই .jpg অথবা .jpeg ফরম্যাটে হতে হবে!';
      setPhotoError(errMsg);
      alert(`❌ আপলোড ব্যর্থ:\n${errMsg}\nআপনার সিলেক্ট করা ফরম্যাট: ${file.type || file.name.split('.').pop()}`);
      if (photoInputRef.current) photoInputRef.current.value = '';
      return;
    }

    // 2. Size Validation (Max 100 KB = 100 * 1024 bytes = 102,400 bytes)
    const maxSizeBytes = 100 * 1024;
    if (file.size > maxSizeBytes) {
      const errMsg = `ছবির সাইজ ১০০ KB এর বেশি হতে পারবে না! বর্তমান সাইজ: ${formatSizeKB(file.size)} KB`;
      setPhotoError(errMsg);
      alert(`❌ আপলোড ব্যর্থ:\n${errMsg}\n\nঅনুগ্রহ করে ১০০ KB এর নিচের সাইজের .jpg ছবি ব্যবহার করুন।`);
      if (photoInputRef.current) photoInputRef.current.value = '';
      return;
    }

    // 3. Dimensions Validation (300px * 300px)
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 300 || img.height !== 300) {
          const errMsg = `ছবির সাইজ অবশ্যই ৩০০ × ৩০০ পিক্সেল (300px × 300px) হতে হবে! বর্তমান সাইজ: ${img.width}px × ${img.height}px`;
          setPhotoError(errMsg);
          alert(`❌ আপলোড ব্যর্থ:\n${errMsg}\n\nসঠিক সাইজ (300x300 pixel) এর ছবি আপলোড দিন।`);
          if (photoInputRef.current) photoInputRef.current.value = '';
          return;
        }

        // All Valid! Set image data URL
        updateField('photoUrl', event.target?.result as string);
        setPhotoSuccess('ছবি সফলভাবে আপলোড হয়েছে (300x300px, .jpg)');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Signature Upload Validation
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSignatureError(null);
    setSignatureSuccess(null);

    if (!file) return;

    // 1. Format Validation (.jpg / .jpeg)
    const isJpg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');
    if (!isJpg) {
      const errMsg = 'স্বাক্ষরটি অবশ্যই .jpg অথবা .jpeg ফরম্যাটে হতে হবে!';
      setSignatureError(errMsg);
      alert(`❌ আপলোড ব্যর্থ:\n${errMsg}\nআপনার সিলেক্ট করা ফরম্যাট: ${file.type || file.name.split('.').pop()}`);
      if (signatureInputRef.current) signatureInputRef.current.value = '';
      return;
    }

    // 2. Size Validation (Max 60 KB = 60 * 1024 bytes = 61,440 bytes)
    const maxSizeBytes = 60 * 1024;
    if (file.size > maxSizeBytes) {
      const errMsg = `স্বাক্ষরের সাইজ ৬০ KB এর বেশি হতে পারবে না! বর্তমান সাইজ: ${formatSizeKB(file.size)} KB`;
      setSignatureError(errMsg);
      alert(`❌ আপলোড ব্যর্থ:\n${errMsg}\n\nঅনুগ্রহ করে ৬০ KB এর নিচের সাইজের .jpg স্বাক্ষর ব্যবহার করুন।`);
      if (signatureInputRef.current) signatureInputRef.current.value = '';
      return;
    }

    // 3. Dimensions Validation (300px * 80px)
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 300 || img.height !== 80) {
          const errMsg = `স্বাক্ষরের সাইজ অবশ্যই ৩০০ × ৮০ পিক্সেল (300px × 80px) হতে হবে! বর্তমান সাইজ: ${img.width}px × ${img.height}px`;
          setSignatureError(errMsg);
          alert(`❌ আপলোড ব্যর্থ:\n${errMsg}\n\nসঠিক সাইজ (300x80 pixel) এর স্বাক্ষর আপলোড দিন।`);
          if (signatureInputRef.current) signatureInputRef.current.value = '';
          return;
        }

        // All Valid! Set signature data URL
        updateField('signatureUrl', event.target?.result as string);
        setSignatureSuccess('স্বাক্ষর সফলভাবে আপলোড হয়েছে (300x80px, .jpg)');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Helper to resize/convert any image to exact specs using HTML Canvas
  const processAndResizeImage = (
    file: File,
    targetWidth: number,
    targetHeight: number,
    maxKb: number,
    fieldKey: 'photoUrl' | 'signatureUrl'
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Fill background white for JPG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Draw resized image
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Convert to JPEG with quality adjusting to meet max KB requirement
          let quality = 0.92;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // Reduce quality if file size exceeds maxKb
          while (dataUrl.length * (3 / 4) > maxKb * 1024 && quality > 0.1) {
            quality -= 0.05;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          const finalKb = (dataUrl.length * (3 / 4)) / 1024;
          if (finalKb <= maxKb) {
            updateField(fieldKey, dataUrl);
            if (fieldKey === 'photoUrl') {
              setPhotoError(null);
              setPhotoSuccess(`স্বয়ংক্রিয়ভাবে রিসাইজ করে আপলোড করা হলো (${targetWidth}x${targetHeight}px, ${finalKb.toFixed(1)}KB, .jpg)`);
            } else {
              setSignatureError(null);
              setSignatureSuccess(`স্বয়ংক্রিয়ভাবে রিসাইজ করে আপলোড করা হলো (${targetWidth}x${targetHeight}px, ${finalKb.toFixed(1)}KB, .jpg)`);
            }
          } else {
            const errStr = `স্বয়ংক্রিয় রিসাইজের পরও সাইজ ${finalKb.toFixed(1)}KB দাঁড়িয়েছে, যা সর্বোচ্চ ${maxKb}KB এর বেশি!`;
            if (fieldKey === 'photoUrl') setPhotoError(errStr);
            else setSignatureError(errStr);
            alert(`❌ রিসাইজ ব্যর্থ:\n${errStr}`);
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">১.১</span>
          <h4 className="text-sm font-bold text-slate-900">ছবি এবং স্বাক্ষর আপলোড (Photo & Signature Upload)</h4>
        </div>
        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span>আবশ্যক শর্ত প্রযোজ্য</span>
        </span>
      </div>

      {/* Rules Notice Banner */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>ছবি ও স্বাক্ষর আপলোডের সঠিক নিয়মাবলী (Standard Bangladesh Govt Job Format):</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300 font-medium pl-1">
          <li className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold text-sm">📷</span>
            <div>
              <p className="font-bold text-white">ছবি (Applicant Photo):</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                • দৈর্ঘ্য × প্রস্থ: <strong className="text-emerald-400">300px × 300px</strong> (পিক্সেল)
              </p>
              <p className="text-[11px] text-slate-300">
                • ফাইল সাইজ: সর্বোচ্চ <strong className="text-emerald-400">100 KB</strong>
              </p>
              <p className="text-[11px] text-slate-300">
                • ফরম্যাট: <strong className="text-emerald-400">.JPG / .JPEG</strong>
              </p>
            </div>
          </li>

          <li className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold text-sm">✍️</span>
            <div>
              <p className="font-bold text-white">স্বাক্ষর (Applicant Signature):</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                • দৈর্ঘ্য × প্রস্থ: <strong className="text-emerald-400">300px × 80px</strong> (পিক্সেল)
              </p>
              <p className="text-[11px] text-slate-300">
                • ফাইল সাইজ: সর্বোচ্চ <strong className="text-emerald-400">60 KB</strong>
              </p>
              <p className="text-[11px] text-slate-300">
                • ফরম্যাট: <strong className="text-emerald-400">.JPG / .JPEG</strong>
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Grid for Photo & Signature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* ================= PHOTO CARD ================= */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>আবেদনকারীর ছবি (Photo) *</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                300x300px | ≤100KB | .JPG
              </span>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-300 p-4 min-h-[180px] relative">
              {formData.photoUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[150px] h-[150px] border-2 border-emerald-500 rounded-lg overflow-hidden shadow-md bg-white p-1">
                    <img
                      src={formData.photoUrl}
                      alt="Candidate Photo"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    300 × 300 পিক্সেল ভ্যালিড ছবি
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-2 p-2">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">ছবি সিলেক্ট করুন</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    (300px × 300px, Max 100KB, JPG)
                  </p>
                </div>
              )}
            </div>

            {/* Error or Success Alert Messages */}
            {photoError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">আপলোড বাতিল করা হয়েছে:</strong>
                  <span>{photoError}</span>
                </div>
              </div>
            )}

            {photoSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{photoSuccess}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <input
              ref={photoInputRef}
              type="file"
              accept=".jpg,.jpeg,image/jpeg"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-file-input"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <label
                htmlFor="photo-file-input"
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95 text-center"
              >
                <Upload className="w-4 h-4" />
                <span>{formData.photoUrl ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}</span>
              </label>

              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    updateField('photoUrl', '');
                    setPhotoSuccess(null);
                    setPhotoError(null);
                    if (photoInputRef.current) photoInputRef.current.value = '';
                  }}
                  className="px-3.5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="ছবি মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>রিমুভ</span>
                </button>
              )}
            </div>

            {/* Quick Auto-Fit Option for user convenience if they select non-exact image */}
            <div className="pt-1">
              <label className="text-[11px] text-slate-500 font-medium flex items-center gap-1 cursor-pointer hover:text-emerald-600">
                <Crop className="w-3.5 h-3.5 text-slate-400" />
                <span>অন্য কোনো সাইজের .jpg ছবি থাকলে স্বয়ংক্রিয়ভাবে 300x300px এ কনভার্ট করুন:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processAndResizeImage(file, 300, 300, 100, 'photoUrl');
                  }}
                  className="hidden"
                  id="photo-auto-resize"
                />
                <label htmlFor="photo-auto-resize" className="ml-1 text-emerald-700 font-bold underline cursor-pointer">
                  [অটো-রিসাইজ করুন]
                </label>
              </label>
            </div>
          </div>
        </div>

        {/* ================= SIGNATURE CARD ================= */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>আবেদনকারীর স্বাক্ষর (Signature) *</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                300x80px | ≤60KB | .JPG
              </span>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-300 p-4 min-h-[180px] relative">
              {formData.signatureUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[240px] h-[64px] border-2 border-emerald-500 rounded-lg overflow-hidden shadow-md bg-white p-1 flex items-center justify-center">
                    <img
                      src={formData.signatureUrl}
                      alt="Candidate Signature"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    300 × 80 পিক্সেল ভ্যালিড স্বাক্ষর
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-2 p-2">
                  <div className="w-20 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                    <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">স্বাক্ষর সিলেক্ট করুন</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    (300px × 80px, Max 60KB, JPG)
                  </p>
                </div>
              )}
            </div>

            {/* Error or Success Alert Messages */}
            {signatureError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">আপলোড বাতিল করা হয়েছে:</strong>
                  <span>{signatureError}</span>
                </div>
              </div>
            )}

            {signatureSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{signatureSuccess}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <input
              ref={signatureInputRef}
              type="file"
              accept=".jpg,.jpeg,image/jpeg"
              onChange={handleSignatureUpload}
              className="hidden"
              id="signature-file-input"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <label
                htmlFor="signature-file-input"
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95 text-center"
              >
                <Upload className="w-4 h-4" />
                <span>{formData.signatureUrl ? 'স্বাক্ষর পরিবর্তন করুন' : 'স্বাক্ষর আপলোড করুন'}</span>
              </label>

              {formData.signatureUrl && (
                <button
                  type="button"
                  onClick={() => {
                    updateField('signatureUrl', '');
                    setSignatureSuccess(null);
                    setSignatureError(null);
                    if (signatureInputRef.current) signatureInputRef.current.value = '';
                  }}
                  className="px-3.5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="স্বাক্ষর মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>রিমুভ</span>
                </button>
              )}
            </div>

            {/* Quick Auto-Fit Option */}
            <div className="pt-1">
              <label className="text-[11px] text-slate-500 font-medium flex items-center gap-1 cursor-pointer hover:text-emerald-600">
                <Crop className="w-3.5 h-3.5 text-slate-400" />
                <span>অন্য কোনো সাইজের .jpg স্বাক্ষর থাকলে স্বয়ংক্রিয়ভাবে 300x80px এ কনভার্ট করুন:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processAndResizeImage(file, 300, 80, 60, 'signatureUrl');
                  }}
                  className="hidden"
                  id="signature-auto-resize"
                />
                <label htmlFor="signature-auto-resize" className="ml-1 text-emerald-700 font-bold underline cursor-pointer">
                  [অটো-রিসাইজ করুন]
                </label>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
