import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We will apply getDynamicTextSize to the personal contact spans in the 3 premium templates.
# The spans typically look like:
# <span className="break-words [word-break:break-word] flex-1 min-w-0 leading-tight" dir="ltr">{personal.email}</span>
# We'll replace the static className string with a dynamic one.

fields = ['email', 'phone', 'location', 'website', 'linkedin', 'github']

for field in fields:
    # We want to match: className="something" dir="ltr">{personal.email}
    # and change to: className={`something ${getDynamicTextSize(personal.email)}`} dir="ltr">{personal.email}
    # But website/linkedin might have .replace(...) inside the brackets.
    
    # We'll use a regex that captures the className and the variable part.
    # Pattern: className="([^"]*break-words[^"]*)"([^>]*>)\{personal\.([a-zA-Z]+)(.*?)\}
    def repl(m):
        cls = m.group(1)
        rest_of_tag = m.group(2)
        f_name = m.group(3)
        f_methods = m.group(4)
        
        # Remove any hardcoded text-[12px] or text-[11px] from the cls
        cls = re.sub(r'text-\[[0-9]+px\]', '', cls)
        cls = re.sub(r'text-(xs|sm)', '', cls)
        cls = " ".join(cls.split()) # clean up extra spaces
        
        var_expr = f"personal.{f_name}{f_methods}"
        
        return f'className={{`{cls} ${{getDynamicTextSize({var_expr})}}`}}{rest_of_tag}{{{var_expr}}}'

    content = re.sub(
        r'className="([^"]*break-words[^"]*)"([^>]*>)\{personal\.(' + field + r')(.*?)\}',
        repl,
        content
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

