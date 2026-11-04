import React, { useState } from 'react';
import { AsmaulHusnaItem } from '../types';
import { ASMAUL_HUSNA } from '../data/asmaulHusna';
import { Sparkles, ChevronLeft, ChevronRight, Grid, X, Search } from 'lucide-react';

interface AsmaulHusnaCardProps {
  current: AsmaulHusnaItem;
  arabicSize?: number;
}

export const AsmaulHusnaCard: React.FC<AsmaulHusnaCardProps> = ({ current, arabicSize = 30 }) => {
  const [activeItem, setActiveItem] = useState<AsmaulHusnaItem>(current);
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevNum = activeItem.number === 1 ? 99 : activeItem.number - 1;
    setActiveItem(ASMAUL_HUSNA[prevNum - 1]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextNum = activeItem.number === 99 ? 1 : activeItem.number + 1;
    setActiveItem(ASMAUL_HUSNA[nextNum - 1]);
  };

  const filteredList = ASMAUL_HUSNA.filter(item => 
    item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.number.toString().includes(searchQuery)
  );

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-slate-900 border border-emerald-500/20 shadow-lg text-white p-4 transition-all">
        {/* Subtle decorative watermark */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Asmaul Husna #{activeItem.number}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              title="Sebelumnya"
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              title="Selanjutnya"
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAllModal(true)}
              title="Daftar 99 Asmaul Husna"
              className="px-2 py-1 ml-1 text-[11px] font-medium rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 flex items-center gap-1 active:scale-95 transition-all"
            >
              <Grid className="w-3 h-3" />
              <span>Semua</span>
            </button>
          </div>
        </div>

        {/* Content row: Arabic on right/top, Latin & meaning */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
          <div>
            <h3 className="text-lg font-bold text-emerald-100 tracking-wide">
              {activeItem.latin}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1">
              {activeItem.arti}
            </p>
          </div>
          <div 
            className="font-arabic font-bold text-amber-200 text-right select-none drop-shadow-sm self-end sm:self-center"
            style={{ fontSize: `${Math.max(26, arabicSize)}px`, lineHeight: 1.5 }}
          >
            {activeItem.arab}
          </div>
        </div>
      </div>

      {/* Modal Daftar 99 Asmaul Husna */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">99 Asmaul Husna</h3>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/40">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama latin, arti, atau nomor..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-800/40">
              {filteredList.map((item) => (
                <button
                  key={item.number}
                  onClick={() => {
                    setActiveItem(item);
                    setShowAllModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                    item.number === activeItem.number
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                      : 'hover:bg-slate-800/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-emerald-400 shrink-0">
                      {item.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold">{item.latin}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.arti}</p>
                    </div>
                  </div>
                  <span className="font-arabic text-xl text-amber-200 text-right pr-2 shrink-0">
                    {item.arab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
