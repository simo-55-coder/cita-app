import re
with open("src/index.css", "r") as f:
    css = f.read()

# Replace #print-cv-document with #interactive-cv-preview and add global CV classes for robustness
css = css.replace("#print-cv-document", "#interactive-cv-preview")
css = css.replace("height: 100% !important;", "height: 100% !important; min-height: 100vh !important;")

with open("src/index.css", "w") as f:
    f.write(css)

