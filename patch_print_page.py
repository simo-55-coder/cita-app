import re

with open("src/index.css", "r") as f:
    content = f.read()

# For html, body
content = content.replace("height: 296mm !important;", "max-height: 297mm !important;\n    height: 100vh !important;\n    overflow: hidden !important;")

# For #print-cv-document
content = content.replace("height: 100% !important;", "height: 100% !important;\n    max-height: 297mm !important;\n    overflow: hidden !important;")

with open("src/index.css", "w") as f:
    f.write(content)
