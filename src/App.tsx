import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Music, Trophy } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex flex-col crt-effect">
      {/* Static Noise Overlay */}
      <div className="static-overlay" />

      {/* Background Glitch Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-1 bg-magenta-500 animate-glitch-heavy" />
        <div className="absolute top-3/4 right-1/4 w-64 h-2 bg-cyan-400 animate-glitch-heavy" style={{ animationDelay: '0.1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b-4 border-magenta-500 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-magenta-500 flex items-center justify-center shadow-[4px_4px_0px_#00ffff]">
            <Gamepad2 className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-pixel text-white leading-none tracking-tighter">
              NEON_<span className="text-cyan-400">SNAKE</span>.EXE
            </h1>
            <p className="text-[8px] text-magenta-500 font-silk mt-1 tracking-[0.3em] animate-pulse">SYSTEM_STATUS: UNSTABLE // V1.0.GLITCH</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5 px-6 py-3 bg-black border-2 border-cyan-400 shadow-[4px_4px_0px_#ff00ff]">
            <Trophy size={20} className="text-cyan-400" />
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-magenta-500 font-pixel mb-1 tracking-widest">DATA_HARVEST</span>
              <div className="flex gap-1">
                {score.toString().padStart(4, '0').split('').map((digit, i) => (
                  <div key={i} className="w-8 h-10 bg-black border border-cyan-400/30 flex items-center justify-center">
                    <span className="text-xl font-pixel text-white animate-glitch-heavy">
                      {digit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 p-8 max-w-7xl mx-auto w-full">
        {/* Game Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center animate-screen-tear"
        >
          <div className="relative p-2 bg-magenta-500 shadow-[8px_8px_0px_#00ffff]">
            <SnakeGame onScoreChange={setScore} />
          </div>
        </motion.section>

        {/* Music Section */}
        <motion.section 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-96 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-4 text-[10px] text-cyan-400 font-pixel tracking-widest">
            <Music size={14} />
            <span>SIGNAL_STREAM</span>
          </div>
          <MusicPlayer />
        </motion.section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 px-8 py-3 border-t-4 border-cyan-400 bg-black flex justify-between items-center text-[8px] text-magenta-500 font-pixel tracking-[0.2em]">
        <div className="flex gap-8">
          <span className="animate-pulse">CORE: OVERLOAD</span>
          <span>MEM_LEAK: DETECTED</span>
        </div>
        <div className="flex gap-8">
          <span className="text-cyan-400">ENCRYPTED_BY_AI_STUDIO</span>
          <span>[C] 2026_VOID_ARCADE</span>
        </div>
      </footer>
    </div>
  );
}
