import React, { useState } from 'react';
import { CVTheme, FontSizeOption, SpacingOption } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Type,
  AlignJustify,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface CustomizationToolbarProps {
  theme: CVTheme;
  onUpdateTheme: (updates: Partial<CVTheme>) => void;
  className?: string;
}

const FONT_OPTIONS: { id: FontSizeOption; scale: number; labelKey: string }[] = [
  { id: 'small', scale: 0.9, labelKey: 'fontSizeSmall' },
  { id: 'normal', scale: 1.0, labelKey: 'fontSizeNormal' },
  { id: 'large', scale: 1.1, labelKey: 'fontSizeLarge' },
  { id: 'xlarge', scale: 1.2, labelKey: 'fontSizeXLarge' },
];

const SPACING_OPTIONS: { id: SpacingOption; labelKey: string }[] = [
  { id: 'compact', labelKey: 'spacingCompact' },
  { id: 'normal', labelKey: 'spacingNormal' },
  { id: 'relaxed', labelKey: 'spacingRelaxed' },
];

export const CustomizationToolbar: React.FC<CustomizationToolbarProps> = ({
  theme,
  onUpdateTheme,
  className = '',
}) => {
  const { t, isRTL } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const currentFontSize = theme.fontSize || 'normal';
  const currentScale = theme.fontSizeScale ?? (
    currentFontSize === 'small' ? 0.9 :
    currentFontSize === 'large' ? 1.1 :
    currentFontSize === 'xlarge' ? 1.2 : 1.0
  );
  const currentSpacing = theme.spacing || 'normal';
  const isAutoFill = !!theme.autoFillPage;

  const handleSetFontSize = (option: FontSizeOption) => {
    const found = FONT_OPTIONS.find((f) => f.id === option);
    onUpdateTheme({
      fontSize: option,
      fontSizeScale: found ? found.scale : 1.0,
    });
  };

  const handleStepScale = (delta: number) => {
    const newScale = Number(Math.max(0.85, Math.min(1.25, currentScale + delta)).toFixed(2));
    let matchingOption: FontSizeOption = 'normal';
    if (newScale <= 0.92) matchingOption = 'small';
    else if (newScale >= 1.18) matchingOption = 'xlarge';
    else if (newScale >= 1.06) matchingOption = 'large';
    else matchingOption = 'normal';

    onUpdateTheme({
      fontSize: matchingOption,
      fontSizeScale: newScale,
    });
  };

  const handleSetSpacing = (spacing: SpacingOption) => {
    onUpdateTheme({ spacing });
  };

  const handleToggleAutoFill = () => {
    onUpdateTheme({ autoFillPage: !isAutoFill });
  };

  const handleResetDefaults = () => {
    onUpdateTheme({
      fontSize: 'normal',
      fontSizeScale: 1.0,
      spacing: 'normal',
      autoFillPage: false,
    });
  };

  const isModified =
    currentFontSize !== 'normal' ||
    Math.abs(currentScale - 1.0) > 0.01 ||
    currentSpacing !== 'normal' ||
    isAutoFill;

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all pointer-events-auto select-none ${className}`}
    >
      {/* Primary Bar: Quick summary and toggle */}
      <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 overflow-hidden w-full">
        <button
          id="btn-toggle-customization"
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-800 hover:text-violet-700 transition-colors cursor-pointer group min-w-0 shrink"
          title={isExpanded ? 'Collapse toolbar' : 'Expand live toolbar'}
        >
          <div className="p-1 sm:p-1.5 rounded-lg bg-violet-50 group-hover:bg-violet-100 text-violet-600 transition-colors shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="truncate max-w-[130px] min-[400px]:max-w-[170px] sm:max-w-none text-[11px] sm:text-xs">
            {t.previewControls.customizeLayout}
          </span>
          <span className="shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </span>
        </button>

        {/* Quick Inline Badges / Status */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Font scale quick indicator (visible on wider mobile / desktop) */}
          <span className="hidden min-[460px]:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0">
            {Math.round(currentScale * 100)}%
          </span>

          {/* Spacing badge (visible on tablet / desktop) */}
          <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 capitalize shrink-0">
            {t.previewControls[SPACING_OPTIONS.find((s) => s.id === currentSpacing)?.labelKey as keyof typeof t.previewControls] || currentSpacing}
          </span>

          {/* Auto-Fill smart toggle pill button (ALWAYS visible, never cut off) */}
          <button
            id="btn-quick-autofill"
            type="button"
            onClick={handleToggleAutoFill}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-xs active:scale-95 ${
              isAutoFill
                ? 'bg-violet-600 text-white border-violet-600 shadow-violet-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={t.previewControls.autoFillTip}
          >
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isAutoFill ? 'text-amber-300 fill-amber-300' : 'text-slate-400'}`} />
            <span className="whitespace-nowrap font-bold text-[11px] sm:text-xs">
              {t.previewControls.autoFillTitle}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100 flex flex-col gap-3 animate-fadeIn">
          {/* Row 1: Font Size Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 min-w-[120px]">
              <Type className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.previewControls.fontSizeTitle}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Steppers */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
                <button
                  id="btn-font-scale-minus"
                  type="button"
                  onClick={() => handleStepScale(-0.05)}
                  disabled={currentScale <= 0.85}
                  className="p-1.5 rounded-md hover:bg-white text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Decrease font size (-5%)"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 text-xs font-bold text-slate-800 min-w-[42px] text-center">
                  {Math.round(currentScale * 100)}%
                </span>
                <button
                  id="btn-font-scale-plus"
                  type="button"
                  onClick={() => handleStepScale(0.05)}
                  disabled={currentScale >= 1.25}
                  className="p-1.5 rounded-md hover:bg-white text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Increase font size (+5%)"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Segmented Preset Buttons */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 flex-1 sm:flex-none">
                {FONT_OPTIONS.map((opt) => {
                  const active = currentFontSize === opt.id;
                  const label = t.previewControls[opt.labelKey as keyof typeof t.previewControls] as string;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSetFontSize(opt.id)}
                      className={`flex-1 sm:flex-none px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        active
                          ? 'bg-white text-violet-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: Spacing & Section Margins */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 min-w-[120px]">
              <AlignJustify className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.previewControls.spacingTitle}</span>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 w-full sm:w-auto">
              {SPACING_OPTIONS.map((opt) => {
                const active = currentSpacing === opt.id;
                const label = t.previewControls[opt.labelKey as keyof typeof t.previewControls] as string;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSetSpacing(opt.id)}
                    className={`flex-1 sm:flex-none px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-violet-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Smart Page-Filling Mode (Auto-Expand) */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-violet-50/60 border border-violet-200/60">
            <div className="flex items-start gap-2 min-w-0">
              <div className="p-1 rounded-md bg-violet-100 text-violet-700 mt-0.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    {t.previewControls.autoFillTitle}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-violet-600 text-white tracking-wider">
                    {t.previewControls.autoFillBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  {t.previewControls.autoFillTip}
                </p>
              </div>
            </div>

            {/* iOS style Toggle Switch */}
            <button
              id="switch-autofill-page"
              type="button"
              role="switch"
              aria-checked={isAutoFill}
              onClick={handleToggleAutoFill}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isAutoFill ? 'bg-violet-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAutoFill
                    ? isRTL
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Footer of toolbar: Reset to standard defaults */}
          {isModified && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isRTL ? 'إعادة التعيين' : 'Reset to default'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
