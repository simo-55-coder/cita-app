import React from 'react';
import { CVTheme, TemplateId } from '../../types';
import { Palette, Check, Type } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TemplateSelector } from '../TemplateSelector';

interface ThemeSectionProps {
  theme: CVTheme;
  onChange: (updated: CVTheme) => void;
  onOpenPreview?: () => void;
}

const COLOR_PRESETS = [
  { name: 'Royal Violet', color: '#7c3aed' },
  { name: 'Indigo Velvet', color: '#4f46e5' },
  { name: 'Midnight Navy', color: '#1e40af' },
  { name: 'Emerald Tech', color: '#059669' },
  { name: 'Executive Ruby', color: '#be123c' },
  { name: 'Dark Slate', color: '#334155' },
  { name: 'Amber Glow', color: '#b45309' },
  { name: 'Teal Modern', color: '#0d9488' },
];

export const ThemeSection: React.FC<ThemeSectionProps> = ({ theme, onChange, onOpenPreview }) => {
  const { t, isRTL } = useLanguage();
  const currentPrimary = theme.primaryColor || '#7c3aed';
  const currentTemplate = (theme.template || theme.layoutStyle || 'modern') as TemplateId;

  const handleTemplateSelect = (templateId: TemplateId) => {
    onChange({
      ...theme,
      template: templateId,
      layoutStyle: templateId,
    });
  };

  const handleColorSelect = (color: string) => {
    onChange({
      ...theme,
      primaryColor: color,
    });
  };

  const handleFontSelect = (font: CVTheme['fontFamily']) => {
    onChange({
      ...theme,
      fontFamily: font,
    });
  };

  return (
    <div className="w-full max-w-full space-y-5">
      {/* 1. Dedicated Templates Selector */}
      <TemplateSelector
        currentTemplate={currentTemplate}
        primaryColor={currentPrimary}
        onSelectTemplate={handleTemplateSelect}
        onOpenPreview={onOpenPreview}
      />

      {/* 2. Customization Section Header */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          {t.templates.customizationTitle}
        </h4>
      </div>

      {/* 3. Palette Colors */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.templates.colorsTitle}</h3>
            <p className="text-xs text-slate-500">{t.templates.colorsDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = currentPrimary.toLowerCase() === preset.color.toLowerCase();
            return (
              <button
                key={preset.color}
                type="button"
                onClick={() => handleColorSelect(preset.color)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-start ${
                  isSelected
                    ? 'border-violet-600 bg-violet-50/80 shadow-xs ring-2 ring-violet-500/30'
                    : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: preset.color }}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-xs font-semibold text-slate-700 truncate">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom hex color input */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <label className="text-xs font-semibold text-slate-700">
            {t.theme.customColor}:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentPrimary}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <span className="text-xs font-mono text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
              {currentPrimary}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Font Family Selection */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.templates.fontsTitle}</h3>
            <p className="text-xs text-slate-500">{t.templates.fontsDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleFontSelect('sans')}
            className={`p-3.5 rounded-xl border text-start transition-all ${
              theme.fontFamily === 'sans'
                ? 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-500/30'
                : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
            }`}
          >
            <span className="block text-xs font-bold text-slate-800 font-sans">
              Plus Jakarta Sans {isRTL ? '(Cairo)' : ''}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.theme.modernSansDesc}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleFontSelect('serif')}
            className={`p-3.5 rounded-xl border text-start transition-all ${
              theme.fontFamily === 'serif'
                ? 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-500/30'
                : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
            }`}
          >
            <span className="block text-xs font-bold text-slate-800 font-serif">
              Playfair Display {isRTL ? '(Tajawal)' : ''}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.theme.classicSerifDesc}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
