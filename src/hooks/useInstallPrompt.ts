import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsInstalled(isStandalone);

    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (!user || isInstalled) {
      return;
    }

    const checkIfShouldShow = async () => {
      try {
        const { data, error } = await supabase
          .from('users_profiles')
          .select('pwa_install_dismissed')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking PWA preference:', error);
          return;
        }

        if (!data?.pwa_install_dismissed) {
          setTimeout(() => {
            setShowPrompt(true);
          }, 2500);
        }
      } catch (error) {
        console.error('Error checking PWA preference:', error);
      }
    };

    checkIfShouldShow();
  }, [user, isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowPrompt(false);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during install:', error);
    }
  };

  const handleDismiss = async (permanent: boolean) => {
    setShowPrompt(false);

    if (permanent && user) {
      try {
        const { error } = await supabase
          .from('users_profiles')
          .update({
            pwa_install_dismissed: true,
            pwa_install_dismissed_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating PWA preference:', error);
        }
      } catch (error) {
        console.error('Error updating PWA preference:', error);
      }
    }
  };

  const triggerInstallPrompt = () => {
    if (!isInstalled) {
      setShowPrompt(true);
    }
  };

  return {
    showPrompt,
    isIOS,
    isAndroid,
    isInstalled,
    handleInstall,
    handleDismiss,
    triggerInstallPrompt
  };
}
