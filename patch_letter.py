import re

with open("src/index.css", "r") as f:
    css = f.read()

css = css.replace("size: A4;", "size: letter;")
css = css.replace("210mm", "8.5in")
css = css.replace("297mm", "11in")

with open("src/index.css", "w") as f:
    f.write(css)

with open("src/components/PreviewPanel.tsx", "r") as f:
    js = f.read()

js = js.replace("format: 'a4'", "format: 'letter'")

with open("src/components/PreviewPanel.tsx", "w") as f:
    f.write(js)
