import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Executive Modern (38%_62%)
old_em_container = "grid grid-cols-[38%_62%]"
new_em_container = "flex flex-row"
content = content.replace("overflow-hidden min-h-[1123px] w-[794px] min-w-[794px] max-w-[794px] mx-auto shadow-sm grid grid-cols-[38%_62%] ${scaleClass}`}",
                          "overflow-hidden min-h-[1123px] w-[794px] min-w-[794px] max-w-[794px] mx-auto shadow-sm flex flex-row ${scaleClass}`}")

content = content.replace('      {/* Sidebar */}\n      <div className="bg-slate-900 text-white',
                          '      {/* Sidebar */}\n      <div className="w-[38%] shrink-0 bg-slate-900 text-white')

content = content.replace('      {/* Main Content */}\n      <div className="p-8 bg-white flex flex-col',
                          '      {/* Main Content */}\n      <div className="w-[62%] shrink-0 p-8 bg-white flex flex-col')

# Creative Minimal (62%_38%)
content = content.replace('className="grid grid-cols-[62%_38%] flex-1 w-full bg-white relative z-0"',
                          'className="flex flex-row flex-1 w-full bg-white relative z-0"')

content = content.replace('        {/* Main Content (Left) */}\n        <div className="pt-28 ps-8 pe-6 pb-8 flex flex-col',
                          '        {/* Main Content (Left) */}\n        <div className="w-[62%] shrink-0 pt-28 ps-8 pe-6 pb-8 flex flex-col')

content = content.replace('        {/* Sidebar (Right) */}\n        <div className="bg-slate-800 text-white pt-10 pb-8 flex flex-col',
                          '        {/* Sidebar (Right) */}\n        <div className="w-[38%] shrink-0 bg-slate-800 text-white pt-10 pb-8 flex flex-col')

# Corporate Elite (38%_62%)
content = content.replace('      {/* Sidebar */}\n      <div className="bg-[#111111] p-6 md:p-8 flex flex-col',
                          '      {/* Sidebar */}\n      <div className="w-[38%] shrink-0 bg-[#111111] p-6 md:p-8 flex flex-col')

content = content.replace('      {/* Main Content */}\n      <div className="p-8 bg-slate-950 flex flex-col',
                          '      {/* Main Content */}\n      <div className="w-[62%] shrink-0 p-8 bg-slate-950 flex flex-col')


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
