import re

with open('src/components/CVDocument.tsx', 'r') as f:
    content = f.read()

# Replace the broken renderText with correct one
old_helper_regex = r"const renderText = \(text\?: string\) => \{.*?  \)\);\n\};\n"
new_helper = r"""const renderText = (text?: string) => {
  if (!text) return null;
  // Handle literal '\n' strings or actual line breaks
  return text.split(/\\n|\n/).map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};
"""
content = re.sub(old_helper_regex, new_helper, content, flags=re.DOTALL)

with open('src/components/CVDocument.tsx', 'w') as f:
    f.write(content)
print("Success")
