import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_templates = """
const ExecutiveModernTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#1e293b';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white text-slate-800 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm flex flex-row ${scaleClass}`}>
      {/* Sidebar - Dark Accent */}
      <div className="w-[32%] shrink-0 text-white p-5 md:p-6 flex flex-col gap-5" style={{ backgroundColor: primary }}>
        {personal.avatarUrl ? (
          <div className="w-20 h-20 shrink-0 mx-auto rounded-full overflow-hidden border-2 border-white/20 shadow-lg aspect-square">
            <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-20 h-20 shrink-0 mx-auto rounded-full bg-white/10 border-2 border-white/20 shadow-lg flex items-center justify-center aspect-square">
            <span className="text-2xl text-white/50">{personal.fullName?.charAt(0) || ''}</span>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-lg font-bold leading-tight mb-0.5">{personal.fullName}</h1>
          <p className="text-[11px] text-white/80 font-semibold uppercase tracking-wider">{personal.jobTitle}</p>
        </div>

        <div className="space-y-2 text-[11px] sm:text-xs text-white/90 text-start w-full">
          {personal.email && <div className="flex items-start gap-2"><Mail className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" /><span className="break-all flex-1 min-w-0">{personal.email}</span></div>}
          {personal.phone && <div className="flex items-start gap-2"><Phone className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" /><span className="flex-1 min-w-0">{personal.phone}</span></div>}
          {personal.location && <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" /><span className="flex-1 min-w-0 leading-snug">{personal.location}</span></div>}
          {personal.linkedin && <div className="flex items-start gap-2"><Linkedin className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" /><span className="break-all flex-1 min-w-0">{personal.linkedin.replace(/^https?:\\/\\//, '')}</span></div>}
          {personal.github && <div className="flex items-start gap-2"><Github className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" /><span className="break-all flex-1 min-w-0">{personal.github.replace(/^https?:\\/\\//, '')}</span></div>}
          {personal.website && <div className="flex items-start gap-2"><Globe className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" /><span className="break-all flex-1 min-w-0">{personal.website.replace(/^https?:\\/\\//, '')}</span></div>}
        </div>

        {skills && skills.length > 0 && (
          <div className="mt-2 w-full">
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-1.5 mb-2.5 text-start">{t.skills.sectionTitle}</h2>
            <div className="flex flex-wrap gap-1.5 justify-start">
              {skills.map(s => (
                <span key={s.id} className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">{s.name}</span>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="mt-2 w-full">
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-1.5 mb-2.5 text-start">{t.languages.sectionTitle}</h2>
            <div className="space-y-2 text-start">
              {languages.map(l => (
                <div key={l.id} className="flex flex-col text-[11px] sm:text-xs">
                  <span className="font-semibold">{l.name}</span>
                  <span className="opacity-70 text-[10px]">{t.proficiencies[l.proficiency] || l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[68%] p-6 md:p-8 bg-white flex flex-col gap-5">
        {summary && (
          <section className="text-start">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-800 mb-2.5 flex items-center gap-2" style={{ color: primary }}>
              <span className="w-6 h-0.5 bg-current inline-block rounded-full shrink-0"></span>
              {t.summary.sectionTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-[1.6] text-justify">{renderText(summary)}</p>
          </section>
        )}

        {experiences && experiences.length > 0 && (
          <section className="text-start">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-800 mb-3.5 flex items-center gap-2" style={{ color: primary }}>
              <span className="w-6 h-0.5 bg-current inline-block rounded-full shrink-0"></span>
              {t.experience.sectionTitle}
            </h2>
            <div className="space-y-4 border-s-2 ms-2 ps-4 relative" style={{ borderColor: `${primary}30` }}>
              {experiences.map(exp => (
                <div key={exp.id} className="relative">
                  <div className="absolute top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 shrink-0" style={{ borderColor: primary, insetInlineStart: '-21px' }}></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-0.5 gap-0.5">
                    <h3 className="text-[13px] font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      {exp.startDate} – {exp.current ? t.present : exp.endDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mb-1.5" style={{ color: primary }}>
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </h4>
                  {exp.description && <p className="text-[11px] sm:text-xs text-slate-600 mb-1.5 leading-[1.6]">{renderText(exp.description)}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ms-3 text-[11px] sm:text-xs text-slate-600 space-y-1">
                      {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1">{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section className="text-start">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-slate-800 mb-3.5 flex items-center gap-2" style={{ color: primary }}>
              <span className="w-6 h-0.5 bg-current inline-block rounded-full shrink-0"></span>
              {t.education.sectionTitle}
            </h2>
            <div className="space-y-4 border-s-2 ms-2 ps-4 relative" style={{ borderColor: `${primary}30` }}>
              {education.map(edu => (
                <div key={edu.id} className="relative">
                  <div className="absolute top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 shrink-0" style={{ borderColor: primary, insetInlineStart: '-21px' }}></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-0.5 gap-0.5">
                    <h3 className="text-[13px] font-bold text-slate-900">{edu.degree}</h3>
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 shrink-0">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold" style={{ color: primary }}>{edu.institution}</h4>
                  {(edu.fieldOfStudy || edu.gpa) && (
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                      {edu.fieldOfStudy} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const CreativeMinimalTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#ec4899';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-slate-50 text-slate-800 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto p-4 md:p-6 shadow-sm ${scaleClass}`}>
      <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-slate-100 min-h-full">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-6">
          {personal.avatarUrl ? (
            <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden mb-3 border-[1.5px] p-0.5 aspect-square" style={{ borderColor: primary }}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            </div>
          ) : (
             <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden mb-3 border-[1.5px] p-0.5 aspect-square flex items-center justify-center bg-slate-50" style={{ borderColor: primary }}>
                <span className="text-2xl text-slate-400 font-light">{personal.fullName?.charAt(0) || ''}</span>
             </div>
          )}
          <h1 className="text-xl font-black tracking-tight text-slate-900 mb-1">{personal.fullName}</h1>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: primary }}>{personal.jobTitle}</p>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 text-[11px] font-semibold text-slate-500">
            {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 shrink-0"/> {personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 shrink-0"/> {personal.phone}</span>}
            {personal.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0"/> {personal.location}</span>}
            {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 shrink-0"/> {personal.linkedin.replace(/^https?:\\/\\//, '')}</span>}
          </div>
        </header>

        {summary && (
          <section className="mb-6 text-center px-4 md:px-8">
            <p className="text-[11px] sm:text-xs leading-[1.6] text-slate-600 font-medium italic">"{renderText(summary)}"</p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6 text-start">
            {experiences && experiences.length > 0 && (
              <section>
                <h2 className="text-xs sm:text-[13px] font-black uppercase text-slate-900 mb-3 pb-1.5 border-b-2" style={{ borderColor: `${primary}30` }}>{t.experience.sectionTitle}</h2>
                <div className="space-y-4">
                  {experiences.map(exp => (
                    <div key={exp.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-0.5 gap-1">
                        <h3 className="text-[13px] font-bold text-slate-800">{exp.position}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white shrink-0 tracking-wider" style={{ backgroundColor: primary }}>
                          {exp.startDate} – {exp.current ? t.present : exp.endDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-500 mb-1.5">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </h4>
                      {exp.description && <p className="text-[11px] sm:text-xs text-slate-600 mb-1.5 leading-[1.6]">{renderText(exp.description)}</p>}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-outside ms-3 mt-1 text-[11px] sm:text-xs text-slate-600 space-y-1">
                          {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1">{h}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education && education.length > 0 && (
              <section>
                <h2 className="text-xs sm:text-[13px] font-black uppercase text-slate-900 mb-3 pb-1.5 border-b-2" style={{ borderColor: `${primary}30` }}>{t.education.sectionTitle}</h2>
                <div className="space-y-4">
                  {education.map(edu => (
                    <div key={edu.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-0.5 gap-1">
                        <h3 className="text-[13px] font-bold text-slate-800">{edu.degree}</h3>
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0">{edu.startDate} – {edu.endDate}</span>
                      </div>
                      <h4 className="text-xs font-bold" style={{ color: primary }}>{edu.institution}</h4>
                      {(edu.fieldOfStudy || edu.gpa) && (
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                          {edu.fieldOfStudy} {edu.gpa && `• GPA: ${edu.gpa}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="md:col-span-1 space-y-6 text-start">
            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-xs sm:text-[13px] font-black uppercase text-slate-900 mb-3">{t.skills.sectionTitle}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span key={s.id} className="text-[10px] font-bold px-2 py-1 rounded-full border-[1.5px] tracking-wide" style={{ borderColor: `${primary}40`, color: primary }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section>
                <h2 className="text-xs sm:text-[13px] font-black uppercase text-slate-900 mb-3">{t.languages.sectionTitle}</h2>
                <div className="space-y-2">
                  {languages.map(l => (
                    <div key={l.id} className="flex flex-col">
                      <div className="text-xs font-bold text-slate-800">{l.name}</div>
                      <div className="text-[10px] font-semibold text-slate-500">{t.proficiencies[l.proficiency] || l.proficiency}</div>
                    </div>
                  ))}
                </div>
              </section>
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
  const primary = theme?.primaryColor || '#0f172a';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white text-slate-800 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm flex flex-row ${scaleClass}`}>
      {/* Sidebar - Light Banner */}
      <div className="w-[32%] shrink-0 bg-slate-50 border-e border-slate-200 p-6 flex flex-col items-end text-end">
        {personal.avatarUrl ? (
          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden mb-6 shadow-sm border border-slate-200 aspect-square">
            <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-24 h-24 shrink-0 rounded-xl bg-slate-200 mb-6 shadow-sm border border-slate-300 flex items-center justify-center aspect-square">
             <span className="text-3xl text-slate-400 font-light">{personal.fullName?.charAt(0) || ''}</span>
          </div>
        )}
        
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t.personal.sectionTitle}</h2>
        <div className="space-y-3 text-[11px] sm:text-xs text-slate-700 w-full flex flex-col items-end">
          {personal.email && <div className="w-full"><span className="block text-[9px] font-bold text-slate-400 mb-0.5 uppercase tracking-widest">Email</span><span className="font-semibold break-all">{personal.email}</span></div>}
          {personal.phone && <div className="w-full"><span className="block text-[9px] font-bold text-slate-400 mb-0.5 uppercase tracking-widest">Phone</span><span className="font-semibold">{personal.phone}</span></div>}
          {personal.location && <div className="w-full"><span className="block text-[9px] font-bold text-slate-400 mb-0.5 uppercase tracking-widest">Location</span><span className="font-semibold leading-snug">{personal.location}</span></div>}
          {personal.linkedin && <div className="w-full"><span className="block text-[9px] font-bold text-slate-400 mb-0.5 uppercase tracking-widest">LinkedIn</span><span className="font-semibold break-all">{personal.linkedin.replace(/^https?:\\/\\//, '')}</span></div>}
        </div>

        {skills && skills.length > 0 && (
          <div className="mt-8 w-full flex flex-col items-end">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t.skills.sectionTitle}</h2>
            <div className="flex flex-col gap-1.5 w-full text-end">
              {skills.map(s => (
                <div key={s.id} className="text-xs font-bold text-slate-800">{s.name} <span className="text-[10px] font-semibold text-slate-400 block">({t.levels[s.level] || s.level})</span></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[68%] p-6 md:p-8 flex flex-col text-start">
        <header className="mb-6 border-b-[3px] pb-5" style={{ borderColor: primary }}>
          <h1 className="text-xl font-black text-slate-900 mb-1.5 uppercase tracking-tight leading-none">{personal.fullName}</h1>
          <p className="text-[13px] font-bold tracking-widest uppercase" style={{ color: primary }}>{personal.jobTitle}</p>
        </header>

        {summary && (
          <section className="mb-6">
            <p className="text-[11px] sm:text-xs leading-[1.6] text-slate-700">{renderText(summary)}</p>
          </section>
        )}

        {experiences && experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs sm:text-[13px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center">
              <span className="w-2 h-2 me-2 shrink-0 rounded-[2px]" style={{ backgroundColor: primary }}></span>
              {t.experience.sectionTitle}
            </h2>
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-1 gap-1">
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-900">{exp.position}</h3>
                      <h4 className="text-xs font-bold mt-0.5" style={{ color: primary }}>{exp.company}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">{exp.startDate} – {exp.current ? t.present : exp.endDate}</span>
                  </div>
                  {exp.description && <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-[1.6]">{renderText(exp.description)}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ms-3 mt-1.5 text-[11px] sm:text-xs text-slate-600 space-y-1">
                      {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1">{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs sm:text-[13px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center">
              <span className="w-2 h-2 me-2 shrink-0 rounded-[2px]" style={{ backgroundColor: primary }}></span>
              {t.education.sectionTitle}
            </h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-1">
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-900">{edu.degree}</h3>
                    <h4 className="text-xs font-bold text-slate-600 mt-0.5">{edu.institution}</h4>
                    {(edu.fieldOfStudy || edu.gpa) && (
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                        {edu.fieldOfStudy} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
"""

start_str = "const ExecutiveModernTemplate: React.FC<CVDocumentProps> ="
end_str = "export const CVDocument: React.FC<CVDocumentProps> ="

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_templates + "\n" + content[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Scaling and resizing applied successfully.")
else:
    print("Could not find start or end bounds.")

