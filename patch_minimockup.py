import re

file_path = 'src/components/TemplateSelector.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_mockups = """
  if (templateId === 'executive-modern') {
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
  }

  if (templateId === 'creative-minimal') {
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
  }

  if (templateId === 'corporate-elite') {
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
  }
"""

content = content.replace("  // Minimalist Clean\n  return (", new_mockups + "\n  // Minimalist Clean\n  return (")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

