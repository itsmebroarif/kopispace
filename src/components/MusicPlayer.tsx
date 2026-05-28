/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Music, Radio, Volume2, Coffee } from 'lucide-react';
import { playClickSfx, playToggleSfx } from '../utils/sfx';

const MUSIC_TRACKS = [
  { id: '1', title: 'Lofi Cafe Beats', artist: 'Jazz hop Chillout', duration: '3:20' },
  { id: '2', title: 'Morning Espresso', artist: 'Bossa Nova Groove', duration: '2:45' },
  { id: '3', title: 'Rainy Day Studio', artist: 'Piano Ambient Drone', duration: '4:12' },
  { id: '4', title: 'Midnight Cocoa', artist: 'Synthwave Sleep Loop', duration: '3:50' },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(60);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(16).fill(15));
  const track = MUSIC_TRACKS[currentTrackIndex];

  const synthesisEngine = useRef<{
    context: AudioContext | null;
    lfo: OscillatorNode | null;
    filter: BiquadFilterNode | null;
    gainNode: GainNode | null;
    noiseNode: AudioBufferSourceNode | null;
    pads: OscillatorNode[];
  }>({
    context: null,
    lfo: null,
    filter: null,
    gainNode: null,
    noiseNode: null,
    pads: []
  });

  // Calculate duration in seconds
  const parseDuration = (durStr: string) => {
    const parts = durStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };
  const durationSec = parseDuration(track.duration);

  // Time tracker effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSec) {
            // Auto skip to next
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });

        // Mutate visualizer bars randomly for cassette EQ animation
        setVisualizerBars((prev) =>
          prev.map(() => Math.floor(Math.random() * 45) + 5)
        );
      }, 1000);
    } else {
      setVisualizerBars(new Array(16).fill(4));
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex]);

  // Handle ambient synthesis start/stop
  useEffect(() => {
    if (isPlaying) {
      startAmbientSynth();
    } else {
      stopAmbientSynth();
    }
    return () => {
      stopAmbientSynth();
    };
  }, [isPlaying, currentTrackIndex, volume]);

  const startAmbientSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      synthesisEngine.current.context = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime((volume / 100) * 0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthesisEngine.current.gainNode = masterGain;

      // 1. White Noise Filtered (Cafe Rain & Crackles)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(450, ctx.currentTime);

      noiseNode.connect(lpFilter);
      lpFilter.connect(masterGain);
      noiseNode.start();
      synthesisEngine.current.noiseNode = noiseNode;

      // 2. Beautiful Soft Pads chords synthesis based on current track index!
      // Add multiple frequencies to create a sweet jazz chill chord
      const chords = [
        [130.81, 164.81, 196.00, 261.63], // C major (cozy, warm) lofi
        [146.83, 174.61, 220.00, 293.66], // D minor (morning espresso bossa)
        [110.00, 130.81, 164.81, 220.00], // A minor (rainy ambient dream)
        [116.54, 146.83, 174.61, 233.08], // B flat major (midnight cocoa synth)
      ];

      const frequencies = chords[currentTrackIndex] || chords[0];
      const padsList: OscillatorNode[] = [];

      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Lofi raw feel (triangle with filtering)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow hover filter sweep (wah effect)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 30);

        oscGain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        padsList.push(osc);
      });

      synthesisEngine.current.pads = padsList;

    } catch (e) {
      console.warn('Synth failed to initialize', e);
    }
  };

  const stopAmbientSynth = () => {
    const engine = synthesisEngine.current;
    if (engine.noiseNode) {
      try { engine.noiseNode.disconnect(); } catch (e) {}
      engine.noiseNode = null;
    }
    if (engine.pads && engine.pads.length > 0) {
      engine.pads.forEach((pad) => {
        try { pad.disconnect(); } catch (e) {}
      });
      engine.pads = [];
    }
    if (engine.context) {
      try { engine.context.close(); } catch (e) {}
      engine.context = null;
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlayPause = () => {
    playToggleSfx();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    playClickSfx();
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
      setCurrentTime(0);
      setIsPlaying(true);
    }, 200);
  };

  const handleSelectTrack = (idx: number) => {
    playClickSfx();
    setCurrentTrackIndex(idx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Percent style width
  const progressPercent = (currentTime / durationSec) * 100;

  return (
    <div className="relative overflow-hidden p-6 rounded-3xl bg-[#2e2319] border-4 border-[#3e3022] text-[#f7e6d5] shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] transition-transform duration-300 hover:rotate-1">
      {/* Decorative slant styling in corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#3b82f6] -translate-y-12 translate-x-12 rotate-45 opacity-25" />

      {/* Embedded Cassette player visualization */}
      <div className="bg-[#1b140f] p-4 rounded-xl border-2 border-[#544131] relative overflow-hidden mb-5">
        
        {/* Cassette face plate */}
        <div className="flex justify-between text-[10px] font-mono text-[#aa917c] px-1 mb-2">
          <span className="flex items-center gap-1">
            <Radio size={10} className="text-[#3b82f6] animate-pulse" /> STEREO SOUND
          </span>
          <span>A-SIDE</span>
        </div>

        {/* Cassette reels container */}
        <div className="flex items-center justify-center space-x-12 py-3 bg-[#110c0a] rounded-lg border-2 border-[#2b1f17] relative">
          
          {/* Reel LEFT */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full border-4 border-dashed border-[#544131] flex items-center justify-center ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              {/* Coffee bean hub */}
              <Coffee size={14} className="text-[#bf9f82] rotate-45" />
            </div>
            <div className="absolute w-3 h-3 bg-black rounded-full" />
          </div>

          {/* Central cassette window */}
          <div className="flex gap-1 items-end bg-[#1b140f] w-16 h-7 rounded border border-[#3c2e22] px-2 py-1 justify-center">
            {/* Visualizer bars */}
            {visualizerBars.map((val, i) => (
              <div
                key={i}
                className="w-0.5 bg-[#3b82f6] transition-all duration-300 ease-out"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>

          {/* Reel RIGHT */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full border-4 border-dashed border-[#544131] flex items-center justify-center ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              {/* Coffee bean hub */}
              <Coffee size={14} className="text-[#bf9f82] -rotate-12" />
            </div>
            <div className="absolute w-3 h-3 bg-black rounded-full" />
          </div>
        </div>

        {/* Tape info readout */}
        <div className="mt-3 text-center">
          <div className="text-xs font-mono font-bold tracking-wider text-rose-300 truncate">
            {track.title}
          </div>
          <p className="text-[10px] font-mono text-[#9c8471] truncate">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-mono text-[#caad97] mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{track.duration}</span>
        </div>
        <div className="w-full bg-[#1b140f] h-2 rounded-full overflow-hidden border border-[#544131]">
          <div
            className="bg-[#3b82f6] h-full transition-all duration-300 relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Gloss light */}
            <div className="absolute top-0 right-0 w-2 h-full bg-white opacity-40 blur-xs" />
          </div>
        </div>
      </div>

      {/* Controls Container with Persona slant active states */}
      <div className="flex items-center justify-between">
        {/* Play control, skewed style */}
        <button
          onClick={handlePlayPause}
          id="music-play-pause-btn"
          className={`flex items-center justify-center px-4 py-2 border-2 text-sm font-bold uppercase transition-all duration-200 -skew-x-6 hover:scale-105 active:scale-95 ${
            isPlaying
              ? 'bg-[#e34234] border-white text-white shadow-[2px_2px_0px_0px_white]'
              : 'bg-[#3b82f6] border-white text-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-blue-600'
          }`}
        >
          {isPlaying ? (
            <span className="flex items-center gap-1.5 font-mono">
              <Pause size={14} /> PAUSE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-mono">
              <Play size={14} /> SOUND ON
            </span>
          )}
        </button>

        {/* Sync Next button */}
        <button
          onClick={handleNextTrack}
          id="music-next-btn"
          className="flex items-center justify-center p-2.5 bg-[#4c3928] border-2 border-[#735840] hover:bg-[#5c4632] hover:border-[#3b82f6] hover:text-white text-[#ddc1aa] rounded-xl transition-all duration-200"
          title="Next Loop Track"
        >
          <SkipForward size={16} />
        </button>

        {/* Volume slider */}
        <div className="flex items-center space-x-2 bg-[#1b140f] py-1 px-3 rounded-lg border border-[#443325]">
          <Volume2 size={13} className="text-[#bf9f82]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
            }}
            className="w-16 accent-[#3b82f6] bg-zinc-800 cursor-pointer h-1 rounded"
          />
        </div>
      </div>

      {/* Grid playlist selector with coffee cangkir colors */}
      <div className="mt-5 pt-4 border-t border-[#443325]">
        <div className="text-[10px] uppercase font-mono tracking-wider text-[#9c8471] mb-2 flex items-center gap-1">
          <Music size={11} className="text-[#3b82f6]" /> Select Ambient Loop Genre
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_TRACKS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => handleSelectTrack(idx)}
              className={`p-2 rounded-lg text-left text-xs font-mono transition-all duration-200 truncate border ${
                currentTrackIndex === idx
                  ? 'bg-[#3b82f6] text-white border-white font-medium shadow-sm'
                  : 'bg-[#1b140f] text-[#caad97] border-[#443325] hover:border-zinc-500'
              }`}
            >
              ☕ {t.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
