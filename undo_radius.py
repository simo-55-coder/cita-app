import re
with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'style={{ borderColor: primary, color: primary, borderRadius: "9999px", borderWidth: "1.5px", borderStyle: "solid" }}',
    'style={{ borderColor: primary, color: primary }}'
)
with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)
