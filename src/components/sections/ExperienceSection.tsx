import React, { useState } from 'react';
import { ExperienceItem } from '../../types';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp, PlusCircle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, onChange }) => {
  const { t, isRTL } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const handleAddExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newExp: ExperienceItem = {
      id: newId,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: true,
      description: '',
      highlights: [''],
    };
    onChange([newExp, ...experiences]);
    setExpandedId(newId);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(experiences.filter((exp) => exp.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleUpdate = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id === id) {
          return { ...exp, [field]: value };
        }
        return exp;
      })
    );
  };

  const handleAddHighlight = (expId: string) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            highlights: [...exp.highlights, ''],
          };
        }
        return exp;
      })
    );
  };

  const handleUpdateHighlight = (expId: string, index: number, value: string) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id === expId) {
          const updatedHighlights = [...exp.highlights];
          updatedHighlights[index] = value;
          return { ...exp, highlights: updatedHighlights };
        }
        return exp;
      })
    );
  };

  const handleRemoveHighlight = (expId: string, index: number) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            highlights: exp.highlights.filter((_, i) => i !== index),
          };
        }
        return exp;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.experience.sectionTitle}</h3>
            <p className="text-xs text-slate-500">{t.experience.sectionDesc}</p>
          </div>
        </div>

        <button
          type="button"
          id="btn-add-experience"
          onClick={handleAddExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.experience.addPosition}</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">{t.experience.noEntries}</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 font-semibold hover:underline"
          >
            {t.experience.addFirstPrompt}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;

            return (
              <div
                key={exp.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                {/* Collapsible Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {exp.position || (isRTL ? 'وظيفة بدون مسمى' : 'Untitled Position')}
                      </span>
                      {exp.current && (
                        <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded font-medium shrink-0">
                          {t.present}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {exp.company || (isRTL ? 'اسم الشركة' : 'Company Name')} {exp.location ? `• ${exp.location}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(exp.id, e)}
                      title={t.delete}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Form Fields */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-100 space-y-3.5 bg-slate-50/50">
                    {/* Position */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.experience.position} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                        placeholder={t.experience.positionPlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>

                    {/* Company & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.experience.company} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                          placeholder={t.experience.companyPlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.experience.location}
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleUpdate(exp.id, 'location', e.target.value)}
                          placeholder={t.experience.locationPlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.experience.startDate}
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                          placeholder={t.experience.datePlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.experience.endDate}
                        </label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? t.present : exp.endDate}
                          onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                          placeholder={t.experience.datePlaceholder}
                          className={`w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs ${
                            exp.current ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Current Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleUpdate(exp.id, 'current', e.target.checked)}
                        className="w-4 h-4 rounded text-violet-600 bg-white border-slate-300 focus:ring-violet-500"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        {t.experience.current}
                      </span>
                    </label>

                    {/* Overview Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.experience.description}
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)}
                        placeholder={t.experience.descriptionPlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>

                    {/* Key Highlights / Achievements */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-700">
                          {t.experience.highlights}
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddHighlight(exp.id)}
                          className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>{t.experience.addHighlight}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {exp.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => handleUpdateHighlight(exp.id, index, e.target.value)}
                              placeholder={t.experience.highlightPlaceholder}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                            />
                            {exp.highlights.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveHighlight(exp.id, index)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
