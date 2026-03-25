import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS, Track } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    let nextIndex = currentTrackIndex;
    if (direction === 'next') {
      nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrackIndex, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-cyan-400 p-6 shadow-[8px_8px_0px_#ff00ff] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-magenta-500/30 animate-pulse" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      <div className="flex flex-col items-center gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="relative w-56 h-56 border-4 border-magenta-500 shadow-[4px_4px_0px_#00ffff] overflow-hidden group"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale brightness-50 contrast-150 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-magenta-500/10 mix-blend-overlay" />
            <div className="absolute top-2 left-2 bg-black px-2 py-1 text-[8px] font-pixel text-cyan-400 border border-cyan-400">IMG_DATA_{currentTrack.id}</div>
          </motion.div>
        </AnimatePresence>

        <div className="text-center w-full">
          <h3 className="text-lg font-pixel text-white tracking-tighter animate-glitch-heavy truncate">{currentTrack.title}</h3>
          <p className="text-magenta-500 text-[10px] font-silk uppercase tracking-[0.3em] mt-2">
            SOURCE: {currentTrack.artist}
          </p>
        </div>

        <div className="w-full space-y-3">
          <div className="h-2 bg-magenta-500/20 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_10px_#00ffff]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[8px] text-cyan-400/60 font-pixel tracking-widest">
            <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
            <span>{Math.floor((audioRef.current?.duration || 0) / 60)}:{(Math.floor((audioRef.current?.duration || 0) % 60)).toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            onClick={() => handleSkip('prev')}
            className="text-cyan-400 hover:text-white transition-colors active:translate-y-1"
          >
            <SkipBack size={32} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center bg-magenta-500 text-black shadow-[4px_4px_0px_#00ffff] hover:bg-white transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={() => handleSkip('next')}
            className="text-cyan-400 hover:text-white transition-colors active:translate-y-1"
          >
            <SkipForward size={32} />
          </button>
        </div>

        <div className="w-full flex items-center gap-4 pt-4 border-t border-cyan-400/20">
          <Volume2 size={16} className="text-magenta-500" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-magenta-500/20 appearance-none cursor-pointer accent-magenta-500"
          />
        </div>
      </div>

      <div className="mt-10 border-t-2 border-magenta-500 pt-6">
        <div className="flex items-center gap-3 mb-6 text-[10px] text-cyan-400 font-pixel tracking-widest">
          <Music size={14} />
          <span>SIGNAL_LIST</span>
        </div>
        <div className="space-y-3">
          {TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`w-full flex items-center gap-4 p-3 border-2 transition-all ${
                currentTrackIndex === index 
                ? 'bg-cyan-400 border-cyan-400 text-black shadow-[4px_4px_0px_#ff00ff]' 
                : 'border-magenta-500/30 hover:border-magenta-500 text-magenta-500/60 hover:text-magenta-500'
              }`}
            >
              <div className="w-12 h-12 border border-current flex-shrink-0 overflow-hidden">
                <img src={track.cover} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[10px] font-pixel truncate">{track.title}</div>
                <div className="text-[8px] font-silk opacity-60 mt-1">ID: {track.id.toString().padStart(3, '0')}</div>
              </div>
              {currentTrackIndex === index && isPlaying && (
                <div className="flex gap-1 items-end h-4">
                  <div className="w-1 bg-black animate-pulse" style={{ height: '60%' }} />
                  <div className="w-1 bg-black animate-pulse" style={{ height: '100%', animationDelay: '0.1s' }} />
                  <div className="w-1 bg-black animate-pulse" style={{ height: '40%', animationDelay: '0.2s' }} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
