/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

interface SplashViewProps {
  onComplete: () => void;
}

export default function SplashView({ onComplete }: SplashViewProps) {
  const [phase, setPhase] = useState<'flash' | 'logo' | 'exit' | 'done'>('flash');

  useEffect(() => {
    // Phase 1: High speed bright blue electrical flash (300ms)
    const flashTimer = setTimeout(() => {
      setPhase('logo');
    }, 450);

    // Phase 2: Show bouncing coffee logo & diagonal aesthetics (2.2 seconds)
    const logoTimer = setTimeout(() => {
      setPhase('exit');
    }, 2400);

    // Phase 3: Fast diagonal swipe exit transition (400ms)
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2850);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(logoTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden font-sans transition-all duration-500 ease-in-out ${
        phase === 'exit'
          ? '-translate-y-full skew-y-6 opacity-0'
          : 'bg-[#181512]' // Dark Warm Cafe Beans base color
      }`}
    >
      {/* Decorative Persona 3 background elements */}
      {/* High-speed diagonal stripes */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div 
          className="absolute h-[150%] w-[80px] bg-[#3b82f6] rotate-30 -left-12 -top-12 animate-pulse space-y-4"
          style={{ animationDuration: '0.8s' }}
        />
        <div 
          className="absolute h-[150%] w-[120px] bg-[#3b82f6] rotate-30 right-24 -top-24 opacity-40 animate-pulse"
          style={{ animationDuration: '1.2s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#3b82f6_25%,transparent_25%,transparent_50%,#3b82f6_50%,#3b82f6_75%,transparent_75%,transparent)] bg-[size:40px_40px] opacity-10" />
      </div>

      {/* Blue lightning flash cover */}
      <div
        className={`absolute inset-0 z-10 bg-[#3b82f6] transition-opacity duration-300 pointer-events-none ${
          phase === 'flash' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Main splash card */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        {/* Animated Sonic-styled star background burst */}
        <div 
          className={`absolute w-72 h-72 rounded-full border-4 border-[#3b82f6] opacity-30 transform transition-all duration-700 ease-out ${
            phase === 'logo' ? 'scale-125 rotate-45 border-dashed' : 'scale-75 rotate-0'
          }`}
        />
        <div 
          className={`absolute w-60 h-60 bg-gradient-to-tr from-[#3b82f6] via-cyan-500 to-transparent rounded-full blur-3xl opacity-20 transform transition-all duration-1000 ${
            phase === 'logo' ? 'scale-150' : 'scale-50'
          }`}
        />

        {/* Coffee Cup & Pencil Vector logo wrapper with Persona skewed borders */}
        <div
          className={`relative p-8 bg-[#2d241e] border-4 border-white text-white -skew-x-6 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all duration-500 transform ${
            phase === 'logo' ? 'scale-100 opacity-100 rotate-2' : 'scale-50 opacity-0 -rotate-12'
          }`}
        >
          {/* Cafe element + Notion notebook element combined */}
          <div className="flex items-center justify-center space-x-3 mb-3">
            {/* Embedded custom Coffee-Cup & Scribble SVG */}
            <svg
              className="w-16 h-16 text-[#3b82f6] filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.6)] animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animationDuration: '1.2s' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 8a3 3 0 013 3v1a3 3 0 01-3 3h-1V8h1z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 8h4m-4 3h6m-6 3h3"
              />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-[#3b82f6] uppercase">
            KOPI<span className="text-[#3b82f6]">SPACE</span>
          </h1>
          
          <div className="mt-2 text-xs font-mono tracking-[4px] uppercase text-zinc-400">
            All-In-One Workspace
          </div>
        </div>

        {/* Dynamic game-style status line */}
        <div className="mt-8 font-mono text-xs text-[#3b82f6] tracking-[2px] transition-all duration-300">
          <span className="inline-block animate-pulse">●</span> LOADING SYSTEM CORE...
        </div>

        {/* Custom speed lines at bottom */}
        <div className="mt-2 flex space-x-1.5 opacity-60">
          <div className="w-12 h-1 bg-[#3b82f6] -skew-x-12 animate-pulse" />
          <div className="w-6 h-1 bg-[#3b82f6] -skew-x-12" />
          <div className="w-3 h-1 bg-white -skew-x-12" />
        </div>
      </div>
    </div>
  );
}
