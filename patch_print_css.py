import re

file_path = 'src/index.css'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Completely rewrite the print media query
new_print_css = """@media print {
  @page {
    size: A4;
    margin: 0;
  }
  
  html, body {
    width: 210mm !important;
    height: 297mm !important;
    background: #ffffff !important;
    color: #1e293b !important;
    padding: 0 !important;
    margin: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    overflow: visible !important;
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

  /* Show only the dedicated print container */
  .print-only,
  #print-cv-root {
    display: block !important;
    visibility: visible !important;
    width: 210mm !important;
    height: 297mm !important;
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
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box !important;
    page-break-after: auto !important;
    page-break-inside: auto !important;
    overflow: hidden !important;
  }
}
"""

content = re.sub(r'@media print\s*\{.*\}', new_print_css, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
