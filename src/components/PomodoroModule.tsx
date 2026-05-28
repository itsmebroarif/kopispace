/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Coffee, Compass, Settings } from 'lucide-react';
import { playClickSfx, playToggleSfx, playAlarmSfx } from '../utils/sfx';
import { translate } from '../i18n';
import { Language } from '../types';

interface PomodoroModuleProps {
  language: Language;
}

export default function PomodoroModule({ language }: PomodoroModuleProps) {
  // Config durations in minutes
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isFocusMode, setIsFocusMode] = useState(true); // true = focus, false = break
  
  // Running values
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const [showConfig, setShowConfig] = useState(false);

  // Interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync config edits when paused or adjusted
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isFocusMode ? workDuration * 60 : breakDuration * 60);
    }
  }, [workDuration, breakDuration, isFocusMode]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Alarm! Trigger trigger sound
            playAlarmSfx();
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);

            // Switch focus <-> break
            if (isFocusMode) {
              setCompletedSessions((c) => c + 1);
              setIsFocusMode(false);
              return breakDuration * 60;
            } else {
              setIsFocusMode(true);
              return workDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isFocusMode, workDuration, breakDuration]);

  const handleStartPause = () => {
    playClickSfx();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    playToggleSfx();
    setIsRunning(false);
    setIsFocusMode(true);
    setTimeLeft(workDuration * 60);
  };

  // Format time (MM:SS)
  const formatTimeStr = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Percents completed calculation for visual progress
  const totalDuration = isFocusMode ? workDuration * 60 : breakDuration * 60;
  const elapsed = totalDuration - timeLeft;
  const progressPercent = (elapsed / totalDuration) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#fcf9f5] dark:bg-[#150f0c] rounded-3xl border-4 border-[#3a281d] shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] max-w-xl mx-auto overflow-hidden relative">
      
      {/* Decorative skewed stripes */}
      <div className="absolute top-0 left-0 w-32 h-6 bg-[#3b82f6] -skew-x-20 -translate-x-12 translate-y-4 rotate-12 opacity-45" />

      {/* Mode Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#3b82f6] text-white font-extrabold uppercase text-[10px] tracking-widest -skew-x-12 border-2 border-black shadow-[3px_3px_0px_0px_rgba(18,12,8,1)]">
          <Flame size={12} className="animate-pulse" />
          {isFocusMode ? translate('focusTime', language) : translate('breakTime', language)}
        </div>
      </div>

      {/* Coffee Brewing Visualizer */}
      <div className="relative w-48 h-48 bg-[#eedbc5] dark:bg-[#251b14] rounded-full border-4 border-[#3d2e24] shadow-inner mb-6 flex items-center justify-center overflow-hidden group">
        
        {/* Steam rising lines (only if focusing & running!) */}
        {isRunning && isFocusMode && (
          <div className="absolute -top-1 flex space-x-3 z-20">
            <div className="w-1.5 h-6 bg-amber-200 opacity-60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '1s' }} />
            <div className="w-1.5 h-8 bg-amber-200 opacity-60 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.4s' }} />
            <div className="w-1.5 h-5 bg-amber-200 opacity-60 rounded-full animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '0.8s' }} />
          </div>
        )}

        {/* Level Fill of Brewed Coffee */}
        <div
          className="absolute bottom-0 left-0 w-full bg-[#5c4033] dark:bg-[#402a1e] transition-all duration-1000 ease-out border-t-2 border-[#ff9f1c]"
          style={{ height: `${isFocusMode ? progressPercent : 100 - progressPercent}%` }}
        />

        {/* Central visual coffee cup outline */}
        <div className="relative z-10 flex flex-col items-center">
          <Coffee size={40} className={`text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${isRunning ? 'animate-pulse' : ''}`} />
          <span className="text-3xl font-mono font-extrabold text-white tracking-widest filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)] mt-2">
            {formatTimeStr(timeLeft)}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleStartPause}
          id="pomodoro-start-btn"
          className={`px-6 py-3 border-3 text-sm font-extrabold uppercase -skew-x-6 tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-[#3b82f6] hover:bg-blue-600 text-white border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {isRunning ? (
            <span className="flex items-center gap-1.5 font-mono">
              <Pause size={15} /> {translate('pause', language)}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-mono">
              <Play size={15} /> {translate('start', language)}
            </span>
          )}
        </button>

        <button
          onClick={handleReset}
          id="pomodoro-reset-btn"
          className="p-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-2 border-black hover:border-[#3b82f6] hover:text-[#3b82f6] rounded-xl transition-all duration-200"
          title={translate('reset', language)}
          aria-label={translate('reset', language)}
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={() => {
            playClickSfx();
            setShowConfig(!showConfig);
          }}
          id="pomodoro-setting-btn"
          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
            showConfig
              ? 'bg-[#3b82f6] text-white border-white'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-black'
          }`}
          title="Adjust focus length"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Modular Config Adjust Slider Drawer */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 border-t border-dashed border-zinc-300 dark:border-zinc-800 ${
          showConfig ? 'max-h-[160px] py-4' : 'max-h-0 py-0'
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-mono text-zinc-500 mb-1 flex items-center gap-1">
              ☕ {translate('focusLabel', language)}
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={workDuration}
              onChange={(e) => {
                setWorkDuration(Number(e.target.value));
              }}
              className="w-full accent-[#3b82f6] bg-zinc-200 dark:bg-zinc-800 cursor-pointer h-1.5 rounded"
            />
            <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 justify-end block text-right">
              {workDuration} Min
            </span>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-zinc-500 mb-1 flex items-center gap-1">
              🍃 {translate('breakLabel', language)}
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => {
                setBreakDuration(Number(e.target.value));
              }}
              className="w-full accent-green-500 bg-zinc-200 dark:bg-zinc-800 cursor-pointer h-1.5 rounded"
            />
            <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 justify-end block text-right">
              {breakDuration} Min
            </span>
          </div>
        </div>
      </div>

      {/* Completion Counts counter */}
      <div className="mt-4 pt-3 w-full border-t border-zinc-200 dark:border-zinc-800 text-center flex items-center justify-center gap-2">
        <Compass size={13} className="text-zinc-400" />
        <span className="text-xs font-mono text-zinc-400">
          {translate('pomodoroSessions', language)}
          <span className="font-bold text-[#3b82f6] bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-300 dark:border-zinc-800">
            {completedSessions}
          </span>
        </span>
      </div>
    </div>
  );
}
