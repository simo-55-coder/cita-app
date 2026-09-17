import re
with open("src/index.css", "r") as f:
    css = f.read()

# Make the print overrides apply to ANY potential ID used for the document
css = css.replace("#interactive-cv-preview", "#interactive-cv-preview, #cv-document")

with open("src/index.css", "w") as f:
    f.write(css)

