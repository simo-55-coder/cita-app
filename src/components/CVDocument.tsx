import React from 'react';
import { CVData, CVTheme, TemplateId } from '../types';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Code2,
  Languages,
  Heart,
  FolderGit2,
  Award,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const getCustomizationData = (theme?: CVTheme, isPrint?: boolean) => {
  const fontSize = theme?.fontSize || 'normal';
  const fontSizeScale = theme?.fontSizeScale ?? (
    fontSize === 'small' ? 0.9 :
    fontSize === 'large' ? 1.1 :
    fontSize === 'xlarge' ? 1.2 : 1.0
  );
  const spacing = theme?.spacing || 'normal';
  const isAutoFill = !!theme?.autoFillPage;

  return {
    fontSize,
    fontSizeScale,
    spacing,
    isAutoFill,
    dataAttrs: {
      'data-font-size': fontSize,
      'data-spacing': spacing,
      'data-auto-fill': isAutoFill ? 'true' : 'false',
    },
    cssVars: {
      ['--cv-font-scale' as any]: fontSizeScale,
      ['--cv-spacing-mode' as any]: spacing,
    },
  };
};

const getDynamicTextSize = (text?: string, baseSize: string = 'text-[12px]') => {
  if (!text) return baseSize;
  const len = text.length;
  if (len > 35) return 'text-[9.5px] leading-tight';
  if (len > 25) return 'text-[10.5px] leading-tight';
  return baseSize;
};

const renderText = (text?: string) => {
  if (!text) return null;
  return text.split(/\\n|\n/).map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};

export interface ContentDensityInfo {
  isSparse: boolean;
  isDense: boolean;
  score: number;
  mainScore: number;
  isMainSparse: boolean;
}

export const getContentDensity = (data: CVData): ContentDensityInfo => {
  const { summary, experiences, education, skills, languages, hobbies, projects, certifications } = data;
  let mainScore = 0;
  let sideScore = 0;

  // Summary weight
  const summaryLen = (summary || '').trim().length;
  if (summaryLen > 0) {
    mainScore += Math.min(summaryLen / 40, 6) + 2;
  }

  // Experiences weight
  (experiences || []).forEach((exp) => {
    mainScore += 4.5;
    const descLen = (exp.description || '').trim().length;
    mainScore += Math.min(descLen / 50, 5);
    if (exp.highlights && exp.highlights.length) {
      mainScore += exp.highlights.filter(Boolean).length * 1.2;
    }
  });

  // Education weight
  (education || []).forEach((edu) => {
    mainScore += 3.5;
    if (edu.fieldOfStudy || edu.gpa) mainScore += 1.5;
  });

  // Projects weight
  (projects || []).forEach((proj) => {
    mainScore += 3.5;
    const descLen = (proj.description || '').trim().length;
    mainScore += Math.min(descLen / 50, 4);
  });

  // Certifications weight
  (certifications || []).forEach(() => {
    mainScore += 2;
  });

  // Skills weight
  sideScore += Math.min((skills || []).length * 0.7, 5);

  // Languages weight
  sideScore += Math.min((languages || []).length * 0.7, 4);

  // Hobbies weight
  if (hobbies && hobbies.length) sideScore += 2;

  const score = mainScore + sideScore;

  // Thresholds:
  // Sparse: score < 34 (e.g. 1-2 experiences, short or no bio, 1-2 degrees)
  // Dense: score > 42 (e.g. 3+ experiences with highlights, multiple degrees, long bio)
  const isSparse = score < 34;
  const isDense = score > 42;

  // Main column score (specifically for sections in the main body: Summary, Experiences, Education)
  const isMainSparse = mainScore < 30;

  return {
    isSparse,
    isDense,
    score,
    mainScore,
    isMainSparse,
  };
};

interface CVDocumentProps {
  data: CVData;
  id?: string;
  isPrint?: boolean;
}

const CVDocumentInner: React.FC<CVDocumentProps> = ({
  data,
  id = 'cv-document',
  isPrint = false,
}) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, projects, certifications, theme } = data;
  const primary = theme?.primaryColor || '#7c3aed';
  const templateId: TemplateId = (theme?.template || theme?.layoutStyle || 'modern') as TemplateId;

  // Determine dynamic content density for balanced vertical distribution
  const { isSparse, isDense, isMainSparse } = getContentDensity(data);

  // Font family determination with Arabic fallback
  const getFontFamily = () => {
    if (isRTL) {
      return theme?.fontFamily === 'serif' ? 'Tajawal, Cairo, serif' : 'Cairo, Tajawal, sans-serif';
    }
    return theme?.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Plus Jakarta Sans, sans-serif';
  };

  // Dynamic responsive A4 container: uses fluid relative heights, removes clipping
  const { fontSize, fontSizeScale, spacing, isAutoFill, dataAttrs, cssVars } = getCustomizationData(theme, isPrint);

  const spacingPaddingClass =
    spacing === 'compact'
      ? 'p-5 sm:p-6 md:p-7'
      : spacing === 'relaxed'
      ? 'p-10 sm:p-11 md:p-12'
      : 'p-8 sm:p-9 md:p-10';

  const containerClasses = `cv-standard-template w-[794px] min-w-[794px] max-w-[794px] min-h-[297mm] h-auto bg-white text-slate-800 flex flex-col transition-all ${
    isRTL ? 'font-arabic' : ''
  } ${spacingPaddingClass} ${isPrint ? 'shadow-none border-0' : 'shadow-xl rounded-sm border border-slate-200/90 select-none'}`;

  // Helper for skill level percent (for visual bars)
  const getSkillPercent = (level: string) => {
    switch (level) {
      case 'Beginner':
        return '30%';
      case 'Intermediate':
        return '55%';
      case 'Advanced':
        return '80%';
      case 'Expert':
        return '100%';
      default:
        return '60%';
    }
  };

  // =========================================================================
  // 1. TEMPLATE: MODERN TECH (Clean grid structure, striking header)
  // =========================================================================
  if (templateId === 'modern') {
    return (
      <div
        id={id}
        dir={isRTL ? 'rtl' : 'ltr'}
        {...dataAttrs}
        className={`${containerClasses} mx-auto`}
        style={{ fontFamily: getFontFamily(), ...cssVars }}
      >
          {/* Top Banner / Header */}
          <header className="border-b-2 pb-2.5 sm:pb-3.5 mb-4 sm:mb-6 shrink-0" style={{ borderColor: `${primary}25` }}>
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1
                  className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight break-words"
                  style={{ color: primary }}
                >
                  {personal.fullName || (isRTL ? ' ' : 'Candidate Name')}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 break-words">
                  {personal.jobTitle || (isRTL ? ' ' : 'Job Title')}
                </p>

                {/* Contact Details Grid */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 sm:gap-x-3.5 mt-2 text-xs sm:text-[13px] text-slate-500">
                  {personal.email && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.email)}`}>{personal.email}</span>
                    </div>
                  )}
                  {personal.phone && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr">{personal.phone}</span>
                    </div>
                  )}
                  {personal.location && (
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.location)}`}>{personal.location}</span>
                    </div>
                  )}
                  {personal.website && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.website.replace(/^https?:\/\//, ''))}`}>{personal.website.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  {personal.linkedin && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.linkedin.replace(/^https?:\/\//, ''))}`}>{personal.linkedin.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  {personal.github && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.github.replace(/^https?:\/\//, ''))}`}>{personal.github.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Profile Avatar */}
              {personal.avatarUrl && (
                <div className="shrink-0 self-center my-auto">
                  <img
                    src={personal.avatarUrl}
                    alt={personal.fullName}
                    referrerPolicy="no-referrer"
                    className="cv-profile-avatar header-avatar w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-3 shadow-md shrink-0"
                    style={{ borderColor: primary }}
                  />
                </div>
              )}
            </div>
          </header>

          {/* Summary */}
          {summary && (
            <section className={`${isDense ? 'mb-3 p-2' : isMainSparse ? 'mb-4 sm:mb-5 p-3 sm:p-3.5' : 'mb-3.5 sm:mb-4 p-2 sm:p-2.5'} rounded-xl bg-slate-50/80 border shrink-0 overflow-hidden max-w-full`} style={{ borderColor: `${primary}20` }}>
              <h2
                className="text-[12px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"
                style={{ color: primary }}
              >
                <span>{t.summary.sectionTitle}</span>
              </h2>
              <p className={`text-xs sm:text-[13px] text-slate-700 text-justify break-words ${isDense ? 'leading-[1.6]' : isMainSparse ? 'leading-[1.78]' : 'leading-[1.65]'}`}>
                {renderText(summary)}
              </p>
            </section>
          )}

          {/* Main 2-Column Grid */}
          <div className="flex flex-row gap-5 min-h-0">
            {/* Main Column (Experience & Education) */}
            <div className={`w-[64%] shrink-0 min-w-0 ${isDense ? 'space-y-3.5' : isMainSparse ? 'space-y-6 sm:space-y-7' : 'space-y-4 sm:space-y-5'}`}>
              {/* Work Experience */}
              {experiences && experiences.length > 0 && (
                <section className="min-w-0">
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 sm:mb-2.5 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.experience.sectionTitle}</span>
                  </h2>

                  <div className={`min-w-0 ${isDense ? 'space-y-2.5' : isMainSparse ? 'space-y-4 sm:space-y-5.5' : 'space-y-3.5 sm:space-y-4'}`}>
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className={`relative ${
                          isRTL ? 'pr-2.5 sm:pr-3 border-e-2' : 'pl-2.5 sm:pl-3 border-s-2'
                        }`}
                        style={{ borderColor: `${primary}40` }}
                      >
                        <div className="flex flex-nowrap justify-between items-baseline gap-1 mb-0.5">
                          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                          <span className="text-[12px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 overflow-hidden max-w-full inline-flex items-center">
                            {exp.startDate}  {exp.current ? t.present : exp.endDate}
                          </span>
                        </div>
                        <div className="text-[12px] font-medium text-slate-700 mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="font-semibold break-words" style={{ color: primary }}>{exp.company}</span>
                          {exp.location && <span className="text-slate-400 break-words"> {exp.location}</span>}
                        </div>
                        {exp.description && (
                          <p className={`text-[12px] text-slate-600 mb-1 break-words ${isDense ? 'leading-[1.55]' : isMainSparse ? 'leading-[1.78]' : 'leading-[1.6]'}`}>
                            {renderText(exp.description)}
                          </p>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className={`list-disc list-outside ${isRTL ? 'mr-3.5' : 'ml-3.5'} ${isDense ? 'space-y-0.5' : isMainSparse ? 'space-y-1' : 'space-y-0.5'} text-[12px] text-slate-600 leading-snug break-words`}>
                            {exp.highlights.filter(Boolean).map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <section className="min-w-0">
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 sm:mb-2.5 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.education.sectionTitle}</span>
                  </h2>

                  <div className={`min-w-0 ${isDense ? 'space-y-2' : isMainSparse ? 'space-y-3.5 sm:space-y-4' : 'space-y-2.5 sm:space-y-3'}`}>
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className={`relative ${
                          isRTL ? 'pr-2.5 sm:pr-3 border-e-2' : 'pl-2.5 sm:pl-3 border-s-2'
                        }`}
                        style={{ borderColor: `${primary}40` }}
                      >
                        <div className="flex flex-nowrap justify-between items-baseline gap-1 mb-0.5">
                          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{edu.degree}</h3>
                          <span className="text-[12px] font-medium text-slate-500 shrink-0 overflow-hidden max-w-full">
                            {edu.startDate}  {edu.endDate}
                          </span>
                        </div>
                        <div className="text-[12px] font-medium text-slate-700 flex flex-wrap items-center gap-x-1.5">
                          <span style={{ color: primary }} className="break-words">{edu.institution}</span>
                          {edu.location && <span className="text-slate-400 break-words">, {edu.location}</span>}
                        </div>
                        {edu.fieldOfStudy && (
                          <p className="text-[12px] text-slate-500 italic mt-0.5 break-words">{edu.fieldOfStudy}</p>
                        )}
                        {edu.gpa && (
                          <p className="text-[12px] font-medium text-slate-600 mt-0.5">
                            {t.education.gpa}: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Column (Skills, Languages, Hobbies) */}
            <div className={`w-[32%] shrink-0 min-w-0 ${isDense ? 'space-y-3.5' : 'space-y-4 sm:space-y-5'}`}>
              {/* Skills */}
              {skills && skills.length > 0 && (
                <section className="min-w-0">
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-1.5 sm:mb-2 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.skills.sectionTitle}</span>
                  </h2>

                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="skill-badge tag chip inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium border max-w-full box-border whitespace-nowrap shrink-0"
                        style={{
                          backgroundColor: `${primary}08`,
                          borderColor: `${primary}25`,
                          color: primary,
                        }}
                      >
                        <span className="min-w-0 whitespace-nowrap">{skill.name}</span>
                        <span className="text-[8px] sm:text-[9px] text-slate-400 shrink-0 whitespace-nowrap">
                          ({t.levels[skill.level] || skill.level})
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <section className="min-w-0">
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-1.5 sm:mb-2 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.languages.sectionTitle}</span>
                  </h2>

                  <div className="space-y-1 sm:space-y-1.5">
                    {languages.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-[11px] gap-2 sm:text-xs gap-1">
                        <span className="font-medium text-slate-800 break-words">{item.name}</span>
                        <span className="text-[12px] text-slate-500 font-medium shrink-0">
                          {t.proficiencies[item.proficiency] || item.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hobbies / Interests */}
              {hobbies && hobbies.length > 0 && (
                <section className="min-w-0 interests-section hobbies">
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-1.5 sm:mb-2 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.hobbies.sectionTitle}</span>
                  </h2>

                  <div className="flex flex-wrap gap-1.5">
                    {hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="interest-item hobby-badge interest-badge tag chip text-[12px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 max-w-full inline-flex items-center box-border whitespace-nowrap shrink-0"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
    );
  }

  // =========================================================================
  // 2. TEMPLATE: EXECUTIVE CORPORATE (Formal, structured, authoritative)
  // =========================================================================
  if (templateId === 'executive') {
    return (
      <div
        id={id}
        dir={isRTL ? 'rtl' : 'ltr'}
        {...dataAttrs}
        className={`${containerClasses} mx-auto`}
        style={{ fontFamily: getFontFamily(), ...cssVars }}
      >
          {/* Formal Centered Header */}
          <header className="text-center pb-3 sm:pb-4 mb-4 sm:mb-6 border-b-2 border-double shrink-0" style={{ borderColor: primary }}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider uppercase text-slate-900 leading-tight break-words">
              {personal.fullName || (isRTL ? 'اسم المرشح' : 'Candidate Name')}
            </h1>
            <p
              className="text-xs sm:text-sm font-semibold tracking-widest uppercase mt-1 break-words"
              style={{ color: primary }}
            >
              {personal.jobTitle || (isRTL ? 'المسمى الوظيفي' : 'Job Title')}
            </p>

            {/* Formal Horizontal Contact Bar with Bullet Separators */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-2.5 text-[12px] text-slate-600">
              {personal.email && (
                <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.email)}`}>
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <>
                  <span className="text-slate-400">•</span>
                  <span dir="ltr">{personal.phone}</span>
                </>
              )}
              {personal.location && (
                <>
                  <span className="text-slate-400">•</span>
                  <span>{personal.location}</span>
                </>
              )}
              {personal.linkedin && (
                <>
                  <span className="text-slate-400">•</span>
                  <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.linkedin.replace(/^https?:\/\//, ''))}`}>
                    {personal.linkedin.replace(/^https?:\/\//, '')}
                  </span>
                </>
              )}
              {personal.website && (
                <>
                  <span className="text-slate-400">•</span>
                  <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.website.replace(/^https?:\/\//, ''))}`}>
                    {personal.website.replace(/^https?:\/\//, '')}
                  </span>
                </>
              )}
            </div>
          </header>

          <div className={`w-full min-w-0 ${isDense ? 'space-y-3.5' : isSparse ? 'space-y-6 sm:space-y-7' : 'space-y-4 sm:space-y-5'}`}>
            {/* Executive Summary */}
            {summary && (
              <section className="min-w-0">
                <div className="flex items-center justify-center gap-3 my-2 sm:my-2.5">
                  <div className="h-px flex-1 bg-slate-300" />
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-widest px-3 py-0.5 rounded bg-slate-100/90 border border-slate-300/80 text-slate-900 shadow-2xs"
                    style={{ color: primary }}
                  >
                    {t.summary.sectionTitle}
                  </h2>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>
                <p className={`text-xs sm:text-[13px] text-slate-700 text-justify break-words ${isDense ? 'leading-[1.6]' : isSparse ? 'leading-[1.78]' : 'leading-[1.65]'}`}>
                  {renderText(summary)}
                </p>
              </section>
            )}

            {/* Professional Experience */}
            {experiences && experiences.length > 0 && (
              <section className="min-w-0">
                <div className="flex items-center justify-center gap-3 my-2 sm:my-2.5">
                  <div className="h-px flex-1 bg-slate-300" />
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-widest px-3 py-0.5 rounded bg-slate-100/90 border border-slate-300/80 text-slate-900 shadow-2xs"
                    style={{ color: primary }}
                  >
                    {t.experience.sectionTitle}
                  </h2>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>

                <div className={`min-w-0 ${isDense ? 'space-y-2.5' : isSparse ? 'space-y-4.5 sm:space-y-5.5' : 'space-y-3.5 sm:space-y-4'}`}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className={isDense ? 'space-y-0.5' : isSparse ? 'space-y-1.5' : 'space-y-1'}>
                      <div className="flex flex-nowrap justify-between items-baseline gap-1">
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                        <span className="text-[12px] font-semibold text-slate-600 shrink-0 min-w-0 overflow-hidden max-w-full">
                          {exp.startDate} – {exp.current ? t.present : exp.endDate}
                        </span>
                      </div>

                      <div className="text-[12px] font-semibold text-slate-700 flex flex-wrap items-center justify-between gap-1">
                        <span style={{ color: primary }} className="break-words">{exp.company}</span>
                        {exp.location && <span className="text-slate-500 font-normal text-[12px]">{exp.location}</span>}
                      </div>

                      {exp.description && (
                        <p className={`text-[12px] text-slate-600 text-justify break-words ${isDense ? 'leading-[1.55]' : isSparse ? 'leading-[1.78]' : 'leading-[1.6]'}`}>
                          {renderText(exp.description)}
                        </p>
                      )}

                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className={`list-disc list-outside ${isRTL ? 'mr-4' : 'ml-4'} ${isDense ? 'space-y-0.5' : isSparse ? 'space-y-1' : 'space-y-0.5'} text-[12px] text-slate-600 leading-snug pt-0.5 break-words`}>
                          {exp.highlights.filter(Boolean).map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education & Credentials */}
            {education && education.length > 0 && (
              <section className="min-w-0">
                <div className="flex items-center justify-center gap-3 my-2 sm:my-2.5">
                  <div className="h-px flex-1 bg-slate-300" />
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-widest px-3 py-0.5 rounded bg-slate-100/90 border border-slate-300/80 text-slate-900 shadow-2xs"
                    style={{ color: primary }}
                  >
                    {t.education.sectionTitle}
                  </h2>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>

                <div className={`min-w-0 ${isDense ? 'space-y-2' : isSparse ? 'space-y-3.5 sm:space-y-4.5' : 'space-y-2.5 sm:space-y-3'}`}>
                  {education.map((edu) => (
                    <div key={edu.id} className={`flex flex-nowrap justify-between items-baseline gap-1 ${isSparse ? 'py-1' : 'py-0.5'}`}>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{edu.degree}</h3>
                        <div className="text-[12px] text-slate-700 flex flex-wrap items-center gap-1">
                          <span className="font-semibold break-words" style={{ color: primary }}>{edu.institution}</span>
                          {edu.location && <span className="text-slate-500">, {edu.location}</span>}
                          {edu.fieldOfStudy && <span className="text-slate-500 italic"> – {edu.fieldOfStudy}</span>}
                        </div>
                      </div>
                      <div className="text-end shrink-0 min-w-0 max-w-full">
                        <span className="text-[12px] font-semibold text-slate-600 min-w-0 overflow-hidden max-w-full">
                          {edu.startDate} – {edu.endDate}
                        </span>
                        {edu.gpa && (
                          <div className="text-[8px] sm:text-[9px] text-slate-500 font-medium">
                            {t.education.gpa}: {edu.gpa}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Projects (if present) */}
            {projects && projects.length > 0 && (
              <section className="min-w-0">
                <div className="flex items-center justify-center gap-3 my-2 sm:my-2.5">
                  <div className="h-px flex-1 bg-slate-300" />
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-widest px-3 py-0.5 rounded bg-slate-100/90 border border-slate-300/80 text-slate-900 shadow-2xs"
                    style={{ color: primary }}
                  >
                    {t.projects?.sectionTitle || 'Projects'}
                  </h2>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>

                <div className={`min-w-0 ${isDense ? 'space-y-2' : isSparse ? 'space-y-3.5 sm:space-y-4' : 'space-y-2.5 sm:space-y-3'}`}>
                  {projects.map((proj) => (
                    <div key={proj.id} className="min-w-0">
                      <div className="flex flex-nowrap justify-between items-baseline gap-1">
                        <div className="text-xs sm:text-[13px] font-bold text-slate-900 break-words flex items-center gap-1.5">
                          <span>{proj.name}</span>
                          {proj.role && <span className="font-semibold" style={{ color: primary }}>({proj.role})</span>}
                        </div>
                        {proj.link && (
                          <span dir="ltr" className="text-[11px] text-slate-500 shrink-0 max-w-[200px] truncate">
                            {proj.link.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {proj.technologies.map((tech, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.description && (
                        <p className={`text-[12px] text-slate-600 mt-1 break-words ${isDense ? 'leading-[1.55]' : isSparse ? 'leading-[1.78]' : 'leading-[1.6]'}`}>
                          {renderText(proj.description)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications (if present) */}
            {certifications && certifications.length > 0 && (
              <section className="min-w-0">
                <div className="flex items-center justify-center gap-3 my-2 sm:my-2.5">
                  <div className="h-px flex-1 bg-slate-300" />
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-widest px-3 py-0.5 rounded bg-slate-100/90 border border-slate-300/80 text-slate-900 shadow-2xs"
                    style={{ color: primary }}
                  >
                    {t.certifications?.sectionTitle || 'Certifications'}
                  </h2>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>

                <div className={`min-w-0 ${isDense ? 'space-y-1.5' : isSparse ? 'space-y-2.5' : 'space-y-2'}`}>
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-baseline gap-2 text-[12px]">
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        <span className="text-slate-500"> – </span>
                        <span className="font-semibold" style={{ color: primary }}>{cert.issuer}</span>
                      </div>
                      {cert.issueDate && <span className="text-slate-500 shrink-0">{cert.issueDate}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Core Competencies / Skills & Languages in Structured Grid */}
            <div className="grid grid-cols-2 gap-5 pt-2 border-t border-slate-200">
              {/* Competencies */}
              {skills && skills.length > 0 && (
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 pb-0.5 border-b border-slate-200">
                    <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900">
                      {t.skills.sectionTitle}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[12px]">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-1.5 text-slate-700 min-w-0 max-w-full overflow-hidden">
                        <span className="w-1.5 h-1.5 rounded-xs shrink-0" style={{ backgroundColor: primary }} />
                        <span className="break-words min-w-0">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages & Interests */}
              <div className="min-w-0">
                {languages && languages.length > 0 && (
                  <div className="mb-2.5">
                    <div className="flex items-center gap-2 mb-1.5 pb-0.5 border-b border-slate-200">
                      <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900">
                        {t.languages.sectionTitle}
                      </h2>
                    </div>
                    <div className="space-y-1 text-[12px]">
                      {languages.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-2">
                          <span className="font-medium text-slate-800 break-words">{item.name}</span>
                          <span className="text-[12px] text-slate-500 shrink-0">
                            {t.proficiencies[item.proficiency] || item.proficiency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hobbies && hobbies.length > 0 && (
                  <div className="interests-section hobbies">
                    <div className="flex items-center gap-2 mb-1 pb-0.5 border-b border-slate-200">
                      <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900">
                        {t.hobbies.sectionTitle}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className="interest-item hobby-badge interest-badge tag chip text-[12px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 max-w-full inline-flex items-center box-border whitespace-nowrap shrink-0"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    );
  }

  // =========================================================================
  // 3. TEMPLATE: CREATIVE DESIGNER (Bold accent sidebar & vibrant hierarchy)
  // =========================================================================
  if (templateId === 'creative') {
    return (
      <div
        id={id}
        dir={isRTL ? 'rtl' : 'ltr'}
        {...dataAttrs}
        className={`cv-standard-template w-[794px] min-w-[794px] max-w-[794px] min-h-[297mm] h-auto bg-white text-slate-800 flex transition-all items-stretch mx-auto ${
          isRTL ? 'font-arabic flex-row-reverse' : 'flex-row'
        } ${isPrint ? 'shadow-none border-0' : 'shadow-xl rounded-sm border border-slate-200/90 select-none'}`}
        style={{ fontFamily: getFontFamily(), ...cssVars }}
      >
          {/* Accent Sidebar (34% width on desktop/print, full width on mobile) */}
          <aside
            className="w-[34%] min-w-0 p-4 sm:p-5 flex flex-col justify-start shrink-0"
            style={{
              backgroundColor: `${primary}10`,
              borderRight: isRTL ? 'none' : `2px solid ${primary}25`,
              borderLeft: isRTL ? `2px solid ${primary}25` : 'none',
            }}
          >
            {/* Avatar & Personal Identity */}
            <div className="text-center space-y-1.5 sm:space-y-2 shrink-0">
              {personal.avatarUrl ? (
                <img
                  src={personal.avatarUrl}
                  alt={personal.fullName}
                  referrerPolicy="no-referrer"
                  className="cv-profile-avatar sidebar-avatar w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover border-2 sm:border-3 shadow-md shrink-0"
                  style={{ borderColor: primary }}
                />
              ) : (
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-md shrink-0"
                  style={{ backgroundColor: primary }}
                >
                  {(personal.fullName || 'A').charAt(0)}
                </div>
              )}

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 break-words">{personal.fullName}</h3>
                <p className="text-xs sm:text-[13px] font-semibold break-words" style={{ color: primary }}>{personal.jobTitle}</p>
              </div>
            </div>

            <div className={`w-full min-w-0 ${isDense ? 'space-y-3 mt-2' : 'space-y-3.5 sm:space-y-4 mt-2'}`}>
              {/* Contact Details */}
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-slate-700 pt-1.5 sm:pt-2 border-t border-slate-200">
                {personal.email && (
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                      <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <span className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.email)}`} dir="ltr">{personal.email}</span>
                  </div>
                )}
                {personal.phone && (
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                      <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <span className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.phone)}`} dir="ltr">{personal.phone}</span>
                  </div>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                      <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <span className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.location)}`}>{personal.location}</span>
                  </div>
                )}
                {personal.website && (
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                      <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <span className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.website.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
                {personal.linkedin && (
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                      <Linkedin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <span className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.linkedin.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
                {personal.github && (
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                      <Github className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <span className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.github.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.github.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
              </div>

              {/* Skills with Visual Progress Bars */}
              {skills && skills.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2 pt-1.5 sm:pt-2 border-t border-slate-200">
                  <h4
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider flex items-center gap-1"
                    style={{ color: primary }}
                  >
                    <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{t.skills.sectionTitle}</span>
                  </h4>

                  <div className="space-y-1 sm:space-y-1.5">
                    {skills.map((skill) => (
                      <div key={skill.id} className="space-y-0.5">
                        <div className="flex justify-between items-start text-[11px] gap-2 sm:text-xs font-semibold text-slate-800">
                          <span className="break-words">{skill.name}</span>
                          <span className="text-slate-500 shrink-0 ml-1">{t.levels[skill.level] || skill.level}</span>
                        </div>
                        <div className="w-full h-1 sm:h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: getSkillPercent(skill.level),
                              backgroundColor: primary,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div className="space-y-1 sm:space-y-1.5 pt-1.5 sm:pt-2 border-t border-slate-200">
                  <h4
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider flex items-center gap-1"
                    style={{ color: primary }}
                  >
                    <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{t.languages.sectionTitle}</span>
                  </h4>

                  <div className="space-y-0.5 sm:space-y-1">
                    {languages.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-[11px] gap-2 sm:text-xs gap-1">
                        <span className="font-semibold text-slate-800 break-words">{item.name}</span>
                        <span className="text-slate-500 shrink-0">{t.proficiencies[item.proficiency] || item.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creative Hobbies */}
              {hobbies && hobbies.length > 0 && (
                <div className="pt-1.5 sm:pt-2 border-t border-slate-200 interests-section hobbies">
                  <h4
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                    style={{ color: primary }}
                  >
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{t.hobbies.sectionTitle}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {hobbies.map((hobby, idx) => (
                      <span
                        key={idx}
                        className="interest-item hobby-badge interest-badge tag chip text-[8px] sm:text-[9px] font-semibold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 max-w-full inline-flex items-center box-border whitespace-nowrap shrink-0"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Body (66% width) */}
          <main className="w-[66%] flex-1 min-w-0 p-4 sm:p-6 md:p-7 flex flex-col justify-start">
            {/* Header Title & Tagline */}
            <div className="border-b-2 pb-2 sm:pb-3 mb-2 sm:mb-3.5 shrink-0" style={{ borderColor: `${primary}25` }}>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight"
                style={{ color: primary }}
              >
                {personal.fullName || (isRTL ? ' ' : 'Candidate Name')}
              </h1>
              <div className="inline-block mt-1 sm:mt-1.5 px-2.5 sm:px-3 py-0.5 rounded-lg text-xs sm:text-[13px] font-bold text-white shadow-xs max-w-full overflow-hidden break-words" style={{ backgroundColor: primary }}>
                {personal.jobTitle || (isRTL ? ' ' : 'Job Title')}
              </div>
            </div>

            <div className={`w-full min-w-0 flex-1 flex flex-col ${isDense ? 'space-y-3' : isMainSparse ? 'space-y-6 sm:space-y-7' : 'space-y-4 sm:space-y-5'}`}>
              {/* Profile Statement */}
              {summary && (
                <section className={`relative pl-2.5 sm:pl-3 border-s-2 sm:border-s-2 ${isDense ? 'mb-1.5' : isMainSparse ? 'mb-3 sm:mb-4' : 'mb-2'}`} style={{ borderColor: primary }}>
                  <p className={`text-xs sm:text-[13px] text-slate-700 text-justify break-words ${isDense ? 'leading-[1.6]' : isMainSparse ? 'leading-[1.78]' : 'leading-[1.65]'}`}>
                    {renderText(summary)}
                  </p>
                </section>
              )}

              {/* Experience Timeline */}
              {experiences && experiences.length > 0 && (
                <section className="min-w-0">
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 sm:mb-2.5 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.experience.sectionTitle}</span>
                  </h2>

                  <div className={`min-w-0 ${isDense ? 'space-y-2.5' : isMainSparse ? 'space-y-4 sm:space-y-5.5' : 'space-y-3 sm:space-y-4'}`}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-3 sm:pl-3.5 border-s-2" style={{ borderColor: `${primary}40` }}>
                        <span
                          className="absolute -start-[5px] top-1 w-2 h-2 rounded-full border border-white"
                          style={{ backgroundColor: primary }}
                        />
                        <div className="flex flex-nowrap justify-between items-baseline gap-1">
                          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                          <span className="text-[12px] font-bold text-white px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 max-w-full overflow-hidden break-words inline-flex items-center" style={{ backgroundColor: primary }}>
                            {exp.startDate}  {exp.current ? t.present : exp.endDate}
                          </span>
                        </div>

                        <div className="text-[12px] font-semibold text-slate-700 my-0.5 sm:my-1 flex flex-wrap items-center gap-1">
                          <span style={{ color: primary }} className="break-words">{exp.company}</span>
                          {exp.location && <span className="text-slate-400 font-normal">  {exp.location}</span>}
                        </div>

                        {exp.description && (
                          <p className={`text-[12px] text-slate-600 mb-1 sm:mb-1.5 break-words ${isDense ? 'leading-[1.55]' : isMainSparse ? 'leading-[1.78]' : 'leading-[1.65]'}`}>
                            {renderText(exp.description)}
                          </p>
                        )}

                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className={`list-disc list-outside ml-3.5 ${isDense ? 'space-y-0.5' : isMainSparse ? 'space-y-1' : 'space-y-0.5'} text-[12px] text-slate-600 leading-snug break-words`}>
                            {exp.highlights.filter(Boolean).map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <section className="min-w-0">
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 sm:mb-2.5 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.education.sectionTitle}</span>
                  </h2>

                  <div className={`min-w-0 ${isDense ? 'space-y-1.5' : isMainSparse ? 'space-y-3 sm:space-y-3.5' : 'space-y-2 sm:space-y-2.5'}`}>
                    {education.map((edu) => (
                      <div key={edu.id} className={`${isDense ? 'p-1.5 sm:p-2' : isMainSparse ? 'p-3 sm:p-3.5' : 'p-2 sm:p-2.5'} rounded-xl bg-slate-50/80 border border-slate-200/80 max-w-full overflow-hidden`}>
                        <div className="flex flex-nowrap justify-between items-baseline gap-1">
                          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{edu.degree}</h3>
                          <span className="text-[12px] text-slate-500 font-medium shrink-0">
                            {edu.startDate}  {edu.endDate}
                          </span>
                        </div>
                        <div className="text-[12px] font-medium text-slate-700 flex flex-wrap items-center gap-1 mt-0.5">
                          <span style={{ color: primary }} className="break-words">{edu.institution}</span>
                          {edu.location && <span className="text-slate-400">, {edu.location}</span>}
                        </div>
                        {edu.fieldOfStudy && (
                          <p className="text-[12px] text-slate-500 italic mt-0.5 break-words">{edu.fieldOfStudy}</p>
                        )}
                        {edu.gpa && (
                          <p className="text-[12px] font-medium text-slate-600 mt-0.5">
                            {t.education.gpa}: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
    );
  }

  // =========================================================================
  // 4. TEMPLATE: MINIMALIST CLEAN (ATS-Friendly, single column, pure whitespace)
  // =========================================================================
  return (
    <div
      id={id}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...dataAttrs}
      className={`${containerClasses} mx-auto`}
      style={{ fontFamily: getFontFamily(), ...cssVars }}
    >
        {/* Clean Linear Header (Start-Aligned) */}
        <header className="pb-3 sm:pb-3.5 mb-4 sm:mb-6 border-b-2 shrink-0" style={{ borderColor: `${primary}35` }}>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 break-words">
            {personal.fullName || (isRTL ? 'اسم المرشح' : 'Candidate Name')}
          </h1>
          <p className="text-xs sm:text-sm font-semibold mt-0.5 break-words" style={{ color: primary }}>
            {personal.jobTitle || (isRTL ? 'المسمى الوظيفي' : 'Job Title')}
          </p>

          {/* Inline ATS-friendly Contact row separated by subtle pipes */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-xs sm:text-[13px] text-slate-600">
            {personal.email && (
              <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.email)}`}>
                {personal.email}
              </span>
            )}
            {personal.phone && (
              <>
                <span className="text-slate-300">|</span>
                <span dir="ltr">{personal.phone}</span>
              </>
            )}
            {personal.location && (
              <>
                <span className="text-slate-300">|</span>
                <span>{personal.location}</span>
              </>
            )}
            {personal.linkedin && (
              <>
                <span className="text-slate-300">|</span>
                <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.linkedin.replace(/^https?:\/\//, ''))}`}>
                  {personal.linkedin.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
            {personal.github && (
              <>
                <span className="text-slate-300">|</span>
                <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.github.replace(/^https?:\/\//, ''))}`}>
                  {personal.github.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
            {personal.website && (
              <>
                <span className="text-slate-300">|</span>
                <span dir="ltr" className={`break-words [word-break:break-word] ${getDynamicTextSize(personal.website.replace(/^https?:\/\//, ''))}`}>
                  {personal.website.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
          </div>
        </header>

        <div className={`w-full min-w-0 ${isDense ? 'space-y-3' : isSparse ? 'space-y-5.5 sm:space-y-6.5' : 'space-y-3.5 sm:space-y-4'}`}>
          {/* Summary */}
          {summary && (
            <section className="min-w-0">
              <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                  {t.summary.sectionTitle}
                </h2>
              </div>
              <p className={`text-xs sm:text-[13px] text-slate-700 text-justify break-words ${isDense ? 'leading-[1.6]' : isSparse ? 'leading-[1.78]' : 'leading-[1.65]'}`}>
                {renderText(summary)}
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <section className="min-w-0">
              <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                  {t.experience.sectionTitle}
                </h2>
              </div>

              <div className={`min-w-0 ${isDense ? 'space-y-2.5' : isSparse ? 'space-y-4 sm:space-y-5' : 'space-y-3 sm:space-y-3.5'}`}>
                {experiences.map((exp) => (
                  <div key={exp.id} className={isDense ? '' : isSparse ? 'space-y-1' : 'space-y-0.5'}>
                    <div className="flex flex-nowrap justify-between items-baseline gap-1">
                      <div className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">
                        <span>{exp.position}</span>
                        <span className="font-normal text-slate-400 mx-1.5">|</span>
                        <span className="font-semibold" style={{ color: primary }}>{exp.company}</span>
                        {exp.location && <span className="text-slate-500 font-normal">, {exp.location}</span>}
                      </div>
                      <span className="text-[12px] text-slate-500 font-medium shrink-0">
                        {exp.startDate} – {exp.current ? t.present : exp.endDate}
                      </span>
                    </div>

                    {exp.description && (
                      <p className={`text-[12px] text-slate-600 mt-0.5 break-words ${isDense ? 'leading-[1.55]' : isSparse ? 'leading-[1.78]' : 'leading-[1.6]'}`}>
                        {renderText(exp.description)}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className={`list-disc list-outside ${isRTL ? 'mr-4' : 'ml-4'} ${isDense ? 'space-y-0.5' : isSparse ? 'space-y-1' : 'space-y-0.5'} text-[12px] text-slate-600 leading-snug mt-0.5 break-words`}>
                        {exp.highlights.filter(Boolean).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="min-w-0">
              <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                  {t.education.sectionTitle}
                </h2>
              </div>

              <div className={`min-w-0 ${isDense ? 'space-y-1.5' : isSparse ? 'space-y-3 sm:space-y-3.5' : 'space-y-2 sm:space-y-2.5'}`}>
                {education.map((edu) => (
                  <div key={edu.id} className={`flex flex-nowrap justify-between items-baseline gap-1 ${isSparse ? 'py-0.5' : ''}`}>
                    <div className="text-xs sm:text-[13px] min-w-0">
                      <span className="font-bold text-slate-900 break-words">{edu.degree}</span>
                      <span className="font-normal text-slate-400 mx-1.5">|</span>
                      <span className="font-semibold break-words" style={{ color: primary }}>{edu.institution}</span>
                      {edu.location && <span className="text-slate-500">, {edu.location}</span>}
                      {edu.fieldOfStudy && <span className="text-slate-500 italic"> ({edu.fieldOfStudy})</span>}
                    </div>
                    <div className="text-[12px] text-slate-500 shrink-0">
                      <span>{edu.startDate} – {edu.endDate}</span>
                      {edu.gpa && <span className="ml-1 text-slate-600">({edu.gpa})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Projects (if present) */}
          {projects && projects.length > 0 && (
            <section className="min-w-0">
              <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                  {t.projects?.sectionTitle || 'Projects'}
                </h2>
              </div>

              <div className={`min-w-0 ${isDense ? 'space-y-2' : isSparse ? 'space-y-3.5 sm:space-y-4' : 'space-y-2.5 sm:space-y-3'}`}>
                {projects.map((proj) => (
                  <div key={proj.id} className="min-w-0">
                    <div className="flex flex-nowrap justify-between items-baseline gap-1">
                      <div className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">
                        <span>{proj.name}</span>
                        {proj.role && <span className="font-normal text-slate-500 mx-1">({proj.role})</span>}
                      </div>
                      {proj.link && (
                        <span dir="ltr" className="text-[11px] text-slate-500 shrink-0 max-w-[200px] truncate">
                          {proj.link.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {proj.technologies.map((tech, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className={`text-[12px] text-slate-600 mt-0.5 break-words ${isDense ? 'leading-[1.55]' : isSparse ? 'leading-[1.78]' : 'leading-[1.6]'}`}>
                        {renderText(proj.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications (if present) */}
          {certifications && certifications.length > 0 && (
            <section className="min-w-0">
              <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                  {t.certifications?.sectionTitle || 'Certifications'}
                </h2>
              </div>

              <div className={`min-w-0 ${isDense ? 'space-y-1.5' : isSparse ? 'space-y-2.5' : 'space-y-2'}`}>
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-baseline gap-2 text-[12px]">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900">{cert.name}</span>
                      <span className="font-normal text-slate-400 mx-1.5">|</span>
                      <span className="font-semibold" style={{ color: primary }}>{cert.issuer}</span>
                    </div>
                    {cert.issueDate && <span className="text-slate-500 shrink-0">{cert.issueDate}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills (ATS-Optimized linear categorized tags) */}
          {skills && skills.length > 0 && (
            <section className="min-w-0">
              <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                  {t.skills.sectionTitle}
                </h2>
              </div>
              <div className="flex flex-wrap gap-1 text-[12px]">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="skill-badge tag chip px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 max-w-full inline-flex items-center box-border whitespace-nowrap shrink-0"
                  >
                    {skill.name} ({t.levels[skill.level] || skill.level})
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages & Hobbies */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {languages && languages.length > 0 && (
              <div className="min-w-0">
                <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                  <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                    {t.languages.sectionTitle}
                  </h2>
                </div>
                <div className="text-[12px] text-slate-600 space-y-0.5">
                  {languages.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-2">
                      <span className="font-medium text-slate-800 break-words">{item.name}</span>
                      <span className="shrink-0">{t.proficiencies[item.proficiency] || item.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hobbies && hobbies.length > 0 && (
              <div className="min-w-0 interests-section hobbies">
                <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: `${primary}35` }}>
                  <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                    {t.hobbies.sectionTitle}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="interest-item hobby-badge interest-badge tag chip text-[12px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 max-w-full inline-flex items-center box-border whitespace-nowrap shrink-0"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

// =========================================================================
// DISTINCT TEMPLATE WRAPPERS (Isolates CSS/DOM state during transitions)
// =========================================================================

const ModernTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};

const ExecutiveTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};

const CreativeTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};

const MinimalistTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};


// =========================================================================
// PREMIUM TEMPLATES
// =========================================================================






const ExecutiveModernTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#b45309';
  const { isDense } = getContentDensity(data);
  const { fontSize, fontSizeScale, spacing, isAutoFill, dataAttrs, cssVars } = getCustomizationData(theme, isPrint);
  const scaleClass = '';

  return (
    <div
      id={id}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...dataAttrs}
      style={{ ...cssVars }}
      className={`cv-premium-template bg-white text-slate-800 ${
        isRTL ? 'font-arabic' : 'font-sans'
      } overflow-hidden min-h-[1120px] w-[794px] min-w-[794px] max-w-[794px] mx-auto shadow-sm flex flex-row ${
        isPrint ? 'shadow-none border-0' : 'shadow-xl rounded-sm border border-slate-200/90'
      } ${scaleClass}`}
    >
      {/* Sidebar */}
      <div className="w-[38%] shrink-0 bg-slate-900 text-white py-8 px-5 sm:px-6 flex flex-col text-start min-w-0">
        <div className="flex justify-center mb-2 shrink-0">
          <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-[3px] p-1 flex items-center justify-center" style={{ borderColor: primary }}>
            {personal.avatarUrl ? (
              <img src={personal.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-800" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl text-white/50 font-light">{personal.fullName?.charAt(0) || ''}</div>
            )}
          </div>
        </div>

        <div className={`w-full min-w-0 ${isDense ? 'space-y-4' : 'space-y-6'}`}>
          {/* Contact Info */}
          <div className="w-full min-w-0">
            <div className="mb-4">
              <h2 className={`text-[11px] font-bold uppercase text-white bg-slate-800 px-3 py-1.5 inline-block border-s-2 whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary }}>
                {t.personal.sectionTitle || 'Contact'}
              </h2>
            </div>
            <div className="space-y-3 text-[12px] text-white/90 text-start w-full px-2.5 min-w-0">
              {personal.email && <div className="flex items-center gap-3 min-w-0"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Mail className="w-3 h-3 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 leading-tight ${getDynamicTextSize(personal.email)}`} dir="ltr">{personal.email}</span></div>}
              {personal.phone && <div className="flex items-center gap-3 min-w-0"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Phone className="w-3 h-3 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 leading-tight ${getDynamicTextSize(personal.phone)}`} dir="ltr">{personal.phone}</span></div>}
              {personal.location && <div className="flex items-center gap-3 min-w-0"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><MapPin className="w-3 h-3 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 leading-tight ${getDynamicTextSize(personal.location)}`}>{personal.location}</span></div>}
              {personal.website && <div className="flex items-center gap-3 min-w-0"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Globe className="w-3 h-3 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 leading-tight ${getDynamicTextSize(personal.website.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.website.replace(/^https?:\/\//, '')}</span></div>}
              {personal.linkedin && <div className="flex items-center gap-3 min-w-0"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Linkedin className="w-3 h-3 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 leading-tight ${getDynamicTextSize(personal.linkedin.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.linkedin.replace(/^https?:\/\//, '')}</span></div>}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mt-2 w-full min-w-0">
              <div className="mb-4">
                <h2 className={`text-[11px] font-bold uppercase text-white bg-slate-800 px-3 py-1.5 inline-block border-s-2 whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary }}>
                  {t.skills.sectionTitle}
                </h2>
              </div>
              <div className="space-y-3 px-1 text-start min-w-0">
                {skills.map(s => (
                  <div key={s.id} className="w-full min-w-0">
                    <div className="flex justify-between text-[11px] font-medium mb-1 min-w-0">
                      <span className="break-words min-w-0 flex-1">{s.name}</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ 
                        backgroundColor: primary,
                        width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '80%' : s.level === 'Intermediate' ? '60%' : '40%' 
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="mt-2 w-full min-w-0">
              <div className="mb-4">
                <h2 className={`text-[11px] font-bold uppercase text-white bg-slate-800 px-3 py-1.5 inline-block border-s-2 whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary }}>
                  {t.languages.sectionTitle}
                </h2>
              </div>
              <div className="space-y-3 px-1 text-start min-w-0">
                {languages.map(l => (
                  <div key={l.id} className="flex justify-between items-center text-[11px] min-w-0">
                    <span className="font-semibold break-words min-w-0 flex-1">{l.name}</span>
                    <span className="opacity-70 text-[10px] shrink-0 ms-2">{t.proficiencies[l.proficiency] || l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[62%] shrink-0 p-8 bg-white flex flex-col text-start min-w-0">
        <header className="mb-6 mt-2 min-w-0 shrink-0">
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-wider break-words">{personal.fullName}</h1>
          <p className="text-[13px] font-bold tracking-widest uppercase break-words" style={{ color: primary }}>{personal.jobTitle}</p>
        </header>

        <div className={`w-full min-w-0 ${isDense ? 'space-y-4' : 'space-y-8'}`}>
          {summary && (
            <section className="text-start min-w-0">
              <p className="text-[12px] text-slate-600 break-words whitespace-pre-wrap leading-[1.7]">{renderText(summary)}</p>
            </section>
          )}

          {experiences && experiences.length > 0 && (
            <section className="min-w-0">
              <div className="mb-4">
                <h2 className={`inline-block border border-slate-300 text-slate-800 uppercase px-4 py-1.5 text-[11px] font-bold whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`}>
                  {t.experience.sectionTitle}
                </h2>
              </div>
              <div className={`min-w-0 ${isDense ? 'space-y-4' : 'space-y-6'}`}>
                {experiences.map(exp => (
                  <div key={exp.id} className="min-w-0">
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1 min-w-0">
                      <h3 className="text-[13px] font-bold text-slate-900 uppercase break-words">{exp.position}</h3>
                      <span className="text-[10px] font-bold tracking-widest text-slate-500 shrink-0">
                        {exp.startDate}  {exp.current ? t.present : exp.endDate}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold mb-2 break-words" style={{ color: primary }}>
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                    </h4>
                    {exp.description && <p className="text-[12px] text-slate-600 mb-2 break-words whitespace-pre-wrap leading-[1.6]">{renderText(exp.description)}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ms-4 text-[12px] text-slate-600 space-y-1 min-w-0">
                        {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1 break-words">{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section className="min-w-0">
              <div className="mb-4">
                <h2 className={`inline-block border border-slate-300 text-slate-800 uppercase px-4 py-1.5 text-[11px] font-bold whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`}>
                  {t.education.sectionTitle}
                </h2>
              </div>
              <div className={`min-w-0 ${isDense ? 'space-y-3' : 'space-y-5'}`}>
                {education.map(edu => (
                  <div key={edu.id} className="min-w-0">
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1 min-w-0">
                      <h3 className="text-[13px] font-bold text-slate-900 uppercase break-words">{edu.degree}</h3>
                      <span className="text-[10px] font-bold tracking-widest text-slate-500 shrink-0">
                        {edu.startDate}  {edu.endDate}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold break-words" style={{ color: primary }}>{edu.institution}</h4>
                    {(edu.fieldOfStudy || edu.gpa) && (
                      <p className="text-[12px] text-slate-500 mt-1 font-medium break-words">
                        {edu.fieldOfStudy} {edu.gpa && ` GPA: ${edu.gpa}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const CreativeMinimalTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#b45309';
  const { isDense } = getContentDensity(data);
  const { fontSize, fontSizeScale, spacing, isAutoFill, dataAttrs, cssVars } = getCustomizationData(theme, isPrint);
  const scaleClass = '';

  return (
    <div
      id={id}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...dataAttrs}
      style={{ ...cssVars }}
      className={`cv-premium-template bg-white text-slate-800 ${
        isRTL ? 'font-arabic' : 'font-sans'
      } overflow-hidden min-h-[1120px] w-[794px] min-w-[794px] max-w-[794px] mx-auto shadow-sm flex flex-col ${
        isPrint ? 'shadow-none border-0' : 'shadow-xl rounded-sm border border-slate-200/90'
      } ${scaleClass}`}
    >
      
      {/* Top Header */}
      <div className="w-full bg-slate-800 flex flex-row items-center px-8 relative shrink-0" style={{ minHeight: '140px' }}>
         <div className="w-[130px] shrink-0 relative h-full">
            {/* Avatar overlapping bottom */}
            <div className="absolute -bottom-16 start-0 w-32 h-32 rounded-full overflow-hidden border-[6px] border-white shadow-lg bg-slate-100 flex items-center justify-center z-20">
               {personal.avatarUrl ? (
                  <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
               ) : (
                  <span className="text-3xl text-slate-400 font-light">{personal.fullName?.charAt(0) || ''}</span>
               )}
            </div>
         </div>
         
         {/* Name & Title */}
         <div className="flex-1 flex flex-col justify-center ps-4 z-10 text-start min-w-0">
            <h1 className="text-3xl font-black text-white mb-2 tracking-wider uppercase break-words">{personal.fullName}</h1>
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-0.5 w-8 bg-white/50 shrink-0"></span>
              <p className="text-[11px] font-bold tracking-widest uppercase text-white break-words">{personal.jobTitle}</p>
            </div>
         </div>
      </div>

      <div className="flex flex-row flex-1 w-full bg-white relative z-0">
        {/* Main Content (Left) */}
        <div className="w-[62%] shrink-0 pt-28 ps-8 pe-6 pb-8 flex flex-col text-start bg-white border-e border-slate-100 min-w-0">
          <div className={`w-full min-w-0 ${isDense ? 'space-y-4' : 'space-y-8'}`}>
            {summary && (
              <section className="min-w-0">
                <h2 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-3">
                  <span className="w-5 h-5 shrink-0 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
                     <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                  {t.summary.sectionTitle}
                </h2>
                <p className="text-[12px] text-slate-600 border-s-2 ms-2.5 ps-4 border-slate-200 break-words whitespace-pre-wrap leading-[1.7]">{renderText(summary)}</p>
              </section>
            )}

            {experiences && experiences.length > 0 && (
              <section className="min-w-0">
                <h2 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-5 h-5 shrink-0 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
                     <Briefcase className="w-3 h-3 text-white" />
                  </span>
                  {t.experience.sectionTitle}
                </h2>
                <div className={`space-y-6 ms-2.5 border-s-2 border-slate-200 ps-4 min-w-0 ${isDense ? 'space-y-4' : 'space-y-6'}`}>
                  {experiences.map(exp => (
                    <div key={exp.id} className="min-w-0">
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0">
                          {exp.startDate}  {exp.current ? t.present : exp.endDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold mb-2 break-words" style={{ color: primary }}>
                        {exp.company}
                      </h4>
                      {exp.description && <p className="text-[12px] text-slate-600 mb-2 break-words whitespace-pre-wrap leading-[1.6]">{renderText(exp.description)}</p>}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-outside ms-4 text-[12px] text-slate-600 space-y-1 min-w-0">
                          {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1 break-words">{h}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education && education.length > 0 && (
              <section className="min-w-0">
                <h2 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-5 h-5 shrink-0 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
                     <GraduationCap className="w-3 h-3 text-white" />
                  </span>
                  {t.education.sectionTitle}
                </h2>
                <div className={`space-y-5 ms-2.5 border-s-2 border-slate-200 ps-4 min-w-0 ${isDense ? 'space-y-3' : 'space-y-5'}`}>
                  {education.map(edu => (
                    <div key={edu.id} className="min-w-0">
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-slate-800 break-words">{edu.degree}</h3>
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0">{edu.startDate}  {edu.endDate}</span>
                      </div>
                      <h4 className="text-xs font-bold break-words" style={{ color: primary }}>{edu.institution}</h4>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="w-[38%] shrink-0 bg-slate-800 text-white pt-10 pb-8 flex flex-col text-start shadow-inner relative z-0 min-w-0">
          <div className={`w-full min-w-0 ${isDense ? 'space-y-4' : 'space-y-8'}`}>
            
            {/* Ribbons */}
            <div className="w-full min-w-0">
              <div className="flex w-full">
                 <h2 className="text-[11px] font-bold uppercase tracking-widest text-white shadow-md rounded-e-full py-1.5 ps-6 pe-4 mb-5 inline-block" style={{ backgroundColor: primary }}>
                   {t.personal.sectionTitle || 'Contact'}
                 </h2>
              </div>
              <div className="space-y-3 px-6 sm:px-8 text-[12px] min-w-0">
                {personal.email && <div className="flex items-center gap-2.5 min-w-0"><Mail className="w-3.5 h-3.5 shrink-0"/> <span className={`break-words [word-break:break-word] min-w-0 ${getDynamicTextSize(personal.email)}`} dir="ltr">{personal.email}</span></div>}
                {personal.phone && <div className="flex items-center gap-2.5 min-w-0"><Phone className="w-3.5 h-3.5 shrink-0"/> <span className={`break-words [word-break:break-word] min-w-0 ${getDynamicTextSize(personal.phone)}`} dir="ltr">{personal.phone}</span></div>}
                {personal.location && <div className="flex items-center gap-2.5 min-w-0"><MapPin className="w-3.5 h-3.5 shrink-0"/> <span className={`break-words [word-break:break-word] min-w-0 ${getDynamicTextSize(personal.location)}`}>{personal.location}</span></div>}
                {personal.linkedin && <div className="flex items-center gap-2.5 min-w-0"><Linkedin className="w-3.5 h-3.5 shrink-0"/> <span className={`break-words [word-break:break-word] min-w-0 ${getDynamicTextSize(personal.linkedin.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.linkedin.replace(/^https?:\/\//, '')}</span></div>}
              </div>
            </div>

            {skills && skills.length > 0 && (
              <div className="w-full min-w-0">
                <div className="flex w-full">
                   <h2 className="text-[11px] font-bold uppercase tracking-widest text-white shadow-md rounded-e-full py-1.5 ps-6 pe-4 mb-5 inline-block" style={{ backgroundColor: primary }}>
                     {t.skills.sectionTitle}
                   </h2>
                </div>
                <div className="space-y-4 px-6 min-w-0">
                  {skills.map(s => (
                    <div key={s.id} className="w-full min-w-0">
                      <div className="flex justify-between text-[11px] font-medium mb-1 min-w-0">
                        <span className="break-words min-w-0 flex-1">{s.name}</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-white" style={{ 
                          width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '80%' : s.level === 'Intermediate' ? '60%' : '40%' 
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div className="w-full min-w-0">
                <div className="flex w-full">
                   <h2 className="text-[11px] font-bold uppercase tracking-widest text-white shadow-md rounded-e-full py-1.5 ps-6 pe-4 mb-5 inline-block" style={{ backgroundColor: primary }}>
                     {t.languages.sectionTitle}
                   </h2>
                </div>
                <div className="space-y-3 px-6 min-w-0">
                  {languages.map(l => (
                    <div key={l.id} className="flex justify-between items-center text-[11px] min-w-0">
                      <span className="font-semibold break-words min-w-0 flex-1">{l.name}</span>
                      <span className="opacity-70 text-[10px] shrink-0 ms-2">{t.proficiencies[l.proficiency] || l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

const CorporateEliteTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#ca8a04';
  const { isDense } = getContentDensity(data);
  const { fontSize, fontSizeScale, spacing, isAutoFill, dataAttrs, cssVars } = getCustomizationData(theme, isPrint);
  const scaleClass = '';

  return (
    <div
      id={id}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...dataAttrs}
      style={{ ...cssVars }}
      className={`cv-premium-template bg-slate-950 text-slate-200 ${
        isRTL ? 'font-arabic' : 'font-sans'
      } overflow-hidden min-h-[1120px] w-[794px] min-w-[794px] max-w-[794px] mx-auto shadow-sm flex flex-row ${
        isPrint ? 'shadow-none border-0' : 'shadow-xl rounded-sm border border-slate-800'
      } ${scaleClass}`}
    >
      
      {/* Sidebar */}
      <div className="w-[38%] shrink-0 bg-[#111111] p-6 md:p-8 flex flex-col text-start border-e border-slate-800 min-w-0">
        
        {/* Hexagon Profile Pic */}
        <div className="w-full flex justify-center mt-2 mb-4 shrink-0">
           <div className="w-32 h-32 shrink-0 aspect-square relative" style={{ backgroundColor: primary, clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}>
              <div className="absolute inset-[3px] bg-slate-950 flex items-center justify-center overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}>
                {personal.avatarUrl ? (
                  <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <span className="text-4xl text-slate-500 font-light">{personal.fullName?.charAt(0) || ''}</span>
                )}
              </div>
           </div>
        </div>

        <div className={`w-full min-w-0 ${isDense ? 'space-y-4' : 'space-y-8'}`}>
          {/* Contact Info */}
          <div className="w-full min-w-0">
              <div className="flex justify-center mb-5 w-full">
                 <h2 className={`inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase text-center whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary, color: primary, borderRadius: "9999px", borderWidth: "1.5px", borderStyle: "solid" }}>
                   {t.personal.sectionTitle || 'Contact'}
                 </h2>
              </div>
              <div className="space-y-4 text-[12px] text-slate-300 w-full min-w-0 px-2.5">
                {personal.email && <div className="flex items-center gap-3 min-w-0"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 ${getDynamicTextSize(personal.email)}`} dir="ltr">{personal.email}</span></div>}
                {personal.phone && <div className="flex items-center gap-3 min-w-0"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Phone className="w-3.5 h-3.5 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 ${getDynamicTextSize(personal.phone)}`} dir="ltr">{personal.phone}</span></div>}
                {personal.location && <div className="flex items-center gap-3 min-w-0"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 leading-tight ${getDynamicTextSize(personal.location)}`}>{personal.location}</span></div>}
                {personal.website && <div className="flex items-center gap-3 min-w-0"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Globe className="w-3.5 h-3.5 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 ${getDynamicTextSize(personal.website.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.website.replace(/^https?:\/\//, '')}</span></div>}
                {personal.linkedin && <div className="flex items-center gap-3 min-w-0"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Linkedin className="w-3.5 h-3.5 text-white" /></div><span className={`break-words [word-break:break-word] flex-1 min-w-0 ${getDynamicTextSize(personal.linkedin.replace(/^https?:\/\//, ''))}`} dir="ltr">{personal.linkedin.replace(/^https?:\/\//, '')}</span></div>}
              </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="w-full min-w-0">
              <div className="flex justify-center mb-5 w-full">
                 <h2 className={`inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase text-center whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary, color: primary, borderRadius: "9999px", borderWidth: "1.5px", borderStyle: "solid" }}>
                   {t.skills.sectionTitle}
                 </h2>
              </div>
              <div className="space-y-4 w-full min-w-0">
                {skills.map(s => (
                  <div key={s.id} className="w-full min-w-0">
                    <div className="flex justify-between text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider min-w-0">
                      <span className="break-words min-w-0 flex-1">{s.name}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ 
                        backgroundColor: primary,
                        width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '80%' : s.level === 'Intermediate' ? '60%' : '40%' 
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="w-full min-w-0">
              <div className="flex justify-center mb-5 w-full">
                 <h2 className={`inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase text-center whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary, color: primary, borderRadius: "9999px", borderWidth: "1.5px", borderStyle: "solid" }}>
                   {t.languages.sectionTitle}
                 </h2>
              </div>
              <div className="space-y-3 w-full min-w-0">
                {languages.map(l => (
                  <div key={l.id} className="flex justify-between items-center text-[11px] min-w-0">
                    <span className="font-bold text-white break-words min-w-0 flex-1">{l.name}</span>
                    <span className="text-slate-400 text-[10px] shrink-0 ms-2">{t.proficiencies[l.proficiency] || l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[62%] shrink-0 p-8 bg-slate-950 flex flex-col text-start min-w-0">
        <header className="mb-6 mt-2 pb-6 border-b border-slate-800 min-w-0 shrink-0">
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide leading-none break-words">{personal.fullName}</h1>
          <p className="text-[13px] font-bold tracking-widest uppercase break-words" style={{ color: primary }}>{personal.jobTitle}</p>
        </header>

        <div className={`w-full min-w-0 ${isDense ? 'space-y-4' : 'space-y-8'}`}>
          {summary && (
            <section className="w-full min-w-0">
              <div className="mb-4 w-full">
                 <h2 className={`inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary, color: primary, borderRadius: "9999px", borderWidth: "1.5px", borderStyle: "solid" }}>
                   {t.summary.sectionTitle}
                 </h2>
              </div>
              <p className="text-[11px] sm:text-[12px] text-slate-300 break-words whitespace-pre-wrap leading-[1.7]">{renderText(summary)}</p>
            </section>
          )}

          {experiences && experiences.length > 0 && (
            <section className="w-full min-w-0">
              <div className="mb-4 w-full">
                 <h2 className={`inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary, color: primary, borderRadius: "9999px", borderWidth: "1.5px", borderStyle: "solid" }}>
                   {t.experience.sectionTitle}
                 </h2>
              </div>
              <div className={`w-full min-w-0 ${isDense ? 'space-y-4' : 'space-y-6'}`}>
                {experiences.map(exp => (
                  <div key={exp.id} className="w-full min-w-0">
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1 min-w-0">
                      <h3 className="text-[13px] font-bold text-white leading-snug break-words">{exp.position}</h3>
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0 xl:text-end mt-1 xl:mt-0">{exp.startDate}  {exp.current ? t.present : exp.endDate}</span>
                    </div>
                    <h4 className="text-[11px] text-slate-400 mt-1 break-words">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</h4>
                    {exp.description && <p className="text-[11px] sm:text-[12px] text-slate-400 mt-2 break-words whitespace-pre-wrap leading-[1.6]">{renderText(exp.description)}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ms-4 mt-2 text-[11px] sm:text-[12px] text-slate-400 space-y-1.5 min-w-0">
                        {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1 break-words">{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section className="w-full min-w-0">
              <div className="mb-4 w-full">
                 <h2 className={`inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase whitespace-nowrap leading-none ${isRTL ? 'tracking-normal' : 'tracking-widest'}`} style={{ borderColor: primary, color: primary, borderRadius: "9999px", borderWidth: "1.5px", borderStyle: "solid" }}>
                   {t.education.sectionTitle}
                 </h2>
              </div>
              <div className={`w-full min-w-0 ${isDense ? 'space-y-3' : 'space-y-5'}`}>
                {education.map(edu => (
                  <div key={edu.id} className="w-full min-w-0">
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1 min-w-0">
                      <h3 className="text-[13px] font-bold text-white leading-snug break-words">{edu.degree}</h3>
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0 xl:text-end mt-1 xl:mt-0">{edu.startDate}  {edu.endDate}</span>
                    </div>
                    <h4 className="text-[11px] text-slate-400 mt-1 break-words">{edu.institution}</h4>
                    {(edu.fieldOfStudy || edu.gpa) && (
                      <p className="text-[11px] text-slate-500 mt-1.5 font-medium break-words">
                        {edu.fieldOfStudy} {edu.gpa && ` GPA: ${edu.gpa}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const CVDocument: React.FC<CVDocumentProps> = (props) => {
  const templateId = props.data.theme?.template || props.data.theme?.layoutStyle || 'modern';

  // Mount a completely distinct React Component based on the template.
  // This prevents React from reusing DOM nodes between structurally different templates,
  // ensuring CSS grids, flexboxes, and specific styles do not collapse or inherit.

  switch (templateId) {
    case 'executive-modern':
      return <ExecutiveModernTemplate {...props} />;
    case 'creative-minimal':
      return <CreativeMinimalTemplate {...props} />;
    case 'corporate-elite':
      return <CorporateEliteTemplate {...props} />;
    case 'executive':

      return <ExecutiveTemplateWrapper {...props} />;
    case 'creative':
      return <CreativeTemplateWrapper {...props} />;
    case 'minimalist':
      return <MinimalistTemplateWrapper {...props} />;
    case 'modern':
    default:
      return <ModernTemplateWrapper {...props} />;
  }
};
