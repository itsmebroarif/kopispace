/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Coffee,
  FileText,
  Clock,
  CheckSquare,
  Wallet,
  LayoutDashboard,
  Users,
  Settings,
  Moon,
  Sun,
  Crown,
  Laptop
} from 'lucide-react';

// Type definitions
import { Language, DesignStyle, ThemeMode } from './types';
import { translate } from './i18n';
import { playClickSfx, playTabSfx, setSfxEnabled } from './utils/sfx';

// Modular Workspace Views
import SplashView from './components/SplashView';
import MusicPlayer from './components/MusicPlayer';
import WorkspaceModule from './components/WorkspaceModule';
import PomodoroModule from './components/PomodoroModule';
import TodoHabitModule from './components/TodoHabitModule';
import MoneyModule from './components/MoneyModule';
import ProjectModule from './components/ProjectModule';
import ContactModule from './components/ContactModule';
import SettingsModule from './components/SettingsModule';

export default function App() {
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [currentTab, setCurrentTab] = useState<'workspace' | 'pomodoro' | 'todo' | 'money' | 'project' | 'contacts' | 'settings'>('workspace');

  // Core configurations persisting in Local Storage
  const [language, setLanguage] = useState<Language>('id');
  const [style, setStyle] = useState<DesignStyle>('material');
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // Load from local storage
  useEffect(() => {
    const savedLang = localStorage.getItem('kopispace_language') as Language;
    const savedStyle = localStorage.getItem('kopispace_style') as DesignStyle;
    const savedTheme = localStorage.getItem('kopispace_theme') as ThemeMode;
    const savedSfx = localStorage.getItem('kopispace_sfx');

    if (savedLang) setLanguage(savedLang);
    if (savedStyle) setStyle(savedStyle);
    if (savedTheme) setTheme(savedTheme);
    if (savedSfx) setSfxEnabled(savedSfx === 'true');
  }, []);

  // Sync settings helper actions
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('kopispace_language', lang);
  };

  const changeStyle = (s: DesignStyle) => {
    setStyle(s);
    localStorage.setItem('kopispace_style', s);
  };

  const changeTheme = (t: ThemeMode) => {
    setTheme(t);
    localStorage.setItem('kopispace_theme', t);
  };

  const handleTabChange = (tab: typeof currentTab) => {
    playTabSfx();
    setCurrentTab(tab);
  };

  // Compile active layout classes based on custom Cupertino vs Material design styles
  const isMaterial = style === 'material';
  
  const cardBorderClass = isMaterial ? 'border-4 border-[#3a281d] rounded-xl shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]' : 'border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm';
  const buttonClass = isMaterial ? '-skew-x-12 border-2 border-[#120d0aa] uppercase shadow-[2px_2px_0px_0px_rgba(59,130,246,1)]' : 'rounded-lg';
  const radiusClass = isMaterial ? 'rounded-none' : 'rounded-[32px]';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden ${
      theme === 'dark' 
        ? 'bg-[#181310] text-[#f7e6d5]' // Midnight Lounge Dark (Warm Espresso tones)
        : 'bg-[#fcf7ee] text-[#4d3319]' // Sunlit Cafe Cream (Cozy Light)
    }`}>
      
      {/* Splash Screen display wrapper */}
      {!isSplashDone && (
        <SplashView onComplete={() => setIsSplashDone(true)} />
      )}

      {isSplashDone && (
        <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 animate-fade-in duration-700">
          
          {/* Aesthetic background stripe accents (Persona style slanting lines) */}
          {isMaterial && (
            <div className="absolute top-0 right-0 w-full h-1 pointer-events-none skew-y-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-40" />
          )}

          {/* Core Header section */}
          <header className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-6 bg-white dark:bg-[#1a1410] border-4 border-[#3a281d] shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] relative overflow-hidden -skew-x-1 hover:skew-x-0 transition-transform ${radiusClass}`}>
            
            {/* Persona Diagonal background stripe inside header */}
            <div className="absolute -top-12 -left-12 w-32 h-[200%] bg-[#3b82f6] rotate-30 opacity-15 pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              
              {/* Rotating Custom Coffee Indicator Symbol */}
              <div className="w-12 h-12 bg-[#3b82f6] border-2 border-white flex items-center justify-center -skew-x-12 shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
                <Coffee className="text-white w-6 h-6" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white flex items-center gap-1">
                  KOPI<span className="text-[#3b82f6]">SPACE</span>
                  <Crown size={12} className="text-amber-500" />
                </h1>
                <p className="text-[10px] font-mono tracking-[2px] uppercase text-zinc-500 dark:text-zinc-400">
                  {translate('appSub', language)}
                </p>
              </div>
            </div>

            {/* Quick quick setting controls & status */}
            <div className="flex items-center gap-3 relative z-10 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase py-1 px-3 bg-[#e6dbcf] dark:bg-[#2e2319] border border-[#a89685] text-zinc-600 dark:text-[#be9874] rounded-lg -skew-x-6 flex items-center gap-1.5 shadow-sm">
                <Laptop size={11} className="text-[#3b82f6] animate-pulse" /> PWA LOCAL Caching
              </span>

              {/* Day / Midnight quick toggler */}
              <button
                onClick={() => {
                  playClickSfx();
                  changeTheme(theme === 'dark' ? 'light' : 'dark');
                }}
                id="quick-theme-toggle"
                className="p-2.5 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-900 text-[#3b82f6] hover:text-cyan-400 rounded-xl border border-[#3a281d] dark:border-zinc-800 shadow-xs transition-transform hover:scale-105 active:scale-95"
                title="Toggle Environment Mode"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </header>

          {/* Grid: Content panels + Sidebar columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT BAR - MODULE NAVIGATIONS (1 COLUMN) */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
              
              {/* Slanted multi-tab nav panel */}
              <nav className={`p-4 bg-white dark:bg-[#1a1410] border-4 border-[#3a281d] shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] ${radiusClass}`}>
                
                <span className="block text-[9.5px] uppercase font-mono tracking-[3px] text-zinc-400 dark:text-zinc-500 pb-3 border-b-2 border-dashed border-[#ecdcd0] dark:border-[#332519] mb-4">
                  ☕ CORE SYSTEM TABS
                </span>

                <div className="space-y-2 flex flex-col">
                  {[
                    { id: 'workspace' as const, icon: FileText, label: translate('workspace', language) },
                    { id: 'pomodoro' as const, icon: Clock, label: translate('pomodoro', language) },
                    { id: 'todo' as const, icon: CheckSquare, label: translate('todoHabit', language) },
                    { id: 'money' as const, icon: Wallet, label: translate('money', language) },
                    { id: 'project' as const, icon: LayoutDashboard, label: translate('kanban', language) },
                    { id: 'contacts' as const, icon: Users, label: translate('contacts', language) },
                    { id: 'settings' as const, icon: Settings, label: translate('settings', language) },
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = currentTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center gap-3 p-3 text-xs font-mono font-bold uppercase transition-all duration-150 text-left border-2 ${
                          isActive
                            ? 'bg-[#3b82f6] text-white border-white scale-102 -skew-x-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-transparent border-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        } ${isMaterial ? 'rounded-none' : 'rounded-xl'}`}
                      >
                        <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'rotate-12 animate-pulse text-white' : 'text-[#3b82f6]'}`} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* Beautiful Integrated Music player cassette cassette widget */}
              <MusicPlayer />

            </div>

            {/* RIGHT COLUMN - ACTIVE TAB VIEW (3 COLUMNS) */}
            <main className="lg:col-span-3 transition-all duration-300">
              {currentTab === 'workspace' && <WorkspaceModule language={language} />}
              {currentTab === 'pomodoro' && <PomodoroModule language={language} />}
              {currentTab === 'todo' && <TodoHabitModule language={language} />}
              {currentTab === 'money' && <MoneyModule language={language} />}
              {currentTab === 'project' && <ProjectModule language={language} />}
              {currentTab === 'contacts' && <ContactModule language={language} />}
              {currentTab === 'settings' && (
                <SettingsModule
                  language={language}
                  onLanguageChange={changeLanguage}
                  style={style}
                  onStyleChange={changeStyle}
                  theme={theme}
                  onThemeChange={changeTheme}
                />
              )}
            </main>

          </div>

          {/* Tiny artistic footer panel */}
          <footer className="mt-12 text-center border-t border-[#ecdcd0] dark:border-[#332519] py-6 font-mono text-[10px] text-zinc-500">
            KOPI<span className="text-[#3b82f6]">SPACE</span> PWA v1.0.0 • {language === 'id' ? 'Dirancang Khusus Untuk Pekerja Kreatif & IT' : language === 'jp' ? 'IT・学生・クリエイティブ特化型' : 'Engineered for Creatives, Developers & Students'}
          </footer>

        </div>
      )}
    </div>
  );
}
