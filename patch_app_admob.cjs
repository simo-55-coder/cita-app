const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
const importAuth = `import { initAuth, signInWithGoogle, signOutUser } from './lib/firebase';`;
const newImports = `import { initAuth, signInWithGoogle, signOutUser } from './lib/firebase';\nimport { initAdMob, showBannerAd } from './lib/admob';`;
code = code.replace(importAuth, newImports);

// 2. Add useEffect for AdMob
const authEffect = `  // Firebase Auth listener
  useEffect(() => {`;
const admobEffect = `  // Initialize AdMob on Mount
  useEffect(() => {
    initAdMob().then(() => showBannerAd());
  }, []);

  // Firebase Auth listener
  useEffect(() => {`;

code = code.replace(authEffect, admobEffect);

fs.writeFileSync('src/App.tsx', code);
console.log("Success");
