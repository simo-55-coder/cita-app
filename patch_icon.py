import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Share2 to the lucide-react imports
if 'Share2,' not in content:
    content = content.replace('  ZoomIn,\n', '  Share2,\n  ZoomIn,\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
