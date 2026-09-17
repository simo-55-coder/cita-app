import re

file_path = 'src/components/TemplateSelector.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace executive-modern mockup
old_executive_modern = """  if (templateId === 'executive-modern') {
    return (
      <div className="w-full h-32 bg-white rounded-lg border border-slate-200/80 shadow-xs flex overflow-hidden select-none">
        <div className="w-1/3 bg-slate-900 flex flex-col items-center pt-3 pb-2 px-1">
          <div className="w-8 h-8 rounded-full bg-slate-700 mb-2"></div>
          <div className="h-1.5 w-10 bg-slate-500 rounded-xs mb-1"></div>
          <div className="h-1 w-12 bg-slate-600 rounded-xs"></div>
        </div>
        <div className="w-2/3 p-2 flex flex-col gap-1.5">
          <div className="h-1.5 w-16 rounded-xs" style={{ backgroundColor: accent }}></div>
          <div className="h-1 w-full bg-slate-200 rounded-xs"></div>
          <div className="h-1 w-5/6 bg-slate-200 rounded-xs"></div>
          <div className="h-1.5 w-12 rounded-xs mt-1" style={{ backgroundColor: accent }}></div>
          <div className="h-1 w-full bg-slate-200 rounded-xs"></div>
        </div>
      </div>
    );
  }"""

new_executive_modern = """  if (templateId === 'executive-modern') {
    return (
      <div className="w-full h-32 bg-white rounded-lg border border-slate-200/80 shadow-xs flex overflow-hidden select-none">
        <div className="w-[38%] bg-slate-900 flex flex-col items-center pt-3 pb-2 px-1">
          <div className="w-8 h-8 rounded-full border-[1.5px] mb-2 bg-slate-800" style={{ borderColor: accent }}></div>
          <div className="w-full px-1.5 space-y-1">
             <div className="h-0.5 w-6 mb-1 rounded-full" style={{ backgroundColor: accent }}></div>
             <div className="h-1 w-full bg-slate-600 rounded-xs"></div>
             <div className="h-1 w-5/6 bg-slate-600 rounded-xs"></div>
             <div className="h-1 w-4/6 bg-slate-600 rounded-xs"></div>
          </div>
        </div>
        <div className="w-[62%] p-2 flex flex-col gap-1.5">
          <div className="h-2 w-16 bg-slate-800 rounded-xs"></div>
          <div className="h-1.5 w-12 rounded-xs mb-1" style={{ backgroundColor: accent }}></div>
          <div className="flex gap-1 items-start mt-1">
             <div className="w-0.5 h-6 rounded-full" style={{ backgroundColor: accent }}></div>
             <div className="flex-1 space-y-1">
                <div className="h-1 w-full bg-slate-200 rounded-xs"></div>
                <div className="h-1 w-5/6 bg-slate-200 rounded-xs"></div>
                <div className="h-1 w-full bg-slate-200 rounded-xs"></div>
             </div>
          </div>
        </div>
      </div>
    );
  }"""

content = content.replace(old_executive_modern, new_executive_modern)

# Replace creative-minimal mockup
old_creative_minimal = """  if (templateId === 'creative-minimal') {
    return (
      <div className="w-full h-32 bg-white rounded-lg p-2 border border-slate-200/80 shadow-xs flex flex-col overflow-hidden select-none items-center text-center">
        <div className="w-8 h-8 rounded-full mb-1.5" style={{ border: `2px solid ${accent}` }}></div>
        <div className="h-1.5 w-16 bg-slate-800 rounded-xs mb-1"></div>
        <div className="h-1 w-20 bg-slate-400 rounded-xs mb-2"></div>
        <div className="w-full flex gap-1 justify-center mb-1.5">
          <div className="h-1 w-8 rounded-full" style={{ backgroundColor: `${accent}40` }}></div>
          <div className="h-1 w-8 rounded-full" style={{ backgroundColor: `${accent}40` }}></div>
          <div className="h-1 w-8 rounded-full" style={{ backgroundColor: `${accent}40` }}></div>
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-xs"></div>
      </div>
    );
  }"""

new_creative_minimal = """  if (templateId === 'creative-minimal') {
    return (
      <div className="w-full h-32 bg-white rounded-lg border border-slate-200/80 shadow-xs flex flex-col overflow-hidden select-none relative">
        <div className="w-full h-10 bg-slate-800 flex items-center px-3 relative shrink-0">
          <div className="absolute -bottom-3 start-3 w-8 h-8 rounded-full border-2 border-white bg-slate-200 z-10 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-slate-300"></div>
          </div>
          <div className="ms-12 flex flex-col justify-center h-full pt-1">
             <div className="h-1.5 w-16 bg-white rounded-xs mb-0.5"></div>
             <div className="h-1 w-10 rounded-xs" style={{ backgroundColor: accent }}></div>
          </div>
        </div>
        <div className="flex-1 flex pt-4 bg-white relative z-0">
           <div className="w-[62%] px-2 space-y-1.5 border-e border-slate-100">
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: accent }}></div>
                 <div className="h-1.5 w-12 bg-slate-700 rounded-xs"></div>
              </div>
              <div className="h-1 w-full bg-slate-200 rounded-xs"></div>
              <div className="h-1 w-4/5 bg-slate-200 rounded-xs"></div>
           </div>
           <div className="w-[38%] px-1.5 space-y-1.5">
              <div className="h-1 w-10 bg-slate-800 rounded-xs"></div>
              <div className="space-y-1">
                 <div className="h-0.5 w-full bg-slate-200 rounded-xs"></div>
                 <div className="h-0.5 w-3/4 bg-slate-200 rounded-xs"></div>
              </div>
           </div>
        </div>
      </div>
    );
  }"""

content = content.replace(old_creative_minimal, new_creative_minimal)


# Replace corporate-elite mockup
old_corporate_elite = """  if (templateId === 'corporate-elite') {
    return (
      <div className="w-full h-32 bg-white rounded-lg border border-slate-200/80 shadow-xs flex flex-row-reverse overflow-hidden select-none">
        <div className="w-1/3 bg-slate-50 border-l border-slate-200 flex flex-col pt-3 px-1.5 items-end">
          <div className="w-7 h-7 rounded-md bg-slate-300 mb-2"></div>
          <div className="h-1 w-10 bg-slate-400 rounded-xs mb-0.5"></div>
          <div className="h-1 w-8 bg-slate-400 rounded-xs"></div>
        </div>
        <div className="w-2/3 p-2.5 flex flex-col gap-2 justify-center">
          <div className="h-2 w-16 bg-slate-800 rounded-xs"></div>
          <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: accent }}></div>
          <div className="space-y-0.5">
            <div className="h-1 w-full bg-slate-200 rounded-xs"></div>
            <div className="h-1 w-10/12 bg-slate-200 rounded-xs"></div>
          </div>
        </div>
      </div>
    );
  }"""

new_corporate_elite = """  if (templateId === 'corporate-elite') {
    return (
      <div className="w-full h-32 bg-slate-950 rounded-lg border border-slate-800 shadow-xs flex overflow-hidden select-none">
        <div className="w-[38%] bg-[#111111] border-e border-slate-800 flex flex-col items-center pt-2 px-1">
          <div className="w-7 h-7 mb-2 bg-slate-800 flex items-center justify-center overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}>
             <div className="w-full h-full" style={{ backgroundColor: accent }}></div>
          </div>
          <div className="w-full px-1 space-y-1.5 mt-1">
             <div className="h-1 w-8 bg-slate-500 rounded-xs mx-auto"></div>
             <div className="space-y-1 mt-1">
               <div className="h-0.5 w-full bg-slate-700 rounded-xs"></div>
               <div className="h-0.5 w-5/6 bg-slate-700 rounded-xs"></div>
             </div>
          </div>
        </div>
        <div className="w-[62%] p-2 flex flex-col gap-1.5">
          <div className="h-2 w-16 bg-slate-200 rounded-xs"></div>
          <div className="h-1.5 w-10 rounded-xs mb-0.5" style={{ backgroundColor: accent }}></div>
          <div className="flex gap-1.5 mt-1">
             <div className="w-0.5 h-6 bg-slate-800"></div>
             <div className="flex-1 space-y-1">
                <div className="h-1 w-full bg-slate-700 rounded-xs"></div>
                <div className="h-1 w-full bg-slate-700 rounded-xs"></div>
                <div className="h-1 w-3/4 bg-slate-700 rounded-xs"></div>
             </div>
          </div>
        </div>
      </div>
    );
  }"""

content = content.replace(old_corporate_elite, new_corporate_elite)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

