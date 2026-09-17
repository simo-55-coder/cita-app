import re

with open("src/index.css", "r") as f:
    css = f.read()

# Add specific overrides to ensure the background stretches and borders stay rounded
print_fixes = """
  /* Force flex columns to stretch to the bottom */
  #print-cv-document > div {
    height: 100% !important;
    min-height: 100% !important;
  }
  #print-cv-document .flex-row {
    height: 100% !important;
    align-items: stretch !important;
  }
  #print-cv-document .flex-row > div {
    height: 100% !important;
  }
  
  /* Force border radius on everything that has it */
  .rounded-full {
    border-radius: 9999px !important;
  }
  .rounded-lg {
    border-radius: 0.5rem !important;
  }
  .rounded-md {
    border-radius: 0.375rem !important;
  }
  
  /* Force borders to show */
  .border {
    border-width: 1px !important;
    border-style: solid !important;
  }
"""

css = css.replace("  #print-cv-document {", print_fixes + "\n  #print-cv-document {")

with open("src/index.css", "w") as f:
    f.write(css)

