import React from 'react';
import { CVData, TemplateId } from '../types';
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
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const renderText = (text?: string) => {
  if (!text) return null;
  return text.split(/\\n|\n/).map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
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
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#7c3aed';
  const templateId: TemplateId = (theme?.template || theme?.layoutStyle || 'modern') as TemplateId;

  // Font family determination with Arabic fallback
  const getFontFamily = () => {
    if (isRTL) {
      return theme?.fontFamily === 'serif' ? 'Tajawal, Cairo, serif' : 'Cairo, Tajawal, sans-serif';
    }
    return theme?.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Plus Jakarta Sans, sans-serif';
  };

  // Dynamic responsive A4 container: uses fluid relative heights, removes clipping
  const containerClasses = `w-full max-w-[210mm] min-h-[297mm] h-auto bg-white text-slate-800 flex flex-col transition-all ${
    isRTL ? 'font-arabic' : ''
  } ${isPrint ? 'p-8 sm:p-10 shadow-none border-0' : 'p-6 sm:p-8 md:p-10 shadow-xl rounded-sm border border-slate-200/90 select-none'}`;

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
      <div className="w-full flex justify-center">
        <div
          id={id}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={containerClasses}
          style={{ fontFamily: getFontFamily() }}
        >
          {/* Top Banner / Header */}
          <header className="border-b-2 pb-2.5 sm:pb-3.5 mb-4 sm:mb-6" style={{ borderColor: `${primary}25` }}>
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1
                  className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight break-words"
                  style={{ color: primary }}
                >
                  {personal.fullName || (isRTL ? 'الاسم الكامل' : 'Candidate Name')}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 break-words">
                  {personal.jobTitle || (isRTL ? 'المسمى الوظيفي' : 'Job Title')}
                </p>

                {/* Contact Details Grid */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 sm:gap-x-3.5 mt-2 text-xs sm:text-[13px] text-slate-500">
                  {personal.email && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className="break-all">{personal.email}</span>
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
                      <span className="break-words whitespace-normal">{personal.location}</span>
                    </div>
                  )}
                  {personal.website && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className="break-all">{personal.website.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  {personal.linkedin && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className="break-all">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  {personal.github && (
                    <div className="flex items-center gap-1 min-w-0">
                      <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                      <span dir="ltr" className="break-all">{personal.github.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Profile Avatar */}
              {personal.avatarUrl && (
                <div className="shrink-0">
                  <img
                    src={personal.avatarUrl}
                    alt={personal.fullName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 shadow-sm"
                    style={{ borderColor: primary }}
                  />
                </div>
              )}
            </div>
          </header>

          {/* Summary */}
          {summary && (
            <section className="mb-4 sm:mb-6 p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border" style={{ borderColor: `${primary}20` }}>
              <h2
                className="text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"
                style={{ color: primary }}
              >
                <span>{t.summary.sectionTitle}</span>
              </h2>
              <p className="text-xs sm:text-[13px] leading-[1.7] text-slate-700 text-justify break-words">
                {renderText(summary)}
              </p>
            </section>
          )}

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-12 gap-3 sm:gap-5">
            {/* Main Column (Experience & Education) */}
            <div className="col-span-8 min-w-0 space-y-5 sm:space-y-7">
              {/* Work Experience */}
              {experiences && experiences.length > 0 && (
                <section>
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 sm:mb-2.5 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.experience.sectionTitle}</span>
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className={`relative ${
                          isRTL ? 'pr-2.5 sm:pr-3 border-r-2' : 'pl-2.5 sm:pl-3 border-l-2'
                        }`}
                        style={{ borderColor: `${primary}40` }}
                      >
                        <div className="flex flex-nowrap justify-between items-baseline gap-1 mb-0.5">
                          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                          <span className="text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                            {exp.startDate} – {exp.current ? t.present : exp.endDate}
                          </span>
                        </div>
                        <div className="text-[11px] sm:text-xs font-medium text-slate-700 mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="font-semibold break-words" style={{ color: primary }}>{exp.company}</span>
                          {exp.location && <span className="text-slate-400 break-words">• {exp.location}</span>}
                        </div>
                        {exp.description && (
                          <p className="text-[11px] sm:text-xs text-slate-600 mb-1 leading-[1.7] break-words">
                            {renderText(exp.description)}
                          </p>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className={`list-disc list-outside ${isRTL ? 'mr-3.5' : 'ml-3.5'} space-y-0.5 text-[11px] sm:text-xs text-slate-600 leading-snug break-words`}>
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
                <section>
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 sm:mb-2.5 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.education.sectionTitle}</span>
                  </h2>

                  <div className="space-y-4 sm:space-y-5">
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className={`relative ${
                          isRTL ? 'pr-2.5 sm:pr-3 border-r-2' : 'pl-2.5 sm:pl-3 border-l-2'
                        }`}
                        style={{ borderColor: `${primary}40` }}
                      >
                        <div className="flex flex-nowrap justify-between items-baseline gap-1 mb-0.5">
                          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{edu.degree}</h3>
                          <span className="text-[11px] sm:text-xs font-medium text-slate-500 shrink-0">
                            {edu.startDate} – {edu.endDate}
                          </span>
                        </div>
                        <div className="text-[11px] sm:text-xs font-medium text-slate-700 flex flex-wrap items-center gap-x-1.5">
                          <span style={{ color: primary }} className="break-words">{edu.institution}</span>
                          {edu.location && <span className="text-slate-400 break-words">, {edu.location}</span>}
                        </div>
                        {edu.fieldOfStudy && (
                          <p className="text-[11px] sm:text-xs text-slate-500 italic mt-0.5 break-words">{edu.fieldOfStudy}</p>
                        )}
                        {edu.gpa && (
                          <p className="text-[11px] sm:text-xs font-medium text-slate-600 mt-0.5">
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
            <div className="col-span-4 min-w-0 space-y-5 sm:space-y-7">
              {/* Skills */}
              {skills && skills.length > 0 && (
                <section>
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
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-medium border break-words max-w-full"
                        style={{
                          backgroundColor: `${primary}08`,
                          borderColor: `${primary}25`,
                          color: primary,
                        }}
                      >
                        <span className="break-words whitespace-normal">{skill.name}</span>
                        <span className="text-[8px] sm:text-[9px] text-slate-400 shrink-0">
                          ({t.levels[skill.level] || skill.level})
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <section>
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
                        <span className="font-medium text-slate-800 break-words whitespace-normal">{item.name}</span>
                        <span className="text-[11px] sm:text-xs text-slate-500 font-medium shrink-0">
                          {t.proficiencies[item.proficiency] || item.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hobbies / Interests */}
              {hobbies && hobbies.length > 0 && (
                <section>
                  <h2
                    className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-1.5 sm:mb-2 border-b flex items-center gap-1.5"
                    style={{ color: primary, borderColor: `${primary}30` }}
                  >
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.hobbies.sectionTitle}</span>
                  </h2>

                  <div className="flex flex-wrap gap-1">
                    {hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 break-words"
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
      </div>
    );
  }

  // =========================================================================
  // 2. TEMPLATE: EXECUTIVE CORPORATE (Formal, structured, authoritative)
  // =========================================================================
  if (templateId === 'executive') {
    return (
      <div className="w-full flex justify-center">
        <div
          id={id}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={containerClasses}
          style={{ fontFamily: getFontFamily() }}
        >
          {/* Formal Centered Header */}
          <header className="text-center pb-2.5 sm:pb-3.5 mb-4 sm:mb-6 border-b-2 border-double" style={{ borderColor: primary }}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider uppercase text-slate-900 leading-tight break-words">
              {personal.fullName || (isRTL ? 'الاسم الكامل' : 'Candidate Name')}
            </h1>
            <p
              className="text-xs sm:text-sm font-semibold tracking-widest uppercase mt-0.5 break-words"
              style={{ color: primary }}
            >
              {personal.jobTitle || (isRTL ? 'المسمى الوظيفي' : 'Job Title')}
            </p>

            {/* Formal Horizontal Contact Bar with Bullet Separators */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-2 text-[11px] sm:text-xs text-slate-600">
              {personal.email && <span dir="ltr" className="break-all">{personal.email}</span>}
              {personal.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span dir="ltr">{personal.phone}</span>
                </>
              )}
              {personal.location && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{personal.location}</span>
                </>
              )}
              {personal.linkedin && (
                <>
                  <span className="text-slate-300">•</span>
                  <span dir="ltr" className="break-all">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
                </>
              )}
              {personal.website && (
                <>
                  <span className="text-slate-300">•</span>
                  <span dir="ltr" className="break-all">{personal.website.replace(/^https?:\/\//, '')}</span>
                </>
              )}
            </div>
          </header>

          {/* Executive Summary */}
          {summary && (
            <section className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-1 pb-0.5 border-b border-slate-300">
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900">
                  {t.summary.sectionTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-[13px] leading-[1.7] text-slate-700 text-justify break-words">
                {renderText(summary)}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {experiences && experiences.length > 0 && (
            <section className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-1.5 pb-0.5 border-b border-slate-300">
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900">
                  {t.experience.sectionTitle}
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex flex-nowrap justify-between items-baseline gap-1">
                      <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-600 shrink-0">
                        {exp.startDate} – {exp.current ? t.present : exp.endDate}
                      </span>
                    </div>

                    <div className="text-[11px] sm:text-xs font-semibold text-slate-700 flex flex-wrap items-center justify-between gap-1">
                      <span style={{ color: primary }} className="break-words">{exp.company}</span>
                      {exp.location && <span className="text-slate-500 font-normal text-[11px] sm:text-xs">{exp.location}</span>}
                    </div>

                    {exp.description && (
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-[1.7] text-justify break-words">
                        {renderText(exp.description)}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className={`list-disc list-outside ${isRTL ? 'mr-4' : 'ml-4'} space-y-0.5 text-[11px] sm:text-xs text-slate-600 leading-snug pt-0.5 break-words`}>
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
            <section className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-1.5 pb-0.5 border-b border-slate-300">
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900">
                  {t.education.sectionTitle}
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-nowrap justify-between items-baseline gap-1">
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{edu.degree}</h3>
                      <div className="text-[11px] sm:text-xs text-slate-700 flex flex-wrap items-center gap-1">
                        <span className="font-semibold break-words" style={{ color: primary }}>{edu.institution}</span>
                        {edu.location && <span className="text-slate-500">, {edu.location}</span>}
                        {edu.fieldOfStudy && <span className="text-slate-500 italic"> — {edu.fieldOfStudy}</span>}
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-600">
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

          {/* Core Competencies / Skills & Languages in Structured Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 pt-1 border-t border-slate-200">
            {/* Competencies */}
            {skills && skills.length > 0 && (
              <div className="min-w-0">
                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900 mb-1.5 pb-0.5 border-b border-slate-200">
                  {t.skills.sectionTitle}
                </h2>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-1.5 text-slate-700 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primary }} />
                      <span className="break-words whitespace-normal">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages & Interests */}
            <div className="min-w-0">
              {languages && languages.length > 0 && (
                <div className="mb-2 sm:mb-2.5">
                  <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
                    {t.languages.sectionTitle}
                  </h2>
                  <div className="space-y-1 text-[11px] sm:text-xs">
                    {languages.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-2">
                        <span className="font-medium text-slate-800 break-words whitespace-normal">{item.name}</span>
                        <span className="text-[11px] sm:text-xs text-slate-500 shrink-0">
                          {t.proficiencies[item.proficiency] || item.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hobbies && hobbies.length > 0 && (
                <div>
                  <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
                    {t.hobbies.sectionTitle}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-600 break-words">
                    {hobbies.join(' • ')}
                  </p>
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
      <div className="w-full flex justify-center">
        <div
          id={id}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`w-full max-w-[210mm] min-h-[297mm] h-auto bg-white text-slate-800 flex transition-all items-stretch ${
            isRTL ? 'font-arabic flex-row-reverse' : 'flex-row'
          } ${isPrint ? 'shadow-none border-0' : 'shadow-xl rounded-sm border border-slate-200/90 select-none'}`}
          style={{ fontFamily: getFontFamily() }}
        >
          {/* Accent Sidebar (34% width on desktop/print, full width on mobile) */}
          <aside
            className="w-[34%] min-w-0 p-4 sm:p-5 flex flex-col justify-start space-y-4 sm:space-y-4 shrink-0"
            style={{
              backgroundColor: `${primary}10`,
              borderRight: isRTL ? 'none' : `2px solid ${primary}25`,
              borderLeft: isRTL ? `2px solid ${primary}25` : 'none',
            }}
          >
            {/* Avatar & Personal Identity */}
            <div className="text-center space-y-1.5 sm:space-y-2">
              {personal.avatarUrl ? (
                <img
                  src={personal.avatarUrl}
                  alt={personal.fullName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full mx-auto object-cover border-2 sm:border-3 shadow-md"
                  style={{ borderColor: primary }}
                />
              ) : (
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center text-white text-base sm:text-xl font-bold shadow-md"
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

            {/* Contact Details */}
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-slate-700 pt-1.5 sm:pt-2 border-t border-slate-200">
              {personal.email && (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                    <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] break-all" dir="ltr">{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                    <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] break-all" dir="ltr">{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] break-all">{personal.location}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] break-all" dir="ltr">{personal.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                    <Linkedin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] break-all" dir="ltr">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {personal.github && (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="p-0.5 sm:p-1 rounded-md text-white shrink-0" style={{ backgroundColor: primary }}>
                    <Github className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] break-all" dir="ltr">{personal.github.replace(/^https?:\/\//, '')}</span>
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
                        <span className="break-words whitespace-normal">{skill.name}</span>
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
                      <span className="font-semibold text-slate-800 break-words whitespace-normal">{item.name}</span>
                      <span className="text-slate-500 shrink-0">{t.proficiencies[item.proficiency] || item.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Creative Hobbies */}
            {hobbies && hobbies.length > 0 && (
              <div className="pt-1.5 sm:pt-2 border-t border-slate-200">
                <h4
                  className="text-xs sm:text-[13px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                  style={{ color: primary }}
                >
                  <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{t.hobbies.sectionTitle}</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {hobbies.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] sm:text-[9px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 break-words"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Body (66% width) */}
          <main className="w-[66%] flex-1 min-w-0 p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header Title & Tagline */}
            <div className="border-b-2 pb-2 sm:pb-3 mb-1.5 sm:mb-2" style={{ borderColor: `${primary}25` }}>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight"
                style={{ color: primary }}
              >
                {personal.fullName || (isRTL ? 'الاسم الكامل' : 'Candidate Name')}
              </h1>
              <div className="inline-block mt-1 sm:mt-1.5 px-2.5 sm:px-3 py-0.5 rounded-lg text-xs sm:text-[13px] font-bold text-white shadow-xs" style={{ backgroundColor: primary }}>
                {personal.jobTitle || (isRTL ? 'المسمى الوظيفي' : 'Job Title')}
              </div>
            </div>

            {/* Profile Statement */}
            {summary && (
              <section className="relative pl-2.5 sm:pl-3 border-l-2 sm:border-l-3" style={{ borderColor: primary }}>
                <p className="text-xs sm:text-[13px] leading-[1.7] text-slate-700 text-justify break-words">
                  {renderText(summary)}
                </p>
              </section>
            )}

            {/* Experience Timeline */}
            {experiences && experiences.length > 0 && (
              <section className="space-y-4 sm:space-y-6">
                <h2
                  className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-1.5 sm:mb-2 border-b flex items-center gap-1.5"
                  style={{ color: primary, borderColor: `${primary}30` }}
                >
                  <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span>{t.experience.sectionTitle}</span>
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-3 sm:pl-3.5 border-l-2" style={{ borderColor: `${primary}40` }}>
                      <span
                        className="absolute -left-[5px] top-1 w-2 h-2 rounded-full border border-white"
                        style={{ backgroundColor: primary }}
                      />
                      <div className="flex flex-nowrap justify-between items-baseline gap-1">
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                        <span className="text-[11px] sm:text-xs font-bold text-white px-1.5 sm:px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: primary }}>
                          {exp.startDate} – {exp.current ? t.present : exp.endDate}
                        </span>
                      </div>

                      <div className="text-[11px] sm:text-xs font-semibold text-slate-700 my-0.5 flex flex-wrap items-center gap-1">
                        <span style={{ color: primary }} className="break-words">{exp.company}</span>
                        {exp.location && <span className="text-slate-400 font-normal"> • {exp.location}</span>}
                      </div>

                      {exp.description && (
                        <p className="text-[11px] sm:text-xs text-slate-600 mb-1 leading-[1.7] break-words">
                          {renderText(exp.description)}
                        </p>
                      )}

                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[11px] sm:text-xs text-slate-600 leading-snug break-words">
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
              <section className="space-y-4 sm:space-y-5">
                <h2
                  className="text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1 mb-1.5 sm:mb-2 border-b flex items-center gap-1.5"
                  style={{ color: primary, borderColor: `${primary}30` }}
                >
                  <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span>{t.education.sectionTitle}</span>
                </h2>

                <div className="space-y-1.5 sm:space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-1.5 sm:p-2 rounded-xl bg-slate-50/80 border border-slate-200/80">
                      <div className="flex flex-nowrap justify-between items-baseline gap-1">
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">{edu.degree}</h3>
                        <span className="text-[11px] sm:text-xs text-slate-500 font-medium shrink-0">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      <div className="text-[11px] sm:text-xs font-medium text-slate-700 flex flex-wrap items-center gap-1">
                        <span style={{ color: primary }} className="break-words">{edu.institution}</span>
                        {edu.location && <span className="text-slate-400">, {edu.location}</span>}
                      </div>
                      {edu.fieldOfStudy && (
                        <p className="text-[11px] sm:text-xs text-slate-500 italic mt-0.5 break-words">{edu.fieldOfStudy}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-[11px] sm:text-xs font-medium text-slate-600 mt-0.5">
                          {t.education.gpa}: {edu.gpa}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. TEMPLATE: MINIMALIST CLEAN (ATS-Friendly, single column, pure whitespace)
  // =========================================================================
  return (
    <div className="w-full flex justify-center">
      <div
        id={id}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={containerClasses}
        style={{ fontFamily: getFontFamily() }}
      >
        {/* Clean Linear Header */}
        <header className="pb-2.5 sm:pb-3 mb-4 sm:mb-6 border-b border-slate-300">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 break-words">
            {personal.fullName || (isRTL ? 'الاسم الكامل' : 'Candidate Name')}
          </h1>
          <p className="text-xs sm:text-sm font-semibold mt-0.5 break-words" style={{ color: primary }}>
            {personal.jobTitle || (isRTL ? 'المسمى الوظيفي' : 'Job Title')}
          </p>

          {/* Inline ATS-friendly Contact row separated by pipes */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-xs sm:text-[13px] text-slate-600">
            {personal.email && <span dir="ltr" className="break-all">{personal.email}</span>}
            {personal.phone && (
              <>
                <span className="text-slate-400">|</span>
                <span dir="ltr">{personal.phone}</span>
              </>
            )}
            {personal.location && (
              <>
                <span className="text-slate-400">|</span>
                <span>{personal.location}</span>
              </>
            )}
            {personal.linkedin && (
              <>
                <span className="text-slate-400">|</span>
                <span dir="ltr" className="break-all">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
              </>
            )}
            {personal.github && (
              <>
                <span className="text-slate-400">|</span>
                <span dir="ltr" className="break-all">{personal.github.replace(/^https?:\/\//, '')}</span>
              </>
            )}
            {personal.website && (
              <>
                <span className="text-slate-400">|</span>
                <span dir="ltr" className="break-all">{personal.website.replace(/^https?:\/\//, '')}</span>
              </>
            )}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
              {t.summary.sectionTitle}
            </h2>
            <p className="text-xs sm:text-[13px] leading-[1.7] text-slate-700 text-justify break-words">
              {renderText(summary)}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section className="mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
              {t.experience.sectionTitle}
            </h2>

            <div className="space-y-4 sm:space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-nowrap justify-between items-baseline gap-1">
                    <div className="text-xs sm:text-[13px] font-bold text-slate-900 break-words">
                      <span>{exp.position}</span>
                      <span className="font-normal text-slate-500"> — </span>
                      <span className="font-semibold" style={{ color: primary }}>{exp.company}</span>
                      {exp.location && <span className="text-slate-500 font-normal">, {exp.location}</span>}
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-medium shrink-0">
                      {exp.startDate} – {exp.current ? t.present : exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-[1.7] break-words">
                      {renderText(exp.description)}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className={`list-disc list-outside ${isRTL ? 'mr-4' : 'ml-4'} space-y-0.5 text-[11px] sm:text-xs text-slate-600 leading-snug mt-0.5 break-words`}>
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
          <section className="mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
              {t.education.sectionTitle}
            </h2>

            <div className="space-y-1.5 sm:space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-nowrap justify-between items-baseline gap-1">
                  <div className="text-xs sm:text-[13px] min-w-0">
                    <span className="font-bold text-slate-900 break-words">{edu.degree}</span>
                    <span className="text-slate-500"> — </span>
                    <span className="font-semibold break-words" style={{ color: primary }}>{edu.institution}</span>
                    {edu.location && <span className="text-slate-500">, {edu.location}</span>}
                    {edu.fieldOfStudy && <span className="text-slate-500 italic"> ({edu.fieldOfStudy})</span>}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 shrink-0">
                    <span>{edu.startDate} – {edu.endDate}</span>
                    {edu.gpa && <span className="ml-1 text-slate-600">({edu.gpa})</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills (ATS-Optimized linear categorized tags) */}
        {skills && skills.length > 0 && (
          <section className="mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
              {t.skills.sectionTitle}
            </h2>
            <div className="flex flex-wrap gap-1 text-[11px] sm:text-xs">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 break-words"
                >
                  {skill.name} ({t.levels[skill.level] || skill.level})
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages & Hobbies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
          {languages && languages.length > 0 && (
            <div className="min-w-0">
              <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
                {t.languages.sectionTitle}
              </h2>
              <div className="text-[11px] sm:text-xs text-slate-600 space-y-0.5">
                {languages.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <span className="font-medium text-slate-800 break-words whitespace-normal">{item.name}</span>
                    <span className="shrink-0">{t.proficiencies[item.proficiency] || item.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hobbies && hobbies.length > 0 && (
            <div className="min-w-0">
              <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 mb-1 pb-0.5 border-b border-slate-200">
                {t.hobbies.sectionTitle}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 break-words">
                {hobbies.join(' • ')}
              </p>
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

export const CVDocument: React.FC<CVDocumentProps> = (props) => {
  const templateId = props.data.theme?.template || props.data.theme?.layoutStyle || 'modern';

  // Mount a completely distinct React Component based on the template.
  // This prevents React from reusing DOM nodes between structurally different templates,
  // ensuring CSS grids, flexboxes, and specific styles do not collapse or inherit.
  switch (templateId) {
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
