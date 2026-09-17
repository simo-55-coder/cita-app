import React, { useState, useRef, useEffect } from 'react';
import { CVData, CVTheme } from '../types';
import { CVDocument } from './CVDocument';
import { AdModal } from './AdModal';
import { showRewardedAd } from '../lib/admob';
import { CVStrengthMeter } from './CVStrengthMeter';
import { CustomizationToolbar } from './CustomizationToolbar';
import {
  Share2,
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

  const [printStatus, setPrintStatus] = useState<{
    show: boolean;
    isError?: boolean;
    message?: string;
  } | null>(null);

  const [generatedPdf, setGeneratedPdf] = useState<{ file: File; filename: string; objectUrl: string } | null>(null);

  const [showAdModal, setShowAdModal] = useState(false);

  // Auto-dismiss success notification after 5 seconds
  useEffect(() => {
    if (printStatus?.show && !printStatus.isError && !generatedPdf) {
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
    setGeneratedPdf(null);
    const safeName = (data.personal?.fullName || 'CV').trim();
    const filename = `${safeName.replace(/\s+/g, '_')}_CV.pdf`;

    setPrintStatus({
      show: true,
      isError: false,
      message: 'Preparing document (Ads help keep this app free)...',
    });

    await showRewardedAd();

    setPrintStatus({
      show: true,
      isError: false,
      message: t.previewControls.preparingPrint || 'Generating PDF... Please wait.',
    });

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

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedPdf({ file: pdfFile, filename, objectUrl });

      setPrintStatus({
        show: true,
        isError: false,
        message: 'PDF generated successfully! Choose an action below:',
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

        {/* Readiness/Strength Indicator replacing Zoom controls */}
        <div className="flex-1 flex justify-center">
          <CVStrengthMeter data={data} variant="mini" />
        </div>

        {/* Action Buttons: Download PDF */}
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

      {/* Live Customization Toolbar (Font Size, Spacing & Smart Auto-Fill) */}
      <CustomizationToolbar theme={data.theme} onUpdateTheme={handleUpdateTheme} />

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

            {/* Direct fallback trigger for iframe blocking or Action buttons for generated PDF */}
            <div className="flex flex-col gap-2 pt-1 border-t border-black/10">
              
              {generatedPdf ? (
                <div className="flex flex-wrap items-center gap-2">
                  {navigator.canShare && navigator.canShare({ files: [generatedPdf.file] }) && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.share({
                            files: [generatedPdf.file],
                            title: generatedPdf.filename,
                          });
                          setPrintStatus(null);
                        } catch (err: any) {
                          if (err.name !== 'AbortError') console.error('Share error:', err);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{(t.previewControls as Record<string, string>).share || (isRTL ? 'مشاركة PDF' : 'Share PDF')}</span>
                    </button>
                  )}
                  <a
                    href={generatedPdf.objectUrl}
                    download={generatedPdf.filename}
                    onClick={() => setPrintStatus(null)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.previewControls.downloadPdf || 'Download'}</span>
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDirectFallback}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-violet-600" />
                    <span>{t.previewControls.openInNewTab}</span>
                  </button>
                  <span className="text-[11px] opacity-80 flex-1 leading-tight">
                    {t.previewControls.printIframeHelp}
                  </span>
                </div>
              )}
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
