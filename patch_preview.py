import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add AdModal import
if "import { AdModal }" not in content:
    content = content.replace("import { CVDocument } from './CVDocument';", "import { CVDocument } from './CVDocument';\nimport { AdModal } from './AdModal';")

# 2. Add state inside the component
if "const [showAdModal, setShowAdModal] = useState(false);" not in content:
    content = re.sub(r'(const \[printStatus, setPrintStatus\] = useState[^;]+;)',
                     r'\1\n  const [showAdModal, setShowAdModal] = useState(false);',
                     content)

# 3. Rename handleDownloadPdf to executeDownloadPdf
content = content.replace("const handleDownloadPdf = async (e?: React.MouseEvent | React.TouchEvent) => {", 
                          "const executeDownloadPdf = async () => {")

# 4. Remove e.preventDefault from executeDownloadPdf since it no longer takes e
content = re.sub(r'if \(e\) \{\s*e\.preventDefault\(\);\s*e\.stopPropagation\(\);\s*\}\s*', '', content)

# 5. Create new handleDownloadPdf
new_handler = """  const handleDownloadPdf = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowAdModal(true);
  };"""

content = content.replace("const executeDownloadPdf = async () => {", new_handler + "\n\n  const executeDownloadPdf = async () => {")

# 6. Add <AdModal /> at the end of the return statement before the closing fragment or div
ad_modal_jsx = """
      <AdModal 
        isOpen={showAdModal} 
        onClose={() => setShowAdModal(false)} 
        onRewardGranted={() => {
          setShowAdModal(false);
          // Small timeout to allow modal animation to clear before blocking main thread
          setTimeout(() => {
            executeDownloadPdf();
          }, 300);
        }} 
        title={t.previewControls.downloadPdf || "Watch Ad to Download"}
        description={isRTL ? "شاهد هذا الإعلان القصير لدعمنا قبل تحميل سيرتك الذاتية." : "Support CVita by watching a quick sponsor message before downloading your PDF."}
      />
    </div>
  );
};
"""

content = re.sub(r'    </div>\s*\);\s*};\s*$', ad_modal_jsx, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
