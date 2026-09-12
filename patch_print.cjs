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

    // Initialize print layout feedback state to force a render flush
    setPrintStatus({
      show: true,
      isError: false,
      message: t.previewControls.preparingPrint || 'Preparing print layout...',
    });

    // Ensure the window/iframe has focus before triggering print
    window.focus();

    // Use a slight delay to allow the React state to flush and the browser to register focus,
    // which bypasses issues where window.print() gets ignored or blocked on the first click.
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Print failed', err);
        setPrintStatus({
          show: true,
          isError: true,
          message: t.previewControls.printIframeHelp,
        });
      } finally {
        setTimeout(() => {
          document.title = originalTitle;
          setPrintStatus(prev => prev && !prev.isError ? null : prev);
        }, 1500);
      }
    }, 150);
  };`;

const newPrint = `  // Simple print handler
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

if(code.includes(oldPrint)) {
  code = code.replace(oldPrint, newPrint);
  fs.writeFileSync('src/components/PreviewPanel.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
