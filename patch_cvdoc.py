import re

with open('src/components/CVDocument.tsx', 'r') as f:
    content = f.read()

# Insert renderText helper after imports
helper = """
const renderText = (text?: string) => {
  if (!text) return null;
  // Handle literal '\\n' strings or actual line breaks
  return text.split(/\\\\n|\\n/).map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};
"""
content = re.sub(r"(import \{ useLanguage \} from '../context/LanguageContext';)", r"\1\n" + helper, content)

# Replace {summary} with {renderText(summary)}
content = re.sub(r'\{summary\}', r'{renderText(summary)}', content)
# Ensure we didn't replace property names or if statements
content = content.replace('renderText(summary) && (', 'summary && (')

# Replace {exp.description} with {renderText(exp.description)}
content = re.sub(r'\{exp\.description\}', r'{renderText(exp.description)}', content)
content = content.replace('renderText(exp.description) && (', 'exp.description && (')

# Replace {edu.description} with {renderText(edu.description)}
content = re.sub(r'\{edu\.description\}', r'{renderText(edu.description)}', content)
content = content.replace('renderText(edu.description) && (', 'edu.description && (')

with open('src/components/CVDocument.tsx', 'w') as f:
    f.write(content)
print("Success")
