import React, { useState, useEffect } from 'react';
import { AppState, Album, SlideshowSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';
import AuthScreen from './components/AuthScreen';
import AlbumSelection from './components/AlbumSelection';
import SettingsScreen from './components/SettingsScreen';
import Slideshow from './components/Slideshow';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.AUTH);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [settings, setSettings] = useState<SlideshowSettings>(DEFAULT_SETTINGS);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for Access Token in URL (returned from Google)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1)); // remove #
        const token = params.get('access_token');
        
        if (token) {
            setAccessToken(token);
            setCurrentState(AppState.ALBUMS);
            // Clean URL
            window.history.replaceState(null, '', window.location.pathname);
        }
    }
  }, []);

  const handleConnect = () => {
    // Legacy handler - unused in real OAuth flow as logic moves to useEffect
    setCurrentState(AppState.ALBUMS);
  };

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentState(AppState.SETTINGS);
  };

  const handleStartSlideshow = (newSettings: SlideshowSettings) => {
    setSettings(newSettings);
    setCurrentState(AppState.SLIDESHOW);
  };

  const handleCloseSlideshow = () => {
    setCurrentState(AppState.ALBUMS);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans select-none">
      {currentState === AppState.AUTH && (
        <AuthScreen onConnect={handleConnect} />
      )}

      {currentState === AppState.ALBUMS && (
        <AlbumSelection 
            onSelectAlbum={handleSelectAlbum} 
            accessToken={accessToken} 
        />
      )}

      {currentState === AppState.SETTINGS && selectedAlbum && (
        <SettingsScreen onStart={handleStartSlideshow} />
      )}

      {currentState === AppState.SLIDESHOW && selectedAlbum && (
        <Slideshow 
            album={selectedAlbum} 
            settings={settings} 
            onClose={handleCloseSlideshow} 
        />
      )}
    </div>
  );
};

export default App;
