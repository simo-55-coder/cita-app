import re

with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

# Add the logic for isSparse
func = """
  const isSparse = (() => {
    let len = (summary || '').length;
    len += (experiences || []).reduce((acc, exp) => acc + (exp.description || '').length + (exp.title || '').length, 0);
    len += (education || []).reduce((acc, edu) => acc + (edu.degree || '').length + (edu.institution || '').length, 0);
    return len < 400 && (!experiences || experiences.length <= 1) && (!education || education.length <= 1);
  })();
"""

# Find all functional components that have `const scaleClass = ...` and add `isSparse` before it
content = re.sub(r'(const scaleClass = .*?;)', func + r'\n  \1', content)

with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)
