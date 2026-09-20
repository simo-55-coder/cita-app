import React, { useState, useRef, useEffect } from 'react';
import { CVData, CVTheme } from '../types';
import { CVDocument } from './CVDocument';
import { AdModal } from './AdModal';
import { showRewardedAd } from '../lib/admob';
import { CVStrengthMeter } from './CVStrengthMeter';
import { CustomizationToolbar } from './CustomizationToolbar';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import {
  Download,
  CloudUpload,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PreviewPanelProps {
  data: CVData;
  onUpdateCV?: React.Dispatch<React.SetStateAction<CVData>>;
  onBackToEdit: () => void;
  onOpenDriveModal: () => void;
  isDriveConnected: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  data,
  onUpdateCV,
  onBackToEdit,
  onOpenDriveModal,
  isDriveConnected,
}) => {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [customZoom, setCustomZoom] = useState<number>(1);
  const [zoomMode, setZoomMode] = useState<'fit' | 'custom'>('fit');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateTheme = (updates: Partial<CVTheme>) => {
    if (onUpdateCV) {
      onUpdateCV((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          ...updates,
        },
      }));
    }
  };

  const [fitScale, setFitScale] = useState<number>(1);
  const CV_WIDTH = 794; // Fixed A4 width

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateScale = () => {
      if (containerRef.current) {
        // Add some padding (e.g., 32px total) to the available width
        const availableWidth = containerRef.current.clientWidth - 32;
        const newScale = Math.min(availableWidth / CV_WIDTH, 1);
        setFitScale(newScale);
      }
    };

    calculateScale();

    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });

    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, []);

  const effectiveZoom = zoomMode === 'fit' ? fitScale : customZoom;

  const [showAdModal, setShowAdModal] = useState(false);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = window.setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => window.clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleZoomIn = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.min(Number((prev + 0.1).toFixed(2)), 1.8));
  };

  const handleZoomOut = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.max(Number((prev - 0.1).toFixed(2)), 0.5));
  };

  const handleFit = () => {
    setZoomMode('fit');
    setCustomZoom(1);
  };

  // Direct download PDF handler with online/offline detection
  const handleDownloadPdf = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isGenerating) return;

    // Check if device is connected to the internet
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (isOnline) {
      // Show rewarded ad when online
      setShowAdModal(true);
    } else {
      // Allow direct download without showing ad when offline
      executeDownloadPdf(false);
    }
  };

  const executeDownloadPdf = async (shouldShowAd: boolean = true) => {
    setIsGenerating(true);
    setErrorMessage(null);

    const safeName = (data.personal?.fullName || 'CV').trim();
    const filename = `${safeName.replace(/\s+/g, '_')}_CV.pdf`;

    if (shouldShowAd && typeof navigator !== 'undefined' && navigator.onLine) {
      await showRewardedAd();
    }

    try {
      const element = document.getElementById('interactive-cv-preview');
      if (!element) {
        throw new Error('CV document not found.');
      }

      const htmlToImage = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      // Temporarily prepare element for pristine high-fidelity capture
      const originalTransform = element.style.transform;
      const originalBoxShadow = element.style.boxShadow;
      const hadShadow = element.classList.contains('shadow-xl') || element.classList.contains('shadow-sm');
      const hadBorder = element.classList.contains('border');
      
      element.style.transform = 'none';
      element.style.boxShadow = 'none';
      element.classList.remove('shadow-xl', 'shadow-sm', 'border');

      await new Promise(resolve => setTimeout(resolve, 250));

      const isDarkTemplate = data.theme?.template === 'corporate-elite';
      const bgColor = isDarkTemplate ? '#020617' : '#ffffff';

      const imgData = await htmlToImage.toJpeg(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: bgColor,
        style: {
          transform: 'none',
          boxShadow: 'none',
          margin: '0',
        }
      });

      // Restore element
      element.style.transform = originalTransform;
      element.style.boxShadow = originalBoxShadow;
      if (hadShadow) element.classList.add('shadow-xl');
      if (hadBorder) element.classList.add('border');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 1) { // 1mm threshold to prevent blank pages
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate base64 data for Capacitor Native Filesystem & Share
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      // 1. Native Capacitor (Android APK/AAB for Google Play Store)
      if (Capacitor.isNativePlatform()) {
        try {
          const writeRes = await Filesystem.writeFile({
            path: filename,
            data: pdfBase64,
            directory: Directory.Cache,
          });

          await Share.share({
            title: filename,
            text: safeName,
            url: writeRes.uri,
            dialogTitle: isRTL ? 'مشاركة وحفظ السيرة الذاتية PDF' : 'Share / Save CV PDF',
          });
          return;
        } catch (nativeShareErr: any) {
          console.warn('Native Capacitor share failed, falling back:', nativeShareErr);
        }
      }

      // 2. Web Share API (Mobile Browsers like Chrome / Safari / Brave)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: filename,
            text: safeName,
          });
          return;
        } catch (webShareErr: any) {
          if (webShareErr.name === 'AbortError') {
            // User cancelled the share dialog
            return;
          }
          console.warn('Web Share failed, falling back to download:', webShareErr);
        }
      }

      // 3. Fallback direct browser download for desktop browsers
      pdf.save(filename);
    } catch (err: any) {
      console.error('PDF generation or sharing failed:', err);
      setErrorMessage(err?.message || 'Failed to generate/share PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="w-full max-w-full flex flex-col flex-1 overflow-x-hidden relative">
      {/* Top Floating Control Toolbar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 py-2.5 flex items-center justify-between gap-2 shadow-xs pointer-events-auto">
        <button
          id="btn-preview-back"
          type="button"
          onClick={onBackToEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-xs font-semibold text-slate-700 transition-colors shadow-xs shrink-0 cursor-pointer pointer-events-auto touch-manipulation active:scale-95"
        >
          <BackIcon className="w-3.5 h-3.5" />
          <span>{t.previewControls.backToEditor}</span>
        </button>

        {/* Readiness/Strength Indicator replacing Zoom controls */}
        <div className="flex-1 flex justify-center">
          <CVStrengthMeter data={data} variant="mini" />
        </div>

        {/* Action Buttons: Download PDF (triggers native share / file save) */}
        <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
          <button
            id="btn-preview-download"
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            title={t.previewControls.downloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-600 active:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 cursor-pointer pointer-events-auto touch-manipulation select-none active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isGenerating ? t.previewControls.generatingPdf : t.previewControls.downloadPdf}
            </span>
          </button>
        </div>
      </div>

      {/* Live Customization Toolbar (Font Size, Spacing & Smart Auto-Fill) */}
      <CustomizationToolbar theme={data.theme} onUpdateTheme={handleUpdateTheme} />

      {/* Error Alert Toast (if any) */}
      {errorMessage && (
        <div className="fixed top-14 inset-x-3 max-w-md mx-auto z-50 animate-fadeIn pointer-events-auto">
          <div className="p-3 rounded-2xl shadow-xl border flex items-center justify-between gap-2 bg-amber-50/95 border-amber-300 text-amber-900 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs font-semibold leading-snug">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg hover:bg-black/10 text-amber-800 transition-colors"
              title={t.previewControls.closeAlert}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Preview Container with dynamic responsiveness */}
      <div
        ref={containerRef}
        className="w-full flex-1 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden min-h-[360px] bg-slate-100/60 pb-32 md:pb-40"
      >
        {/* Dynamic centered paper container */}
        <div
          className="w-full flex justify-center transition-transform duration-150 ease-out origin-top"
          style={{ transform: `scale(${effectiveZoom})` }}
        >
          <CVDocument data={data} id="interactive-cv-preview" />
        </div>
      </div>

      {/* Bottom Floating Actions Dock for Mobile */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-50 pointer-events-auto select-none touch-manipulation bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-2">
        <button
          id="btn-dock-edit"
          type="button"
          onClick={onBackToEdit}
          className="flex-1 py-2.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer pointer-events-auto active:scale-95 touch-manipulation"
        >
          <BackIcon className="w-3.5 h-3.5" />
          <span className="truncate">{t.previewControls.backToEditor}</span>
        </button>

        <button
          id="btn-dock-drive"
          type="button"
          onClick={onOpenDriveModal}
          className="flex-1 py-2.5 px-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-xs font-semibold text-violet-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer pointer-events-auto active:scale-95 touch-manipulation"
        >
          <CloudUpload className="w-3.5 h-3.5 text-violet-600" />
          <span className="truncate">{isDriveConnected ? t.drive.backupToDrive : t.drive.connectDrive}</span>
        </button>

        <button
          id="btn-dock-download"
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="flex-1 py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-violet-600/20 cursor-pointer pointer-events-auto active:scale-95 touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
          title={t.previewControls.downloadPdf}
        >
          {isGenerating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span className="truncate">
            {isGenerating ? t.previewControls.generatingPdf : t.previewControls.downloadPdf}
          </span>
        </button>
      </div>

      <AdModal 
        isOpen={showAdModal} 
        onClose={() => setShowAdModal(false)} 
        onRewardGranted={() => {
          setShowAdModal(false);
          // Small timeout to allow modal animation to clear before blocking main thread
          setTimeout(() => {
            executeDownloadPdf();
          }, 300);
        }} 
        title={t.previewControls.downloadPdf || "Watch Ad to Download"}
        description={isRTL ? "شاهد هذا الإعلان القصير لدعمنا قبل تحميل سيرتك الذاتية." : "Support CVita by watching a quick sponsor message before downloading your PDF."}
      />
    </div>
  );
};
