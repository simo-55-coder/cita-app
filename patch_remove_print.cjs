const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewPanel.tsx', 'utf8');

// 1. Remove Printer from imports
code = code.replace(/,\s*Printer,/, ',');
code = code.replace(/Printer,\s*/, '');

// 2. Remove handlePrint function
const handlePrintRegex = /  \/\/ Robust print handler with WebView\/PWA fallbacks[\s\S]*?  const BackIcon = isRTL \? ArrowRight : ArrowLeft;/;
code = code.replace(handlePrintRegex, '  const BackIcon = isRTL ? ArrowRight : ArrowLeft;');

// 3. Remove Print button from the top header
const topPrintBtnRegex = /\s*<button\s+id="btn-preview-print"[\s\S]*?<\/button>/;
code = code.replace(topPrintBtnRegex, '');

fs.writeFileSync('src/components/PreviewPanel.tsx', code);
console.log("Success");
