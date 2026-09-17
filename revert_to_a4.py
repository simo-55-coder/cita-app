import re

# 1. Revert CVDocument.tsx
with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

content = content.replace("w-[816px] min-w-[816px] max-w-[816px]", "w-[794px] min-w-[794px] max-w-[794px]")
content = content.replace("min-h-[1056px]", "min-h-[1120px]")
content = content.replace("min-h-[11in]", "min-h-[297mm]")

with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)

# 2. Revert index.css
with open("src/index.css", "r") as f:
    css = f.read()

css = css.replace("11in", "297mm")
css = css.replace("size: letter;", "size: A4;")
css = css.replace("width: 8.5in", "width: 210mm")
css = css.replace("width: 816px", "width: 794px")

with open("src/index.css", "w") as f:
    f.write(css)

# 3. Revert PreviewPanel.tsx
with open("src/components/PreviewPanel.tsx", "r") as f:
    preview = f.read()
    
preview = preview.replace("width: '816px'", "width: '794px'")
preview = preview.replace("format: 'letter'", "format: 'a4'")

with open("src/components/PreviewPanel.tsx", "w") as f:
    f.write(preview)

