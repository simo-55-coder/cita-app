const fs = require('fs');

// Update admob.ts
let admobCode = fs.readFileSync('src/lib/admob.ts', 'utf8');
admobCode = admobCode.replace('position: BannerAdPosition.BOTTOM_CENTER,', 'position: BannerAdPosition.TOP_CENTER,');
admobCode = admobCode.replace('margin: 70, // Margin to ensure it sits above the bottom action dock', 'margin: 50, // Margin to sit below the Header (Header height is ~49px)');
fs.writeFileSync('src/lib/admob.ts', admobCode);

// Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importTarget = `import { initAdMob, showBannerAd } from "./lib/admob";`;
const newImport = `import { initAdMob, showBannerAd } from "./lib/admob";\nimport { Capacitor } from '@capacitor/core';`;
if (!appCode.includes('@capacitor/core')) {
  appCode = appCode.replace(importTarget, newImport);
}

// Add Spacer
const mainTarget = `<main className="w-full max-w-full flex-1 flex flex-col overflow-x-hidden">`;
const newMain = `<main className="w-full max-w-full flex-1 flex flex-col overflow-x-hidden">
            {Capacitor.getPlatform() !== 'web' && (
              <div className="w-full h-[50px] shrink-0 bg-slate-50" />
            )}`;
appCode = appCode.replace(mainTarget, newMain);

fs.writeFileSync('src/App.tsx', appCode);
console.log("Success");
