import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// 1. تسجيل الـ Service Worker لتفعيل العمل بدون إنترنت تلقائياً وتحديث الكاش فورياً
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[CVita PWA] جاهز للعمل أوفلاين بالكامل بدون إنترنت');
  },
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      // التحقق الدوري من التحديثات كل 30 دقيقة
      setInterval(() => {
        registration.update();
      }, 30 * 60 * 1000);
    }
  },
});

// 2. استراتيجية التخزين المؤقت المباشرة (Cache-First Pre-caching) لغلاف التطبيق (HTML, CSS, JS) لمنع شاشة الأوفلاين في أندرويد/TWA
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', async () => {
    try {
      // التحقق من وجود تسجيل نشط أو تسجيل الـ Service Worker الاحتياطي
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length === 0) {
        try {
          await navigator.serviceWorker.register('./sw.js');
        } catch {
          await navigator.serviceWorker.register('./pwabuilder-sw.js');
        }
      }

      // تخزين مسار الصفحة الحالية والأصول الأساسية في CacheStorage فوراً
      if ('caches' in window) {
        const cache = await caches.open('cvita-offline-cache-v3');
        const urlsToWarm = [
          window.location.href,
          window.location.pathname,
          './',
          'index.html',
        ];
        await Promise.allSettled(
          urlsToWarm.map((url) =>
            fetch(url, { cache: 'no-cache' })
              .then((res) => {
                if (res.ok) return cache.put(url, res);
              })
              .catch(() => {})
          )
        );
      }
    } catch (err) {
      console.warn('[PWA] Cache initialization warning:', err);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


