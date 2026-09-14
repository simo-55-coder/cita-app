import re

file_path = 'vite.config.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("theme_color: '#0f172a'", "theme_color: '#5b21b6'")
content = content.replace("background_color: '#0f172a'", "background_color: '#5b21b6'")
content = content.replace("src: 'pwa-192x192.png'", "src: 'pwa-logo-192.png'")
content = content.replace("src: 'pwa-512x512.png'", "src: 'pwa-logo-512.png'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

