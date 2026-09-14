import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

helper_func = """
const getDynamicTextSize = (text?: string, baseSize: string = 'text-[12px]') => {
  if (!text) return baseSize;
  const len = text.length;
  if (len > 35) return 'text-[9.5px] leading-tight';
  if (len > 25) return 'text-[10.5px] leading-tight';
  return baseSize;
};
"""

# Remove the broken helper func block
content = content.replace("import {\nconst getDynamicTextSize = (text?: string, baseSize: string = 'text-[12px]') => {\n  if (!text) return baseSize;\n  const len = text.length;\n  if (len > 35) return 'text-[9.5px] leading-tight';\n  if (len > 25) return 'text-[10.5px] leading-tight';\n  return baseSize;\n};\n", "import {\n")

# Inject it after the useLanguage import
content = content.replace("import { useLanguage } from '../context/LanguageContext';", "import { useLanguage } from '../context/LanguageContext';\n" + helper_func)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
