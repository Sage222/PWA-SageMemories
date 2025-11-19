import React, { useState, useEffect } from 'react';
import { Album, Photo } from '../types';
import { MOCK_ALBUMS } from '../constants';
import { Image as ImageIcon, Upload, Loader2, LogOut } from 'lucide-react';
import { fetchAlbums, fetchPhotosForAlbum } from '../services/googlePhotosService';

interface AlbumSelectionProps {
  onSelectAlbum: (album: Album) => void;
  accessToken: string | null;
}

const AlbumSelection: React.FC<AlbumSelectionProps> = ({ onSelectAlbum, accessToken }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  
  // Load Albums on Mount
  useEffect(() => {
    const loadAlbums = async () => {
        if (accessToken) {
            setIsLoading(true);
            const googleAlbums = await fetchAlbums(accessToken);
            setAlbums(googleAlbums);
            setIsLoading(false);
        } else {
            // Fallback to mocks if no token (dev mode or error)
            setAlbums(MOCK_ALBUMS);
        }
    };
    loadAlbums();
  }, [accessToken]);

  const handleAlbumClick = async (album: Album) => {
    // If it's a Google Album (has no photos loaded yet)
    if (accessToken && album.photos.length === 0) {
        setIsLoadingPhotos(true);
        const photos = await fetchPhotosForAlbum(accessToken, album.id);
        setIsLoadingPhotos(false);
        
        const fullAlbum = { ...album, photos };
        onSelectAlbum(fullAlbum);
    } else {
        // Local or Mock album
        onSelectAlbum(album);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: Photo[] = Array.from(files).map((file: File, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: `local-${Date.now()}-${index}`,
        url: url,
      };
    });

    const newAlbum: Album = {
      id: `custom-${Date.now()}`,
      title: 'Uploaded Photos',
      coverUrl: newPhotos[0].url,
      photoCount: newPhotos.length,
      photos: newPhotos,
    };

    setAlbums([newAlbum, ...albums]);
    onSelectAlbum(newAlbum);
  };

  const handleLogout = () => {
    window.location.hash = '';
    window.location.reload();
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <header className="p-6 pt-8 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold">Select Album</h2>
            <p className="text-neutral-400 text-sm mt-1">
                {accessToken ? 'From your Google Photos' : 'Demo Mode'}
            </p>
        </div>
        {accessToken && (
            <button onClick={handleLogout} className="p-2 bg-neutral-800 rounded-full hover:bg-red-900/50 transition-colors text-neutral-400 hover:text-red-400">
                <LogOut className="w-5 h-5" />
            </button>
        )}
      </header>

      {isLoadingPhotos && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="font-medium">Loading photos...</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Fetching albums...</p>
             </div>
        ) : (
            <div className="grid grid-cols-2 gap-4 pb-24">
                {/* Upload Button */}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500 hover:bg-neutral-800/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-blue-400">
                        <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-neutral-300">Upload Photos</span>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />
                </label>

            {albums.map((album) => (
                <button
                key={album.id}
                onClick={() => handleAlbumClick(album)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-800 text-left focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all active:scale-95"
                >
                <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <h3 className="font-bold text-white truncate w-full">{album.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{album.photoCount} items</span>
                    </div>
                </div>
                </button>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AlbumSelection;
