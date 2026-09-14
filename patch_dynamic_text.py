import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's add a helper function at the top of the file.
helper_func = """
const getDynamicTextSize = (text?: string, baseSize: string = 'text-[12px]') => {
  if (!text) return baseSize;
  const len = text.length;
  if (len > 35) return 'text-[9.5px] leading-tight';
  if (len > 25) return 'text-[10.5px] leading-tight';
  return baseSize;
};
"""

if 'getDynamicTextSize' not in content:
    content = content.replace("export const CVDocument: React.FC<CVDocumentProps> = (props) => {", helper_func + "\nexport const CVDocument: React.FC<CVDocumentProps> = (props) => {")
    content = content.replace("const ExecutiveModernTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {", helper_func + "\nconst ExecutiveModernTemplate: React.FC<CVDocumentProps> = ({ data, id, isPrint }) => {")
    # Actually it's better to just inject it once at the top level, right after imports.
    # Let's remove the above and just inject after the last import.

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getDynamicTextSize' not in content:
    content = re.sub(r'(import .*?;?\n)(?!import)', r'\1\n' + helper_func + r'\n', content, count=1)

# Now, we need to apply it.
# We have lines like: <span className="break-words [word-break:break-word] flex-1 min-w-0 leading-tight" dir="ltr">{personal.email}</span>
# We can just change the className to include the dynamic size.
# Actually, the user asked for "robust CSS containment that automatically detects text overflows... Automatically adjust font sizes, padding, and word-wrapping rules dynamically based on content length"
# The python regex to replace this is a bit complex. Let's use robust CSS instead:
# CSS `container-type: inline-size` on the contact container, and `font-size: clamp(8px, 4cqi, 12px)` on the text.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
