import React, { useState } from 'react';
import { AppSettings, ThemeStyle, ReminderItem } from '../types';
import { ToggleSwitch } from './ToggleSwitch';
import { 
  ArrowLeft, Moon, Sun, Smartphone, Maximize2,
  Vibrate, Type, Check, AlertTriangle, Eye,
  CheckCircle2, Sliders, Palette, Bell, Clock, 
  Volume2, FileSpreadsheet, RefreshCw, Sparkles 
} from 'lucide-react';
import { 
  triggerNotification, 
  requestNotificationPermission, 
  getNotificationPermission,
  playNotificationChime
} from '../utils/reminderService';
import { fetchFlyersFromGoogleSheets } from '../data/nasehatFlyers';

interface SettingsViewProps {
  currentSettings: AppSettings;
  onApplySettings: (saved: AppSettings) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentSettings,
  onApplySettings,
  onBack
}) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<string | null>(null);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string>(getNotificationPermission());

  // Check if there are unsaved modifications
  const isDirty = JSON.stringify(settings) !== JSON.stringify(currentSettings);

  const handleBackPress = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      onBack();
    }
  };

  const handleApply = () => {
    onApplySettings(settings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 1500);
  };

  const handleDiscardAndLeave = () => {
    setShowUnsavedModal(false);
    onBack();
  };

  const handleApplyAndLeave = () => {
    onApplySettings(settings);
    setShowUnsavedModal(false);
    onBack();
  };

  // Test Notification & Chime
  const handleTestNotification = async () => {
    if (notificationStatus !== 'granted') {
      const perm = await requestNotificationPermission();
      setNotificationStatus(perm);
    }
    triggerNotification(
      'Uji Pengingat Dzikir',
      'Waktunya dzikir dan mengingat Allah Ta\'ala. Semoga berkah senantiasa menyertai.'
    );
  };

  // Toggle Reminder item
  const handleToggleReminder = (id: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, enabled } : r)
    }));
  };

  // Update Reminder time
  const handleUpdateTime = (id: string, time: string) => {
    setSettings(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, time } : r)
    }));
  };

  // Sync Google Spreadsheet
  const handleSyncGoogleSheet = async () => {
    if (!settings.googleSheetUrl.trim()) {
      setSheetSyncStatus('Masukkan tautan Google Spreadsheet terlebih dahulu.');
      return;
    }
    setIsSyncingSheet(true);
    setSheetSyncStatus(null);
    try {
      const flyers = await fetchFlyersFromGoogleSheets(settings.googleSheetUrl);
      setSheetSyncStatus(`Berhasil sinkronkan ${flyers.length} flyer nasehat!`);
    } catch {
      setSheetSyncStatus('Gagal memuat sheet. Pastikan spreadsheet dipublikasikan ke web (CSV).');
    } finally {
      setIsSyncingSheet(false);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full select-none overflow-hidden ${
      settings.themeStyle === 'retro'
        ? 'bg-[#fbf7ee] dark:bg-[#1a1714] text-[#2c221a] dark:text-[#f3ede2]'
        : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      {/* ================= FIXED TOP HEADER ================= */}
      <header className={`shrink-0 w-full z-30 px-4 py-3 flex items-center justify-between shadow-xs ${
        settings.themeStyle === 'modern-glow'
          ? 'bg-slate-900/95 border-b border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white'
          : settings.themeStyle === 'retro'
          ? 'bg-[#f4ebd0]/95 dark:bg-[#231d17]/95 border-b-2 border-[#8c502b] dark:border-[#d97706]'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackPress}
            className={`p-1.5 -ml-1 rounded-xl transition-all active:scale-95 ${
              settings.themeStyle === 'retro'
                ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#fbf7ee] dark:bg-[#2e261f] text-[#8c502b] dark:text-[#fcd34d] shadow-[2px_2px_0px_#8c502b]'
                : settings.themeStyle === 'modern-glow'
                ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300 hover:border-cyan-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5">
              <Sliders className={`w-4 h-4 ${
                settings.themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d]' : 'text-emerald-600 dark:text-emerald-400'
              }`} />
              Setelan Aplikasi
            </h2>
            <p className="text-[10px] opacity-75">
              Tema retro, pengingat dzikir &amp; opsi aplikasi
            </p>
          </div>
        </div>

        {isDirty && (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-medium animate-pulse">
            Ada Perubahan
          </span>
        )}
      </header>

      {/* Main Settings Body (Hanya Tengah yang Scroll) */}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pb-28 space-y-5 max-w-xl mx-auto w-full text-xs">
        {/* GRUP 0: PILIHAN GAYA TEMA (KLASIK, MODERN GLOW, RETRO) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              settings.themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d]' : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              <Palette className="w-3.5 h-3.5" />
              Gaya Desain &amp; Tema Visual
            </h3>
            <span className="text-[10px] opacity-70 font-mono">
              3 Pilihan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Klasik Islami */}
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, themeStyle: 'classic' }))}
              className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                settings.themeStyle === 'classic'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Klasik
                  </span>
                  {settings.themeStyle === 'classic' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold">Klasik Islami</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Minimalis bersih dengan warna zamrud menenangkan.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-md bg-emerald-600"></div>
                <div className="w-3.5 h-3.5 rounded-md bg-amber-500"></div>
                <span className="text-[10px] text-slate-400 font-mono">Original</span>
              </div>
            </button>

            {/* 2. Modern Glow */}
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, themeStyle: 'modern-glow' }))}
              className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                settings.themeStyle === 'modern-glow'
                  ? 'border-cyan-400 bg-slate-900 text-white ring-2 ring-cyan-400/50 shadow-[0_0_18px_rgba(6,182,212,0.4)]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:border-cyan-400/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Modern Glow
                  </span>
                  {settings.themeStyle === 'modern-glow' && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Modern Glow</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-1 leading-snug">
                  Tepi tombol bercahaya neon cyan &amp; aksen futuristik.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-md bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                <div className="w-3.5 h-3.5 rounded-md bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
                <span className="text-[10px] text-cyan-300 font-mono">Neon Halo</span>
              </div>
            </button>

            {/* 3. Retro Vintage (Baru) */}
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, themeStyle: 'retro' }))}
              className={`relative p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between border-2 ${
                settings.themeStyle === 'retro'
                  ? 'bg-[#f4ebd0] dark:bg-[#28211a] border-[#8c502b] dark:border-[#d97706] text-[#2c221a] dark:text-[#f3ede2] shadow-[3.5px_3.5px_0px_#8c502b] dark:shadow-[3.5px_3.5px_0px_#d97706]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#8c502b]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ebd7b2] dark:bg-[#423326] text-[#8c502b] dark:text-[#fcd34d] border border-[#8c502b] dark:border-[#d97706] uppercase">
                    Retro
                  </span>
                  {settings.themeStyle === 'retro' && (
                    <CheckCircle2 className="w-4 h-4 text-[#8c502b] dark:text-[#fcd34d]" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-tight">Retro Vintage</h4>
                <p className="text-[11px] opacity-80 mt-1 leading-snug">
                  Nuansa hangat kertas perkamen 90-an, aksen terracotta &amp; bayangan taktil vintage.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#8c502b]/30 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[#8c502b]"></div>
                <div className="w-3.5 h-3.5 rounded bg-[#d97706]"></div>
                <span className="text-[10px] font-bold opacity-80 uppercase">Parchment</span>
              </div>
            </button>
          </div>
        </section>

        {/* GRUP 1: FITUR PENGINGAT (REMINDER) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              settings.themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d]' : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              <Bell className="w-3.5 h-3.5" />
              Pengingat Waktu Dzikir (Reminder)
            </h3>
            <button
              onClick={handleTestNotification}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                settings.themeStyle === 'retro'
                  ? 'bg-[#ebd7b2] dark:bg-[#34281e] text-[#8c502b] dark:text-[#fcd34d] border border-[#8c502b] dark:border-[#d97706]'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>Uji Notifikasi</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
            {/* Master Reminder Toggle */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Aktifkan Pengingat Dzikir</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Notifikasi lonceng &amp; pesan saat waktu tiba</div>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.remindersEnabled}
                onChange={(checked) => setSettings(s => ({ ...s, remindersEnabled: checked }))}
                ariaLabel="Aktifkan pengingat dzikir"
              />
            </div>

            {/* List individual reminder times */}
            {settings.remindersEnabled && (
              <div className="p-3.5 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
                {settings.reminders.map((rem) => (
                  <div key={rem.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{rem.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{rem.subtitle}</div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="time"
                          value={rem.time}
                          onChange={(e) => handleUpdateTime(rem.id, e.target.value)}
                          className="bg-transparent text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <ToggleSwitch
                        size="sm"
                        checked={rem.enabled}
                        onChange={(checked) => handleToggleReminder(rem.id, checked)}
                        ariaLabel={`Aktifkan pengingat ${rem.title}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* GRUP 2: KONEKSI GOOGLE SPREADSHEET (CAROUSEL NASEHAT) */}
        <section className="space-y-2.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-1 ${
            settings.themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d]' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Koneksi Google Spreadsheet (Flyer Nasehat)
          </h3>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Tautkan link Google Spreadsheet yang dipublikasikan ke web (format CSV) untuk memperbarui konten flyer nasehat secara otomatis tanpa mengubah kode aplikasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={settings.googleSheetUrl}
                onChange={(e) => setSettings(s => ({ ...s, googleSheetUrl: e.target.value }))}
                placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleSyncGoogleSheet}
                disabled={isSyncingSheet}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                <span>{isSyncingSheet ? 'Sinkron...' : 'Sinkronkan'}</span>
              </button>
            </div>
            {sheetSyncStatus && (
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                {sheetSyncStatus}
              </p>
            )}
          </div>
        </section>

        {/* GRUP 3: OPSI TAMPILAN & PERANGKAT (KUNCI ORIENTASI TELAH DIHAPUS) */}
        <section className="space-y-2.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider px-1 ${
            settings.themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d]' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            Opsi Tampilan &amp; Layar
          </h3>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
            {/* Mode Gelap / Terang */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-500 shrink-0">
                  {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Mode Gelap / Terang</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {settings.theme === 'dark' ? 'Mode Gelap (Malam)' : 'Mode Terang (Siang)'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, theme: 'light' }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    settings.theme === 'light' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Terang
                </button>
                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    settings.theme === 'dark' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Gelap
                </button>
              </div>
            </div>

            {/* Layar Selalu Menyala (WakeLock) */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Layar Selalu Menyala</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Cegah layar mati otomatis saat berdzikir</div>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.keepAwake}
                onChange={(checked) => setSettings(s => ({ ...s, keepAwake: checked }))}
                ariaLabel="Layar selalu menyala"
              />
            </div>

            {/* Mode Full Layar */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Mode Layar Penuh</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Sembunyikan bilah browser saat aktif</div>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.fullscreen}
                onChange={(checked) => setSettings(s => ({ ...s, fullscreen: checked }))}
                ariaLabel="Mode layar penuh"
              />
            </div>
          </div>
        </section>

        {/* GRUP 4: OPSI DZIKIR PAGI & PETANG */}
        <section className="space-y-2.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider px-1 ${
            settings.themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d]' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            Opsi Dzikir Pagi &amp; Petang
          </h3>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
            {/* Counter Aktif / Tidak */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Tombol Counter Dzikir</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Tampilkan tombol hitung pada dzikir berulang</div>
              </div>
              <ToggleSwitch
                checked={settings.counterEnabled}
                onChange={(checked) => setSettings(s => ({ ...s, counterEnabled: checked }))}
                ariaLabel="Tombol counter dzikir"
              />
            </div>

            {/* Efek Getar Taktil */}
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Efek Getar Taktil</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Getar saat tombol counter ditekan</div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.hapticEnabled}
                  onChange={(checked) => setSettings(s => ({ ...s, hapticEnabled: checked }))}
                  ariaLabel="Efek getar taktil"
                />
              </div>

              {settings.hapticEnabled && (
                <div className="pt-1.5 pl-6 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Durasi getaran</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">{settings.hapticDuration} ms</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={settings.hapticDuration}
                    onChange={(e) => setSettings(s => ({ ...s, hapticDuration: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Tampilkan Latin saat membuka halaman */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Tampilkan Teks Latin</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mematikan opsi ini membuat pembacaan lebih fokus
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.showLatinDefault}
                  onChange={(checked) => setSettings(s => ({ ...s, showLatinDefault: checked }))}
                  ariaLabel="Tampilkan teks latin"
                />
              </div>

              {settings.showLatinDefault && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300">
                      Langsung buka kartu Latin saat memuat halaman
                    </span>
                  </div>
                  <ToggleSwitch
                    size="sm"
                    checked={settings.autoExpandLatin}
                    onChange={(checked) => setSettings(s => ({ ...s, autoExpandLatin: checked }))}
                    ariaLabel="Langsung buka kartu latin"
                  />
                </div>
              )}
            </div>

            {/* Tampilkan Dalil saat memuat halaman */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Langsung Buka Sumber &amp; Dalil</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Otomatis buka penjelasan hadits pada kartu dzikir</div>
              </div>
              <ToggleSwitch
                checked={settings.autoExpandDalil}
                onChange={(checked) => setSettings(s => ({ ...s, autoExpandDalil: checked }))}
                ariaLabel="Langsung buka dalil"
              />
            </div>
          </div>
        </section>

        {/* GRUP 5: UKURAN FONT & TIPOGRAFI (ANIMASI TEKANAN TELAH DIHAPUS DARI SINI) */}
        <section className="space-y-2.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider px-1 ${
            settings.themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d]' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            Ukuran Font &amp; Tipografi
          </h3>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-4 shadow-xs">
            {/* Slider Font Arabic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-500" />
                  Ukuran Teks Arab
                </span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">{settings.arabicFontSize} px</span>
              </div>
              <input
                type="range"
                min="22"
                max="44"
                step="2"
                value={settings.arabicFontSize}
                onChange={(e) => setSettings(s => ({ ...s, arabicFontSize: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              {/* Live Preview Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center">
                <div 
                  className="font-arabic text-emerald-950 dark:text-amber-200 leading-loose"
                  style={{ fontSize: `${settings.arabicFontSize}px` }}
                >
                  سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
                </div>
              </div>
            </div>

            {/* Slider Font Latin & Arti */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Ukuran Teks Latin &amp; Terjemahan
                </span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">{settings.latinFontSize} px</span>
              </div>
              <input
                type="range"
                min="13"
                max="20"
                step="1"
                value={settings.latinFontSize}
                onChange={(e) => setSettings(s => ({ ...s, latinFontSize: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-left space-y-1">
                <p className="italic" style={{ fontSize: `${settings.latinFontSize}px` }}>
                  "Subhanallah wa bihamdihi"
                </p>
                <p className="opacity-70 text-xs" style={{ fontSize: `${Math.max(11, settings.latinFontSize - 2)}px` }}>
                  Maha Suci Allah dan segala puji bagi-Nya.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FIXED BOTTOM APPLY BAR ================= */}
      <footer className={`shrink-0 w-full mt-auto z-30 p-4 flex items-center justify-between gap-3 max-w-xl mx-auto ${
        settings.themeStyle === 'modern-glow'
          ? 'bg-slate-900/95 border-t border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          : settings.themeStyle === 'retro'
          ? 'bg-[#f4ebd0]/95 dark:bg-[#231d17]/95 border-t-2 border-[#8c502b] dark:border-[#d97706]'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xs'
      }`}>
        <button
          onClick={handleBackPress}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs transition-all active:scale-95 ${
            settings.themeStyle === 'retro'
              ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#fbf7ee] dark:bg-[#2e261f] text-[#8c502b] dark:text-[#fcd34d] font-bold shadow-[2px_2px_0px_#8c502b]'
              : settings.themeStyle === 'modern-glow'
              ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300 hover:border-cyan-400'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-xs'
          }`}
        >
          Kembali
        </button>

        <button
          onClick={handleApply}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 text-white ${
            settings.themeStyle === 'modern-glow'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:opacity-95 border border-cyan-300/50 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : settings.themeStyle === 'retro'
              ? 'bg-[#8c502b] hover:bg-[#a05d33] border border-[#d97706] shadow-[3px_3px_0px_#d97706]'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/20'
          }`}
        >
          {savedToast ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Pengaturan Diterapkan!</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Terapkan Opsi Pengaturan</span>
            </>
          )}
        </button>
      </footer>

      {/* ================= CUSTOM CONFIRMATION POPUP ================= */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-3xl shadow-2xl p-5 text-center space-y-4 text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Perubahan Belum Diterapkan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed">
                Anda telah mengubah setelan aplikasi namun belum menyimpannya. Ingin menerapkan atau membatalkan perubahan ini?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleDiscardAndLeave}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold active:scale-95 transition-all"
              >
                Batalkan
              </button>
              <button
                onClick={handleApplyAndLeave}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold active:scale-95 transition-all shadow-md shadow-emerald-900/20"
              >
                Terapkan &amp; Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
