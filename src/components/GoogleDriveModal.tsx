import React, { useState, useEffect } from 'react';
import { CVData, DriveFileItem } from '../types';
import {
  signInWithGoogleDrive,
  signOutGoogle,
  uploadCVToGoogleDrive,
  listDriveCVFiles,
  downloadDriveCV,
} from '../services/googleDrive';
import { User } from 'firebase/auth';
import { X, Cloud, CloudUpload, RefreshCw, CheckCircle2, AlertCircle, FileText, ExternalLink, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCV: CVData;
  onLoadCV: (loaded: CVData) => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  currentCV,
  onLoadCV,
  currentUser,
  onUserChange,
}) => {
  const { t, isRTL } = useLanguage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadDriveFiles();
    }
  }, [isOpen, currentUser]);

  const loadDriveFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const files = await listDriveCVFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const result = await signInWithGoogleDrive();
      onUserChange(result.user);
      setStatusMessage({ type: 'success', text: t.drive.connectedSuccess });
      const files = await listDriveCVFiles();
      setDriveFiles(files);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Google Drive connection failed. Please try again.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutGoogle();
      onUserChange(null);
      setDriveFiles([]);
      setStatusMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setStatusMessage(null);
    try {
      const res = await uploadCVToGoogleDrive(currentCV);
      setStatusMessage({
        type: 'success',
        text: `${t.drive.backupSuccess} (${res.name})`,
      });
      await loadDriveFiles();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || t.drive.backupFailed,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRestore = async (fileId: string) => {
    try {
      setIsLoadingFiles(true);
      const loaded = await downloadDriveCV(fileId);
      if (loaded && loaded.personal) {
        onLoadCV(loaded);
        setStatusMessage({ type: 'success', text: t.drive.restoreSuccess });
        setTimeout(() => onClose(), 1200);
      } else {
        throw new Error('Invalid CV file format');
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Could not restore this file.',
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn ${
        isRTL ? 'font-arabic' : ''
      }`}
    >
      <div
        className="w-full max-w-lg bg-white border border-slate-200/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.drive.title}</h3>
              <p className="text-xs text-slate-500">{t.drive.subtitle}</p>
            </div>
          </div>

          <button
            id="btn-close-drive-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Status Message banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {!currentUser ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 mx-auto flex items-center justify-center">
                <CloudUpload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.drive.connectDrive}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  {t.drive.description}
                </p>
              </div>

              {/* Official styled Google Sign In Button */}
              <div className="pt-2 flex justify-center">
                <button
                  id="btn-google-sign-in"
                  type="button"
                  disabled={isSigningIn}
                  onClick={handleSignIn}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isSigningIn ? t.drive.signingIn : t.drive.signInGoogle}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* User Account Info Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-violet-400"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.displayName || 'Google Account'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  title={t.drive.signOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Current CV Button */}
              <button
                id="btn-upload-cv-to-drive"
                type="button"
                disabled={isUploading}
                onClick={handleUpload}
                className="w-full py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CloudUpload className="w-4 h-4" />
                )}
                <span>{isUploading ? t.drive.uploading : t.drive.saveCurrent}</span>
              </button>

              {/* Saved Backups on Google Drive */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {t.drive.backupsListTitle} ({driveFiles.length})
                  </span>
                  <button
                    type="button"
                    onClick={loadDriveFiles}
                    disabled={isLoadingFiles}
                    className="text-[11px] text-violet-600 hover:text-violet-700 flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                    <span>{t.drive.refresh}</span>
                  </button>
                </div>

                {isLoadingFiles ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-slate-400" />
                    {t.drive.fetchingFiles}
                  </div>
                ) : driveFiles.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-3 text-center bg-slate-50 rounded-xl border border-slate-200">
                    {t.drive.noBackups}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="min-w-0 flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-violet-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {file.name}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              {new Date(file.modifiedTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              title="Open in Drive"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRestore(file.id)}
                            className="px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 text-[11px] font-semibold transition-colors"
                          >
                            {t.drive.restore}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
