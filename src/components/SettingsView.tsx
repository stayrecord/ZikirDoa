import React, { useState } from 'react';
import { AppSettings, OrientationLockMode, CounterAnimationMode, ThemeStyle } from '../types';
import { 
  ArrowLeft, Moon, Sun, Lock, Maximize2, Smartphone, 
  Vibrate, Type, Check, AlertTriangle, Eye, ShieldCheck,
  CheckCircle2, Sliders, Palette
} from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none overflow-hidden">
      {/* ================= FIXED TOP HEADER ================= */}
      <header className={`shrink-0 w-full z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-xs ${
        settings.themeStyle === 'modern-glow'
          ? 'border-b border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          : settings.themeStyle === 'anime-flat'
          ? 'border-b-2 border-slate-900 dark:border-white shadow-[0_2px_0px_#0f172a]'
          : 'border-b border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackPress}
            className={`p-1.5 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 ${
              settings.themeStyle === 'anime-flat'
                ? 'border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#38bdf8]'
                : settings.themeStyle === 'modern-glow'
                ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300 hover:border-cyan-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Setelan Aplikasi
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Konfigurasi tema gaya, tampilan &amp; fitur dzikir
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
        {/* GRUP 0: PILIHAN GAYA TEMA (KLASIK ISLAMI, MODERN GLOW, ANIME FLAT) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Gaya Desain / Tema Visual
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
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
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Bawaan Aktif
                  </span>
                  {settings.themeStyle === 'classic' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold">Klasik Islami</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Desain minimalis islami dengan warna zamrud elegan &amp; aksen lembut.
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
                  Tepi tombol bercahaya neon cyan &amp; emerald dengan aura futuristik.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-md bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                <div className="w-3.5 h-3.5 rounded-md bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
                <span className="text-[10px] text-cyan-300 font-mono">Neon Halo</span>
              </div>
            </button>

            {/* 3. Anime Flat */}
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, themeStyle: 'anime-flat' }))}
              className={`relative p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between border-2 border-slate-900 dark:border-white ${
                settings.themeStyle === 'anime-flat'
                  ? 'bg-sky-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-[3.5px_3.5px_0px_0px_#0f172a] dark:shadow-[3.5px_3.5px_0px_0px_#38bdf8]'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#38bdf8] hover:shadow-[3px_3px_0px_0px_#0f172a]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-300 text-slate-900 border border-slate-900 uppercase">
                    Anime Flat
                  </span>
                  {settings.themeStyle === 'anime-flat' && (
                    <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight">Anime Flat</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  Gaya datar komik 2D, garis tepi tegas tebal 2px &amp; bayangan solid tanpa karakter.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t-2 border-slate-900 dark:border-white/50 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-sky-400 border border-slate-900"></div>
                <div className="w-3.5 h-3.5 bg-rose-400 border border-slate-900"></div>
                <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 uppercase">Cel-Shaded</span>
              </div>
            </button>
          </div>
        </section>

        {/* GRUP 1: OPSI UMUM */}
        <section className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-1">
            Opsi Umum
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.keepAwake}
                  onChange={(e) => setSettings(s => ({ ...s, keepAwake: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.fullscreen}
                  onChange={(e) => setSettings(s => ({ ...s, fullscreen: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Kunci Orientasi Layar */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-500 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Kunci Orientasi Layar</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Pilih orientasi layar perangkat Anda</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { id: 'auto', label: 'Otomatis' },
                  { id: 'portrait', label: 'Potret' },
                  { id: 'landscape', label: 'Lanskap' }
                ].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, orientationLock: o.id as OrientationLockMode }))}
                    className={`py-2 px-1 rounded-xl text-center border transition-all text-xs ${
                      settings.orientationLock === o.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GRUP 2: OPSI DZIKIR PAGI & PETANG */}
        <section className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-1">
            Opsi Dzikir Pagi &amp; Petang
          </h3>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
            {/* Counter Aktif / Tidak */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Tombol Counter Dzikir</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Tampilkan tombol hitung pada dzikir berulang</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.counterEnabled}
                  onChange={(e) => setSettings(s => ({ ...s, counterEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Bergetar atau tidak + durasi slider */}
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Efek Getar Taktil</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Getar saat tombol counter ditekan</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hapticEnabled}
                    onChange={(e) => setSettings(s => ({ ...s, hapticEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
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
                    Mematikan opsi ini membuat halaman termuat lebih cepat &amp; fokus
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showLatinDefault}
                    onChange={(e) => setSettings(s => ({ ...s, showLatinDefault: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Sub-option jika Latin diaktifkan */}
              {settings.showLatinDefault && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300">
                      Langsung buka kartu Latin saat memuat halaman
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoExpandLatin}
                    onChange={(e) => setSettings(s => ({ ...s, autoExpandLatin: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoExpandDalil}
                  onChange={(e) => setSettings(s => ({ ...s, autoExpandDalil: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </section>

        {/* GRUP 3: UKURAN FONT & ANIMASI */}
        <section className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-1">
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
              {/* Live Preview Latin */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-left space-y-1">
                <p className="text-slate-800 dark:text-slate-300 italic" style={{ fontSize: `${settings.latinFontSize}px` }}>
                  "Subhanallah wa bihamdihi"
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs" style={{ fontSize: `${Math.max(11, settings.latinFontSize - 2)}px` }}>
                  Maha Suci Allah dan segala puji bagi-Nya.
                </p>
              </div>
            </div>

            {/* Pilihan 5 Animasi Counter */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <label className="font-semibold text-slate-800 dark:text-slate-200 block">
                Animasi Tekanan Counter (5 Pilihan)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { id: 'fluid', label: 'Fluid Wave' },
                  { id: 'pulse', label: 'Pulse Bounce' },
                  { id: 'spark', label: 'Glow Aura' },
                  { id: 'squish', label: 'Haptic Squish' },
                  { id: 'pop', label: 'Minimal Pop' }
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, counterAnimation: a.id as CounterAnimationMode }))}
                    className={`py-2 px-2 rounded-xl text-center border text-[11px] transition-all ${
                      settings.counterAnimation === a.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FIXED BOTTOM APPLY BAR ================= */}
      <footer className={`shrink-0 w-full mt-auto z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 flex items-center justify-between gap-3 max-w-xl mx-auto ${
        settings.themeStyle === 'modern-glow'
          ? 'border-t border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          : settings.themeStyle === 'anime-flat'
          ? 'border-t-2 border-slate-900 dark:border-white shadow-[0_-2px_0px_#0f172a]'
          : 'border-t border-slate-200 dark:border-slate-800 shadow-xs'
      }`}>
        <button
          onClick={handleBackPress}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs transition-all active:scale-95 ${
            settings.themeStyle === 'anime-flat'
              ? 'border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#38bdf8] uppercase font-bold'
              : settings.themeStyle === 'modern-glow'
              ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300 hover:border-cyan-400'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-xs'
          }`}
        >
          Kembali
        </button>

        <button
          onClick={handleApply}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
            settings.themeStyle === 'modern-glow'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:opacity-95 text-white border border-cyan-300/50 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : settings.themeStyle === 'anime-flat'
              ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#38bdf8] uppercase font-black'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/20'
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
