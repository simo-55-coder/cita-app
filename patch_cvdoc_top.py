with open('src/components/CVDocument.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 18 and line.strip() == '};':
        # Skip this extra brace
        continue
    new_lines.append(line)

content = "".join(new_lines)
import_lang = "import { useLanguage } from '../context/LanguageContext';\n"
helper = """
const renderText = (text?: string) => {
  if (!text) return null;
  return text.split(/\\\\n|\\n/).map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};
"""
content = content.replace(import_lang, import_lang + helper)

with open('src/components/CVDocument.tsx', 'w') as f:
    f.write(content)
print("Success")
