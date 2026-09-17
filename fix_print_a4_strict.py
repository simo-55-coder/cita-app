import re

with open("src/index.css", "r") as f:
    css = f.read()

# We need to use exactly 'size: A4 portrait;' without the explicit mm override 
# because sometimes Android's Print Spooler gets confused by multiple size declarations.
# Let's clean up the @page rule to be exactly what standard browsers expect for A4.

# Find the @page block and replace it
import re
css = re.sub(r'@page\s*{[^}]+}', '@page {\n    size: A4 portrait;\n    margin: 0;\n  }', css)

# Make sure html and body are strictly A4 sized in print
css = css.replace("width: 210mm !important;", "width: 210mm !important;\n    min-width: 210mm !important;\n    max-width: 210mm !important;")

with open("src/index.css", "w") as f:
    f.write(css)

