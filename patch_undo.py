import re

with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

def replace_class(old, new, text):
    return text.replace(new, old)

content = replace_class('text-[12px]', '${isSparse ? "text-[14px]" : "text-[12px]"}', content)
content = replace_class('text-[13px]', '${isSparse ? "text-[15px]" : "text-[13px]"}', content)
content = replace_class('text-[11px]', '${isSparse ? "text-[13px]" : "text-[11px]"}', content)
content = replace_class('text-xs sm:text-sm', '${isSparse ? "text-sm sm:text-base" : "text-xs sm:text-sm"}', content)
content = replace_class('text-xs sm:text-[13px]', '${isSparse ? "text-sm sm:text-[15px]" : "text-xs sm:text-[13px]"}', content)
content = replace_class('text-sm sm:text-base', '${isSparse ? "text-base sm:text-lg" : "text-sm sm:text-base"}', content)
content = replace_class('space-y-4 sm:space-y-5', '${isSparse ? "space-y-8 sm:space-y-10" : "space-y-4 sm:space-y-5"}', content)
content = replace_class('space-y-5 sm:space-y-7', '${isSparse ? "space-y-8 sm:space-y-10" : "space-y-5 sm:space-y-7"}', content)
content = replace_class('space-y-1.5 sm:space-y-2', '${isSparse ? "space-y-3 sm:space-y-4" : "space-y-1.5 sm:space-y-2"}', content)
content = replace_class('space-y-2 sm:space-y-3', '${isSparse ? "space-y-4 sm:space-y-6" : "space-y-2 sm:space-y-3"}', content)
content = replace_class('space-y-3 sm:space-y-4', '${isSparse ? "space-y-6 sm:space-y-8" : "space-y-3 sm:space-y-4"}', content)

content = content.replace(' min-h-[297mm]', '')

with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)
