const fs = require('fs');
let code = fs.readFileSync('src/data/translations.ts', 'utf8');

code = code.replace(/appTitle:\s*'CV BUILDER'/, "appTitle: 'CVita'");
code = code.replace(/appBadge:\s*'PRO'/, "appBadge: ''");
code = code.replace(/appSubtitle:\s*'Mobile-First A4 Studio'/, "appSubtitle: 'PDF Resume Builder'");

code = code.replace(/appTitle:\s*'CRÉATEUR CV'/, "appTitle: 'CVita'");
// The first replace of appBadge: 'PRO' might have replaced the FR one too if we used global, let's use a regex replace all
code = code.replace(/appTitle:\s*'CRÉATEUR CV'/g, "appTitle: 'CVita'");
code = code.replace(/appBadge:\s*'PRO'/g, "appBadge: ''");
code = code.replace(/appSubtitle:\s*'Studio Mobile A4'/g, "appSubtitle: 'Créateur de CV PDF'");

code = code.replace(/appTitle:\s*'صانع السيرة الذاتية'/g, "appTitle: 'CVita'");
code = code.replace(/appBadge:\s*'برو'/g, "appBadge: ''");
code = code.replace(/appSubtitle:\s*'استوديو الهاتف الذكي A4'/g, "appSubtitle: 'منشئ السيرة الذاتية PDF'");

fs.writeFileSync('src/data/translations.ts', code);
console.log("Success");
