import re

with open("src/components/CVDocument.tsx", "r") as f:
    content = f.read()

# Add a function to calculate content length and determine if we need spacious layout
func = """
  // Determine if content is sparse to apply spacious layout
  const isSparse = (() => {
    let len = (summary || '').length;
    len += (experiences || []).reduce((acc, exp) => acc + (exp.description || '').length + (exp.title || '').length, 0);
    len += (education || []).reduce((acc, edu) => acc + (edu.degree || '').length + (edu.institution || '').length, 0);
    return len < 400; // If very little text, return true
  })();
  
  const spaceYClass = isSparse ? 'space-y-8 sm:space-y-10' : 'space-y-4 sm:space-y-5';
  const textScaleClass = isSparse ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]';
"""

# inject it into CVDocumentInner
content = re.sub(r'(const templateId: TemplateId =.*?;\n)', r'\1' + func, content, count=1)

with open("src/components/CVDocument.tsx", "w") as f:
    f.write(content)
