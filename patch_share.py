import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the current executeDownloadPdf with a version that uses html-to-image and share API
old_execute = """const executeDownloadPdf = async () => {
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

new_execute = """const executeDownloadPdf = async () => {
    const safeName = (data.personal?.fullName || 'CV').trim();
    const filename = `${safeName.replace(/\s+/g, '_')}_CV.pdf`;

    setPrintStatus({
      show: true,
      isError: false,
      message: 'Preparing document (Ads help keep this app free)...',
    });

    await showRewardedAd();

    setPrintStatus({
      show: true,
      isError: false,
      message: t.previewControls.preparingPrint || 'Generating PDF... Please wait.',
    });

    try {
      const element = document.getElementById('interactive-cv-preview');
      if (!element) {
        throw new Error('CV document not found.');
      }

      const htmlToImage = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      // Temporarily prepare element
      const originalTransform = element.style.transform;
      const originalWidth = element.style.width;
      const originalPadding = element.style.padding;
      
      element.style.transform = 'none';
      element.style.width = '794px';
      element.style.padding = '40px';
      element.classList.remove('shadow-xl', 'border');

      await new Promise(resolve => setTimeout(resolve, 300));

      const imgData = await htmlToImage.toJpeg(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          width: '794px',
          margin: '0',
          padding: '40px'
        }
      });

      // Restore element
      element.style.transform = originalTransform;
      element.style.width = originalWidth;
      element.style.padding = originalPadding;
      element.classList.add('shadow-xl', 'border');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
      let shared = false;
      
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: filename,
          });
          shared = true;
        } catch (shareErr: any) {
          if (shareErr.name !== 'AbortError') {
            console.error('Share API failed:', shareErr);
          } else {
            shared = true; 
          }
        }
      }

      if (!shared) {
        pdf.save(filename);
      }

      setPrintStatus({
        show: true,
        isError: false,
        message: shared ? 'PDF processed successfully!' : 'PDF downloaded successfully!',
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

content = content.replace(old_execute, new_execute)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
