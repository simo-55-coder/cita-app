import React from 'react';
import { CVData, WizardTabKey } from '../types';
import { WizardTabs } from './WizardTabs';
import { CVStrengthMeter } from './CVStrengthMeter';
import { PersonalSection } from './sections/PersonalSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { HobbiesSection } from './sections/HobbiesSection';
import { ThemeSection } from './sections/ThemeSection';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface WizardProps {
  data: CVData;
  activeTab: WizardTabKey;
  onTabChange: (tab: WizardTabKey) => void;
  onUpdateCV: (updater: (prev: CVData) => CVData) => void;
  onOpenPreview: () => void;
}

const TAB_ORDER: WizardTabKey[] = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'certifications',
  'hobbies',
  'theme',
];

export const Wizard: React.FC<WizardProps> = ({
  data,
  activeTab,
  onTabChange,
  onUpdateCV,
  onOpenPreview,
}) => {
  const { t, isRTL } = useLanguage();
  const currentIndex = TAB_ORDER.indexOf(activeTab);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TAB_ORDER.length - 1;

  const handlePrev = () => {
    if (!isFirst) {
      onTabChange(TAB_ORDER[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      onTabChange(TAB_ORDER[currentIndex + 1]);
    } else {
      onOpenPreview();
    }
  };

  const tabCounts: Record<WizardTabKey, number | string> = {
    personal: data.personal.fullName ? '✓' : '',
    summary: data.summary ? '✓' : '',
    experience: data.experiences.length,
    education: data.education.length,
    skills: data.skills.length,
    languages: data.languages.length,
    certifications: data.certifications?.length || 0,
    hobbies: data.hobbies.length,
    theme: '',
  };

  // Direction-aware icons
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const NextIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full max-w-full flex flex-col flex-1 pb-24 overflow-x-hidden">
      {/* Horizontal Tabs Bar */}
      <WizardTabs
        activeTab={activeTab}
        onSelectTab={onTabChange}
        tabCounts={tabCounts}
      />

      {/* Main Form Content Area */}
      <div className="w-full max-w-full px-3.5 py-4 flex-1">
        {/* CV Strength Completion Meter */}
        <CVStrengthMeter data={data} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-full"
          >
            {activeTab === 'personal' && (
              <PersonalSection
                data={data.personal}
                onChange={(personal) => onUpdateCV((prev) => ({ ...prev, personal }))}
              />
            )}
            {activeTab === 'summary' && (
              <SummarySection
                summary={data.summary}
                onChange={(summary) => onUpdateCV((prev) => ({ ...prev, summary }))}
              />
            )}
            {activeTab === 'experience' && (
              <ExperienceSection
                experiences={data.experiences}
                onChange={(experiences) => onUpdateCV((prev) => ({ ...prev, experiences }))}
              />
            )}
            {activeTab === 'education' && (
              <EducationSection
                education={data.education}
                onChange={(education) => onUpdateCV((prev) => ({ ...prev, education }))}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsSection
                skills={data.skills}
                onChange={(skills) => onUpdateCV((prev) => ({ ...prev, skills }))}
              />
            )}
            {activeTab === 'languages' && (
              <LanguagesSection
                languages={data.languages}
                onChange={(languages) => onUpdateCV((prev) => ({ ...prev, languages }))}
              />
            )}
            {activeTab === 'certifications' && (
              <CertificationsSection
                certifications={data.certifications || []}
                onChange={(certifications) => onUpdateCV((prev) => ({ ...prev, certifications }))}
              />
            )}
            {activeTab === 'hobbies' && (
              <HobbiesSection
                hobbies={data.hobbies}
                onChange={(hobbies) => onUpdateCV((prev) => ({ ...prev, hobbies }))}
              />
            )}
            {activeTab === 'theme' && (
              <ThemeSection
                theme={data.theme}
                onChange={(theme) => onUpdateCV((prev) => ({ ...prev, theme }))}
                onOpenPreview={onOpenPreview}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Bottom Step Controller Bar */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-30 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2 shadow-xl flex items-center justify-between gap-2">
        <button
          id="btn-wizard-prev"
          disabled={isFirst}
          onClick={handlePrev}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isFirst
              ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-100'
              : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700'
          }`}
        >
          <BackIcon className="w-3.5 h-3.5" />
          <span>{t.back}</span>
        </button>

        {/* Center: Live Preview Button */}
        <button
          id="btn-wizard-open-preview"
          onClick={onOpenPreview}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-600 active:scale-[0.98] text-white text-xs font-bold shadow-lg shadow-violet-600/25 flex items-center justify-center gap-1.5 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.livePreview}</span>
        </button>

        {/* Next / Finish */}
        <button
          id="btn-wizard-next"
          onClick={handleNext}
          className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <span>{isLast ? t.preview : t.next}</span>
          <NextIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
