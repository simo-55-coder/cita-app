import re
with open("src/index.css", "r") as f:
    css = f.read()

css = css.replace("#interactive-cv-preview, #cv-document", "#interactive-cv-preview, #cv-document, #print-cv-document")

with open("src/index.css", "w") as f:
    f.write(css)
