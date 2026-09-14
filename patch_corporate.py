import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_template = """
const CorporateEliteTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {
  const { t, isRTL } = useLanguage();
  const { personal, summary, experiences, education, skills, languages, hobbies, theme } = data;
  const primary = theme?.primaryColor || '#ca8a04';
  const scaleClass = isPrint ? 'scale-[0.98] transform-origin-top' : '';

  return (
    <div id={id} dir={isRTL ? 'rtl' : 'ltr'} className={`bg-slate-950 text-slate-200 ${isRTL ? 'font-arabic' : 'font-sans'} overflow-hidden min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm flex flex-row ${scaleClass}`}>
      
      {/* Sidebar */}
      <div className="w-[38%] shrink-0 bg-[#111111] p-6 md:p-8 flex flex-col gap-8 text-start border-e border-slate-800">
        
        {/* Hexagon Profile Pic */}
        <div className="w-full flex justify-center mt-2 mb-2">
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

        {/* Contact Info */}
        <div className="w-full">
            <div className="flex justify-center mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-center" style={{ borderColor: primary, color: primary }}>
                 {t.personal.sectionTitle || 'Contact'}
               </h2>
            </div>
            <div className="space-y-4 text-[11px] text-slate-300 w-full">
              {personal.email && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-white" /></div><span className="break-all flex-1 min-w-0">{personal.email}</span></div>}
              {personal.phone && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Phone className="w-3.5 h-3.5 text-white" /></div><span className="break-words flex-1 min-w-0">{personal.phone}</span></div>}
              {personal.location && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5 text-white" /></div><span className="break-words flex-1 min-w-0 leading-tight">{personal.location}</span></div>}
              {personal.website && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Globe className="w-3.5 h-3.5 text-white" /></div><span className="break-all flex-1 min-w-0">{personal.website.replace(/^https?:\/\//, '')}</span></div>}
              {personal.linkedin && <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"><Linkedin className="w-3.5 h-3.5 text-white" /></div><span className="break-all flex-1 min-w-0">{personal.linkedin.replace(/^https?:\/\//, '')}</span></div>}
            </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="w-full">
            <div className="flex justify-center mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-center" style={{ borderColor: primary, color: primary }}>
                 {t.skills.sectionTitle}
               </h2>
            </div>
            <div className="space-y-4 w-full">
              {skills.map(s => (
                <div key={s.id} className="w-full">
                  <div className="flex justify-between text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider">
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
          <div className="w-full">
            <div className="flex justify-center mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-center" style={{ borderColor: primary, color: primary }}>
                 {t.languages.sectionTitle}
               </h2>
            </div>
            <div className="space-y-3 w-full">
              {languages.map(l => (
                <div key={l.id} className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-white break-words min-w-0 flex-1">{l.name}</span>
                  <span className="text-slate-400 text-[10px] shrink-0 ms-2">{t.proficiencies[l.proficiency] || l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
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

        {experiences && experiences.length > 0 && (
          <section className="mb-8 w-full">
            <div className="mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: primary, color: primary }}>
                 {t.experience.sectionTitle}
               </h2>
            </div>
            <div className="space-y-7 w-full">
              {experiences.map(exp => (
                <div key={exp.id} className="w-full">
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1">
                    <h3 className="text-[13px] font-bold text-white leading-snug break-words">{exp.position}</h3>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0 xl:text-end mt-1 xl:mt-0">{exp.startDate} – {exp.current ? t.present : exp.endDate}</span>
                  </div>
                  <h4 className="text-[11px] text-slate-400 mt-1 break-words">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</h4>
                  {exp.description && <p className="text-[11px] sm:text-[12px] text-slate-400 leading-[1.6] mt-2.5 break-words whitespace-pre-wrap">{renderText(exp.description)}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ms-4 mt-2 text-[11px] sm:text-[12px] text-slate-400 space-y-1.5">
                      {exp.highlights.filter(Boolean).map((h, i) => <li key={i} className="ps-1 break-words">{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section className="w-full">
            <div className="mb-5 w-full">
               <h2 className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: primary, color: primary }}>
                 {t.education.sectionTitle}
               </h2>
            </div>
            <div className="space-y-6 w-full">
              {education.map(edu => (
                <div key={edu.id} className="w-full">
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-baseline mb-1 gap-1">
                    <h3 className="text-[13px] font-bold text-white leading-snug break-words">{edu.degree}</h3>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider shrink-0 xl:text-end mt-1 xl:mt-0">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <h4 className="text-[11px] text-slate-400 mt-1 break-words">{edu.institution}</h4>
                  {(edu.fieldOfStudy || edu.gpa) && (
                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium break-words">
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
"""

start_str = "const CorporateEliteTemplate: React.FC<CVDocumentProps> ="
end_str = "export const CVDocument: React.FC<CVDocumentProps> ="

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_template + "\n" + content[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced CorporateEliteTemplate successfully.")
else:
    print("Could not find start or end bounds.")

