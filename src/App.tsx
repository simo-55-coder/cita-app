/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CVData, WizardTabKey } from './types';
import { getEmptyCV } from './data/defaultCV';
import { Header } from './components/Header';
import { Wizard } from './components/Wizard';
import { PreviewPanel } from './components/PreviewPanel';
import { CVDocument } from './components/CVDocument';
import { initAdMob, showBannerAd } from "./lib/admob";
import { Capacitor } from '@capacitor/core';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { SettingsModal } from './components/SettingsModal';
import { initAuth } from './services/googleDrive';
import { User } from 'firebase/auth';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const STORAGE_KEY = 'mobile_cv_builder_data_v2';

function CVBuilderApp() {
  const { lang, t, isRTL } = useLanguage();

  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Hydrate state from localStorage for offline persistence
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to read from localStorage', e);
    }
    // Fallback to empty data corresponding to the user's current locale
    return getEmptyCV(lang);
  });

  const [activeTab, setActiveTab] = useState<WizardTabKey>('personal');
  const [viewMode, setViewMode] = useState<'wizard' | 'preview'>('wizard');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Auto-save local draft
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [cvData]);

  // Initialize AdMob on Mount
  useEffect(() => {
    initAdMob().then(() => showBannerAd());
  }, []);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleUpdateCV = (updater: (prev: CVData) => CVData) => {
    setCvData((prev) => {
      const next = updater(prev);
      return { ...next, updatedAt: new Date().toISOString() };
    });
  };

  const handleResetSample = () => {
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
  };

  const handleLoadCV = (loaded: CVData) => {
    setCvData(loaded);
  };

  return (
    <>
      {/* Primary Interactive Screen UI (hidden automatically during printing) */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`no-print w-full max-w-full min-h-screen bg-slate-100/90 text-slate-800 flex flex-col items-center overflow-x-hidden ${
          isRTL ? 'font-arabic' : ''
        }`}
      >
        {/* Mobile-Centric Frame Constraint for tablets and desktops, while 100% full-width on smartphones */}
        <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col border-x border-slate-200/80 shadow-xl relative overflow-x-hidden">
          
          {/* STICKY TOP CONTAINER (Header + AdMob Banner Space) */}
          <div className="sticky top-0 z-40 w-full flex flex-col bg-white/95 backdrop-blur-md">
            {/* Top App Bar Header with language switcher */}
            <Header
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode((prev) => (prev === 'wizard' ? 'preview' : 'wizard'))}
              onOpenDriveModal={() => setIsDriveModalOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              currentUser={currentUser}
              onResetSample={handleResetSample}
            />

            {/* AdMob Banner Reservation Space (Visible placeholder in Web, empty space in Native) */}
            <div className="w-full h-[50px] shrink-0 bg-slate-100/80 flex items-center justify-center border-b border-slate-200/80">
              {Capacitor.getPlatform() === 'web' && (
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Advertisement (AdMob Banner)</span>
              )}
            </div>
          </div>

          {/* Dynamic View: Wizard Editor vs Live Scaled Preview */}
          <main className="w-full max-w-full flex-1 flex flex-col overflow-x-hidden">
            {viewMode === 'wizard' ? (
              <Wizard
                data={cvData}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onUpdateCV={handleUpdateCV}
                onOpenPreview={() => setViewMode('preview')}
              />
            ) : (
              <PreviewPanel
                data={cvData}
                onBackToEdit={() => setViewMode('wizard')}
                onOpenDriveModal={() => setIsDriveModalOpen(true)}
                isDriveConnected={!!currentUser}
              />
            )}
          </main>

          {/* Google Drive Integration Modal */}
          
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
        )}
        <GoogleDriveModal
            isOpen={isDriveModalOpen}
            onClose={() => setIsDriveModalOpen(false)}
            currentCV={cvData}
            onLoadCV={handleLoadCV}
            currentUser={currentUser}
            onUserChange={setCurrentUser}
          />
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      </div>

      {/* Pure Print-Only A4 Document Root (Zero extraneous UI, strict A4 dimensions) */}
      <div id="print-cv-root" className="hidden print:block w-full">
        <CVDocument data={cvData} id="print-cv-document" isPrint={true} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CVBuilderApp />
    </LanguageProvider>
  );
}
