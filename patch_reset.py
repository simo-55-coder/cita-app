import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add setGeneratedPdf(null) at the start of executeDownloadPdf
old_execute_start = "const executeDownloadPdf = async () => {\n    const safeName ="
new_execute_start = "const executeDownloadPdf = async () => {\n    setGeneratedPdf(null);\n    const safeName ="

content = content.replace(old_execute_start, new_execute_start)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
