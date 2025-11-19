import React, { useState, useEffect } from 'react';
import { Lock, Image as ImageIcon, Download, Key, AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import { getAuthUrl } from '../services/googlePhotosService';

interface AuthScreenProps {
  onConnect: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [clientId, setClientId] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detect if we are running on a raw IP address (which Google blocks)
  const isIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(window.location.hostname);
  const currentRedirectUri = window.location.href.split('#')[0];

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

  const handleSwitchToMagicDomain = () => {
    // 192.168.1.50 -> 192.168.1.50.sslip.io
    // This tricks Google into thinking it's a real domain
    const newHostname = `${window.location.hostname}.sslip.io`;
    const newUrl = window.location.href.replace(window.location.hostname, newHostname);
    window.location.href = newUrl;
  };

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(currentRedirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-6 text-center py-12">
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

      {/* IP Address Warning & Fixer */}
      {isIpAddress && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 mb-6 max-w-xs text-left">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold text-sm">Setup Required</span>
            </div>
            <p className="text-xs text-yellow-200/80 mb-3 leading-relaxed">
                Google does not allow IP addresses for login. Switch to a "magic domain" to fix this automatically.
            </p>
            <button 
                onClick={handleSwitchToMagicDomain}
                className="w-full bg-yellow-500 text-black text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
            >
                <RefreshCw className="w-3 h-3" />
                Fix URL (Use sslip.io)
            </button>
        </div>
      )}

      {/* Client ID Input Section */}
      {showInput && (
        <div className="w-full max-w-xs mb-6 animate-fade-in space-y-4">
            {/* Input */}
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

            {/* Help Text / Config Info */}
            <div className="bg-neutral-800/50 rounded-lg p-3 text-[10px] text-neutral-400 text-left border border-neutral-800">
                <p className="mb-2 font-medium text-neutral-300">1. Create OAuth Client ID (Web App) in Google Cloud.</p>
                
                <div className="mb-2">
                    <span className="block text-neutral-500 mb-1">2. Add Authorized Origin:</span>
                    <code className="block bg-black/30 p-1.5 rounded text-blue-400 break-all select-all">
                        {window.location.origin}
                    </code>
                </div>

                <div>
                    <span className="block text-neutral-500 mb-1">3. Add Authorized Redirect URI:</span>
                    <button 
                        onClick={copyRedirectUri}
                        className="w-full text-left bg-black/30 p-1.5 rounded text-blue-400 break-all relative group hover:bg-black/50 transition-colors"
                    >
                        {currentRedirectUri}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />}
                        </div>
                    </button>
                </div>
            </div>
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading || isIpAddress}
        className="w-full max-w-xs bg-white text-neutral-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
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