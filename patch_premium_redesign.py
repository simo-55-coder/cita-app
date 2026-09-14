import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_templates = """
const ExecutiveModernTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#b45309';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white text-slate-800 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm flex flex-row ${scaleClass}`}>
      {/* Sidebar */}
      <div className="w-[35%] shrink-0 bg-slate-900 text-white py-8 px-5 sm:px-6 flex flex-col gap-6 text-start">
        <div className="flex justify-center mb-2">
          <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-[3px] p-1 flex items-center justify-center" style={{ borderColor: primary }}>
            {personal.avatarUrl ? (
              <img src={personal.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-800" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl text-white/50 font-light">{personal.fullName?.charAt(0) || ''}</div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-white bg-slate-800 px-3 py-1.5 inline-block border-s-2" style={{ borderColor: primary }}>
              {t.personal.sectionTitle || 'Contact'}
            </h2>
          </div>
          <div className="space-y-3 text-[11px] sm:text-xs text-white/90 text-start w-full px-1">
            {personal.email && <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Mail className="w-3 h-3 text-white" /></div><span className="break-all flex-1 min-w-0 leading-tight">{personal.email}</span></div>}
            {personal.phone && <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Phone className="w-3 h-3 text-white" /></div><span className="break-words flex-1 min-w-0 leading-tight">{personal.phone}</span></div>}
            {personal.location && <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><MapPin className="w-3 h-3 text-white" /></div><span className="break-words flex-1 min-w-0 leading-tight">{personal.location}</span></div>}
            {personal.website && <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Globe className="w-3 h-3 text-white" /></div><span className="break-all flex-1 min-w-0 leading-tight">{personal.website.replace(/^https?:\\/\\//, '')}</span></div>}
            {personal.linkedin && <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}><Linkedin className="w-3 h-3 text-white" /></div><span className="break-all flex-1 min-w-0 leading-tight">{personal.linkedin.replace(/^https?:\\/\\//, '')}</span></div>}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mt-2 w-full">
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-white bg-slate-800 px-3 py-1.5 inline-block border-s-2" style={{ borderColor: primary }}>
                {t.skills.sectionTitle}
              </h2>
            </div>
            <div className="space-y-3 px-1 text-start">
              {skills.map(s => (
                <div key={s.id} className="w-full">
                  <div className="flex justify-between text-[11px] font-medium mb-1">
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
          <div className="mt-2 w-full">
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-white bg-slate-800 px-3 py-1.5 inline-block border-s-2" style={{ borderColor: primary }}>
                {t.languages.sectionTitle}
              </h2>
            </div>
            <div className="space-y-3 px-1 text-start">
              {languages.map(l => (
                <div key={l.id} className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold break-words min-w-0 flex-1">{l.name}</span>
                  <span className="opacity-70 text-[10px] shrink-0 ms-2">{t.proficiencies[l.proficiency] || l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[65%] shrink-0 p-8 bg-white flex flex-col text-start">
        <header className="mb-8 mt-2">
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-wider break-words">{personal.fullName}</h1>
          <p className="text-[13px] font-bold tracking-widest uppercase break-words" style={{ color: primary }}>{personal.jobTitle}</p>
        </header>

        {summary && (
          <section className="mb-8 text-start">
            <p className="text-[11px] sm:text-xs text-slate-600 leading-[1.7] break-words whitespace-pre-wrap">{renderText(summary)}</p>
          </section>
        )}

        {experiences && experiences.length > 0 && (
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="inline-block border border-slate-300 text-slate-800 uppercase px-4 py-1.5 text-[11px] font-bold tracking-widest">
                {t.experience.sectionTitle}
              </h2>
            </div>
            <div className="space-y-6">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1">
                    <h3 className="text-[13px] font-bold text-slate-900 uppercase break-words">{exp.position}</h3>
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 shrink-0">
                      {exp.startDate} – {exp.current ? t.present : exp.endDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mb-2 break-words" style={{ color: primary }}>
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </h4>
                  {exp.description && <p className="text-[11px] sm:text-xs text-slate-600 mb-2 leading-[1.6] break-words whitespace-pre-wrap">{renderText(exp.description)}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ms-4 text-[11px] sm:text-xs text-slate-600 space-y-1">
                      {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1 break-words">{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="inline-block border border-slate-300 text-slate-800 uppercase px-4 py-1.5 text-[11px] font-bold tracking-widest">
                {t.education.sectionTitle}
              </h2>
            </div>
            <div className="space-y-5">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1">
                    <h3 className="text-[13px] font-bold text-slate-900 uppercase break-words">{edu.degree}</h3>
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 shrink-0">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold break-words" style={{ color: primary }}>{edu.institution}</h4>
                  {(edu.fieldOfStudy || edu.gpa) && (
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium break-words">
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
  const primary = theme?.primaryColor || '#b45309';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white text-slate-800 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm flex flex-col ${scaleClass}`}>
      
      {/* Top Header */}
      <div className="w-full bg-slate-800 flex flex-row items-center px-8 relative" style={{ minHeight: '140px' }}>
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
         <div className="flex-1 flex flex-col justify-center ps-4 z-10 text-start overflow-hidden">
            <h1 className="text-3xl font-black text-white mb-2 tracking-wider uppercase truncate">{personal.fullName}</h1>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-8 bg-white/50 shrink-0"></span>
              <p className="text-[11px] font-bold tracking-widest uppercase text-white truncate">{personal.jobTitle}</p>
            </div>
         </div>
      </div>

      <div className="flex flex-row flex-1 w-full bg-white relative z-0">
        {/* Main Content (Left) */}
        <div className="w-[62%] shrink-0 pt-20 ps-8 pe-6 pb-8 flex flex-col text-start bg-white border-e border-slate-100">
          <div className="flex flex-col gap-8 w-full">
            {summary && (
              <section>
                <h2 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-3">
                  <span className="w-5 h-5 shrink-0 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
                     <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                  {t.summary.sectionTitle}
                </h2>
                <p className="text-[11px] sm:text-xs leading-[1.7] text-slate-600 border-s-2 ms-2.5 ps-4 border-slate-200 break-words whitespace-pre-wrap">{renderText(summary)}</p>
              </section>
            )}

            {experiences && experiences.length > 0 && (
              <section>
                <h2 className="text-[13px] font-bold text-slate-800 mb-5 flex items-center gap-3">
                  <span className="w-5 h-5 shrink-0 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
                     <Briefcase className="w-3 h-3 text-white" />
                  </span>
                  {t.experience.sectionTitle}
                </h2>
                <div className="space-y-6 ms-2.5 border-s-2 border-slate-200 ps-4">
                  {experiences.map(exp => (
                    <div key={exp.id}>
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1">
                        <h3 className="text-[13px] font-bold text-slate-900 break-words">{exp.position}</h3>
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0">
                          {exp.startDate} – {exp.current ? t.present : exp.endDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold mb-2 break-words" style={{ color: primary }}>
                        {exp.company}
                      </h4>
                      {exp.description && <p className="text-[11px] sm:text-xs text-slate-600 mb-2 leading-[1.6] break-words whitespace-pre-wrap">{renderText(exp.description)}</p>}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-outside ms-4 text-[11px] sm:text-xs text-slate-600 space-y-1">
                          {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1 break-words">{h}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education && education.length > 0 && (
              <section>
                <h2 className="text-[13px] font-bold text-slate-800 mb-5 flex items-center gap-3">
                  <span className="w-5 h-5 shrink-0 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
                     <GraduationCap className="w-3 h-3 text-white" />
                  </span>
                  {t.education.sectionTitle}
                </h2>
                <div className="space-y-5 ms-2.5 border-s-2 border-slate-200 ps-4">
                  {education.map(edu => (
                    <div key={edu.id}>
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1">
                        <h3 className="text-[13px] font-bold text-slate-800 break-words">{edu.degree}</h3>
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0">{edu.startDate} – {edu.endDate}</span>
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
        <div className="w-[38%] shrink-0 bg-slate-800 text-white pt-10 pb-8 flex flex-col text-start shadow-inner relative z-0">
          <div className="flex flex-col gap-8 w-full">
            
            {/* Ribbons */}
            <div className="w-full">
              <div className="flex w-full">
                 <h2 className="text-[11px] font-bold uppercase tracking-widest text-white shadow-md rounded-e-full py-1.5 ps-6 pe-4 mb-5 inline-block" style={{ backgroundColor: primary }}>
                   {t.personal.sectionTitle || 'Contact'}
                 </h2>
              </div>
              <div className="space-y-3 px-6 text-[11px] sm:text-xs">
                {personal.email && <div className="flex items-center gap-2.5"><Mail className="w-3.5 h-3.5 shrink-0"/> <span className="break-all min-w-0">{personal.email}</span></div>}
                {personal.phone && <div className="flex items-center gap-2.5"><Phone className="w-3.5 h-3.5 shrink-0"/> <span className="break-words min-w-0">{personal.phone}</span></div>}
                {personal.location && <div className="flex items-center gap-2.5"><MapPin className="w-3.5 h-3.5 shrink-0"/> <span className="break-words min-w-0">{personal.location}</span></div>}
                {personal.linkedin && <div className="flex items-center gap-2.5"><Linkedin className="w-3.5 h-3.5 shrink-0"/> <span className="break-all min-w-0">{personal.linkedin.replace(/^https?:\\/\\//, '')}</span></div>}
              </div>
            </div>

            {skills && skills.length > 0 && (
              <div className="w-full">
                <div className="flex w-full">
                   <h2 className="text-[11px] font-bold uppercase tracking-widest text-white shadow-md rounded-e-full py-1.5 ps-6 pe-4 mb-5 inline-block" style={{ backgroundColor: primary }}>
                     {t.skills.sectionTitle}
                   </h2>
                </div>
                <div className="space-y-4 px-6">
                  {skills.map(s => (
                    <div key={s.id} className="w-full">
                      <div className="flex justify-between text-[11px] font-medium mb-1">
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
              <div className="w-full">
                <div className="flex w-full">
                   <h2 className="text-[11px] font-bold uppercase tracking-widest text-white shadow-md rounded-e-full py-1.5 ps-6 pe-4 mb-5 inline-block" style={{ backgroundColor: primary }}>
                     {t.languages.sectionTitle}
                   </h2>
                </div>
                <div className="space-y-3 px-6">
                  {languages.map(l => (
                    <div key={l.id} className="flex justify-between items-center text-[11px]">
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
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-slate-950 text-slate-200 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm flex flex-row ${scaleClass}`}>
      
      {/* Left Sidebar */}
      <div className="w-[38%] shrink-0 bg-[#111111] p-6 md:p-8 flex flex-col gap-8 text-start border-e border-slate-800">
        
        {/* Hexagon Profile Pic */}
        <div className="w-full flex justify-center mt-2">
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

        {education && education.length > 0 && (
          <div className="w-full">
            <div className="flex justify-center mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-center" style={{ borderColor: primary, color: primary }}>
                 {t.education.sectionTitle}
               </h2>
            </div>
            <div className="space-y-5 text-start w-full">
              {education.map(edu => (
                <div key={edu.id} className="w-full">
                  <h3 className="text-[13px] font-bold text-white leading-snug break-words">{edu.degree}</h3>
                  <h4 className="text-[11px] text-slate-400 mt-1 break-words">{edu.institution}</h4>
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider mt-1.5">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {experiences && experiences.length > 0 && (
          <div className="w-full">
            <div className="flex justify-center mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-center" style={{ borderColor: primary, color: primary }}>
                 {t.experience.sectionTitle}
               </h2>
            </div>
            <div className="space-y-6 text-start w-full">
              {experiences.map(exp => (
                <div key={exp.id} className="w-full">
                  <h3 className="text-[13px] font-bold text-white leading-snug break-words">{exp.position}</h3>
                  <h4 className="text-[11px] text-slate-400 mt-1 break-words">{exp.company}</h4>
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider mt-1.5 mb-2">{exp.startDate} – {exp.current ? t.present : exp.endDate}</p>
                  {exp.description && <p className="text-[11px] text-slate-400 leading-[1.6] line-clamp-3 break-words whitespace-pre-wrap">{renderText(exp.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Right) */}
      <div className="w-[62%] shrink-0 p-8 bg-slate-950 flex flex-col text-start">
        <header className="mb-8 mt-2 pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide leading-none break-words">{personal.fullName}</h1>
          <p className="text-[13px] font-bold tracking-widest uppercase break-words" style={{ color: primary }}>{personal.jobTitle}</p>
        </header>

        {summary && (
          <section className="mb-8 w-full">
            <div className="mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: primary, color: primary }}>
                 {t.summary.sectionTitle}
               </h2>
            </div>
            <p className="text-[11px] sm:text-[12px] leading-[1.7] text-slate-300 break-words whitespace-pre-wrap">{renderText(summary)}</p>
          </section>
        )}

        {skills && skills.length > 0 && (
          <section className="mb-8 w-full">
            <div className="mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: primary, color: primary }}>
                 {t.skills.sectionTitle}
               </h2>
            </div>
            <div className="space-y-4 w-full">
              {skills.map(s => (
                <div key={s.id} className="w-full">
                  <div className="flex justify-between text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider">
                    <span className="break-words min-w-0 flex-1">{s.name}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5">
                    <div className="h-full" style={{ 
                      backgroundColor: primary,
                      width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '80%' : s.level === 'Intermediate' ? '60%' : '40%' 
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact info on the right body */}
        <section className="mb-8 w-full">
            <div className="mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: primary, color: primary }}>
                 {t.personal.sectionTitle || 'Contact'}
               </h2>
            </div>
            <div className="space-y-3 text-[11px] sm:text-[12px] text-slate-300 w-full">
              {personal.email && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-white" /></div><span className="break-all flex-1 min-w-0">{personal.email}</span></div>}
              {personal.phone && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Phone className="w-3.5 h-3.5 text-white" /></div><span className="break-words flex-1 min-w-0">{personal.phone}</span></div>}
              {personal.location && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5 text-white" /></div><span className="break-words flex-1 min-w-0 leading-tight">{personal.location}</span></div>}
              {personal.website && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Globe className="w-3.5 h-3.5 text-white" /></div><span className="break-all flex-1 min-w-0">{personal.website.replace(/^https?:\\/\\//, '')}</span></div>}
            </div>
        </section>
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
    print("Exact matches applied successfully.")
else:
    print("Could not find start or end bounds.")

