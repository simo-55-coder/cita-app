import React, { useState, useRef } from 'react';
import { X, Share2, Star, Shield, FileText, ChevronRight, Check, Download, Upload, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CVData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onImportCV: (data: CVData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  cvData,
  onImportCV,
}) => {
  const { isRTL, lang, t } = useLanguage();
  const [activeContent, setActiveContent] = useState<'menu' | 'privacy' | 'terms'>('menu');
  const [shareFeedback, setShareFeedback] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'CVita - Mobile CV Builder',
          text: 'Check out CVita, the easiest way to build professional CVs right from your phone!',
          url: 'https://cvita.app',
        });
      } else {
        await navigator.clipboard.writeText('Check out CVita: https://cvita.app');
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } catch (err) {
      console.warn('Share failed', err);
    }
  };

  const handleRateUs = () => {
    window.open('https://play.google.com/store/apps/details?id=com.example.cvita', '_blank');
  };

  const handleExportJSON = () => {
    try {
      const jsonStr = JSON.stringify(cvData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = cvData.personal.fullName?.trim().replace(/\s+/g, '_') || 'cv';
      a.href = url;
      a.download = `${safeName}_backup.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setNotification({ type: 'success', message: isRTL ? 'تم تصدير ملف النسخة الاحتياطية بنجاح!' : 'Backup exported successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ type: 'error', message: isRTL ? 'حدث خطأ أثناء التصدير' : 'Export failed' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object' && parsed.personal && parsed.theme) {
          onImportCV(parsed);
          setNotification({ type: 'success', message: t.backup.importSuccess });
          setTimeout(() => {
            setNotification(null);
            onClose();
          }, 1500);
        } else {
          setNotification({ type: 'error', message: t.backup.importError });
          setTimeout(() => setNotification(null), 3500);
        }
      } catch (err) {
        setNotification({ type: 'error', message: t.backup.importError });
        setTimeout(() => setNotification(null), 3500);
      }
    };
    reader.readAsText(file);
    // Reset file input so user can re-import same file if needed
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <div 
        dir={isRTL ? 'rtl' : 'ltr'} 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200"
      >
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            {activeContent !== 'menu' && (
              <button 
                onClick={() => setActiveContent('menu')}
                className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-500 transition-colors"
              >
                <ChevronRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
              </button>
            )}
            <h2 className="text-sm font-bold text-slate-800">
              {activeContent === 'menu' && (isRTL ? 'الإعدادات والبيانات' : lang === 'fr' ? 'Paramètres & Données' : 'Settings & Data')}
              {activeContent === 'privacy' && (isRTL ? 'سياسة الخصوصية' : lang === 'fr' ? 'Confidentialité' : 'Privacy Policy')}
              {activeContent === 'terms' && (isRTL ? 'شروط الخدمة' : lang === 'fr' ? 'Conditions' : 'Terms of Service')}
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveContent('menu');
              setNotification(null);
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-200/50 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
                : 'bg-rose-50 text-rose-800 border-b border-rose-100'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Content Area */}
        <div className="p-2 overflow-y-auto">
          {activeContent === 'menu' && (
            <div className="flex flex-col gap-1">
              {/* Backup & Restore Group */}
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t.backup.title}
              </div>

              <SettingItem 
                icon={<Download className="w-4 h-4 text-violet-600" />}
                title={t.backup.exportBtn}
                subtitle={t.backup.exportDesc}
                onClick={handleExportJSON}
              />
              <SettingItem 
                icon={<Upload className="w-4 h-4 text-violet-600" />}
                title={t.backup.importBtn}
                subtitle={t.backup.importDesc}
                onClick={handleTriggerImport}
              />

              <div className="my-1.5 border-t border-slate-100 mx-2" />

              {/* General Group */}
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isRTL ? 'عام' : 'General'}
              </div>

              <SettingItem 
                icon={<Share2 className="w-4 h-4" />}
                title={isRTL ? 'مشاركة التطبيق' : lang === 'fr' ? 'Partager' : 'Share App'}
                onClick={handleShare}
                rightElement={shareFeedback ? <Check className="w-4 h-4 text-green-500" /> : undefined}
              />
              <SettingItem 
                icon={<Star className="w-4 h-4" />}
                title={isRTL ? 'قيّمنا' : lang === 'fr' ? 'Évaluez-nous' : 'Rate Us'}
                onClick={handleRateUs}
              />
              <div className="my-1 border-t border-slate-100 mx-2" />
              <SettingItem 
                icon={<Shield className="w-4 h-4" />}
                title={isRTL ? 'سياسة الخصوصية' : lang === 'fr' ? 'Confidentialité' : 'Privacy Policy'}
                onClick={() => setActiveContent('privacy')}
              />
              <SettingItem 
                icon={<FileText className="w-4 h-4" />}
                title={isRTL ? 'شروط الخدمة' : lang === 'fr' ? 'Conditions' : 'Terms of Service'}
                onClick={() => setActiveContent('terms')}
              />
            </div>
          )}

          {activeContent === 'privacy' && (
            <div className="p-3 text-sm text-slate-600 leading-relaxed space-y-3 font-medium">
              <p>
                <strong>Data Collection:</strong> We use Google AdMob to display advertisements. AdMob may collect and use data such as your device IP address and advertising ID to provide relevant ads.
              </p>
              <p>
                <strong>Your Data:</strong> All CV data you enter remains completely private and is stored locally on your device unless you explicitly choose to back it up to your Google Drive or export as JSON.
              </p>
            </div>
          )}

          {activeContent === 'terms' && (
            <div className="p-3 text-sm text-slate-600 leading-relaxed space-y-3 font-medium">
              <p>
                <strong>Usage:</strong> By using CVita, you agree to these basic terms. This application is provided "as is" without warranty.
              </p>
              <p>
                <strong>Content:</strong> You are solely responsible for the accuracy and legality of the information you place into your CV.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeContent === 'menu' && (
          <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-center border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">
              CVITA v1.1.0 • JSON BACKUP READY
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

function SettingItem({
  icon,
  title,
  subtitle,
  onClick,
  rightElement,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  rightElement?: React.ReactNode;
}) {
  const { isRTL } = useLanguage();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-violet-50/80 text-slate-700 hover:text-violet-800 transition-colors group text-start"
    >
      <div className="flex items-center gap-3 min-w-0 pr-1">
        <div className="text-slate-400 group-hover:text-violet-600 transition-colors shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <span className="text-xs font-bold block truncate">{title}</span>
          {subtitle && (
            <span className="text-[10px] text-slate-400 font-normal block truncate mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {rightElement ? (
        rightElement
      ) : (
        <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-violet-400 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
      )}
    </button>
  );
}
