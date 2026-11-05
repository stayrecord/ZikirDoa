import React, { useState, useRef, useEffect } from 'react';
import { DoaItem, BabSholatItem, AppSettings } from '../types';
import { HelpModal } from './HelpModal';
import { 
  ArrowLeft, Search, BookOpen, ChevronRight, ChevronLeft, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, List
} from 'lucide-react';

interface DoaSholatViewProps {
  type: 'doa' | 'sholat';
  items: (DoaItem | BabSholatItem)[];
  settings: AppSettings;
  onBack: () => void;
}

export const DoaSholatView: React.FC<DoaSholatViewProps> = ({
  type,
  items,
  settings,
  onBack
}) => {
  // If activeItemIndex is null, show the list. If number, show the reader.
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [subItemIndex, setSubItemIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedLatin, setRevealedLatin] = useState<{ [key: string]: boolean }>({});
  const [revealedDalil, setRevealedDalil] = useState<{ [key: string]: boolean }>({});
  const [showHelp, setShowHelp] = useState(false);
  const [showIndexDrawer, setShowIndexDrawer] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const isDoa = type === 'doa';
  const theme = isDoa
    ? {
        name: 'Doa Harian',
        badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
        accentBg: 'from-teal-900/40 via-cyan-900/30 to-slate-900',
        activePill: 'bg-teal-600 text-white',
        borderGlow: 'hover:border-teal-500/40'
      }
    : {
        name: 'Bab Sholat',
        badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        accentBg: 'from-emerald-900/40 via-teal-900/30 to-slate-900',
        activePill: 'bg-emerald-600 text-white',
        borderGlow: 'hover:border-emerald-500/40'
      };

  // Filter list by title
  const filteredItems = items.filter(item => 
    item.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Synchronize history state for sub-items in Doa/Sholat
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab === type && typeof e.state.itemIndex === 'number') {
        setActiveItemIndex(e.state.itemIndex);
        setSubItemIndex(0);
      } else {
        setActiveItemIndex(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [type]);

  // When changing item, push state so back button returns to list
  const handleOpenItem = (index: number) => {
    setActiveItemIndex(index);
    setSubItemIndex(0);
    window.history.pushState({ tab: type, itemIndex: index }, '');
  };

  const handleReaderBack = () => {
    if (window.history.state && typeof window.history.state.itemIndex === 'number') {
      window.history.back();
    } else {
      setActiveItemIndex(null);
    }
  };

  const currentItem = activeItemIndex !== null ? items[activeItemIndex] : null;

  // Touch swipe handling in reader mode
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || activeItemIndex === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && activeItemIndex < items.length - 1) {
      setActiveItemIndex(activeItemIndex + 1);
      setSubItemIndex(0);
    } else if (diff < -50 && activeItemIndex > 0) {
      setActiveItemIndex(activeItemIndex - 1);
      setSubItemIndex(0);
    }
    touchStartX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    if (activeItemIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeItemIndex > 0) {
        setActiveItemIndex(activeItemIndex - 1);
        setSubItemIndex(0);
      }
      if (e.key === 'ArrowRight' && activeItemIndex < items.length - 1) {
        setActiveItemIndex(activeItemIndex + 1);
        setSubItemIndex(0);
      }
      if (e.key === 'Escape') {
        setActiveItemIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemIndex, items.length]);

  // Extract sections from `isi`
  const getSubSections = () => {
    if (!currentItem) return [];
    return currentItem.isi.map((row, idx) => {
      let prefix = '';
      let arab = '';
      let latin = '';
      let arti = '';

      if (row.length === 4) {
        prefix = row[0] || '';
        arab = row[1] || '';
        latin = row[2] || '';
        arti = row[3] || '';
      } else if (row.length === 3) {
        arab = row[0] || '';
        latin = row[1] || '';
        arti = row[2] || '';
      } else if (row.length >= 1) {
        arti = row[0] || '';
      }

      return {
        key: `${activeItemIndex}-${idx}`,
        prefix,
        arab,
        latin,
        arti
      };
    });
  };

  const subSections = getSubSections();

  // ================= VIEW 1: LIST VIEW FIRST =================
  if (activeItemIndex === null) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <header className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between gap-3 shadow-xs ${
          settings.themeStyle === 'modern-glow'
            ? 'bg-slate-900/95 border-b border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white'
            : settings.themeStyle === 'retro'
            ? 'bg-[#f4ebd0]/95 dark:bg-[#231d17]/95 border-b-2 border-[#8c502b] dark:border-[#d97706] text-[#2c221a] dark:text-[#f3ede2]'
            : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
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
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {theme.name}
              </h2>
              <p className="text-[10px] opacity-75">
                Pilih judul untuk membuka halaman baca
              </p>
            </div>
          </div>

          <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${
            settings.themeStyle === 'retro'
              ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#ebd7b2] dark:bg-[#34281e] text-[#8c502b] dark:text-[#fcd34d] font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}>
            {filteredItems.length} Materi
          </span>
        </header>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/80">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari ${theme.name.toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 space-y-2 max-w-xl mx-auto w-full">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada judul yang cocok dengan "{searchQuery}"
            </div>
          ) : (
            filteredItems.map((item, originalIndex) => {
              // Find index in main array
              const actualIndex = items.indexOf(item);
              const countParts = item.isi?.length || 1;

              return (
                <button
                  key={actualIndex}
                  onClick={() => handleOpenItem(actualIndex)}
                  className={`w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 ${theme.borderGlow} text-left flex items-center justify-between gap-3 transition-all active:scale-[0.99] group shadow-xs`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:border-emerald-500/40">
                      {actualIndex + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {item.judul}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {countParts} Bagian bacaan
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ================= VIEW 2: FULL READER MODE (WITH HORIZONTAL SWIPE) =================
  return (
    <div 
      className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-hidden"
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
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleReaderBack}
            className={`p-1.5 -ml-1 rounded-xl transition-all active:scale-95 ${
              settings.themeStyle === 'retro'
                ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#fbf7ee] dark:bg-[#2e261f] text-[#8c502b] dark:text-[#fcd34d] shadow-[2px_2px_0px_#8c502b]'
                : settings.themeStyle === 'modern-glow'
                ? 'border border-cyan-400/40 bg-slate-800/80 text-cyan-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Kembali ke Daftar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {currentItem?.judul}
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {theme.name}
            </span>
          </div>
        </div>

        {/* Right tools: Help & Page Counter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Bantuan Navigasi"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowIndexDrawer(true)}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 flex items-center gap-1 active:scale-95 transition-all"
            title="Daftar Materi"
          >
            <List className="w-3 h-3 text-slate-400" />
            <span>{(activeItemIndex ?? 0) + 1} / {items.length}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area (Hanya Tengah yang Scroll) */}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pb-24 space-y-4 max-w-3xl mx-auto w-full">
        {subSections.map((sec, secIdx) => {
          const isLatinOpen = !!revealedLatin[sec.key] || (settings.showLatinDefault && settings.autoExpandLatin);
          const isDalilOpen = !!revealedDalil[sec.key] || settings.autoExpandDalil;

          return (
            <div key={sec.key} className="space-y-3 p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs">
              {/* Optional Section Prefix / Subtitle */}
              {sec.prefix && (
                <div 
                  className="text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed font-medium prose prose-slate dark:prose-invert max-w-none text-left"
                  dangerouslySetInnerHTML={{ __html: sec.prefix }}
                />
              )}

              {/* Arabic Card (if arabic text exists) */}
              {sec.arab ? (
                <div
                  onClick={() => setRevealedLatin(p => ({ ...p, [sec.key]: !p[sec.key] }))}
                  role="button"
                  tabIndex={0}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/40 shadow-xs cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-200/80 dark:border-slate-800/60 pb-1.5">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Bagian {secIdx + 1}
                    </span>
                    <span className="flex items-center text-slate-400 dark:text-slate-500">
                      {isLatinOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </div>

                  <div
                    className="font-arabic text-emerald-950 dark:text-amber-200 leading-loose select-none text-right py-1"
                    style={{ fontSize: `${settings.arabicFontSize}px` }}
                  >
                    {sec.arab}
                  </div>
                </div>
              ) : null}

              {/* Latin Card (Collapsible) */}
              {sec.latin && isLatinOpen && (
                <div 
                  onClick={() => setRevealedLatin(p => ({ ...p, [sec.key]: !p[sec.key] }))}
                  className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-500/25 shadow-xs cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all animate-in fade-in slide-in-from-top-1 text-left"
                >
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Transliterasi Latin</span>
                  </div>
                  <p 
                    className="text-slate-800 dark:text-slate-200 italic leading-relaxed"
                    style={{ fontSize: `${settings.latinFontSize}px` }}
                  >
                    {sec.latin}
                  </p>
                </div>
              )}

              {/* Arti / Penjelasan HTML Card */}
              {sec.arti && (
                <div
                  onClick={() => setRevealedDalil(p => ({ ...p, [sec.key]: !p[sec.key] }))}
                  role="button"
                  tabIndex={0}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/30 shadow-xs cursor-pointer transition-all active:scale-[0.99] text-left"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-200/80 dark:border-slate-800/60 pb-1">
                    <span className="font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider text-[10px]">
                      {sec.arab ? 'Terjemahan' : 'Pembahasan & Referensi'}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {isDalilOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>

                  <div 
                    className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm prose prose-slate dark:prose-invert max-w-none text-left"
                    style={{ fontSize: `${settings.latinFontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: sec.arti }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Horizontal Swipe Footer Navigation */}
      {/* ================= FIXED BOTTOM FOOTER (SELALU MENTOK DI BAWAH SCREEN) ================= */}
      <footer className={`shrink-0 w-full mt-auto z-30 px-4 py-2.5 flex items-center justify-between shadow-xs ${
        settings.themeStyle === 'modern-glow'
          ? 'bg-slate-900/95 border-t border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white'
          : settings.themeStyle === 'retro'
          ? 'bg-[#f4ebd0]/95 dark:bg-[#231d17]/95 border-t-2 border-[#8c502b] dark:border-[#d97706] text-[#2c221a] dark:text-[#f3ede2]'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800'
      }`}>
        <button
          onClick={() => {
            if (activeItemIndex > 0) setActiveItemIndex(activeItemIndex - 1);
          }}
          disabled={activeItemIndex === 0}
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

        <button
          onClick={handleReaderBack}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            settings.themeStyle === 'retro'
              ? 'border border-[#8c502b] dark:border-[#d97706] bg-[#ebd7b2] dark:bg-[#34281e] text-[#8c502b] dark:text-[#fcd34d] font-bold'
              : settings.themeStyle === 'modern-glow'
              ? 'text-cyan-300 hover:text-cyan-200'
              : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Lihat Daftar
        </button>

        <button
          onClick={() => {
            if (activeItemIndex < items.length - 1) setActiveItemIndex(activeItemIndex + 1);
          }}
          disabled={activeItemIndex === items.length - 1}
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

      {/* Help Modal */}
      {showHelp && (
        <HelpModal 
          onClose={() => setShowHelp(false)} 
          title={`Panduan ${theme.name}`} 
        />
      )}

      {/* Index Quick-Jump Drawer */}
      {showIndexDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Daftar Isi {theme.name}</h3>
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
                    setActiveItemIndex(idx);
                    setShowIndexDrawer(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    idx === activeItemIndex
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-500/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{item.judul}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
