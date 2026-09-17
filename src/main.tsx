import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BRAND_ASSETS } from './config/brandAssets';

declare const __APP_BUILD_TIME__: string;

// Expose BRAND_ASSETS globally on window to guarantee backward compatibility for any cached chunks
if (typeof window !== 'undefined') {
  (window as any).BRAND_ASSETS = BRAND_ASSETS;
}

// Global error handler for stale chunk recovery
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message && (event.message.includes('BRAND_ASSETS') || event.message.includes('Loading chunk') || event.message.includes('dynamically imported module'))) {
      console.warn('[CacheBust] Stale chunk error detected, force reloading page:', event.message);
      if (!sessionStorage.getItem('soltaoverbo_reloaded_for_error')) {
        sessionStorage.setItem('soltaoverbo_reloaded_for_error', 'true');
        window.location.reload();
      }
    }
  });
}

// Purge any active PWA Service Workers and browser CacheStorage
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
  if ('caches' in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });
  }
}

// Automatic cache bust detection on build update
try {
  const lastBuild = localStorage.getItem('soltaoverbo_build_time');
  if (lastBuild !== __APP_BUILD_TIME__) {
    console.log('[CacheBust] New build detected:', __APP_BUILD_TIME__);
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
    localStorage.removeItem('soltaoverbo_cms_data_cache');
  }
  localStorage.setItem('soltaoverbo_build_time', __APP_BUILD_TIME__);
} catch (e) {
  // Ignore restricted storage errors
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
