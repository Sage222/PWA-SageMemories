import React, { useState } from 'react';
import { Album, Photo } from '../types';
import { MOCK_ALBUMS } from '../constants';
import { Plus, Image as ImageIcon, FolderOpen, Upload } from 'lucide-react';

interface AlbumSelectionProps {
  onSelectAlbum: (album: Album) => void;
}

const AlbumSelection: React.FC<AlbumSelectionProps> = ({ onSelectAlbum }) => {
  const [albums, setAlbums] = useState<Album[]>(MOCK_ALBUMS);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: Photo[] = Array.from(files).map((file: File, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: `local-${Date.now()}-${index}`,
        url: url,
        // In a real app, we'd read as Base64 here immediately if needed, 
        // but we'll let the Service handle fetching the blob from ObjectURL later.
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

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <header className="p-6 pt-8 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-20">
        <h2 className="text-2xl font-bold">Select Album</h2>
        <p className="text-neutral-400 text-sm mt-1">Choose a memory to relive</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
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
              onClick={() => onSelectAlbum(album)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-800 text-left focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all active:scale-95"
            >
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
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
      </div>
    </div>
  );
};

export default AlbumSelection;