import React, { useState } from 'react';
import { EducationItem } from '../../types';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface EducationSectionProps {
  education: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education, onChange }) => {
  const { t, isRTL } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const handleAdd = () => {
    const newId = `edu-${Date.now()}`;
    const newEdu: EducationItem = {
      id: newId,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    onChange([newEdu, ...education]);
    setExpandedId(newId);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(education.filter((edu) => edu.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleUpdate = (id: string, field: keyof EducationItem, value: string) => {
    onChange(
      education.map((edu) => {
        if (edu.id === id) {
          return { ...edu, [field]: value };
        }
        return edu;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.education.sectionTitle}</h3>
            <p className="text-xs text-slate-500">{t.education.sectionDesc}</p>
          </div>
        </div>

        <button
          type="button"
          id="btn-add-education"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.education.addDegree}</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">{t.education.noEntries}</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 font-semibold hover:underline"
          >
            {t.education.addFirstPrompt}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu) => {
            const isExpanded = expandedId === edu.id;

            return (
              <div
                key={edu.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {edu.degree || (isRTL ? 'الدرجة العلمية' : 'Degree Title')}
                    </span>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {edu.institution || (isRTL ? 'الجامعة / المؤسسة' : 'University / Institution')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(edu.id, e)}
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

                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-100 space-y-3.5 bg-slate-50/50">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.education.degree} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                        placeholder={t.education.degreePlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.education.institution} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                        placeholder={t.education.institutionPlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.education.fieldOfStudy}
                        </label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => handleUpdate(edu.id, 'fieldOfStudy', e.target.value)}
                          placeholder={t.education.fieldOfStudyPlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.education.location}
                        </label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                          placeholder={t.education.locationPlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.education.startDate}
                        </label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                          placeholder="2015-09"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.education.endDate}
                        </label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                          placeholder="2019-05"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.education.gpa}
                        </label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => handleUpdate(edu.id, 'gpa', e.target.value)}
                          placeholder={t.education.gpaPlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
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
