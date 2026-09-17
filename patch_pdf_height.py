import re

with open("src/components/PreviewPanel.tsx", "r") as f:
    content = f.read()

# When heightLeft is extremely small (e.g. less than 1mm), we shouldn't add a new page.
content = content.replace("while (heightLeft > 0) {", "while (heightLeft > 1) { // 1mm threshold to prevent blank pages")

with open("src/components/PreviewPanel.tsx", "w") as f:
    f.write(content)

