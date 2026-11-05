import React, { useState, useEffect, useRef } from 'react';
import { DzikirItem, AppSettings, CounterButtonSize, CounterButtonPosition, CounterAnimationMode } from '../types';
import { parseRepetitionLimit } from '../data/contentLoader';
import { triggerHapticVibration, playGentleClickSound } from '../utils/feedback';
import { HelpModal } from './HelpModal';
import { CounterConfigModal } from './CounterConfigModal';
import { 
  ChevronLeft, ChevronRight, HelpCircle, 
  RotateCcw, CheckCircle2, ChevronDown, ChevronUp, ArrowLeft,
  List
} from 'lucide-react';

interface DzikirReaderProps {
  type: 'pagi' | 'petang';
  items: DzikirItem[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const DzikirReader: React.FC<DzikirReaderProps> = ({
  type,
  items,
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState<{ [index: number]: number }>({});
  const [revealedLatin, setRevealedLatin] = useState<{ [index: number]: boolean }>({});
  const [revealedDalil, setRevealedDalil] = useState<{ [index: number]: boolean }>({});
  const [showHelp, setShowHelp] = useState(false);
  const [showCounterConfig, setShowCounterConfig] = useState(false);
  const [showIndexDrawer, setShowIndexDrawer] = useState(false);
  const [isPressingCounter, setIsPressingCounter] = useState(false);
  
  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const longPressTimer = useRef<any>(null);

  const isMorning = type === 'pagi';
  const themeAccent = isMorning
    ? {
        primary: 'emerald',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        counterBg: 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400',
        glow: 'shadow-emerald-500/30',
        ring: 'ring-emerald-400',
        title: 'Dzikir Pagi',
        navActive: 'bg-emerald-600 text-white'
      }
    : {
        primary: 'indigo',
        badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        counterBg: 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-500',
        glow: 'shadow-indigo-500/30',
        ring: 'ring-indigo-400',
        title: 'Dzikir Petang',
        navActive: 'bg-indigo-600 text-white'
      };

  const currentItem = items[currentIndex];
  const totalItems = items.length;

  // Initialize auto-expand settings
  useEffect(() => {
    if (settings.autoExpandLatin) {
      setRevealedLatin((prev) => ({ ...prev, [currentIndex]: true }));
    }
    if (settings.autoExpandDalil) {
      setRevealedDalil((prev) => ({ ...prev, [currentIndex]: true }));
    }
  }, [currentIndex, settings.autoExpandLatin, settings.autoExpandDalil]);

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <p>Memuat dzikir...</p>
      </div>
    );
  }

  const repetitionLimit = parseRepetitionLimit(currentItem.KALI);
  const currentCount = counts[currentIndex] || 0;
  const isFinished = repetitionLimit > 0 && currentCount >= repetitionLimit;

  // Next / Prev handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ' && repetitionLimit > 1) {
        e.preventDefault();
        handleCounterPress();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalItems, repetitionLimit, currentCount]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && currentIndex < totalItems - 1) {
      handleNext();
    } else if (diff < -50 && currentIndex > 0) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Counter press
  const handleCounterPress = () => {
    if (settings.hapticEnabled) {
      triggerHapticVibration(settings.hapticDuration);
    }
    playGentleClickSound();
    setIsPressingCounter(true);
    setTimeout(() => setIsPressingCounter(false), 300);

    setCounts((prev) => {
      const cur = prev[currentIndex] || 0;
      const next = repetitionLimit > 0 ? Math.min(repetitionLimit, cur + 1) : cur + 1;
      return { ...prev, [currentIndex]: next };
    });
  };

  const handleResetCount = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCounts((prev) => ({ ...prev, [currentIndex]: 0 }));
  };

  // Long press handler for counter button
  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      triggerHapticVibration(70);
      setShowCounterConfig(true);
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Card toggles
  const toggleLatin = () => {
    setRevealedLatin((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const toggleDalil = () => {
    setRevealedDalil((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  // Counter size & position classes
  const sizeClasses: Record<CounterButtonSize, { container: string; countText: string; iconSize: string }> = {
    small: { container: 'w-14 h-14', countText: 'text-xl', iconSize: 'w-6 h-6' },
    medium: { container: 'w-16 h-16', countText: 'text-2xl', iconSize: 'w-7 h-7' },
    large: { container: 'w-20 h-20', countText: 'text-3xl', iconSize: 'w-8 h-8' },
    jumbo: { container: 'w-24 h-24', countText: 'text-4xl', iconSize: 'w-10 h-10' }
  };

  const positionClasses: Record<CounterButtonPosition, string> = {
    right: 'right-5 bottom-6',
    center: 'left-1/2 -translate-x-1/2 bottom-6',
    left: 'left-5 bottom-6',
    float: 'right-6 bottom-16'
  };

  const animationClass = {
    fluid: 'anim-fluid-wave',
    pulse: 'anim-pulse-bounce',
    spark: 'anim-glow-spark',
    squish: 'anim-haptic-squish',
    pop: 'anim-minimal-pop'
  }[settings.counterAnimation];

  const isLatinVisible = !!revealedLatin[currentIndex] || (settings.showLatinDefault && settings.autoExpandLatin);
  const isDalilVisible = !!revealedDalil[currentIndex] || settings.autoExpandDalil;

  return (
    <div 
      className="relative flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ================= FIXED TOP HEADER (SELALU MENTOK KE ATAS) ================= */}
      <header className={`shrink-0 w-full z-30 px-4 py-2.5 shadow-xs flex items-center justify-between gap-2 ${
        settings.themeStyle === 'modern-glow'
          ? 'bg-slate-900/95 border-b border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white'
          : settings.themeStyle === 'retro'
          ? 'bg-[#f4ebd0]/95 dark:bg-[#231d17]/95 border-b-2 border-[#8c502b] dark:border-[#d97706] text-[#2c221a] dark:text-[#f3ede2]'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
      }`}>
        {/* Left: Back & Title info */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className={`p-1.5 -ml-1 rounded-xl transition-all active:scale-95 ${
              settings.themeStyle === 'retro'
                ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#fbf7ee] dark:bg-[#2e261f] text-[#8c502b] dark:text-[#fcd34d] shadow-[2px_2px_0px_#8c502b]'
                : settings.themeStyle === 'modern-glow'
                ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {currentItem.JUDUL}
              </span>
              {currentItem.KALI && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${
                  settings.themeStyle === 'retro'
                    ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#ebd7b2] dark:bg-[#34281e] text-[#8c502b] dark:text-[#fcd34d] font-bold uppercase'
                    : themeAccent.badge
                }`}>
                  {currentItem.KALI}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {themeAccent.title}
            </div>
          </div>
        </div>

        {/* Right: Small compact Help icon & Page Counter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Bantuan Navigasi"
            aria-label="Bantuan"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Quick jump page counter */}
          <button
            onClick={() => setShowIndexDrawer(true)}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 flex items-center gap-1 active:scale-95 transition-all"
            title="Daftar Halaman"
          >
            <List className="w-3 h-3 text-slate-400" />
            <span>{currentIndex + 1} / {totalItems}</span>
          </button>
        </div>
      </header>

      {/* ================= VERTICALLY SCROLLABLE CONTENT (HANYA TENGAH YANG SCROLL) ================= */}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pb-28 space-y-4 max-w-3xl mx-auto w-full">
        {/* ARABIC CARD (Tappable to toggle Latin) */}
        <div
          onClick={toggleLatin}
          role="button"
          tabIndex={0}
          className="relative group p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/40 shadow-xs cursor-pointer transition-all duration-200 active:scale-[0.99]"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {currentItem.JUDUL}
            </span>
            <span className="flex items-center text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
              {isLatinVisible ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </div>

          {/* Arabic Text */}
          <div
            className="font-arabic text-emerald-950 dark:text-amber-200 leading-loose select-none text-right py-2 drop-shadow-xs"
            style={{ fontSize: `${settings.arabicFontSize}px` }}
          >
            {currentItem.ARAB}
          </div>
        </div>

        {/* LATIN CARD (Collapsible) */}
        {isLatinVisible && (
          <div 
            onClick={toggleLatin}
            className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-500/25 shadow-xs cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Transliterasi Latin</span>
            </div>
            <p 
              className="text-slate-800 dark:text-slate-200 italic leading-relaxed"
              style={{ fontSize: `${settings.latinFontSize}px` }}
            >
              {currentItem.LATIN}
            </p>
          </div>
        )}

        {/* ARTI CARD (Tappable to toggle Sumber & Dalil) */}
        <div
          onClick={toggleDalil}
          role="button"
          tabIndex={0}
          className="relative group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/30 shadow-xs cursor-pointer transition-all duration-200 active:scale-[0.99]"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
            <span className="font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider text-[10px]">
              Arti / Terjemahan
            </span>
            <span className="flex items-center text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
              {isDalilVisible ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </div>

          {/* HTML / Plain meaning */}
          <div 
            className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm prose prose-slate dark:prose-invert max-w-none text-left"
            style={{ fontSize: `${settings.latinFontSize}px` }}
            dangerouslySetInnerHTML={{ __html: currentItem.ARTI }}
          />
        </div>

        {/* SUMBER & DALIL CARD (Collapsible) */}
        {isDalilVisible && currentItem.SUMBER && (
          <div 
            onClick={toggleDalil}
            className="p-4 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/20 border border-cyan-200/90 dark:border-cyan-500/25 shadow-xs cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-all animate-in fade-in slide-in-from-top-2 duration-200 text-left"
          >
            <div className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Rujukan &amp; Faedah Dalil</span>
            </div>
            <div 
              className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed prose prose-slate dark:prose-invert max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: currentItem.SUMBER }}
            />
          </div>
        )}
      </main>

      {/* ================= BOTTOM NAVIGATION BAR & COUNTER ================= */}
      {/* Floating or fixed Counter Button (HANYA MUNCUL JIKA > 1x, TERSEMBUNYI JIKA HANYA 1x) */}
      {settings.counterEnabled && repetitionLimit > 1 && (
        <div className={`fixed z-40 ${positionClasses[settings.counterPosition]}`}>
          <div className="relative">
            {/* Reset button badge */}
            {currentCount > 0 && (
              <button
                onClick={handleResetCount}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 flex items-center justify-center shadow-md active:scale-90 transition-all z-10"
                title="Reset Hitungan"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}

            {/* Main Interactive Counter Button - Transparan 60%, Hanya Angka di Tengah */}
            <button
              onClick={handleCounterPress}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-150 select-none opacity-60 hover:opacity-85 active:opacity-100 backdrop-blur-md ${
                sizeClasses[settings.counterSize].container
              } ${
                settings.themeStyle === 'modern-glow'
                  ? 'border-2 border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)] glow-halo-pulse'
                  : settings.themeStyle === 'retro'
                  ? 'border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3px_3px_0px_#8c502b]'
                  : 'border border-white/20'
              } ${
                isFinished
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 ring-4 ring-emerald-300/40 shadow-emerald-500/50'
                  : `${themeAccent.counterBg} ${themeAccent.glow}`
              } ${isPressingCounter ? animationClass : 'active:scale-95'}`}
              title="Counter zikir (tekan lama untuk setelan)"
            >
              {isFinished ? (
                <CheckCircle2 className={`${sizeClasses[settings.counterSize].iconSize} text-white drop-shadow`} />
              ) : (
                <span className={`font-mono tabular-nums font-extrabold tracking-tight drop-shadow-sm leading-none ${sizeClasses[settings.counterSize].countText}`}>
                  {currentCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= FIXED BOTTOM FOOTER (SELALU MENTOK DI BAWAH SCREEN) ================= */}
      <footer className={`shrink-0 w-full mt-auto z-30 px-4 py-2.5 flex items-center justify-between shadow-xs ${
        settings.themeStyle === 'modern-glow'
          ? 'bg-slate-900/95 border-t border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white'
          : settings.themeStyle === 'retro'
          ? 'bg-[#f4ebd0]/95 dark:bg-[#231d17]/95 border-t-2 border-[#8c502b] dark:border-[#d97706] text-[#2c221a] dark:text-[#f3ede2]'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800'
      }`}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Sebelumnya"
          className={`p-2.5 rounded-xl disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all shadow-xs ${
            settings.themeStyle === 'retro'
              ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#fbf7ee] dark:bg-[#2e261f] text-[#8c502b] dark:text-[#fcd34d] shadow-[2px_2px_0px_#8c502b]'
              : settings.themeStyle === 'modern-glow'
              ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className={`text-[12px] font-mono font-medium ${
          settings.themeStyle === 'retro' 
            ? 'font-bold px-2 py-0.5 rounded bg-[#ebd7b2] dark:bg-[#34281e] text-[#8c502b] dark:text-[#fcd34d] border border-[#8c502b] dark:border-[#d97706]' 
            : settings.themeStyle === 'modern-glow'
            ? 'text-cyan-300 font-bold'
            : 'text-slate-600 dark:text-slate-400'
        }`}>
          {currentIndex + 1} / {totalItems}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === totalItems - 1}
          aria-label="Selanjutnya"
          className={`p-2.5 rounded-xl disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all shadow-xs ${
            settings.themeStyle === 'retro'
              ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#fbf7ee] dark:bg-[#2e261f] text-[#8c502b] dark:text-[#fcd34d] shadow-[2px_2px_0px_#8c502b]'
              : settings.themeStyle === 'modern-glow'
              ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>

      {/* ================= MODALS & DRAWERS ================= */}
      {/* Help Modal */}
      {showHelp && (
        <HelpModal 
          onClose={() => setShowHelp(false)} 
          title={`Panduan ${themeAccent.title}`} 
        />
      )}

      {/* Counter Config Modal (triggered on long press) */}
      {showCounterConfig && (
        <CounterConfigModal
          currentSize={settings.counterSize}
          currentPosition={settings.counterPosition}
          currentDuration={settings.hapticDuration}
          currentAnimation={settings.counterAnimation}
          onSave={(size, pos, dur, anim) => {
            onUpdateSettings({
              counterSize: size,
              counterPosition: pos,
              hapticDuration: dur,
              counterAnimation: anim
            });
          }}
          onClose={() => setShowCounterConfig(false)}
        />
      )}

      {/* Page Index Quick-Jump Drawer */}
      {showIndexDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Daftar Dzikir ({totalItems})</h3>
              <button
                onClick={() => setShowIndexDrawer(false)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Tutup
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowIndexDrawer(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    idx === currentIndex
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-500/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{item.JUDUL}</span>
                  </div>
                  {item.KALI && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-normal ml-2">
                      {item.KALI}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
