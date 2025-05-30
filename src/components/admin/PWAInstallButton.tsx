
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
      
      // Check if running as PWA on mobile
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    // Check if PWA installation is supported
    const checkIfSupported = () => {
      if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        setIsSupported(true);
      }
    };

    checkIfInstalled();
    checkIfSupported();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsSupported(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast({
        title: "App Installata",
        description: "La dashboard admin è ora disponibile come app!",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        toast({
          title: "Installazione avviata",
          description: "L'app verrà installata a breve...",
        });
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during PWA installation:', error);
      toast({
        title: "Errore installazione",
        description: "Si è verificato un errore durante l'installazione.",
        variant: "destructive",
      });
    }
  };

  // Don't show button if already installed or not supported
  if (isInstalled) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Check className="h-4 w-4" />
        App Installata
      </Button>
    );
  }

  if (!isSupported || !deferredPrompt) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleInstallClick}
      className="gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Installa App</span>
      <Smartphone className="h-4 w-4 sm:hidden" />
    </Button>
  );
};

export default PWAInstallButton;
