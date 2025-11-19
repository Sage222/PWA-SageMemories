import React, { useState, useEffect } from 'react';
import { Lock, Image as ImageIcon, Download, Key } from 'lucide-react';
import { getAuthUrl } from '../services/googlePhotosService';

interface AuthScreenProps {
  onConnect: () => void; // Kept for legacy/demo logic if needed, but primarily we redirect
}

const AuthScreen: React.FC<AuthScreenProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [clientId, setClientId] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    // Load saved client ID if available
    const savedId = localStorage.getItem('google_client_id');
    if (savedId) {
        setClientId(savedId);
        setShowInput(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleGoogleLogin = () => {
    if (!clientId) {
        setShowInput(true);
        return;
    }

    setIsLoading(true);
    localStorage.setItem('google_client_id', clientId);
    
    // Redirect to Google
    window.location.href = getAuthUrl(clientId);
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
      <p className="text-neutral-400 mb-8 text-sm max-w-xs">
        Connect your Google Photos to view your albums.
      </p>

      {showInput && (
        <div className="w-full max-w-xs mb-4 animate-fade-in">
            <div className="bg-neutral-800 rounded-xl p-3 border border-neutral-700 flex items-center gap-2">
                <Key className="w-4 h-4 text-neutral-500" />
                <input 
                    type="text" 
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Paste Client ID here"
                    className="bg-transparent border-none focus:outline-none text-white text-sm w-full placeholder-neutral-600"
                />
            </div>
            <p className="text-[10px] text-neutral-500 mt-2 text-left px-1">
                Create an OAuth Client ID in Google Cloud Console. <br/>
                Origin: <span className="text-neutral-400">{window.location.origin}</span><br/>
                Redirect: <span className="text-neutral-400">{window.location.href.split('#')[0]}</span>
            </p>
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full max-w-xs bg-white text-neutral-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-neutral-100 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        ) : (
            <>
                <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                <span>{showInput ? 'Continue to Google' : 'Connect Google Photos'}</span>
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
        <span>Secure OAuth 2.0 Connection</span>
      </div>
    </div>
  );
};

export default AuthScreen;
