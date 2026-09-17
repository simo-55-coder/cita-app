import re

with open("src/index.css", "r") as f:
    css = f.read()

# Add a universal rule for print to keep all styles
universal_print_rule = """
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
"""

css = css.replace("@media print {\n  @page {", "@media print {\n" + universal_print_rule + "  @page {")

with open("src/index.css", "w") as f:
    f.write(css)

