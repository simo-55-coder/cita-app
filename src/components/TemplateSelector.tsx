import React from 'react';
import { TemplateId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Check, Sparkles, LayoutTemplate, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface TemplateSelectorProps {
  currentTemplate: TemplateId;
  primaryColor: string;
  onSelectTemplate: (templateId: TemplateId) => void;
  onOpenPreview?: () => void;
}

interface TemplateItemDef {
  id: TemplateId;
  iconAccent: string;
}

const TEMPLATE_DEFS: TemplateItemDef[] = [
  { id: 'modern', iconAccent: '#8b5cf6' },
  { id: 'executive', iconAccent: '#1e3a8a' },
  { id: 'creative', iconAccent: '#ec4899' },
  { id: 'minimalist', iconAccent: '#0f172a' },
];

/**
 * Scaled SVG Miniature Layout Mockup representing each template structure
 */
const TemplateMiniMockup: React.FC<{
  templateId: TemplateId;
  primaryColor: string;
  isRTL: boolean;
}> = ({ templateId, primaryColor, isRTL }) => {
  const accent = primaryColor || '#7c3aed';

  if (templateId === 'modern') {
    return (
      <div className="w-full h-32 bg-white rounded-lg p-2 border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden select-none">
        {/* Modern Header */}
        <div className="flex items-center gap-2 pb-1.5 border-b" style={{ borderColor: `${accent}30` }}>
          <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-20 rounded-xs" style={{ backgroundColor: accent }} />
            <div className="h-1 w-14 bg-slate-300 rounded-xs" />
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className={`grid grid-cols-12 gap-1.5 flex-1 pt-1.5 ${isRTL ? 'direction-rtl' : ''}`}>
          {/* Main Column */}
          <div className="col-span-8 space-y-1.5">
            <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: accent }} />
            <div className="pl-1 space-y-1 border-l-2" style={{ borderColor: `${accent}40` }}>
              <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
              <div className="h-1 w-5/6 bg-slate-100 rounded-xs" />
              <div className="h-1 w-4/6 bg-slate-100 rounded-xs" />
            </div>
            <div className="pl-1 space-y-1 border-l-2" style={{ borderColor: `${accent}40` }}>
              <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
              <div className="h-1 w-3/4 bg-slate-100 rounded-xs" />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-1.5">
            <div className="h-1.5 w-8 rounded-xs" style={{ backgroundColor: accent }} />
            <div className="flex flex-wrap gap-0.5">
              <span className="h-2 w-5 rounded-xs" style={{ backgroundColor: `${accent}20` }} />
              <span className="h-2 w-6 rounded-xs" style={{ backgroundColor: `${accent}20` }} />
              <span className="h-2 w-4 rounded-xs" style={{ backgroundColor: `${accent}20` }} />
            </div>
            <div className="h-1.5 w-8 rounded-xs mt-1" style={{ backgroundColor: accent }} />
            <div className="space-y-0.5">
              <div className="h-1 w-full bg-slate-200 rounded-xs" />
              <div className="h-1 w-4/5 bg-slate-200 rounded-xs" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'executive') {
    return (
      <div className="w-full h-32 bg-white rounded-lg p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden select-none">
        {/* Formal Centered Header */}
        <div className="text-center pb-1.5 space-y-1">
          <div className="h-2 w-28 mx-auto rounded-xs" style={{ backgroundColor: accent }} />
          <div className="h-1 w-20 mx-auto bg-slate-400 rounded-xs" />
          <div className="flex justify-center gap-1 text-[6px] text-slate-400">
            <span className="h-1 w-12 bg-slate-200 rounded-xs" />
            <span className="h-1 w-12 bg-slate-200 rounded-xs" />
          </div>
          {/* Double Rule line */}
          <div className="border-b-2 border-double mt-1" style={{ borderColor: accent }} />
        </div>

        {/* Structured Horizontal Sections */}
        <div className="flex-1 space-y-2 pt-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="h-1.5 w-16 uppercase font-bold rounded-xs" style={{ backgroundColor: accent }} />
              <div className="h-1 w-8 bg-slate-300 rounded-xs" />
            </div>
            <div className="h-1 w-full bg-slate-200 rounded-xs" />
            <div className="h-1 w-11/12 bg-slate-100 rounded-xs" />
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-1">
            <div className="flex items-center justify-between">
              <div className="h-1.5 w-20 rounded-xs" style={{ backgroundColor: accent }} />
              <div className="h-1 w-10 bg-slate-300 rounded-xs" />
            </div>
            <div className="h-1 w-full bg-slate-200 rounded-xs" />
            <div className="h-1 w-4/5 bg-slate-100 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'creative') {
    return (
      <div className="w-full h-32 bg-white rounded-lg border border-slate-200/80 shadow-xs flex overflow-hidden select-none">
        {/* Creative Accent Sidebar */}
        <div
          className={`w-1/3 p-1.5 flex flex-col justify-between ${
            isRTL ? 'order-last' : 'order-first'
          }`}
          style={{ backgroundColor: `${accent}18`, borderRight: isRTL ? 'none' : `1px solid ${accent}30`, borderLeft: isRTL ? `1px solid ${accent}30` : 'none' }}
        >
          <div className="space-y-1.5">
            <div className="w-6 h-6 rounded-full mx-auto" style={{ backgroundColor: accent }} />
            <div className="h-1 w-10 mx-auto bg-slate-400 rounded-xs" />
            <div className="h-1 w-8 mx-auto bg-slate-300 rounded-xs" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-10 rounded-xs" style={{ backgroundColor: accent }} />
            <div className="h-1 w-full bg-slate-300 rounded-xs" />
            <div className="h-1 w-4/5 bg-slate-300 rounded-xs" />
            <div className="h-1 w-3/5 bg-slate-300 rounded-xs" />
          </div>
          <div className="flex flex-wrap gap-0.5">
            <span className="h-2 w-5 rounded-xs" style={{ backgroundColor: accent }} />
            <span className="h-2 w-4 rounded-xs" style={{ backgroundColor: accent }} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-2/3 p-2 flex flex-col justify-between space-y-1.5">
          <div className="space-y-1">
            <div className="h-2.5 w-24 rounded-xs font-bold" style={{ backgroundColor: accent }} />
            <div className="h-1.5 w-16 bg-slate-400 rounded-xs" />
            <div className="h-1 w-full bg-slate-100 rounded-xs" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: accent }} />
            <div className="h-1 w-full bg-slate-200 rounded-xs" />
            <div className="h-1 w-5/6 bg-slate-100 rounded-xs" />
            <div className="h-1 w-4/6 bg-slate-100 rounded-xs" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: accent }} />
            <div className="h-1 w-full bg-slate-200 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // Minimalist Clean
  return (
    <div className="w-full h-32 bg-white rounded-lg p-2.5 border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden select-none">
      {/* Linear Single Column Minimalist */}
      <div className="space-y-1 pb-1 border-b border-slate-200">
        <div className="h-2.5 w-28 rounded-xs font-bold" style={{ backgroundColor: accent }} />
        <div className="h-1 w-16 bg-slate-400 rounded-xs" />
        <div className="h-0.5 w-full bg-slate-200 rounded-xs" />
      </div>

      <div className="space-y-1.5 flex-1 pt-1">
        <div className="space-y-0.5">
          <div className="flex justify-between">
            <div className="h-1.5 w-16 font-semibold" style={{ backgroundColor: accent }} />
            <div className="h-1 w-8 bg-slate-300 rounded-xs" />
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-xs" />
          <div className="h-1 w-11/12 bg-slate-100 rounded-xs" />
        </div>

        <div className="space-y-0.5">
          <div className="flex justify-between">
            <div className="h-1.5 w-14 font-semibold" style={{ backgroundColor: accent }} />
            <div className="h-1 w-7 bg-slate-300 rounded-xs" />
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-xs" />
        </div>

        <div className="flex items-center gap-1 pt-0.5">
          <span className="h-1.5 w-8 rounded-xs" style={{ backgroundColor: `${accent}30` }} />
          <span className="h-1.5 w-10 rounded-xs" style={{ backgroundColor: `${accent}30` }} />
          <span className="h-1.5 w-7 rounded-xs" style={{ backgroundColor: `${accent}30` }} />
        </div>
      </div>
    </div>
  );
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentTemplate,
  primaryColor,
  onSelectTemplate,
  onOpenPreview,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="w-full max-w-full space-y-4">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.templates.sectionTitle}</h3>
              <p className="text-xs text-slate-500">{t.templates.sectionDesc}</p>
            </div>
          </div>

          {onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 active:bg-violet-200 text-violet-700 text-xs font-bold border border-violet-200 transition-all shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.livePreview}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of 4 Distinct Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-full">
        {TEMPLATE_DEFS.map((tmpl) => {
          const isSelected = currentTemplate === tmpl.id;
          const meta = t.templates[tmpl.id];

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`relative group rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-start select-none ${
                isSelected
                  ? 'bg-violet-50/60 border-violet-600 shadow-md ring-2 ring-violet-500/30'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
              }`}
            >
              {/* Top Badge Row */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {meta.badge}
                </span>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-100/90 px-2 py-0.5 rounded-full border border-violet-200">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>{t.templates.activeBadge}</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 opacity-60" />
                    <span>{t.templates.selectButton}</span>
                  </span>
                )}
              </div>

              {/* Scaled Visual Representation */}
              <div className="w-full">
                <TemplateMiniMockup
                  templateId={tmpl.id}
                  primaryColor={primaryColor}
                  isRTL={isRTL}
                />
              </div>

              {/* Template Title & Description */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>{meta.name}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {meta.desc}
                </p>
              </div>

              {/* Key Features Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/60">
                {meta.features.map((feat: string, i: number) => (
                  <span
                    key={i}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white text-violet-800 border border-violet-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {feat}
                  </span>
                ))}
              </div>

              {/* Selection Action Button */}
              <button
                type="button"
                id={`btn-select-template-${tmpl.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(tmpl.id);
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{t.templates.selectedButton}</span>
                  </>
                ) : (
                  <span>{t.templates.selectButton}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
