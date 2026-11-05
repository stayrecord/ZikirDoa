import React, { useState, useEffect } from 'react';
import { 
  DzikirItem, DoaItem, BabSholatItem, 
  AppSettings, AsmaulHusnaItem, NasehatFlyer 
} from './types';
import { 
  loadDzikirPagi, loadDzikirPetang, 
  loadDoaHarian, loadBabSholat 
} from './data/contentLoader';
import { 
  getStoredSettings, saveSettings, 
  applyThemeToDOM, setWakeLock, toggleFullscreen 
} from './data/settingsStore';
import { getNextAsmaulHusna } from './data/asmaulHusna';
import { 
  DEFAULT_NASEHAT_FLYERS, 
  getCachedFlyers, 
  fetchFlyersFromGoogleSheets 
} from './data/nasehatFlyers';
import { triggerNotification } from './utils/reminderService';
import { AsmaulHusnaCompact } from './components/AsmaulHusnaCompact';
import { HomeMenu } from './components/HomeMenu';
import { DzikirReader } from './components/DzikirReader';
import { DoaSholatView } from './components/DoaSholatView';
import { SettingsView } from './components/SettingsView';
import { FlyerCarousel } from './components/FlyerCarousel';
import { SlidersHorizontal, Moon, Sun, Bell, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'pagi' | 'petang' | 'doa' | 'sholat' | 'setelan'>('beranda');
  
  // Data state
  const [dzikirPagi, setDzikirPagi] = useState<DzikirItem[]>([]);
  const [dzikirPetang, setDzikirPetang] = useState<DzikirItem[]>([]);
  const [doaHarian, setDoaHarian] = useState<DoaItem[]>([]);
  const [babSholat, setBabSholat] = useState<BabSholatItem[]>([]);
  const [currentAsmaul, setCurrentAsmaul] = useState<AsmaulHusnaItem | null>(null);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [flyers, setFlyers] = useState<NasehatFlyer[]>(getCachedFlyers());

  // In-app reminder notification banner
  const [inAppAlert, setInAppAlert] = useState<{ title: string; body: string } | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);

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
        
        setCurrentAsmaul(getNextAsmaulHusna());
        
        const initialSettings = getStoredSettings();
        setSettings(initialSettings);
        applyThemeToDOM(initialSettings.theme, initialSettings.themeStyle);

        // Fetch dynamic flyers if Google Sheet URL is configured
        if (initialSettings.googleSheetUrl) {
          fetchFlyersFromGoogleSheets(initialSettings.googleSheetUrl).then((fetched) => {
            if (fetched && fetched.length > 0) setFlyers(fetched);
          });
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();

    // Initialize root history state
    if (!window.history.state || !window.history.state.tab) {
      window.history.replaceState({ tab: 'beranda' }, '');
    }

    const handlePopState = (e: PopStateEvent) => {
      // If a modal was open, the modal handler will dismiss it, keep current tab
      if (e.state?.modal) {
        return;
      }
      const targetTab = e.state?.tab || 'beranda';
      setActiveTab(targetTab);
    };

    window.addEventListener('popstate', handlePopState);

    // Listen for custom in-app reminder alert
    const handleReminderEvent = (e: any) => {
      if (e.detail) {
        setInAppAlert(e.detail);
      }
    };
    window.addEventListener('dzikir-reminder-alert', handleReminderEvent);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('dzikir-reminder-alert', handleReminderEvent);
    };
  }, []);

  // Reminder Checker Interval: checks every 30 seconds
  useEffect(() => {
    if (!settings.remindersEnabled || !settings.reminders || settings.reminders.length === 0) {
      return;
    }

    let lastFiredMinute = '';

    const checkReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${currentHours}:${currentMinutes}`;

      if (timeStr === lastFiredMinute) return; // Prevent double trigger within same minute

      const matchedReminder = settings.reminders.find(
        (r) => r.enabled && r.time === timeStr
      );

      if (matchedReminder) {
        lastFiredMinute = timeStr;
        triggerNotification(
          `Waktunya ${matchedReminder.title}`,
          `${matchedReminder.subtitle}. Luangkan sejenak untuk berdzikir kepada Allah.`
        );
      }
    };

    const interval = setInterval(checkReminders, 30000);
    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, [settings.reminders, settings.remindersEnabled]);

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
    setWakeLock(newSettings.keepAwake);
    toggleFullscreen(newSettings.fullscreen);

    // Refresh flyers if googleSheetUrl changed
    if (newSettings.googleSheetUrl !== settings.googleSheetUrl) {
      fetchFlyersFromGoogleSheets(newSettings.googleSheetUrl).then((fetched) => {
        if (fetched && fetched.length > 0) setFlyers(fetched);
      });
    }
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

  // Responsive container (orientation lock removed, natural responsive max-w)
  const orientationContainerClass = 'w-full h-full max-h-full flex flex-col overflow-hidden max-w-md sm:max-w-xl mx-auto';
  const rootContainerClass = `h-screen h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col transition-colors duration-200 ${
    settings.themeStyle === 'retro'
      ? 'bg-[#fbf7ee] dark:bg-[#1a1714] text-[#2c221a] dark:text-[#f3ede2]'
      : 'bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100'
  } ${settings.theme === 'dark' ? 'dark' : ''}`;

  return (
    <div className={rootContainerClass}>
      <div className={orientationContainerClass}>
        {/* In-app Reminder Banner Notification */}
        {inAppAlert && (
          <div className="shrink-0 z-50 p-3 mx-4 mt-2 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{inAppAlert.title}</div>
                <div className="text-[10px] text-emerald-100 truncate">{inAppAlert.body}</div>
              </div>
            </div>
            <button
              onClick={() => setInAppAlert(null)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
          /* ================= BERANDA (HOME SCREEN) - NON-SCROLLABLE WITH EXPANDED ASMAUL HUSNA & FLYER CAROUSEL ================= */
          <div className={`flex flex-col h-full max-h-full w-full px-4 sm:px-6 py-3 sm:py-4 overflow-hidden ${
            settings.themeStyle === 'retro'
              ? 'bg-[#fbf7ee] dark:bg-[#1a1714] text-[#2c221a] dark:text-[#f3ede2]'
              : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
          }`}>
            {/* Top Minimal Bar */}
            <header className="shrink-0 flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl p-1 flex items-center justify-center shadow-xs ${
                  settings.themeStyle === 'modern-glow'
                    ? 'bg-slate-900 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : settings.themeStyle === 'retro'
                    ? 'bg-[#f4ebd0] dark:bg-[#2e261f] border border-[#8c502b] dark:border-[#d97706] shadow-[2px_2px_0px_#8c502b]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}>
                  <img src="/assets/aistudio/appIco_5f517e82.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-tight">
                    Dzikir &amp; Do'a
                  </span>
                  <span className="text-[10px] opacity-70 block leading-none">
                    Al-Ma'tsurat &amp; Sunnah
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleTheme}
                  title={settings.theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                  className={`p-2 rounded-xl transition-all active:scale-95 shadow-xs ${
                    settings.themeStyle === 'modern-glow'
                      ? 'bg-slate-900 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.25)] hover:border-cyan-400'
                      : settings.themeStyle === 'retro'
                      ? 'bg-[#f4ebd0] dark:bg-[#2e261f] border border-[#8c502b] dark:border-[#d97706] shadow-[2px_2px_0px_#8c502b]'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {settings.theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  )}
                </button>
                <button
                  onClick={() => navigateToTab('setelan')}
                  title="Buka Setelan"
                  className={`p-2 rounded-xl transition-all active:scale-95 shadow-xs ${
                    settings.themeStyle === 'modern-glow'
                      ? 'bg-slate-900 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.25)] hover:border-cyan-400'
                      : settings.themeStyle === 'retro'
                      ? 'bg-[#f4ebd0] dark:bg-[#2e261f] border border-[#8c502b] dark:border-[#d97706] shadow-[2px_2px_0px_#8c502b]'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Title: Flat, Simple & Modern */}
            <div className="shrink-0 text-center pt-1 pb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight select-none">
                Dzikir &amp; Doa
              </h1>
              <p className="text-[10px] sm:text-[11px] opacity-75 mt-0.5">
                Kumpulan Dzikir Harian, Doa &amp; Panduan Sholat
              </p>
            </div>

            {/* Flyer Nasehat: Pure Image Carousel without text/nav buttons */}
            <div className="shrink-0 my-1 sm:my-1.5">
              <FlyerCarousel
                flyers={flyers}
                themeStyle={settings.themeStyle}
                intervalSeconds={settings.carouselInterval || 5}
              />
            </div>

            {/* Asmaul Husna: Fills remaining vertical space */}
            {currentAsmaul && (
              <div className="flex-1 min-h-[85px] my-1 sm:my-1.5 overflow-hidden flex flex-col">
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
            <footer className="shrink-0 pt-1.5 pb-0.5 text-center text-[10px] opacity-60 select-none">
              <p>Dzikir Pagi • Dzikir Petang • Doa Harian • Bab Sholat</p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
