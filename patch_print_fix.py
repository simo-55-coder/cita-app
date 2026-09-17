import re

with open("src/index.css", "r") as f:
    content = f.read()

# Replace the @media print block with a robust one
# We can find the block by regex or string replacement, or just rewrite it
# It's easier to just find the entire @media print { ... } and replace it

print_css = """@media print {
  @page {
    size: A4;
    margin: 0;
  }
  
  html, body {
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    background: #ffffff !important;
    color: #1e293b !important;
    padding: 0 !important;
    margin: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Completely hide interactive UI elements */
  .no-print,
  #root > .no-print,
  header,
  nav,
  aside,
  button,
  #language-switcher,
  [role="dialog"] {
    display: none !important;
  }

  /* Hide root entirely to prevent it from taking up any space */
  #root {
    display: none !important;
  }

  /* Show only the dedicated print container */
  #print-cv-root {
    display: block !important;
    visibility: visible !important;
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }

  #print-cv-root * {
    visibility: visible !important;
  }

  #print-cv-document {
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
}
"""

content = re.sub(r'@media print \{.*?\n\}\n/\*', print_css + '/*', content, flags=re.DOTALL)

with open("src/index.css", "w") as f:
    f.write(content)

