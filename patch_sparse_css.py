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

# Add sparse-mode class to the root divs of each template!
# We can search for `className={containerClasses}` and add sparse-mode
content = content.replace('className={containerClasses}', 'className={`${containerClasses} ${isSparse ? "sparse-mode" : ""}`}')
# For templates that don't use containerClasses:
content = re.sub(r'(className={`[^`]*mx-auto shadow-sm[^`]*)(`})', r'\1 ${isSparse ? "sparse-mode" : ""}\2', content)

# Inject the style block at the end of CVDocumentInner
style_block = """
      {isSparse && (
        <style>{`
          .sparse-mode {
             font-size: 110%;
          }
          .sparse-mode section {
             margin-bottom: 2.5rem !important;
          }
          .sparse-mode p {
             line-height: 1.8 !important;
             font-size: 1.1em;
          }
          .sparse-mode h3 {
             font-size: 1.15em !important;
          }
          .sparse-mode .space-y-4 > * + * {
             margin-top: 1.5rem !important;
          }
          .sparse-mode .space-y-5 > * + * {
             margin-top: 2rem !important;
          }
          .sparse-mode aside, .sparse-mode main, .sparse-mode > div > div {
             min-height: 297mm !important;
          }
        `}</style>
      )}
"""

content = content.replace("return '60%';\n    }\n  };", "return '60%';\n    }\n  };\n" + style_block)

# Wait, `CVDocumentInner` has multiple `return` statements for each template.
# If we want the `<style>` block to apply to all of them, we should wrap the entire switch or inject the `<style>` inside each template's return.
# Or better, just inject it into the wrapper components `ModernTemplateWrapper` etc.
