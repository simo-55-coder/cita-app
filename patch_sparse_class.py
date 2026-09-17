import re

with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

# Add the logic for isSparse
func = """
  // Determine if content is sparse to apply spacious layout
  const isSparse = (() => {
    let len = (summary || '').length;
    len += (experiences || []).reduce((acc, exp) => acc + (exp.description || '').length + (exp.title || '').length, 0);
    len += (education || []).reduce((acc, edu) => acc + (edu.degree || '').length + (edu.institution || '').length, 0);
    return len < 400 && (!experiences || experiences.length <= 1) && (!education || education.length <= 1);
  })();
"""
content = re.sub(r'(const templateId: TemplateId =.*?;\n)', r'\1' + func, content, count=1)

# Add sparse-mode class to the root divs of each template
content = content.replace('className={containerClasses}', 'className={`${containerClasses} ${isSparse ? "sparse-mode" : ""}`}')
content = re.sub(r'(className={`[^`]*mx-auto shadow-sm[^`]*)(`})', r'\1 ${isSparse ? "sparse-mode" : ""}\2', content)

with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)
