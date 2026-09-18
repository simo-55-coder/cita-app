const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Find the start of the Smart Page-Filling Mode block
const startIndex = css.indexOf('/* ==========================================================================');
if (startIndex !== -1 && css.substring(startIndex).includes('Smart Page-Filling Mode')) {
  css = css.substring(0, startIndex) + `/* ==========================================================================
   Smart Page-Filling Mode (Auto-Fill / Auto-Expand)
   Works consistently and responsively across all standard & premium templates
   Preserves template layout (e.g. flex-row for Creative & sidebars, flex-col for linear)
   ========================================================================== */

[data-auto-fill="true"] {
  min-height: 1120px !important;
  height: 100% !important;
  box-sizing: border-box !important;
}

@media print {
  [data-auto-fill="true"] {
    min-height: 297mm !important;
    /* We don't force max-height or overflow hidden so it can overflow to a second page normally if needed */
  }
}
`;
  fs.writeFileSync('src/index.css', css);
  console.log('Fixed CSS');
} else {
  console.log('Could not find block');
}
