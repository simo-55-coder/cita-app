import re

with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

# Replace specific hardcoded text sizes and spacings with dynamic ones
# We must be careful because these might be inside strings or JSX

# Helper to safely replace inside JSX classNames
def replace_class(old, new, text):
    # This is a bit brute force but should work for a React component
    return text.replace(old, new)

# 1. Update text sizes
content = replace_class('text-[12px]', '${isSparse ? "text-[14px]" : "text-[12px]"}', content)
content = replace_class('text-[13px]', '${isSparse ? "text-[15px]" : "text-[13px]"}', content)
content = replace_class('text-[11px]', '${isSparse ? "text-[13px]" : "text-[11px]"}', content)
content = replace_class('text-xs sm:text-sm', '${isSparse ? "text-sm sm:text-base" : "text-xs sm:text-sm"}', content)
content = replace_class('text-xs sm:text-[13px]', '${isSparse ? "text-sm sm:text-[15px]" : "text-xs sm:text-[13px]"}', content)
content = replace_class('text-sm sm:text-base', '${isSparse ? "text-base sm:text-lg" : "text-sm sm:text-base"}', content)

# 2. Update spacings
content = replace_class('space-y-4 sm:space-y-5', '${isSparse ? "space-y-8 sm:space-y-10" : "space-y-4 sm:space-y-5"}', content)
content = replace_class('space-y-5 sm:space-y-7', '${isSparse ? "space-y-8 sm:space-y-10" : "space-y-5 sm:space-y-7"}', content)
content = replace_class('space-y-1.5 sm:space-y-2', '${isSparse ? "space-y-3 sm:space-y-4" : "space-y-1.5 sm:space-y-2"}', content)
content = replace_class('space-y-2 sm:space-y-3', '${isSparse ? "space-y-4 sm:space-y-6" : "space-y-2 sm:space-y-3"}', content)
content = replace_class('space-y-3 sm:space-y-4', '${isSparse ? "space-y-6 sm:space-y-8" : "space-y-3 sm:space-y-4"}', content)

# 3. Add min-h-[297mm] to main and aside elements to fix the background cutoff
# We can use regex to find <aside className="..." and add min-h-[297mm]
content = re.sub(r'(<aside[^>]*className="[^"]*)(")', r'\1 min-h-[297mm]\2', content)
content = re.sub(r'(<main[^>]*className="[^"]*)(")', r'\1 min-h-[297mm]\2', content)

# Also fix the template containers that have w-[38%] or w-[62%] and are not aside/main
content = re.sub(r'(<div[^>]*className="[^"]*w-\[38%\][^"]*)(")', r'\1 min-h-[297mm]\2', content)
content = re.sub(r'(<div[^>]*className="[^"]*w-\[62%\][^"]*)(")', r'\1 min-h-[297mm]\2', content)
content = re.sub(r'(<div[^>]*className="[^"]*w-\[64%\][^"]*)(")', r'\1 min-h-[297mm]\2', content)
content = re.sub(r'(<div[^>]*className="[^"]*w-\[36%\][^"]*)(")', r'\1 min-h-[297mm]\2', content)


with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)
