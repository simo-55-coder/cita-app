import re

file_path = 'src/components/TemplateSelector.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """  useEffect(() => {
    try {
      // Clear old localStorage just in case it conflicts
      localStorage.removeItem('unlocked_premium_templates');
      
      const stored = sessionStorage.getItem('unlocked_premium_templates');"""

content = content.replace("""  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('unlocked_premium_templates');""", replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
