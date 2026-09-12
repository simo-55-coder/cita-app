const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewPanel.tsx', 'utf8');

const oldPrint = `  // Simple print handler
  const handlePrint = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const originalTitle = document.title;
    const safeName = (data.personal?.fullName || 'CV').trim();
    if (safeName) {
      document.title = \`\${safeName} - CV\`;
    }

    try {
      window.print();
    } catch (err) {
      console.error('Print failed', err);
    } finally {
      document.title = originalTitle;
    }
  };`;

const newPrint = `  // Robust print handler with WebView/PWA fallbacks
  const handlePrint = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const originalTitle = document.title;
    const safeName = (data.personal?.fullName || 'CV').trim();
    if (safeName) {
      document.title = \`\${safeName} - CV\`;
    }

    // Small delay ensures the DOM flushes the new title before the print dialog locks the main thread
    setTimeout(() => {
      try {
        const isMobileWebView = /WebView|Android.*Version\\/[0-9]\\.[0-9]|Line|Instagram|FBAV|FBAN/i.test(navigator.userAgent);
        
        if (typeof window.print === 'function' && !isMobileWebView) {
          // Standard execution for modern supported browsers
          window.print();
        } else {
          // Fallback 1: Try clean container for isolated WebViews
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(document.documentElement.innerHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            setTimeout(() => printWindow.close(), 1000);
          } else {
            // Fallback 2: Execute direct PDF download if popups are blocked or print fails
            handleDownloadPdf();
          }
        }
      } catch (err) {
        console.error('Print execution failed:', err);
        // Ultimate fallback: direct PDF download
        handleDownloadPdf();
      } finally {
        setTimeout(() => {
          document.title = originalTitle;
        }, 2000); // Async restore so the OS print spooler has time to read the custom title
      }
    }, 100);
  };`;

if(code.includes(oldPrint)) {
  code = code.replace(oldPrint, newPrint);
  fs.writeFileSync('src/components/PreviewPanel.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
