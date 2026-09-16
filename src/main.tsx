import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare const __APP_BUILD_TIME__: string;

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
  if (lastBuild && lastBuild !== __APP_BUILD_TIME__) {
    console.log('[CacheBust] New build detected:', __APP_BUILD_TIME__);
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
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
