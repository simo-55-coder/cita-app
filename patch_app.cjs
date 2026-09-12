const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateHook = `const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);`;
const stateHookNew = `const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);`;

code = code.replace(stateHook, stateHookNew);

const handleReset = `  const handleResetSample = () => {
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
  };`;

const handleResetNew = `  const handleResetSample = () => {
    setShowClearConfirm(true);
  };

  const confirmResetSection = () => {
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
          newData.theme = { primaryColor: '#4f46e5', fontFamily: 'sans', template: 'modern' };
          break;
      }
      return newData;
    });
    setShowClearConfirm(false);
  };`;

code = code.replace(handleReset, handleResetNew);

const renderJSX = `        {/* Modals & Overlays */}`;
const renderJSXNew = `        {/* Modals & Overlays */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {isRTL ? 'مسح القسم' : lang === 'fr' ? 'Effacer la section' : 'Clear Section'}
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                {isRTL
                  ? 'هل أنت متأكد من مسح جميع البيانات في هذا القسم الحالي فقط؟'
                  : lang === 'fr'
                  ? 'Voulez-vous vraiment effacer toutes les données de cette section uniquement ?'
                  : 'Are you sure you want to clear all data in this current section only?'}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {isRTL ? 'إلغاء' : lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={confirmResetSection}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
                >
                  {isRTL ? 'مسح' : lang === 'fr' ? 'Effacer' : 'Clear'}
                </button>
              </div>
            </div>
          </div>
        )}`;

if (code.includes(renderJSX)) {
  code = code.replace(renderJSX, renderJSXNew);
} else {
  // If not found, insert before <GoogleDriveModal
  const alternativeRender = `<GoogleDriveModal`;
  if (code.includes(alternativeRender)) {
    code = code.replace(alternativeRender, renderJSXNew.replace('        {/* Modals & Overlays */}', '') + '\\n        <GoogleDriveModal');
  } else {
     console.log("Could not find insertion point for modal");
  }
}

fs.writeFileSync('src/App.tsx', code);
console.log("Success");
