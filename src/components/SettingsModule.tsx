/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Language, DesignStyle, ThemeMode } from '../types';
import { translate } from '../i18n';
import { Settings, Globe, ShieldAlert, Monitor, Volume2, Info, ChevronDown, CheckCircle } from 'lucide-react';
import { playClickSfx, playToggleSfx, setSfxEnabled, isSfxEnabled } from '../utils/sfx';

interface SettingsModuleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  style: DesignStyle;
  onStyleChange: (style: DesignStyle) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export default function SettingsModule({
  language,
  onLanguageChange,
  style,
  onStyleChange,
  theme,
  onThemeChange
}: SettingsModuleProps) {
  const [sfx, setSfx] = useState(isSfxEnabled());
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  const handleLangToggle = (lang: Language) => {
    playClickSfx();
    onLanguageChange(lang);
    triggerSaveNotification();
  };

  const handleStyleToggle = (s: DesignStyle) => {
    playToggleSfx();
    onStyleChange(s);
    triggerSaveNotification();
  };

  const handleThemeToggle = (t: ThemeMode) => {
    playClickSfx();
    onThemeChange(t);
    triggerSaveNotification();
  };

  const handleSfxToggle = () => {
    const nextVal = !sfx;
    setSfx(nextVal);
    setSfxEnabled(nextVal);
    // Play sound if turned on!
    setTimeout(() => {
      playToggleSfx();
    }, 50);
    triggerSaveNotification();
  };

  const triggerSaveNotification = () => {
    setIsSavedNotify(true);
    setTimeout(() => {
      setIsSavedNotify(false);
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#faf6f0] dark:bg-[#120d0a] border-4 border-[#3a281d] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(59,130,246,1)] relative overflow-hidden">
      
      {/* Decorative slant lines */}
      <div className="absolute top-0 right-0 w-32 h-6 bg-[#3b82f6] -skew-x-20 translate-x-12 translate-y-4 rotate-12 opacity-35" />

      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
        <Settings className="text-[#3b82f6] w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
        <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white">
          {translate('settingsTitle', language)}
        </h2>
      </div>

      {/* Floating Save banner indicator */}
      {isSavedNotify && (
        <div className="mb-4 p-3 bg-green-500 text-white font-mono text-xs uppercase font-extrabold text-center rounded-xl border border-white animate-bounce flex items-center justify-center gap-1.5">
          <CheckCircle size={14} /> Configuration saved instantly! / Konfigurasi disimpan!
        </div>
      )}

      {/* Grid Settings Row options */}
      <div className="space-y-6">
        
        {/* Language Row */}
        <div className="p-4 bg-white dark:bg-[#191310] border-2 border-[#eaccb2] dark:border-[#2f2016] rounded-2xl">
          <label className="block text-xs font-mono font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Globe size={14} className="text-[#3b82f6]" /> {translate('languageSelect', language)}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'id' as const, label: '🇮🇩 Indonesia' },
              { code: 'en' as const, label: '🇺🇸 English' },
              { code: 'jp' as const, label: '🇯🇵 Japanese' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangToggle(lang.code)}
                className={`py-2 px-3 text-xs font-mono font-bold rounded-xl transition-all border ${
                  language === lang.code
                    ? 'bg-[#3b82f6] text-white border-white font-bold shadow-md scale-102'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* UI Cupertino Style / Android Material Row */}
        <div className="p-4 bg-white dark:bg-[#191310] border-2 border-[#eaccb2] dark:border-[#2f2016] rounded-2xl">
          <label className="block text-xs font-mono font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Monitor size={14} className="text-amber-500" /> {translate('interfaceStyle', language)}
          </label>
          <div className="grid grid-cols-2 gap-3 font-mono">
            
            <button
              onClick={() => handleStyleToggle('cupertino')}
              className={`p-3 text-xs tracking-wide border-2 text-left transition-all rounded-2xl ${
                style === 'cupertino'
                  ? 'bg-white text-zinc-900 border-[#3b82f6] shadow-md font-extrabold scale-101'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {translate('styleCupertino', language)}
              </div>
              <p className="text-[9px] text-zinc-400 mt-1 leading-normal font-sans">
                Highly curved corners, soft gradient depth (Cozy IOS feel)
              </p>
            </button>

            <button
              onClick={() => handleStyleToggle('material')}
              className={`p-3 text-xs tracking-wide border-2 text-left transition-all rounded-sm ${
                style === 'material'
                  ? 'bg-zinc-900 dark:bg-[#251f19] text-white border-white shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] font-extrabold'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-850'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 border border-white bg-amber-500" /> {translate('styleMaterial', language)}
              </div>
              <p className="text-[9px] text-zinc-400 mt-1 leading-normal font-sans">
                Sharp flat corners, high-contrast block 3D shadows (Persona aesthetics)
              </p>
            </button>

          </div>
        </div>

        {/* Environment Theme row */}
        <div className="p-4 bg-white dark:bg-[#191310] border-2 border-[#eaccb2] dark:border-[#2f2016] rounded-2xl">
          <label className="block text-xs font-mono font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Settings size={14} className="text-zinc-400" /> {translate('themeSelect', language)}
          </label>
          <div className="grid grid-cols-2 gap-3 font-mono">
            
            <button
              onClick={() => handleThemeToggle('light')}
              className={`p-3 text-xs border rounded-xl text-left transition-all ${
                theme === 'light'
                  ? 'bg-amber-100/40 text-amber-900 border-amber-600 font-extrabold shadow'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              ☕ {translate('themeLight', language)}
            </button>

            <button
              onClick={() => handleThemeToggle('dark')}
              className={`p-3 text-xs border rounded-xl text-left transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-950 text-amber-100 border-[#3b82f6] font-extrabold shadow-md'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              🌙 {translate('themeDark', language)}
            </button>

          </div>
        </div>

        {/* Sfx Sound effects controller */}
        <div className="p-4 bg-white dark:bg-[#191310] border-2 border-[#eaccb2] dark:border-[#2f2016] rounded-2xl flex items-center justify-between">
          <div className="pr-4">
            <span className="font-mono text-xs font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 size={14} className="text-emerald-500" /> {translate('soundEffects', language)}
            </span>
            <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
              Activate game-style bouncy high fidelity synthesizer feedback.
            </p>
          </div>
          
          <button
            onClick={handleSfxToggle}
            className={`w-14 h-7 rounded-full px-1 flex items-center transition-colors duration-200 ${
              sfx ? 'bg-[#3b82f6]' : 'bg-zinc-300 dark:bg-zinc-800'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white transition-all duration-250 ${
                sfx ? 'translate-x-[26px]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* PWA status details */}
        <div className="p-4 bg-white dark:bg-[#191310] border-2 border-[#eaccb2] dark:border-[#2f2016] rounded-2xl flex items-start gap-3">
          <Info className="text-[#3b82f6] shrink-0 mt-0.5" size={16} />
          <div className="font-mono text-[10px] space-y-1 text-zinc-500 leading-normal">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 block uppercase text-xs">
              {translate('pwaStatus', language)}
            </span>
            <p>✔ Offline Storage Enabled automatically via localStorage caching.</p>
            <p>✔ Standard manifest configurations active.</p>
            <p className="text-[#3b82f6] font-extrabold">Ready to install on home screen!</p>
          </div>
        </div>

      </div>

    </div>
  );
}
