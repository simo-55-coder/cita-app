import React, { useState } from 'react';
import { LanguageItem } from '../../types';
import { Languages, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguagesSectionProps {
  languages: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

const COMMON_LANGUAGES = ['Arabic', 'French', 'English', 'Spanish', 'German', 'Mandarin', 'Japanese'];

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages, onChange }) => {
  const { t, isRTL } = useLanguage();
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState<LanguageItem['proficiency']>('Fluent');

  const handleAdd = (langName?: string) => {
    const finalName = (langName || name).trim();
    if (!finalName) return;

    if (languages.some((l) => l.name.toLowerCase() === finalName.toLowerCase())) {
      setName('');
      return;
    }

    onChange([
      ...languages,
      {
        id: `lang-${Date.now()}`,
        name: finalName,
        proficiency,
      },
    ]);
    setName('');
  };

  const handleRemove = (id: string) => {
    onChange(languages.filter((l) => l.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...languages];
    const item = next[index];
    next[index] = next[index - 1];
    next[index - 1] = item;
    onChange(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === languages.length - 1) return;
    const next = [...languages];
    const item = next[index];
    next[index] = next[index + 1];
    next[index + 1] = item;
    onChange(next);
  };

  const handleUpdateProficiency = (id: string, newProf: LanguageItem['proficiency']) => {
    onChange(languages.map((l) => (l.id === id ? { ...l, proficiency: newProf } : l)));
  };

  const profOptions: LanguageItem['proficiency'][] = ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'];

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.languages.sectionTitle}</h3>
            <p className="text-xs text-slate-500">{t.languages.sectionDesc}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.languages.languagePlaceholder}
              className="sm:col-span-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
            />
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as LanguageItem['proficiency'])}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs cursor-pointer"
            >
              {profOptions.map((p) => (
                <option key={p} value={p}>
                  {t.proficiencies[p]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleAdd()}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.languages.addLanguage}</span>
          </button>
        </div>
      </div>

      {/* Active Languages List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-800 mb-3">
          {t.languages.currentLanguages} ({languages.length})
        </h4>

        {languages.length === 0 ? (
          <p className="text-xs text-slate-400 italic">{t.languages.noLanguages}</p>
        ) : (
          <div className="space-y-2">
            {languages.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === languages.length - 1;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/90 shadow-xs"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <select
                      value={item.proficiency}
                      onChange={(e) =>
                        handleUpdateProficiency(item.id, e.target.value as LanguageItem['proficiency'])
                      }
                      className="bg-violet-50 border border-violet-200 rounded-lg text-[11px] font-bold text-violet-700 px-2 py-1 outline-none cursor-pointer"
                    >
                      {profOptions.map((p) => (
                        <option key={p} value={p}>
                          {t.proficiencies[p]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveUp(index)}
                      title={t.moveUp}
                      className={`p-1 rounded-lg transition-colors ${
                        isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                      }`}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveDown(index)}
                      title={t.moveDown}
                      className={`p-1 rounded-lg transition-colors ${
                        isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      title={t.delete}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <span className="text-xs font-semibold text-slate-500 block mb-2">{t.skills.suggestionsTitle}:</span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_LANGUAGES.map((langItem) => {
            const isAdded = languages.some((l) => l.name.toLowerCase() === langItem.toLowerCase());
            return (
              <button
                key={langItem}
                type="button"
                disabled={isAdded}
                onClick={() => handleAdd(langItem)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  isAdded
                    ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-200 hover:border-violet-300'
                }`}
              >
                + {langItem}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
