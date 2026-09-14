import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Grid Proportions
content = content.replace('grid-cols-[32%_68%]', 'grid-cols-[38%_62%]')
content = content.replace('grid-cols-[68%_32%]', 'grid-cols-[62%_38%]')

# 2. Fix Text Wrapping (remove break-all, use smarter wrapping)
# The `[word-break:break-word]` ensures that words break ONLY if they exceed the line length, otherwise it breaks at spaces.
# Wait, `break-words` in Tailwind does `overflow-wrap: break-word;`. We can add `[word-break:break-word]` to be extra safe for Safari/legacy.
content = content.replace('className="break-all"', 'className="break-words [word-break:break-word]"')
content = content.replace('className="break-all ', 'className="break-words [word-break:break-word] ')
content = content.replace(' break-all ', ' break-words [word-break:break-word] ')
content = content.replace(' break-all"', ' break-words [word-break:break-word]"')

# 3. Ensure profile pictures scale perfectly.
# The avatar images usually have `className="w-full h-full object-cover"`. Let's ensure this.
# (They already do, based on previous outputs, but I'll double check)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
