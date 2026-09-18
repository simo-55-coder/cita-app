import React from 'react';
import { User } from 'firebase/auth';
import { Eye, Edit3, Cloud, Eraser, Globe, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { motion } from 'motion/react';

interface HeaderProps {
  viewMode: 'wizard' | 'preview';
  onToggleViewMode: () => void;
  onOpenDriveModal: () => void;
  onOpenSettings: () => void;
  currentUser: User | null;
  onResetSample: () => void;
}

const LANGUAGES: { code: Language; label: string; name: string }[] = [
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
];

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onOpenDriveModal,
  onOpenSettings,
  currentUser,
  onResetSample,
}) => {
  const { lang, setLang, t, isRTL } = useLanguage();

  return (
    <header className="w-full max-w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 py-2 flex items-center justify-between shadow-xs">
      {/* App Logo & Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-violet-600/25 shrink-0 p-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M14 7.5c-1-1.5-3-2.5-5.5-2.5-3.5 0-6.5 3-6.5 6.5s3 6.5 6.5 6.5c2.5 0 4.5-1 5.5-2.5" />
            <path d="M11 7l4.5 8.5L20 7" />
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-xs font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-1.5 truncate">
            <span>{t.appTitle}</span>
            {t.appBadge && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-violet-100 text-violet-700 border border-violet-200 shrink-0">
                {t.appBadge}
              </span>
            )}
          </h1>
          <p className="text-[10px] text-slate-500 font-medium truncate">{t.appSubtitle}</p>
        </div>
      </div>

      {/* Center / Right Controls: Language Switcher & Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Language Switcher Segmented Control (AR | FR | EN) */}
        <div
          id="language-switcher"
          className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-xs"
        >
          {LANGUAGES.map((item) => {
            const isSelected = lang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code)}
                title={item.name}
                style={isSelected ? { backgroundColor: '#7C3AED', color: '#ffffff' } : undefined}
                className={`
                  px-2 py-1 text-[11px] font-bold rounded-md transition-all duration-150 outline-none select-none
                  ${isSelected 
                    ? 'shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Reset / Sample Data button */}
        <button
          id="btn-header-reset"
          onClick={onResetSample}
          title={t.resetSample}
          className="p-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs"
        >
          <Eraser className="w-3.5 h-3.5" />
        </button>

        {/* View Mode Toggle (Editor vs Preview) */}
        <button
          id="btn-header-toggle-view"
          onClick={onToggleViewMode}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            viewMode === 'preview'
              ? 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-600 text-white shadow-violet-600/25'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
          }`}
        >
          {viewMode === 'preview' ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.edit}</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-violet-600" />
              <span className="hidden sm:inline">{t.preview}</span>
            </>
          )}
        </button>

        {/* Settings Button */}
        <button
          id="btn-header-settings"
          onClick={onOpenSettings}
          title="Settings"
          className="p-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
