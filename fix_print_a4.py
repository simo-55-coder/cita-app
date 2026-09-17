import re

with open("src/index.css", "r") as f:
    css = f.read()

# Change size: A4; to size: 210mm 297mm; to force strict ISO A4 mapping in Android Spooler
css = css.replace("size: A4;", "size: a4 portrait;\n    /* Fallback precise dimensions for Android Print Spooler */\n    size: 210mm 297mm;")

with open("src/index.css", "w") as f:
    f.write(css)

