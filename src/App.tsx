import React, { useState, useEffect } from 'react';
import { 
  DzikirItem, DoaItem, BabSholatItem, 
  AppSettings, AsmaulHusnaItem 
} from './types';
import { 
  loadDzikirPagi, loadDzikirPetang, 
  loadDoaHarian, loadBabSholat 
} from './data/contentLoader';
import { 
  getStoredSettings, saveSettings, 
  applyThemeToDOM, applyOrientationLock, 
  setWakeLock, toggleFullscreen 
} from './data/settingsStore';
import { getNextAsmaulHusna } from './data/asmaulHusna';
import { AsmaulHusnaCompact } from './components/AsmaulHusnaCompact';
import { HomeMenu } from './components/HomeMenu';
import { DzikirReader } from './components/DzikirReader';
import { DoaSholatView } from './components/DoaSholatView';
import { SettingsView } from './components/SettingsView';
import { SlidersHorizontal, Moon, Sun } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'pagi' | 'petang' | 'doa' | 'sholat' | 'setelan'>('beranda');
  
  // Data state
  const [dzikirPagi, setDzikirPagi] = useState<DzikirItem[]>([]);
  const [dzikirPetang, setDzikirPetang] = useState<DzikirItem[]>([]);
  const [doaHarian, setDoaHarian] = useState<DoaItem[]>([]);
  const [babSholat, setBabSholat] = useState<BabSholatItem[]>([]);
  const [currentAsmaul, setCurrentAsmaul] = useState<AsmaulHusnaItem | null>(null);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isDeviceLandscape, setIsDeviceLandscape] = useState(false);

  // Initial load & Browser History Sync for Android/Browser Back Button
  useEffect(() => {
    async function init() {
      try {
        const [pagi, petang, doa, sholat] = await Promise.all([
          loadDzikirPagi(),
          loadDzikirPetang(),
          loadDoaHarian(),
          loadBabSholat()
        ]);
        setDzikirPagi(pagi);
        setDzikirPetang(petang);
        setDoaHarian(doa);
        setBabSholat(sholat);
        
        // Advance Asmaul Husna each time app / beranda is launched
        setCurrentAsmaul(getNextAsmaulHusna());
        
        // Apply theme and orientation
        const initialSettings = getStoredSettings();
        setSettings(initialSettings);
        applyThemeToDOM(initialSettings.theme, initialSettings.themeStyle);
        applyOrientationLock(initialSettings.orientationLock);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();

    // Check device orientation dynamically
    const checkOrientation = () => {
      setIsDeviceLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Initialize root history state
    if (!window.history.state || !window.history.state.tab) {
      window.history.replaceState({ tab: 'beranda' }, '');
    }

    const handlePopState = (e: PopStateEvent) => {
      // If modal was open, the modal handler will dismiss it, keep current tab
      if (e.state?.modal) {
        return;
      }
      const targetTab = e.state?.tab || 'beranda';
      setActiveTab(targetTab);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Safe navigation with history push
  const navigateToTab = (tab: 'beranda' | 'pagi' | 'petang' | 'doa' | 'sholat' | 'setelan') => {
    if (tab === activeTab) return;
    window.history.pushState({ tab }, '');
    setActiveTab(tab);
  };

  // Safe back handler: if on any subpage, go back to previous page / beranda instead of exiting app
  const handleBackToPrevious = () => {
    if (activeTab !== 'beranda') {
      if (window.history.state && window.history.state.tab && window.history.length > 1) {
        window.history.back();
      } else {
        window.history.replaceState({ tab: 'beranda' }, '');
        setActiveTab('beranda');
      }
    }
  };

  // Handle settings update
  const handleApplySettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    applyThemeToDOM(newSettings.theme, newSettings.themeStyle);
    applyOrientationLock(newSettings.orientationLock);
    setWakeLock(newSettings.keepAwake);
    toggleFullscreen(newSettings.fullscreen);
  };

  const handleUpdatePartialSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveSettings(updated);
  };

  // Quick toggle dark / light
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdatePartialSettings({ theme: nextTheme });
    applyThemeToDOM(nextTheme, settings.themeStyle);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-6 space-y-4">
        <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 p-1.5 bg-white dark:bg-slate-900 animate-pulse flex items-center justify-center">
          <img src="/assets/aistudio/appIco_5f517e82.png" alt="App Icon" className="w-full h-full object-contain" />
        </div>
        <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm tracking-wide">
          Memuat Dzikir &amp; Do'a...
        </div>
      </div>
    );
  }

  // Determine wrapper classes based on orientationLock setting
  let orientationContainerClass = 'w-full h-full max-h-full flex flex-col overflow-hidden';
  if (settings.orientationLock === 'portrait') {
    orientationContainerClass += ' max-w-md mx-auto shadow-xl';
  } else if (settings.orientationLock === 'landscape') {
    orientationContainerClass += ' max-w-4xl mx-auto shadow-xl';
  } else {
    // Auto
    orientationContainerClass += ' max-w-md sm:max-w-xl mx-auto';
  }

  const rootContainerClass = 'h-screen h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-100 dark:bg-slate-950';

  return (
    <div className={`${rootContainerClass} transition-colors duration-200 ${settings.theme === 'dark' ? 'dark text-slate-100' : 'text-slate-800'}`}>
      <div className={orientationContainerClass}>
        {/* ================= PAGE ROUTING ================= */}
        {activeTab === 'pagi' ? (
          <DzikirReader
            type="pagi"
            items={dzikirPagi}
            settings={settings}
            onUpdateSettings={handleUpdatePartialSettings}
            onBack={handleBackToPrevious}
          />
        ) : activeTab === 'petang' ? (
          <DzikirReader
            type="petang"
            items={dzikirPetang}
            settings={settings}
            onUpdateSettings={handleUpdatePartialSettings}
            onBack={handleBackToPrevious}
          />
        ) : activeTab === 'doa' ? (
          <DoaSholatView
            type="doa"
            items={doaHarian}
            settings={settings}
            onBack={handleBackToPrevious}
          />
        ) : activeTab === 'sholat' ? (
          <DoaSholatView
            type="sholat"
            items={babSholat}
            settings={settings}
            onBack={handleBackToPrevious}
          />
        ) : activeTab === 'setelan' ? (
          <SettingsView
            currentSettings={settings}
            onApplySettings={handleApplySettings}
            onBack={handleBackToPrevious}
          />
        ) : (
          /* ================= BERANDA (HOME SCREEN) - NON-SCROLLABLE WITH EXPANDED ASMAUL HUSNA ================= */
          <div className="flex flex-col h-full max-h-full w-full px-4 sm:px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Top Minimal Bar */}
            <header className="shrink-0 flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl bg-white dark:bg-slate-900 p-1 flex items-center justify-center shadow-xs ${
                  settings.themeStyle === 'modern-glow'
                    ? 'border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : settings.themeStyle === 'anime-flat'
                    ? 'border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_#0f172a]'
                    : 'border border-slate-200 dark:border-slate-800'
                }`}>
                  <img src="/assets/aistudio/appIco_5f517e82.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                    Dzikir &amp; Do'a
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-none">
                    Al-Ma'tsurat &amp; Sunnah
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleTheme}
                  title={settings.theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                  className={`p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all active:scale-95 shadow-xs ${
                    settings.themeStyle === 'modern-glow'
                      ? 'border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.25)] hover:border-cyan-400'
                      : settings.themeStyle === 'anime-flat'
                      ? 'border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#38bdf8]'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {settings.theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </button>
                <button
                  onClick={() => navigateToTab('setelan')}
                  title="Buka Setelan"
                  className={`p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all active:scale-95 shadow-xs ${
                    settings.themeStyle === 'modern-glow'
                      ? 'border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.25)] hover:border-cyan-400'
                      : settings.themeStyle === 'anime-flat'
                      ? 'border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#38bdf8]'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Title: Flat, Simple & Modern */}
            <div className="shrink-0 text-center pt-1.5 pb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight select-none">
                Dzikir &amp; Doa
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kumpulan Dzikir Harian, Doa &amp; Panduan Sholat
              </p>
            </div>

            {/* Asmaul Husna: Fills the entire remaining vertical space */}
            {currentAsmaul && (
              <div className="flex-1 min-h-[95px] my-1.5 sm:my-2 overflow-hidden flex flex-col">
                <AsmaulHusnaCompact 
                  current={currentAsmaul} 
                  onAdvance={(next) => setCurrentAsmaul(next)}
                  themeStyle={settings.themeStyle}
                />
              </div>
            )}

            {/* 5 Flat Modern Menu Cards */}
            <div className="shrink-0 pt-0.5">
              <HomeMenu 
                onSelect={(page) => navigateToTab(page)} 
                dzikirPagiCount={dzikirPagi.length}
                dzikirPetangCount={dzikirPetang.length}
                doaCount={doaHarian.length}
                sholatCount={babSholat.length}
                themeStyle={settings.themeStyle}
              />
            </div>

            {/* Clean bottom note */}
            <footer className="shrink-0 pt-2 pb-1 text-center text-[10px] text-slate-400 dark:text-slate-600 select-none">
              <p>Dzikir Pagi • Dzikir Petang • Doa Harian • Bab Sholat</p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
