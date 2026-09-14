import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Revert to break-all for contact strings
content = content.replace('break-words whitespace-normal', 'break-all')

# Just in case, let's also make sure we adjust the text classes for contact strings
# to ensure they are at text-xs or text-[11px] properly.
# They are currently mostly `text-[11px] sm:text-xs`.
# To be safe, I'll ensure we have `break-all` everywhere it used to be `break-all`.
# Wait, I had changed `break-all` to `break-words whitespace-normal` globally in the last step for some parts.
# Let's see what is there now.
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
