const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /const handleResetSample = \(\) => \{[\s\S]*?if \(window\.confirm\(confirmMsg\)\) \{[\s\S]*?setCvData\(getSampleCVForLanguage\(lang\)\);\n\s*\}\n\s*\};/,
  `const handleResetSample = () => {
    const confirmMsg = isRTL
      ? 'هل أنت متأكد من مسح جميع البيانات في هذا القسم الحالي فقط؟'
      : lang === 'fr'
      ? 'Voulez-vous vraiment effacer toutes les données de cette section uniquement ?'
      : 'Are you sure you want to clear all data in this current section only?';
    if (window.confirm(confirmMsg)) {
      setCvData(prev => {
        const newData = { ...prev };
        switch (activeTab) {
          case 'personal':
            newData.personal = { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', avatarUrl: '' };
            break;
          case 'summary':
            newData.summary = '';
            break;
          case 'experience':
            newData.experiences = [];
            break;
          case 'education':
            newData.education = [];
            break;
          case 'skills':
            newData.skills = [];
            break;
          case 'languages':
            newData.languages = [];
            break;
          case 'hobbies':
            newData.hobbies = [];
            break;
          case 'theme':
            // Leave theme alone or reset to default
            newData.theme = { primaryColor: '#4f46e5', fontFamily: 'sans', template: 'modern' };
            break;
        }
        return newData;
      });
    }
  };`
);
fs.writeFileSync('src/App.tsx', code);
