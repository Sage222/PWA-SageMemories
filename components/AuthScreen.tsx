import React, { useState, useEffect } from 'react';
import { Key, Lock, User, Image as ImageIcon, Download } from 'lucide-react';

interface AuthScreenProps {
  onConnect: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onConnect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onConnect();
    }, 1500);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 px-6 text-center">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 animate-pulse"></div>
        <div className="bg-white p-6 rounded-full relative z-10">
            <ImageIcon className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-white tracking-tight">
        Memories
      </h1>
      <p className="text-neutral-400 mb-12 text-sm max-w-xs">
        Connect your photos to experience intelligent, AI-curated slideshows.
      </p>

      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="w-full max-w-xs bg-white text-neutral-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-neutral-100 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        ) : (
            <>
                <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                <span>Connect Google Photos</span>
            </>
        )}
      </button>
      
      {installPrompt && (
        <button 
          onClick={handleInstall}
          className="mt-4 w-full max-w-xs bg-neutral-800 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all border border-neutral-700"
        >
          <Download className="w-5 h-5" />
          <span>Install App</span>
        </button>
      )}
      
      <div className="mt-8 flex items-center gap-2 text-xs text-neutral-600">
        <Lock className="w-3 h-3" />
        <span>Secure Connection Simulation</span>
      </div>
    </div>
  );
};

export default AuthScreen;