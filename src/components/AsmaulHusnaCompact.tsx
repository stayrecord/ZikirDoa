import React, { useState, useEffect } from 'react';
import { AsmaulHusnaItem, ThemeStyle } from '../types';
import { ASMAUL_HUSNA, getNextAsmaulHusna } from '../data/asmaulHusna';
import { Sparkles, X, Search, Grid, RefreshCw } from 'lucide-react';

interface AsmaulHusnaCompactProps {
  current: AsmaulHusnaItem;
  onAdvance?: (next: AsmaulHusnaItem) => void;
  themeStyle?: ThemeStyle;
}

export const AsmaulHusnaCompact: React.FC<AsmaulHusnaCompactProps> = ({ 
  current, 
  onAdvance,
  themeStyle = 'classic' 
}) => {
  const [activeItem, setActiveItem] = useState<AsmaulHusnaItem>(current);
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep activeItem synced if prop updates
  useEffect(() => {
    setActiveItem(current);
  }, [current]);

  // Handle hardware & browser back button to close popup without leaving the page
  useEffect(() => {
    const handlePopState = () => {
      if (showAllModal) {
        setShowAllModal(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showAllModal]);

  const openModal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Push modal state into history so the hardware/browser back button pops it
    window.history.pushState({ modal: 'asmaul-husna' }, '');
    setShowAllModal(true);
  };

  const closeModal = () => {
    if (showAllModal) {
      if (window.history.state && window.history.state.modal === 'asmaul-husna') {
        window.history.back();
      } else {
        setShowAllModal(false);
      }
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = getNextAsmaulHusna();
    setActiveItem(next);
    if (onAdvance) onAdvance(next);
  };

  const handleSelectItem = (item: AsmaulHusnaItem) => {
    setActiveItem(item);
    if (onAdvance) onAdvance(item);
    closeModal();
  };

  const filteredList = ASMAUL_HUSNA.filter(item => 
    item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.number.toString().includes(searchQuery)
  );

  // Theme-specific styles
  const getContainerStyle = () => {
    if (themeStyle === 'modern-glow') {
      return 'bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 dark:border-cyan-400/60 shadow-[0_0_16px_rgba(6,182,212,0.3)] hover:shadow-[0_0_22px_rgba(6,182,212,0.45)] rounded-2xl';
    }
    if (themeStyle === 'anime-flat') {
      return 'bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white shadow-[3.5px_3.5px_0px_0px_#0f172a] dark:shadow-[3.5px_3.5px_0px_0px_#38bdf8] rounded-2xl';
    }
    // Classic
    return 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800/80 shadow-xs rounded-2xl';
  };

  const getBadgeStyle = () => {
    if (themeStyle === 'modern-glow') {
      return 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
    }
    if (themeStyle === 'anime-flat') {
      return 'bg-sky-200 dark:bg-sky-900 text-slate-900 dark:text-sky-200 border-2 border-slate-900 dark:border-white font-black';
    }
    return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/50 font-bold';
  };

  const getButtonStyle = () => {
    if (themeStyle === 'modern-glow') {
      return 'p-1.5 rounded-xl text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all active:scale-95';
    }
    if (themeStyle === 'anime-flat') {
      return 'p-1.5 rounded-xl text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#38bdf8] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all';
    }
    return 'p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors active:scale-95';
  };

  return (
    <>
      {/* Full Available Height Asmaul Husna Card with Flexible Layout */}
      <div 
        onClick={() => handleNext()}
        role="button"
        tabIndex={0}
        title="Ketuk untuk beralih ke nama berikutnya"
        className={`group relative cursor-pointer w-full h-full min-h-[95px] p-3 sm:p-4 transition-all duration-200 flex flex-col justify-between select-none ${getContainerStyle()}`}
      >
        {/* Top Header Row of Card */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[11px] leading-tight flex items-center justify-center ${getBadgeStyle()}`}>
              #{activeItem.number}
            </span>
            <span className={`text-[11px] font-semibold tracking-tight ${themeStyle === 'modern-glow' ? 'text-cyan-400' : themeStyle === 'anime-flat' ? 'text-slate-900 dark:text-white uppercase font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
              Asmaul Husna
            </span>
          </div>

          {/* Quick Action Buttons (Next & View All) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNext}
              className={getButtonStyle()}
              title="Ganti ke nama berikutnya"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={openModal}
              className={getButtonStyle()}
              title="Lihat semua 99 Asmaul Husna"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Content: Big Calligraphy Arabic & Translation (Centered & Balanced) */}
        <div className="my-auto py-1 flex flex-col items-center justify-center text-center">
          <div 
            className={`font-arabic text-3xl sm:text-4xl font-bold leading-normal select-none ${
              themeStyle === 'modern-glow' 
                ? 'text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                : themeStyle === 'anime-flat' 
                ? 'text-slate-900 dark:text-white font-extrabold' 
                : 'text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {activeItem.arab}
          </div>

          <div className="mt-1 flex items-center justify-center gap-2 flex-wrap">
            <span className={`text-sm sm:text-base font-extrabold tracking-tight ${
              themeStyle === 'modern-glow' ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>
              {activeItem.latin}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs hidden sm:inline">•</span>
            <span className={`text-xs sm:text-sm font-medium ${
              themeStyle === 'modern-glow' ? 'text-cyan-200/80' : 'text-slate-600 dark:text-slate-300'
            }`}>
              {activeItem.arti}
            </span>
          </div>
        </div>

        {/* Bottom subtle indicator */}
        <div className="shrink-0 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1">
          <span className="italic">Ketuk kartu untuk nama berikutnya</span>
          <span className="font-mono opacity-80">99 Nama Indah Allah</span>
        </div>
      </div>

      {/* ================= MODAL 99 ASMAUL HUSNA ================= */}
      {showAllModal && (
        <div 
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-none"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden ${
              themeStyle === 'modern-glow'
                ? 'bg-slate-900 border border-cyan-500/50 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                : themeStyle === 'anime-flat'
                ? 'bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#38bdf8]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${
              themeStyle === 'modern-glow'
                ? 'border-cyan-500/30 bg-slate-950/60'
                : themeStyle === 'anime-flat'
                ? 'border-b-2 border-slate-900 dark:border-white bg-sky-100 dark:bg-slate-800'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${themeStyle === 'modern-glow' ? 'text-cyan-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <h3 className="text-base font-bold">99 Asmaul Husna</h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Tutup (atau tekan tombol Kembali)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className={`p-3 border-b ${
              themeStyle === 'modern-glow'
                ? 'border-cyan-500/20 bg-slate-950/40'
                : themeStyle === 'anime-flat'
                ? 'border-b-2 border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40'
            }`}>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama latin, arti, atau nomor..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none ${
                    themeStyle === 'modern-glow'
                      ? 'bg-slate-800/90 border border-cyan-500/40 text-white placeholder-slate-400 focus:border-cyan-400'
                      : themeStyle === 'anime-flat'
                      ? 'bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white placeholder-slate-400'
                      : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredList.map((item) => {
                const isSelected = item.number === activeItem.number;
                return (
                  <button
                    key={item.number}
                    onClick={() => handleSelectItem(item)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                      isSelected
                        ? themeStyle === 'modern-glow'
                          ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : themeStyle === 'anime-flat'
                          ? 'bg-sky-200 dark:bg-sky-950/60 border-2 border-slate-900 dark:border-white font-bold'
                          : 'bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                        : themeStyle === 'anime-flat'
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                        themeStyle === 'modern-glow'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : themeStyle === 'anime-flat'
                          ? 'bg-amber-200 dark:bg-amber-900 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {item.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold">{item.latin}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.arti}</p>
                      </div>
                    </div>
                    <span className={`font-arabic text-xl text-right pr-2 shrink-0 select-none ${
                      themeStyle === 'modern-glow' ? 'text-cyan-300' : 'text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {item.arab}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
