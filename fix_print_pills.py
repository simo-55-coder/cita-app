import re
with open("src/index.css", "r") as f:
    css = f.read()

# Add specific fix for the title pills breaking out of borders
pill_fix = """
  /* Specific fix for title pills breaking their borders in Android Print Spooler */
  .rounded-full.border {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: clip !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 1 !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
"""

css = css.replace("  .rounded-full {", pill_fix + "\n  .rounded-full {")

with open("src/index.css", "w") as f:
    f.write(css)

