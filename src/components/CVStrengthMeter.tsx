import React, { useState } from 'react';
import { CVData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Circle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CVStrengthMeterProps {
  data: CVData;
  variant?: 'default' | 'mini';
}

export const CVStrengthMeter: React.FC<CVStrengthMeterProps> = ({ data, variant = 'default' }) => {
  const { t, isRTL } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute checklist and weighted score
  const checks = [
    {
      id: 'name-title',
      label: t.strength.checkNameTitle,
      done: !!(data.personal.fullName?.trim() && data.personal.jobTitle?.trim()),
      weight: 20,
    },
    {
      id: 'contact',
      label: t.strength.checkContact,
      done: !!(data.personal.email?.trim() || data.personal.phone?.trim()),
      weight: 15,
    },
    {
      id: 'summary',
      label: t.strength.checkSummary,
      done: !!(data.summary?.trim() && data.summary.trim().length > 30),
      weight: 15,
    },
    {
      id: 'experience',
      label: t.strength.checkExperience,
      done: (data.experiences?.length || 0) >= 1,
      weight: 20,
    },
    {
      id: 'education',
      label: t.strength.checkEducation,
      done: (data.education?.length || 0) >= 1,
      weight: 15,
    },
    {
      id: 'skills',
      label: t.strength.checkSkills,
      done: (data.skills?.length || 0) >= 3,
      weight: 10,
    },
    {
      id: 'languages',
      label: t.strength.checkLanguages,
      done: (data.languages?.length || 0) >= 1,
      weight: 5,
    },
  ];

  const totalScore = checks.reduce((acc, curr) => (curr.done ? acc + curr.weight : acc), 0);

  // Color & badge determination
  let statusColor = 'bg-amber-500';
  let badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  let label: string = t.strength.needsWork;

  if (totalScore >= 95) {
    statusColor = 'bg-emerald-500';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = t.strength.complete;
  } else if (totalScore >= 70) {
    statusColor = 'bg-violet-600';
    badgeBg = 'bg-violet-50 text-violet-700 border-violet-200';
    label = t.strength.strong;
  } else if (totalScore >= 40) {
    statusColor = 'bg-blue-500';
    badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
    label = t.strength.good;
  }

  const completedCount = checks.filter((c) => c.done).length;

  if (variant === 'mini') {
    return (
      <div className="relative group cursor-pointer pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-2 py-1.5 border border-slate-200/80 shadow-xs hover:bg-slate-200 transition-colors">
          <Sparkles className={`w-3.5 h-3.5 ${statusColor.replace('bg-', 'text-')}`} />
          <div className="flex flex-col gap-0.5">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalScore}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`h-full rounded-full ${statusColor}`}
              />
            </div>
            <span className="text-[9px] font-bold text-slate-600 leading-none">
              {label} ({totalScore}%)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all mb-3.5">
      {/* Clickable Header bar */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                {t.strength.title}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeBg}`}>
                {label} ({totalScore}%)
              </span>
            </div>
            {/* Mini Progress track */}
            <div className="w-36 sm:w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalScore}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`h-full rounded-full ${statusColor}`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <span className="text-[11px] font-medium hidden sm:inline">
            {completedCount}/{checks.length}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expandable Checklist Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100 bg-slate-50/60 px-3.5 py-3"
          >
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              {t.strength.suggestions}:
            </p>
            <div className="space-y-1.5">
              {checks.map((check) => (
                <div
                  key={check.id}
                  className={`flex items-center gap-2 text-xs py-1 px-2 rounded-xl transition-colors ${
                    check.done ? 'bg-emerald-50/50 text-emerald-800' : 'bg-white text-slate-600 border border-slate-100'
                  }`}
                >
                  {check.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={`text-[11px] leading-tight ${check.done ? 'line-through opacity-80' : 'font-medium'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
