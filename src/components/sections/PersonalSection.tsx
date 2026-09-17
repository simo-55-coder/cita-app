import React, { useState, useRef } from 'react';
import { PersonalInfo } from '../../types';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Image as ImageIcon, Upload, Trash2, Camera, Loader2, Link2, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { processProfileImage } from '../../lib/imageOptimizer';

interface PersonalSectionProps {
  data: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({ data, onChange }) => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const optimizedDataUrl = await processProfileImage(file);
      handleChange('avatarUrl', optimizedDataUrl);
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj?.message || 'تعذر معالجة ملف الصورة المرفوع. يرجى تجربة صورة أخرى.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.personal.sectionTitle}</h3>
            <p className="text-xs text-slate-500">{t.personal.sectionDesc}</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.personal.fullName} <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-personal-name"
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder={t.personal.fullNamePlaceholder}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.personal.jobTitle} <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-personal-title"
              type="text"
              value={data.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              placeholder={t.personal.jobTitlePlaceholder}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{t.personal.email}</span>
              </label>
              <input
                id="input-personal-email"
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{t.personal.phone}</span>
              </label>
              <input
                id="input-personal-phone"
                type="tel"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 555-0199"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{t.personal.location}</span>
            </label>
            <input
              id="input-personal-location"
              type="text"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder={t.personal.locationPlaceholder}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Online Profiles & Social */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.personal.website}</h3>
            <p className="text-xs text-slate-500">{t.personal.avatarNote}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{t.personal.website}</span>
          </label>
          <input
            id="input-personal-website"
            type="url"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder={t.personal.websitePlaceholder}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-400" />
              <span>{t.personal.linkedin}</span>
            </label>
            <input
              id="input-personal-linkedin"
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-400" />
              <span>{t.personal.github}</span>
            </label>
            <input
              id="input-personal-github"
              type="text"
              value={data.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="github.com/..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Avatar Image Upload & Management */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-violet-600" />
              <span>{t.personal.avatarUrl}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 transition-colors"
            >
              <Link2 className="w-3 h-3" />
              <span>{showUrlInput ? (t.personal.uploadPhoto || 'رفع صورة') : (t.personal.avatarUrl || 'رابط صورة')}</span>
            </button>
          </label>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="hidden-avatar-file-input"
          />

          {/* Error Message if any */}
          {errorMessage && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {data.avatarUrl ? (
            /* Active Avatar Preview Card */
            <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3.5 transition-all shadow-xs">
              <div className="relative shrink-0">
                <img
                  src={data.avatarUrl}
                  alt={data.fullName || 'Profile Preview'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-violet-500/40 shadow-sm bg-white"
                />
                <span className="absolute bottom-0 end-0 p-1 bg-emerald-500 text-white rounded-full shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-start">
                <p className="text-xs font-bold text-slate-800">
                  {t.personal.uploadPhoto || 'تم اعتماد الصورة الشخصية'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t.personal.photoHelp || 'تم ضبط الحجم والتحسين تلقائياً لتظهر بأعلى جودة'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-initial px-3 py-1.5 bg-white border border-slate-200 hover:border-violet-300 hover:text-violet-600 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{t.personal.changePhoto || 'تغيير الصورة'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('avatarUrl', '')}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1"
                  title={t.personal.removePhoto || 'حذف'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">{t.personal.removePhoto || 'حذف'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-violet-500 bg-violet-50/50'
                  : 'border-slate-200 hover:border-violet-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-2 gap-2">
                  <Loader2 className="w-7 h-7 text-violet-600 animate-spin" />
                  <p className="text-xs font-semibold text-violet-700">
                    جاري معالجة وتحسين الصورة تلقائياً...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-center sm:text-start">
                    <p className="text-xs font-bold text-slate-800">
                      {t.personal.dragOrClick || 'اضغط هنا لاختيار صورتك الشخصية أو اسحبها إلى هنا'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t.personal.photoHelp || 'يدعم جميع أحجام وصيغ الصور، يتم تصغيرها وتحسينها بدقة فائقة تلقائياً'}
                    </p>
                  </div>
                  <div className="sm:ms-auto shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.personal.uploadPhoto || 'رفع صورة'}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Optional External URL Input */}
          {showUrlInput && (
            <div className="mt-2.5 flex items-center gap-2 animate-in fade-in">
              <input
                id="input-personal-avatar"
                type="url"
                value={data.avatarUrl || ''}
                onChange={(e) => handleChange('avatarUrl', e.target.value)}
                placeholder={t.personal.avatarPlaceholder}
                className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
