import re

file_path = 'src/components/TemplateSelector.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Lock and PlayCircle icons
content = content.replace("from 'lucide-react';", ", Lock, PlayCircle } from 'lucide-react';")
# We need to ensure we don't duplicate imports if they exist.
# A better way is to do a regex replace for the lucide-react import
content = re.sub(r"import \{(.*?)\} from 'lucide-react';", r"import {\1, Lock, PlayCircle, Unlock } from 'lucide-react';", content)

new_template_defs = """
  { id: 'modern', iconAccent: '#8b5cf6', isPremium: false },
  { id: 'executive', iconAccent: '#1e3a8a', isPremium: false },
  { id: 'creative', iconAccent: '#ec4899', isPremium: false },
  { id: 'minimalist', iconAccent: '#0f172a', isPremium: false },
  { id: 'executive-modern', iconAccent: '#0f172a', isPremium: true },
  { id: 'creative-minimal', iconAccent: '#f43f5e', isPremium: true },
  { id: 'corporate-elite', iconAccent: '#1e40af', isPremium: true },
"""

content = re.sub(
    r"const TEMPLATE_DEFS: TemplateItemDef\[\] = \[.*?\];",
    "const TEMPLATE_DEFS: TemplateItemDef[] = [" + new_template_defs + "];",
    content,
    flags=re.DOTALL
)

content = content.replace("interface TemplateItemDef {\n  id: TemplateId;\n  iconAccent: string;\n}", "interface TemplateItemDef {\n  id: TemplateId;\n  iconAccent: string;\n  isPremium?: boolean;\n}")


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

