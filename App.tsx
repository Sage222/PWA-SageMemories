import React, { useState } from 'react';
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

  const handleConnect = () => {
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
    // Reset specific state if needed, but keeping album selection flow usually nice
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans select-none">
      {currentState === AppState.AUTH && (
        <AuthScreen onConnect={handleConnect} />
      )}

      {currentState === AppState.ALBUMS && (
        <AlbumSelection onSelectAlbum={handleSelectAlbum} />
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