import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_templates = """
// =========================================================================
// PREMIUM TEMPLATES
// =========================================================================

const ExecutiveModernTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#1e293b';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white text-slate-800 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm ${scaleClass}`}>
      <div className="flex h-full min-h-[1056px]">
        {/* Left Column - Dark Accent */}
        <div className="w-[32%] text-white p-6 flex flex-col gap-6" style={{ backgroundColor: primary }}>
          {personal.avatarUrl ? (
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
              <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full bg-white/10 border-4 border-white/20 shadow-lg flex items-center justify-center">
              <span className="text-4xl text-white/50">{personal.fullName?.charAt(0) || ''}</span>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold leading-tight mb-1">{personal.fullName}</h1>
            <p className="text-sm text-white/80 font-medium">{personal.jobTitle}</p>
          </div>

          <div className="space-y-3 text-sm text-white/90">
            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 opacity-70" /><span className="break-all">{personal.email}</span></div>}
            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 opacity-70" /><span>{personal.phone}</span></div>}
            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 opacity-70" /><span>{personal.location}</span></div>}
            {personal.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-4 h-4 opacity-70" /><span className="break-all">{personal.linkedin.replace(/^https?:\\/\\//, '')}</span></div>}
            {personal.github && <div className="flex items-center gap-2"><Github className="w-4 h-4 opacity-70" /><span className="break-all">{personal.github.replace(/^https?:\\/\\//, '')}</span></div>}
            {personal.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 opacity-70" /><span className="break-all">{personal.website.replace(/^https?:\\/\\//, '')}</span></div>}
          </div>

          {skills && skills.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-3">{t.skills.sectionTitle}</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => (
                  <span key={s.id} className="bg-white/10 px-2 py-1 rounded text-xs">{s.name}</span>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-3">{t.languages.sectionTitle}</h2>
              <div className="space-y-2">
                {languages.map(l => (
                  <div key={l.id} className="flex justify-between text-xs">
                    <span>{l.name}</span>
                    <span className="opacity-70">{t.proficiencies[l.proficiency] || l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="w-[68%] p-8 bg-white flex flex-col gap-6">
          {summary && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 mb-2 flex items-center gap-2" style={{ color: primary }}>
                <span className="w-6 h-0.5 bg-current inline-block"></span>
                {t.summary.sectionTitle}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">{renderText(summary)}</p>
            </section>
          )}

          {experiences && experiences.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2" style={{ color: primary }}>
                <span className="w-6 h-0.5 bg-current inline-block"></span>
                {t.experience.sectionTitle}
              </h2>
              <div className="space-y-5 border-l-2 ml-2 pl-4" style={{ borderColor: `${primary}30` }}>
                {experiences.map(exp => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: primary }}></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[15px] font-bold text-slate-900">{exp.position}</h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{exp.startDate} – {exp.current ? t.present : exp.endDate}</span>
                    </div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: primary }}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</h4>
                    {exp.description && <p className="text-xs text-slate-600 mb-2 leading-relaxed">{renderText(exp.description)}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                        {exp.highlights.filter(Boolean).map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2" style={{ color: primary }}>
                <span className="w-6 h-0.5 bg-current inline-block"></span>
                {t.education.sectionTitle}
              </h2>
              <div className="space-y-4 border-l-2 ml-2 pl-4" style={{ borderColor: `${primary}30` }}>
                {education.map(edu => (
                  <div key={edu.id} className="relative">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: primary }}></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                      <span className="text-xs font-semibold text-slate-500">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <h4 className="text-sm font-semibold" style={{ color: primary }}>{edu.institution}</h4>
                    {(edu.fieldOfStudy || edu.gpa) && (
                      <p className="text-xs text-slate-600 mt-1">
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
    </div>
  );
};

const CreativeMinimalTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#ec4899';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-slate-50 text-slate-800 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto p-8 shadow-sm ${scaleClass}`}>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-full">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-8">
          {personal.avatarUrl && (
            <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 p-1" style={{ borderColor: primary }}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            </div>
          )}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">{personal.fullName}</h1>
          <p className="text-lg font-medium tracking-wide uppercase" style={{ color: primary }}>{personal.jobTitle}</p>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-slate-500">
            {personal.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> {personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> {personal.phone}</span>}
            {personal.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {personal.location}</span>}
            {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5"/> {personal.linkedin.replace(/^https?:\\/\\//, '')}</span>}
          </div>
        </header>

        {summary && (
          <section className="mb-8 text-center px-8">
            <p className="text-[15px] leading-relaxed text-slate-600 font-medium italic">"{renderText(summary)}"</p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {experiences && experiences.length > 0 && (
              <section>
                <h2 className="text-xl font-black uppercase text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: `${primary}30` }}>{t.experience.sectionTitle}</h2>
                <div className="space-y-6">
                  {experiences.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-bold text-slate-800">{exp.position}</h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-md text-white" style={{ backgroundColor: primary }}>{exp.startDate} – {exp.current ? t.present : exp.endDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-500 mb-2">{exp.company} {exp.location && `• ${exp.location}`}</h4>
                      {exp.description && <p className="text-sm text-slate-600 mb-2">{renderText(exp.description)}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education && education.length > 0 && (
              <section>
                <h2 className="text-xl font-black uppercase text-slate-900 mb-4 pb-2 border-b-2" style={{ borderColor: `${primary}30` }}>{t.education.sectionTitle}</h2>
                <div className="space-y-4">
                  {education.map(edu => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-bold text-slate-800">{edu.degree}</h3>
                        <span className="text-xs font-bold text-slate-500">{edu.startDate} – {edu.endDate}</span>
                      </div>
                      <h4 className="text-sm font-bold" style={{ color: primary }}>{edu.institution}</h4>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="col-span-1 space-y-8">
            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase text-slate-900 mb-4">{t.skills.sectionTitle}</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s.id} className="text-xs font-bold px-3 py-1.5 rounded-full border-2" style={{ borderColor: `${primary}40`, color: primary }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase text-slate-900 mb-4">{t.languages.sectionTitle}</h2>
                <div className="space-y-3">
                  {languages.map(l => (
                    <div key={l.id}>
                      <div className="text-sm font-bold text-slate-800">{l.name}</div>
                      <div className="text-xs text-slate-500">{t.proficiencies[l.proficiency] || l.proficiency}</div>
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
      {/* Left Banner */}
      <div className="w-[35%] bg-slate-50 border-r border-slate-200 p-8 flex flex-col items-end text-right">
        {personal.avatarUrl ? (
          <div className="w-36 h-36 rounded-xl overflow-hidden mb-6 shadow-md border border-slate-200">
            <img src={personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-36 h-36 rounded-xl bg-slate-200 mb-6 shadow-md border border-slate-300 flex items-center justify-center">
             <span className="text-5xl text-slate-400 font-light">{personal.fullName?.charAt(0) || ''}</span>
          </div>
        )}
        
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{t.personal.sectionTitle}</h2>
        <div className="space-y-4 text-sm text-slate-700 w-full flex flex-col items-end">
          {personal.email && <div><span className="block text-xs font-bold text-slate-400 mb-0.5 uppercase">Email</span><span className="font-semibold">{personal.email}</span></div>}
          {personal.phone && <div><span className="block text-xs font-bold text-slate-400 mb-0.5 uppercase">Phone</span><span className="font-semibold">{personal.phone}</span></div>}
          {personal.location && <div><span className="block text-xs font-bold text-slate-400 mb-0.5 uppercase">Location</span><span className="font-semibold">{personal.location}</span></div>}
          {personal.linkedin && <div><span className="block text-xs font-bold text-slate-400 mb-0.5 uppercase">LinkedIn</span><span className="font-semibold break-all">{personal.linkedin.replace(/^https?:\\/\\//, '')}</span></div>}
        </div>

        {skills && skills.length > 0 && (
          <div className="mt-8 w-full flex flex-col items-end">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{t.skills.sectionTitle}</h2>
            <div className="flex flex-col gap-2 w-full text-right">
              {skills.map(s => (
                <div key={s.id} className="text-sm font-bold text-slate-800">{s.name} <span className="text-xs font-normal text-slate-400">({t.levels[s.level] || s.level})</span></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-[65%] p-10 flex flex-col">
        <header className="mb-8 border-b-4 pb-6" style={{ borderColor: primary }}>
          <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">{personal.fullName}</h1>
          <p className="text-xl font-bold tracking-widest uppercase" style={{ color: primary }}>{personal.jobTitle}</p>
        </header>

        {summary && (
          <section className="mb-8">
            <p className="text-[15px] leading-relaxed text-slate-700">{renderText(summary)}</p>
          </section>
        )}

        {experiences && experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-5 flex items-center">
              <span className="w-2 h-2 mr-3" style={{ backgroundColor: primary }}></span>
              {t.experience.sectionTitle}
            </h2>
            <div className="space-y-6">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                      <h4 className="text-sm font-bold" style={{ color: primary }}>{exp.company}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{exp.startDate} – {exp.current ? t.present : exp.endDate}</span>
                  </div>
                  {exp.description && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{renderText(exp.description)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-5 flex items-center">
              <span className="w-2 h-2 mr-3" style={{ backgroundColor: primary }}></span>
              {t.education.sectionTitle}
            </h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{edu.degree}</h3>
                    <h4 className="text-sm font-bold text-slate-600">{edu.institution}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{edu.startDate} – {edu.endDate}</span>
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

content = content.replace("export const CVDocument: React.FC<CVDocumentProps> = (props) => {", new_templates + "\nexport const CVDocument: React.FC<CVDocumentProps> = (props) => {")

switch_repl = """
  switch (templateId) {
    case 'executive-modern':
      return <ExecutiveModernTemplate {...props} />;
    case 'creative-minimal':
      return <CreativeMinimalTemplate {...props} />;
    case 'corporate-elite':
      return <CorporateEliteTemplate {...props} />;
    case 'executive':
"""

content = content.replace("  switch (templateId) {\n    case 'executive':", switch_repl)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

