import re

with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

# Add whitespace-nowrap to all section title h2 elements that use rounded-full pills
content = content.replace(
    'className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-center"',
    'className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-center whitespace-nowrap"'
)

content = content.replace(
    'className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest"',
    'className="inline-block border rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"'
)

with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)

