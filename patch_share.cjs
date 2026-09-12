const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewPanel.tsx', 'utf8');

const target = `      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);

      setPrintStatus({
        show: true,
        isError: false,
        message: 'PDF downloaded successfully!',
      });`;

const replacement = `      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Convert generated PDF to Blob/File for Web Share API
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      let shared = false;
      
      // Try Web Share API first (Native Mobile / Supported Browsers)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: filename,
          });
          shared = true;
        } catch (shareErr: any) {
          // Ignore AbortError (user cancelled share), but log others
          if (shareErr.name !== 'AbortError') {
            console.error('Share API failed:', shareErr);
          } else {
            shared = true; // User cancelled, but the API worked. No need to trigger fallback download.
          }
        }
      }

      // Fallback: Standard Web Download
      if (!shared) {
        pdf.save(filename);
      }

      setPrintStatus({
        show: true,
        isError: false,
        message: shared ? 'PDF processed successfully!' : 'PDF downloaded successfully!',
      });`;

if(code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/PreviewPanel.tsx', code);
  console.log("Success");
} else {
  console.log("Not found target. Printing snippet:");
  const lines = code.split('\\n');
  const index = lines.findIndex(l => l.includes('pdf.save(filename)'));
  if (index >= 0) {
    console.log(lines.slice(index - 5, index + 10).join('\\n'));
  }
}
