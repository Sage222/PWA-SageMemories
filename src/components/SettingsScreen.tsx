import React, { useState } from 'react';
import { SlideshowSettings } from '../types';
import { Play, Clock } from 'lucide-react';

interface SettingsScreenProps {
  onStart: (settings: SlideshowSettings) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onStart }) => {
  const [duration, setDuration] = useState(5);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white px-6 pt-12 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="mb-10 z-10">
        <h2 className="text-3xl font-bold mb-2">Customize</h2>
        <p className="text-neutral-400">Tailor your viewing experience</p>
      </div>

      <div className="space-y-8 z-10">
        {/* Duration Slider */}
        <div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Clock className="w-5 h-5" />
                </div>
                <span className="font-medium">Duration</span>
            </div>
            <span className="text-2xl font-bold text-blue-400">{formatDuration(duration)}</span>
          </div>
          
          <input
            type="range"
            min="2"
            max="120"
            step="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
            <span>Fast (2s)</span>
            <span>Slow (2m)</span>
          </div>
        </div>
      </div>

      <div className="mt-auto mb-8 z-10">
        <button
          onClick={() => onStart({ duration, transitionEffect: 'fade' })}
          className="w-full bg-white text-black font-bold text-lg py-5 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-neutral-100"
        >
          <Play className="w-5 h-5 fill-black" />
          Start Slideshow
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;