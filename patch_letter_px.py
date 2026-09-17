import re

with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

# Change A4 width/height to US Letter width/height
# A4: 210mm x 297mm -> ~794px x 1123px (at 96 DPI)
# Letter: 8.5in x 11in -> 816px x 1056px (at 96 DPI)

content = content.replace("w-[794px] min-w-[794px] max-w-[794px]", "w-[816px] min-w-[816px] max-w-[816px]")
content = content.replace("min-h-[1120px]", "min-h-[1056px]")
content = content.replace("min-h-[1123px]", "min-h-[1056px]")
content = content.replace("min-h-[297mm]", "min-h-[11in]")
content = content.replace("min-h-[296mm]", "min-h-[11in]")

with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)

with open("src/index.css", "r") as f:
    css = f.read()

# Make sure sparse mode respects Letter size
css = css.replace("297mm", "11in")
css = css.replace("296mm", "11in")

# Also for HTML/Body in print media
css = css.replace("size: A4;", "size: letter;")
css = css.replace("width: 210mm", "width: 8.5in")
css = css.replace("width: 794px", "width: 816px")

with open("src/index.css", "w") as f:
    f.write(css)

with open("src/components/PreviewPanel.tsx", "r") as f:
    preview = f.read()
    
# Change html2canvas width to Letter width
preview = preview.replace("width: '794px'", "width: '816px'")
with open("src/components/PreviewPanel.tsx", "w") as f:
    f.write(preview)

