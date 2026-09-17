import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

regex = re.compile(r'const executeDownloadPdf = async \(\) => \{.*?} catch \(err: any\) \{\s*console.error\(\'PDF generation failed:\', err\);\s*setPrintStatus\(\{\s*show: true,\s*isError: true,\s*message: err\?\.message \|\| \'Failed to generate PDF. Please try again.\',\s*\}\);\s*\}\s*\};', re.DOTALL)

new_execute = """const executeDownloadPdf = async () => {
    setPrintStatus({
      show: true,
      isError: false,
      message: 'Preparing document (Ads help keep this app free)...',
    });

    // Display rewarded ad (fails gracefully and immediately proceeds on Web/Error)
    await showRewardedAd();

    setPrintStatus({
      show: true,
      isError: false,
      message: t.previewControls.preparingPrint || 'Opening Print Dialog... Please select "Save as PDF".',
    });

    try {
      // Small delay to allow the UI to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger native print dialog (which handles PDF generation flawlessly for Arabic/RTL/Flexbox)
      window.print();
      
      setPrintStatus({
        show: true,
        isError: false,
        message: 'PDF is ready! If the dialog closed, click download again.',
      });
    } catch (err: any) {
      console.error('PDF generation failed:', err);
      setPrintStatus({
        show: true,
        isError: true,
        message: err?.message || 'Failed to generate PDF. Please try again.',
      });
    }
  };"""

if regex.search(content):
    content = regex.sub(new_execute, content)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Regex did not match")
