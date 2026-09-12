import React, { useState } from 'react';
import { X, Share2, Star, Shield, FileText, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isRTL, lang } = useLanguage();
  const [activeContent, setActiveContent] = useState<'menu' | 'privacy' | 'terms'>('menu');
  const [shareFeedback, setShareFeedback] = useState(false);

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
        // Fallback copy to clipboard
        await navigator.clipboard.writeText('Check out CVita: https://cvita.app');
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } catch (err) {
      console.warn('Share failed', err);
    }
  };

  const handleRateUs = () => {
    // Placeholder for Play Store link
    window.open('https://play.google.com/store/apps/details?id=com.example.cvita', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
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
              {activeContent === 'menu' && (isRTL ? 'الإعدادات' : lang === 'fr' ? 'Paramètres' : 'Settings')}
              {activeContent === 'privacy' && (isRTL ? 'سياسة الخصوصية' : lang === 'fr' ? 'Confidentialité' : 'Privacy Policy')}
              {activeContent === 'terms' && (isRTL ? 'شروط الخدمة' : lang === 'fr' ? 'Conditions' : 'Terms of Service')}
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveContent('menu');
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-200/50 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-2 overflow-y-auto">
          {activeContent === 'menu' && (
            <div className="flex flex-col gap-1">
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
                <strong>Your Data:</strong> All CV data you enter remains completely private and is stored locally on your device unless you explicitly choose to back it up to your Google Drive.
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
          <div className="px-4 py-3 bg-slate-50 flex items-center justify-center border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">
              VERSION 1.0.0
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

function SettingItem({ icon, title, onClick, rightElement }: { icon: React.ReactNode, title: string, onClick: () => void, rightElement?: React.ReactNode }) {
  const { isRTL } = useLanguage();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-violet-50 text-slate-700 hover:text-violet-700 transition-colors group text-left"
    >
      <div className="flex items-center gap-3">
        <div className="text-slate-400 group-hover:text-violet-500 transition-colors">
          {icon}
        </div>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      {rightElement ? (
        rightElement
      ) : (
        <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-violet-400 ${isRTL ? 'rotate-180' : ''}`} />
      )}
    </button>
  );
}
