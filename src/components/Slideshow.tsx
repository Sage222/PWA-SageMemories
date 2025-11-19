import React, { useState, useEffect, useRef } from 'react';
import { Album, SlideshowSettings } from '../types';
import { X, Pause, Play, SkipForward } from 'lucide-react';

interface SlideshowProps {
  album: Album;
  settings: SlideshowSettings;
  onClose: () => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ album, settings, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [now, setNow] = useState(new Date());
  
  const timerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const currentPhoto = album.photos[currentIndex];

  // Clock timer
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Progress bar logic
  useEffect(() => {
    if (!isPlaying) return;
    
    const durationMs = settings.duration * 1000;
    const interval = 50; // Update every 50ms
    let elapsed = 0;

    const updateProgress = () => {
      elapsed += interval;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);
    };

    progressTimerRef.current = window.setInterval(updateProgress, interval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentIndex, isPlaying, settings.duration]);


  // Slide timer logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setTimeout(() => {
        nextSlide();
      }, settings.duration * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, settings.duration]);

  const nextSlide = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % album.photos.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Image Layer */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
         {/* Background Blur */}
        <div 
            className="absolute inset-0 opacity-50 blur-3xl transform scale-110"
            style={{ 
                backgroundImage: `url(${currentPhoto.url})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                transition: `background-image 1s ease-in-out` 
            }}
        />
        
        {/* Main Image with Transition */}
        <img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt="Slideshow"
          className="relative max-w-full max-h-full object-contain shadow-2xl animate-fade-in"
          style={{ animation: 'fadeIn 0.8s ease-out' }}
        />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pointer-events-auto">
            <div className="text-white/80 text-sm font-medium bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {currentIndex + 1} / {album.photos.length}
            </div>
            <button 
                onClick={onClose} 
                className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10 text-white"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Controls & Info Footer */}
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-auto pb-6 pt-12 px-6 flex flex-col">
            
            {/* Controls Row */}
            <div className="flex items-center justify-center gap-8 mb-6">
                <button 
                    onClick={togglePlay} 
                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                </button>
                
                <button 
                    onClick={nextSlide}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors active:scale-95"
                >
                    <SkipForward className="w-6 h-6" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                <div 
                    className="h-full bg-white transition-all duration-75 ease-linear" 
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Metadata Row: Date | Title | Time */}
            <div className="flex justify-between items-end text-xs sm:text-sm font-medium text-white/70 tracking-wide">
                <div className="w-24 text-left">
                    {now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                
                <div className="flex-1 text-center px-2">
                    <span className="text-white/90 font-bold truncate block max-w-[200px] mx-auto">
                        {album.title}
                    </span>
                </div>
                
                <div className="w-24 text-right">
                    {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Slideshow;