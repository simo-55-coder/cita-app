import re

file_path = 'src/components/TemplateSelector.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace localStorage with sessionStorage
content = content.replace("localStorage.getItem('unlocked_premium_templates')", "sessionStorage.getItem('unlocked_premium_templates')")
content = content.replace("localStorage.setItem('unlocked_premium_templates'", "sessionStorage.setItem('unlocked_premium_templates'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

