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
    if (themeStyle === 'retro') {
      return 'bg-[#fcf8ed] dark:bg-[#201a14] border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3.5px_3.5px_0px_0px_#8c502b] dark:shadow-[3.5px_3.5px_0px_0px_#d97706] rounded-2xl text-[#2c221a] dark:text-[#f3ede2]';
    }
    // Classic
    return 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800/80 shadow-xs rounded-2xl';
  };

  const getBadgeStyle = () => {
    if (themeStyle === 'modern-glow') {
      return 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
    }
    if (themeStyle === 'retro') {
      return 'bg-[#f4ebd0] dark:bg-[#34291f] text-[#8c502b] dark:text-[#fcd34d] border border-[#8c502b] dark:border-[#d97706] font-bold';
    }
    return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/50 font-bold';
  };

  const getButtonStyle = () => {
    if (themeStyle === 'modern-glow') {
      return 'p-1.5 rounded-xl text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all active:scale-95';
    }
    if (themeStyle === 'retro') {
      return 'p-1.5 rounded-xl text-[#8c502b] dark:text-[#fcd34d] bg-[#f4ebd0] dark:bg-[#34291f] border border-[#8c502b] dark:border-[#d97706] shadow-[2px_2px_0px_0px_#8c502b] dark:shadow-[2px_2px_0px_0px_#d97706] active:translate-x-0.5 active:translate-y-0.5 transition-all';
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
            <span className={`text-[11px] font-semibold tracking-tight ${themeStyle === 'modern-glow' ? 'text-cyan-400' : themeStyle === 'retro' ? 'text-[#8c502b] dark:text-[#fcd34d] font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
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
                : themeStyle === 'retro' 
                ? 'text-[#8c502b] dark:text-[#fef08a] font-bold' 
                : 'text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {activeItem.arab}
          </div>

          <div className="mt-1 flex items-center justify-center gap-2 flex-wrap">
            <span className={`text-sm sm:text-base font-extrabold tracking-tight ${
              themeStyle === 'modern-glow' ? 'text-white' : themeStyle === 'retro' ? 'text-[#2c221a] dark:text-white' : 'text-slate-900 dark:text-white'
            }`}>
              {activeItem.latin}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs hidden sm:inline">•</span>
            <span className={`text-xs sm:text-sm font-medium ${
              themeStyle === 'modern-glow' ? 'text-cyan-200/80' : themeStyle === 'retro' ? 'text-[#6b5849] dark:text-[#d3c7b8]' : 'text-slate-600 dark:text-slate-300'
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
                : themeStyle === 'retro'
                ? 'bg-[#fbf7ee] dark:bg-[#1a1714] border-2 border-[#8c502b] dark:border-[#d97706] text-[#2c221a] dark:text-[#f3ede2] shadow-[6px_6px_0px_#8c502b]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            {/* Header */}
            <div className={`shrink-0 flex items-center justify-between px-5 py-4 border-b ${
              themeStyle === 'retro'
                ? 'border-[#c9bba6] dark:border-[#4d4034] bg-[#f4ebd0]/70 dark:bg-[#25201b]'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${
                  themeStyle === 'modern-glow' ? 'text-cyan-400' : themeStyle === 'retro' ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'
                }`} />
                <h3 className="text-base font-bold">99 Asmaul Husna</h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Filter */}
            <div className={`p-3 border-b shrink-0 ${
              themeStyle === 'retro'
                ? 'border-[#c9bba6] dark:border-[#4d4034] bg-[#fbf7ee] dark:bg-[#1f1a16]'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20'
            }`}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau arti Asmaul Husna..."
                  className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none ${
                    themeStyle === 'retro'
                      ? 'bg-white dark:bg-[#28221c] border-[#c9bba6] dark:border-[#524438] text-[#2c221a] dark:text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid Items List */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {filteredList.map((item) => (
                <button
                  key={item.number}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
                    item.number === activeItem.number
                      ? themeStyle === 'modern-glow'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 ring-2 ring-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : themeStyle === 'retro'
                        ? 'border-[#8c502b] bg-[#f4ebd0] dark:bg-[#32271d] text-[#8c502b] dark:text-[#fcd34d] font-bold shadow-xs'
                        : 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500/30'
                      : themeStyle === 'retro'
                      ? 'border-[#c9bba6] dark:border-[#4d4034] bg-white/70 dark:bg-[#201a14] hover:bg-[#f4ebd0]/50'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {item.number}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">{item.latin}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.arti}</div>
                    </div>
                  </div>
                  <div className="font-arabic text-xl font-bold text-right shrink-0">
                    {item.arab}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
