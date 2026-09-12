import React, { useState } from 'react';
import { Heart, Plus, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HobbiesSectionProps {
  hobbies: string[];
  onChange: (updated: string[]) => void;
}

const COMMON_HOBBIES = [
  'Mobile Photography',
  'Open Source',
  'Trail Running',
  'Chess',
  'Music Production',
  'Cooking',
  'Hiking',
  'Reading',
  '3D Printing',
];

export const HobbiesSection: React.FC<HobbiesSectionProps> = ({ hobbies, onChange }) => {
  const { t, isRTL } = useLanguage();
  const [hobbyInput, setHobbyInput] = useState('');

  const handleAdd = (val?: string) => {
    const item = (val || hobbyInput).trim();
    if (!item) return;

    if (hobbies.some((h) => h.toLowerCase() === item.toLowerCase())) {
      setHobbyInput('');
      return;
    }

    onChange([...hobbies, item]);
    setHobbyInput('');
  };

  const handleRemove = (index: number) => {
    onChange(hobbies.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.hobbies.sectionTitle}</h3>
            <p className="text-xs text-slate-500">{t.hobbies.sectionDesc}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={hobbyInput}
            onChange={(e) => setHobbyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={t.hobbies.hobbyPlaceholder}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
          />
          <button
            type="button"
            onClick={() => handleAdd()}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-violet-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.hobbies.addHobby}</span>
          </button>
        </div>
      </div>

      {/* Active Tags */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-800 mb-3">
          {t.hobbies.currentHobbies} ({hobbies.length})
        </h4>

        {hobbies.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">{t.hobbies.noHobbies}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 shadow-xs"
              >
                <span className="font-medium">{hobby}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-violet-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.skills.suggestionsTitle}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_HOBBIES.map((item) => {
            const isAdded = hobbies.some((h) => h.toLowerCase() === item.toLowerCase());
            return (
              <button
                key={item}
                type="button"
                disabled={isAdded}
                onClick={() => handleAdd(item)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  isAdded
                    ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-200 hover:border-violet-300'
                }`}
              >
                + {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
