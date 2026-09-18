import React, { useRef, useEffect } from 'react';
import { WizardTabKey } from '../types';
import { User, FileText, Briefcase, GraduationCap, Code2, Languages, Heart, Award, LayoutTemplate } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface WizardTabsProps {
  activeTab: WizardTabKey;
  onSelectTab: (tab: WizardTabKey) => void;
  tabCounts: Record<WizardTabKey, number | string>;
}

interface TabDef {
  key: WizardTabKey;
  icon: React.ElementType;
}

const TABS: TabDef[] = [
  { key: 'personal', icon: User },
  { key: 'summary', icon: FileText },
  { key: 'experience', icon: Briefcase },
  { key: 'education', icon: GraduationCap },
  { key: 'skills', icon: Code2 },
  { key: 'languages', icon: Languages },
  { key: 'certifications', icon: Award },
  { key: 'hobbies', icon: Heart },
  { key: 'theme', icon: LayoutTemplate },
];

export const WizardTabs: React.FC<WizardTabsProps> = ({
  activeTab,
  onSelectTab,
  tabCounts,
}) => {
  const { t, isRTL } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the active tab into the center of viewport smoothly
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  return (
    <nav
      aria-label="CV Sections"
      className="w-full max-w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-2.5 shadow-xs shrink-0"
    >
      <div
        ref={scrollContainerRef}
        className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar px-3 scroll-smooth touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const count = tabCounts[tab.key];
          const label = t.tabs[tab.key] || tab.key;

          return (
            <button
              key={tab.key}
              ref={isActive ? activeTabRef : null}
              id={`tab-${tab.key}`}
              onClick={() => onSelectTab(tab.key)}
              className={`relative shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none ${
                isActive
                  ? 'text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeWizardTabPill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 -z-10 shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="leading-none">{label}</span>

              {/* Counter or Status Indicator */}
              {count !== undefined && count !== '' && count !== 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                    isRTL ? 'mr-0.5' : 'ml-0.5'
                  } ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
