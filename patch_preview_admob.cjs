const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewPanel.tsx', 'utf8');

const importTarget = `import { CVDocument } from './CVDocument';`;
const newImport = `import { CVDocument } from './CVDocument';\nimport { showRewardedAd } from '../lib/admob';`;
if(!code.includes('showRewardedAd')) {
  code = code.replace(importTarget, newImport);
}

const downloadTarget = `  // Direct download PDF handler using html2canvas-pro and jspdf (supports Tailwind 4 oklch colors)
  const handleDownloadPdf = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const safeName = (data.personal?.fullName || 'CV').trim();
    const filename = \`\${safeName.replace(/\\s+/g, '_')}_CV.pdf\`;

    setPrintStatus({
      show: true,
      isError: false,
      message: t.previewControls.preparingPrint || 'Generating PDF... Please wait.',
    });`;

const newDownload = `  // Direct download PDF handler using html2canvas-pro and jspdf (supports Tailwind 4 oklch colors)
  const handleDownloadPdf = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const safeName = (data.personal?.fullName || 'CV').trim();
    const filename = \`\${safeName.replace(/\\s+/g, '_')}_CV.pdf\`;

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
      message: t.previewControls.preparingPrint || 'Generating PDF... Please wait.',
    });`;

code = code.replace(downloadTarget, newDownload);

fs.writeFileSync('src/components/PreviewPanel.tsx', code);
console.log("Success");
