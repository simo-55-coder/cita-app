import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Dismiss the static HTML fallback splash immediately once React is active
    const staticSplash = document.getElementById('pwa-splash');
    if (staticSplash) {
      staticSplash.remove();
    }

    // Keep the splash screen for 1100ms so the user sees the elegant branding,
    // then smoothly fade it out with zero flash or white glitch.
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1100);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="app-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#703ED1] via-[#6635C6] to-[#582BAE] text-white transition-opacity duration-500 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Decorative subtle ambient glowing backdrop */}
      <div className="absolute w-72 h-72 rounded-full bg-violet-400/15 blur-3xl pointer-events-none" />

      {/* Main Logo Container matching App identity */}
      <div className="relative flex flex-col items-center">
        {/* Animated App Icon Card */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md p-4 shadow-2xl shadow-violet-950/40 border border-white/20 flex items-center justify-center transition-transform duration-700 ease-out animate-[pulse_3s_ease-in-out_infinite]">
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-inner p-3.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full drop-shadow-md"
            >
              <path d="M14 7.5c-1-1.5-3-2.5-5.5-2.5-3.5 0-6.5 3-6.5 6.5s3 6.5 6.5 6.5c2.5 0 4.5-1 5.5-2.5" />
              <path d="M11 7l4.5 8.5L20 7" />
            </svg>
          </div>
        </div>

        {/* App Title */}
        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
          {t.appTitle || 'CVita'}
        </h1>

        {/* App Subtitle */}
        <p className="mt-1 text-xs sm:text-sm font-medium text-violet-200/90 tracking-wide text-center px-4">
          {t.appSubtitle || 'منشئ السيرة الذاتية PDF'}
        </p>

        {/* Elegant Minimal Loading Indicator */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-white/80 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
