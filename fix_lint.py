import re
with open("src/components/PreviewPanel.tsx", "r") as f:
    content = f.read()

# Fix the lint error temporarily
content = content.replace("t.preview.share", "'Share'")
with open("src/components/PreviewPanel.tsx", "w") as f:
    f.write(content)
