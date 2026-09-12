import React, { useState } from 'react';
import { SkillItem } from '../../types';
import { Code2, Plus, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SkillsSectionProps {
  skills: SkillItem[];
  onChange: (updated: SkillItem[]) => void;
}

const POPULAR_SUGGESTIONS = [
  'React',
  'React Native',
  'Android SDK',
  'Kotlin',
  'TypeScript',
  'Swift',
  'Flutter',
  'Tailwind CSS',
  'Figma',
  'GraphQL',
  'REST APIs',
  'Git / GitHub',
  'Jest & Testing',
  'UI/UX Design',
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onChange }) => {
  const { t, isRTL } = useLanguage();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem['level']>('Advanced');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem['category']>('Technical');

  const handleAddSkill = (nameToAdd?: string) => {
    const name = (nameToAdd || newSkillName).trim();
    if (!name) return;

    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillName('');
      return;
    }

    const newSkill: SkillItem = {
      id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name,
      level: newSkillLevel,
      category: newSkillCategory,
    };

    onChange([...skills, newSkill]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleLevelChange = (id: string, level: SkillItem['level']) => {
    onChange(
      skills.map((s) => (s.id === id ? { ...s, level } : s))
    );
  };

  const levelOptions: SkillItem['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.skills.sectionTitle}</h3>
            <p className="text-xs text-slate-500">{t.skills.sectionDesc}</p>
          </div>
        </div>

        {/* Input Bar for adding custom skill */}
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder={t.skills.skillPlaceholder}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
            />
            <button
              type="button"
              id="btn-add-skill-input"
              onClick={() => handleAddSkill()}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-violet-600/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.skills.addSkill}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{t.skills.defaultLevel}:</span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {levelOptions.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setNewSkillLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                    newSkillLevel === lvl
                      ? 'bg-violet-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.levels[lvl]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Skills Pills with Quick Level Selector */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800">
            {t.skills.currentSkills} ({skills.length})
          </span>
          <span className="text-[11px] text-slate-500">{t.skills.levelTip}</span>
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">{t.skills.noSkills}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 shadow-xs"
              >
                <span className="font-semibold text-slate-800">{skill.name}</span>

                {/* Level selector badge */}
                <select
                  value={skill.level}
                  onChange={(e) => handleLevelChange(skill.id, e.target.value as SkillItem['level'])}
                  className="bg-violet-50 border border-violet-200 text-violet-700 rounded-lg text-[10px] font-bold px-1.5 py-0.5 outline-none cursor-pointer"
                >
                  {levelOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {t.levels[lvl]}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  title={t.delete}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-violet-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.skills.suggestionsTitle}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SUGGESTIONS.map((suggestion) => {
            const isAdded = skills.some((s) => s.name.toLowerCase() === suggestion.toLowerCase());
            return (
              <button
                key={suggestion}
                type="button"
                disabled={isAdded}
                onClick={() => handleAddSkill(suggestion)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  isAdded
                    ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-200 hover:border-violet-300'
                }`}
              >
                + {suggestion}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
