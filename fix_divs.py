import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the extra closing divs
content = content.replace('            </div></div>\n          </div>\n        </div>\n      )}', '            </div>\n          </div>\n        </div>\n      )}')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
