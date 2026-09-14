import re

file_path = 'src/components/TemplateSelector.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure useState and useEffect are imported
if "import React" in content and "useState" not in content:
    content = content.replace("import React", "import React, { useState, useEffect }")
elif "useState" not in content:
    content = content.replace("import {", "import { useState, useEffect, ")

# Inject states inside TemplateSelector
state_injection = """  const [unlockedTemplates, setUnlockedTemplates] = useState<string[]>([]);
  const [adModalTemplate, setAdModalTemplate] = useState<TemplateId | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('unlocked_premium_templates');
      if (stored) {
        setUnlockedTemplates(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load unlocked templates', e);
    }
  }, []);

  const handleSelectTemplateClick = (tmpl: TemplateItemDef) => {
    if (tmpl.isPremium && !unlockedTemplates.includes(tmpl.id)) {
      setAdModalTemplate(tmpl.id);
    } else {
      onSelectTemplate(tmpl.id);
    }
  };

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    // Simulate watching a rewarded ad (e.g., 2 seconds)
    setTimeout(() => {
      setIsWatchingAd(false);
      if (adModalTemplate) {
        const newUnlocked = [...unlockedTemplates, adModalTemplate];
        setUnlockedTemplates(newUnlocked);
        try {
          localStorage.setItem('unlocked_premium_templates', JSON.stringify(newUnlocked));
        } catch(e) {}
        onSelectTemplate(adModalTemplate);
        setAdModalTemplate(null);
      }
    }, 2000);
  };
"""

content = content.replace(
    "const { t, isRTL } = useLanguage();",
    "const { t, isRTL } = useLanguage();\n" + state_injection
)

# Modify the template item rendering
# find onClick={() => onSelectTemplate(tmpl.id)}
content = content.replace("onClick={() => onSelectTemplate(tmpl.id)}", "onClick={() => handleSelectTemplateClick(tmpl)}")
content = content.replace("onClick={(e) => {\n                  e.stopPropagation();\n                  onSelectTemplate(tmpl.id);\n                }}", "onClick={(e) => {\n                  e.stopPropagation();\n                  handleSelectTemplateClick(tmpl);\n                }}")

# We need to change the select button text for locked templates.
# Find: <span>{t.templates.selectButton}</span>
# Replace with: <>{tmpl.isPremium && !unlockedTemplates.includes(tmpl.id) ? <><Lock className="w-3.5 h-3.5 mr-1" /><span>{isRTL ? 'شاهد إعلاناً للفتح' : 'Watch Ad to Unlock'}</span></> : <span>{t.templates.selectButton}</span>}</>
content = re.sub(
    r"<span>\{t\.templates\.selectButton\}</span>",
    r"<>{tmpl.isPremium && !unlockedTemplates.includes(tmpl.id) ? <span className=\"flex items-center gap-1\"><Lock className=\"w-3 h-3\" /><span>{isRTL ? 'فتح القالب (إعلان)' : 'Unlock (Ad)'}</span></span> : <span>{t.templates.selectButton}</span>}</>",
    content
)

# And add the Ad Modal at the end of the return statement before the final </div>
ad_modal_jsx = """
      {adModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {isRTL ? 'قالب مميز' : 'Premium Template'}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {isRTL
                ? 'شاهد إعلاناً قصيراً لفتح هذا القالب المميز مجاناً واستخدامه في سيرتك الذاتية.'
                : 'Watch a short rewarded ad to unlock this premium template for free and use it for your CV.'}
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleWatchAd}
                disabled={isWatchingAd}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isWatchingAd ? (
                  <span className="animate-pulse">{isRTL ? 'جاري العرض...' : 'Watching...'}</span>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    <span>{isRTL ? 'مشاهدة الإعلان' : 'Watch Ad Now'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setAdModalTemplate(null)}
                disabled={isWatchingAd}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("    </div>\n  );\n};", ad_modal_jsx + "\n    </div>\n  );\n};")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

