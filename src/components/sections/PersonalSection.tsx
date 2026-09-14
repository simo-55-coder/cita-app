import React from 'react';
import { PersonalInfo } from '../../types';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Image as ImageIcon, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PersonalSectionProps {
  data: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({ data, onChange }) => {
  const { t } = useLanguage();

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
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

        {/* Avatar Image URL & Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-slate-400" />
            <span>{t.personal.avatarUrl}</span>
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              id="input-personal-avatar"
              type="url"
              value={data.avatarUrl || ''}
              onChange={(e) => handleChange('avatarUrl', e.target.value)}
              placeholder={t.personal.avatarPlaceholder}
              className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all shadow-xs"
            />
            <div className="relative shrink-0">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleChange('avatarUrl', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Upload Image"
              />
              <button
                type="button"
                className="w-full sm:w-auto bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
