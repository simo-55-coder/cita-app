import re

file_path = 'index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('content="#8b5cf6"', 'content="#5b21b6"')

splash_html = """
    <style>
      #pwa-splash {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background-color: #5b21b6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease-out;
      }
      #pwa-splash img {
        width: 120px;
        height: 120px;
        object-fit: contain;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      #pwa-splash h1 {
        color: white;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        margin-top: 1.5rem;
        letter-spacing: 0.05em;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(0.95); }
      }
    </style>
    <div id="pwa-splash">
      <img src="/cita-app/pwa-logo-192.png" alt="CVita App Icon" />
      <h1>CVita</h1>
    </div>
"""

script_html = """
    <script>
      window.addEventListener('load', () => {
        const splash = document.getElementById('pwa-splash');
        if (splash) {
          splash.style.opacity = '0';
          setTimeout(() => {
            splash.remove();
          }, 500); // Wait for transition
        }
      });
    </script>
"""

# inject splash_html right after <body ...>
content = re.sub(r'(<body[^>]*>)', r'\1' + splash_html, content)

# inject script before </body>
content = content.replace('</body>', script_html + '  </body>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
