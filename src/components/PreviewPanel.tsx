import React, { useState, useRef, useEffect } from 'react';
import { CVData } from '../types';
import { CVDocument } from './CVDocument';
import { AdModal } from './AdModal';
import { showRewardedAd } from '../lib/admob';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  CloudUpload,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PreviewPanelProps {
  data: CVData;
  onBackToEdit: () => void;
  onOpenDriveModal: () => void;
  isDriveConnected: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  data,
  onBackToEdit,
  onOpenDriveModal,
  isDriveConnected,
}) => {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [customZoom, setCustomZoom] = useState<number>(1);
  const [zoomMode, setZoomMode] = useState<'fit' | 'custom'>('fit');
  const [printStatus, setPrintStatus] = useState<{
    show: boolean;
    isError?: boolean;
    message?: string;
  } | null>(null);

  const [showAdModal, setShowAdModal] = useState(false);

  // Auto-dismiss success notification after 5 seconds
  useEffect(() => {
    if (printStatus?.show && !printStatus.isError) {
      const timer = window.setTimeout(() => {
        setPrintStatus(null);
      }, 5000);
      return () => window.clearTimeout(timer);
    }
  }, [printStatus]);

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

  // Direct browser action fallback: open in a new tab where iframe restrictions never apply
  const handleDirectFallback = () => {
    try {
      const newWin = window.open(window.location.href, '_blank');
      if (!newWin) {
        window.alert(t.previewControls.printIframeHelp);
      }
    } catch {
      window.alert(t.previewControls.printIframeHelp);
    }
  };

  // Direct download PDF handler using html2canvas-pro and jspdf (supports Tailwind 4 oklch colors)
    const handleDownloadPdf = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowAdModal(true);
  };

  const executeDownloadPdf = async () => {
    const safeName = (data.personal?.fullName || 'CV').trim();
    const filename = `${safeName.replace(/\s+/g, '_')}_CV.pdf`;

    setPrintStatus({
      show: true,
      isError: false,
      message: 'Preparing document (Ads help keep this app free)...',
    });

    // Display rewarded ad (fails gracefully and immediately proceeds on Web/Error)
    await showRewardedAd();

    setPrintStatus({
      show: true,
      isError: false,
      message: t.previewControls.preparingPrint || 'Generating PDF... Please wait.',
    });

    try {
      // Find the element to convert
      const element = document.getElementById('interactive-cv-preview');
      if (!element) {
        throw new Error('CV document not found.');
      }

      // Dynamically import libraries
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        
        windowWidth: 794,
        windowHeight: 1123,
        scrollY: 0,
        scrollX: 0,
        onclone: (doc: Document) => {
          const el = doc.getElementById('interactive-cv-preview');
          if (el) {
            // Force A4 width constraints (approx 210mm at 96dpi is 794px) but let height scale automatically
            el.style.width = '794px';
            el.style.maxWidth = '794px';
            el.style.minWidth = '794px';
            el.style.height = 'auto';
            el.style.minHeight = '1123px';
            el.style.maxHeight = 'none';
            el.style.transform = 'none';
            el.style.overflow = 'visible'; // Allow content to expand beyond a single A4 page smoothly
            
            // Remove shadows and borders for the PDF version
            el.classList.remove('shadow-xl', 'border', 'border-slate-200/90', 'select-none');
            
            // Ensure proper padding for A4 size (equivalent to p-8)
            el.style.padding = '40px';
            el.style.margin = '0';

            // Critical fix for Arabic: Force normal letter-spacing globally inside the clone
            // Tailwind's tracking classes (tracking-tight, etc.) break Arabic cursive joining
            const allElements = el.querySelectorAll('*');
            allElements.forEach((child) => {
              (child as HTMLElement).style.letterSpacing = 'normal';
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Convert generated PDF to Blob/File for Web Share API
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      let shared = false;
      
      // Try Web Share API first (Native Mobile / Supported Browsers)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: filename,
          });
          shared = true;
        } catch (shareErr: any) {
          // Ignore AbortError (user cancelled share), but log others
          if (shareErr.name !== 'AbortError') {
            console.error('Share API failed:', shareErr);
          } else {
            shared = true; // User cancelled, but the API worked. No need to trigger fallback download.
          }
        }
      }

      // Fallback: Standard Web Download
      if (!shared) {
        pdf.save(filename);
      }

      setPrintStatus({
        show: true,
        isError: false,
        message: shared ? 'PDF processed successfully!' : 'PDF downloaded successfully!',
      });
    } catch (err: any) {
      console.error('PDF generation failed:', err);
      setPrintStatus({
        show: true,
        isError: true,
        message: err?.message || 'Failed to generate PDF. Please try again.',
      });
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

        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80 shadow-xs">
          <button
            id="btn-preview-zoom-out"
            type="button"
            onClick={handleZoomOut}
            title={t.previewControls.zoomOut}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 transition-all cursor-pointer pointer-events-auto touch-manipulation"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-preview-fit"
            type="button"
            onClick={handleFit}
            className="px-2 py-0.5 text-[11px] font-bold text-violet-700 hover:text-violet-800 rounded-md transition-colors cursor-pointer pointer-events-auto touch-manipulation"
          >
            {zoomMode === 'fit' ? 'Fit' : `${Math.round(customZoom * 100)}%`}
          </button>
          <button
            id="btn-preview-zoom-in"
            type="button"
            onClick={handleZoomIn}
            title={t.previewControls.zoomIn}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 transition-all cursor-pointer pointer-events-auto touch-manipulation"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-preview-reset-fit"
            type="button"
            onClick={handleFit}
            title={t.previewControls.fitToScreen}
            className={`p-1.5 rounded-lg ml-0.5 transition-all cursor-pointer pointer-events-auto touch-manipulation ${
              zoomMode === 'fit' ? 'text-violet-700 bg-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        {/* Action Buttons: Download PDF & Print */}
        <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
          <button
            id="btn-preview-download"
            type="button"
            onClick={handleDownloadPdf}
            title={t.previewControls.downloadPdf}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-600 active:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 cursor-pointer pointer-events-auto touch-manipulation select-none active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.previewControls.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Direct Feedback Alert / Fallback Toast */}
      {printStatus?.show && (
        <div className="fixed top-14 inset-x-3 max-w-md mx-auto z-50 animate-fadeIn pointer-events-auto">
          <div
            className={`p-3 rounded-2xl shadow-xl border flex flex-col gap-2 backdrop-blur-md transition-all ${
              printStatus.isError
                ? 'bg-amber-50/95 border-amber-300 text-amber-900'
                : 'bg-violet-900/95 text-white border-violet-700/80'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {printStatus.isError ? (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-violet-300 shrink-0" />
                )}
                <p className="text-xs font-semibold leading-snug">{printStatus.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setPrintStatus(null)}
                className={`p-1 rounded-lg hover:bg-black/10 transition-colors ${
                  printStatus.isError ? 'text-amber-800' : 'text-violet-200'
                }`}
                title={t.previewControls.closeAlert}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct fallback trigger for iframe blocking */}
            <div className="flex items-center gap-2 pt-1 border-t border-black/10">
              <button
                type="button"
                onClick={handleDirectFallback}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-violet-600" />
                <span>{t.previewControls.openInNewTab}</span>
              </button>
              <span className="text-[11px] opacity-80 flex-1">
                {t.previewControls.printIframeHelp}
              </span>
            </div>
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
          style={customZoom !== 1 ? { transform: `scale(${customZoom})` } : undefined}
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
          className="flex-1 py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-violet-600/20 cursor-pointer pointer-events-auto active:scale-95 touch-manipulation"
          title={t.previewControls.downloadPdf}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="truncate">{t.previewControls.downloadPdf}</span>
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
