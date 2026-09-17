const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewPanel.tsx', 'utf8');

const regex = /const executeDownloadPdf = async \(\) => \{[\s\S]*?\}\s*catch\s*\(err:\s*any\)\s*\{\s*console.error\('PDF generation failed:', err\);\s*setPrintStatus\(\{\s*show:\s*true,\s*isError:\s*true,\s*message:\s*err\?\.message\s*\|\|\s*'Failed to generate PDF\. Please try again\.',\s*\}\);\s*\}\s*\};/;

const newCode = `const executeDownloadPdf = async () => {
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
  };`;

if (regex.test(code)) {
    code = code.replace(regex, newCode);
    fs.writeFileSync('src/components/PreviewPanel.tsx', code);
    console.log('Patched successfully');
} else {
    console.log('Regex did not match');
}
