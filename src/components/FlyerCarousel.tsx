import React, { useState, useEffect, useRef } from 'react';
import { NasehatFlyer, ThemeStyle } from '../types';
import { X, Share2, Copy, Check, Sparkles } from 'lucide-react';

interface FlyerCarouselProps {
  flyers: NasehatFlyer[];
  themeStyle?: ThemeStyle;
  intervalSeconds?: number;
}

export const FlyerCarousel: React.FC<FlyerCarouselProps> = ({
  flyers,
  themeStyle = 'classic',
  intervalSeconds = 5
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFlyer, setSelectedFlyer] = useState<NasehatFlyer | null>(null);
  const [copied, setCopied] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer (pauses when modal is open)
  useEffect(() => {
    if (flyers.length <= 1 || selectedFlyer) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flyers.length);
    }, intervalSeconds * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [flyers.length, intervalSeconds, selectedFlyer]);

  // Handle hardware & browser back button to close popup
  useEffect(() => {
    const handlePopState = () => {
      if (selectedFlyer) {
        setSelectedFlyer(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedFlyer]);

  const openFlyerModal = (flyer: NasehatFlyer) => {
    window.history.pushState({ modal: 'flyer-detail' }, '');
    setSelectedFlyer(flyer);
  };

  const closeFlyerModal = () => {
    if (selectedFlyer) {
      if (window.history.state && window.history.state.modal === 'flyer-detail') {
        window.history.back();
      } else {
        setSelectedFlyer(null);
      }
    }
  };

  const handleShare = async () => {
    if (!selectedFlyer) return;
    const shareText = `${selectedFlyer.title}\n\n${selectedFlyer.content}\n\n(Sumber: ${selectedFlyer.source || 'Aplikasi Dzikir & Doa'})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedFlyer.title,
          text: shareText
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = () => {
    if (!selectedFlyer) return;
    const shareText = `${selectedFlyer.title}\n\n${selectedFlyer.content}\n\n(Sumber: ${selectedFlyer.source || 'Aplikasi Dzikir & Doa'})`;
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Next
        setCurrentIndex((prev) => (prev + 1) % flyers.length);
      } else {
        // Prev
        setCurrentIndex((prev) => (prev - 1 + flyers.length) % flyers.length);
      }
    }
    setTouchStart(null);
  };

  if (!flyers || flyers.length === 0) return null;

  const currentFlyer = flyers[currentIndex];

  // Container styling matching active theme
  let containerBorderClass = '';
  if (themeStyle === 'modern-glow') {
    containerBorderClass = 'border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]';
  } else if (themeStyle === 'retro') {
    containerBorderClass = 'border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3px_3px_0px_#8c502b] dark:shadow-[3px_3px_0px_#d97706]';
  } else {
    // Classic
    containerBorderClass = 'border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700/60';
  }

  return (
    <>
      {/* ================= PURE IMAGE CAROUSEL (NO TEXT, NO NAVIGATION BUTTONS) ================= */}
      <div className="w-full select-none">
        <div
          role="button"
          tabIndex={0}
          title="Ketuk untuk melihat isi nasehat"
          onClick={() => openFlyerModal(currentFlyer)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 active:scale-[0.99] bg-slate-900 ${containerBorderClass}`}
        >
          {/* Pure flyer image card */}
          <img
            src={currentFlyer.imageUrl}
            alt={currentFlyer.title}
            className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-102"
          />

          {/* Minimal aesthetic dot indicators at bottom */}
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
            {flyers.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? themeStyle === 'modern-glow'
                      ? 'w-4 h-1.5 bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                      : themeStyle === 'retro'
                      ? 'w-4 h-1.5 bg-amber-500'
                      : 'w-4 h-1.5 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL FULL CONTENT POPUP ================= */}
      {selectedFlyer && (
        <div
          onClick={closeFlyerModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${
              themeStyle === 'modern-glow'
                ? 'bg-slate-900 border border-cyan-500/50 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                : themeStyle === 'retro'
                ? 'bg-[#fbf7ee] dark:bg-[#1a1714] border-2 border-[#8c502b] dark:border-[#d97706] text-[#2c221a] dark:text-[#f3ede2] shadow-[6px_6px_0px_#8c502b]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            {/* Header */}
            <div className={`shrink-0 flex items-center justify-between px-5 py-3.5 border-b ${
              themeStyle === 'retro'
                ? 'border-[#c9bba6] dark:border-[#4d4034] bg-[#f4ebd0]/70 dark:bg-[#25201b]'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${
                  themeStyle === 'modern-glow' ? 'text-cyan-400' : themeStyle === 'retro' ? 'text-amber-600' : 'text-emerald-600'
                }`} />
                <h3 className="text-sm font-bold truncate">Flyer Nasehat &amp; Dalil</h3>
              </div>
              <button
                onClick={closeFlyerModal}
                className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
              {/* Full Image */}
              <div className="w-full aspect-[21/9] sm:aspect-[24/9] rounded-2xl overflow-hidden shadow-md">
                <img
                  src={selectedFlyer.imageUrl}
                  alt={selectedFlyer.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Badge */}
              <div>
                {selectedFlyer.badge && (
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase mb-1.5 ${
                    themeStyle === 'modern-glow'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : themeStyle === 'retro'
                      ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-400'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {selectedFlyer.badge}
                  </span>
                )}
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  {selectedFlyer.title}
                </h2>
              </div>

              {/* Dalil / Content */}
              <div className={`p-4 rounded-2xl border leading-relaxed space-y-2.5 ${
                themeStyle === 'retro'
                  ? 'bg-white/60 dark:bg-[#201c18] border-[#c9bba6] dark:border-[#4d4034]'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80'
              }`}>
                <div className="whitespace-pre-line text-slate-700 dark:text-slate-200 font-medium">
                  {selectedFlyer.content}
                </div>

                {selectedFlyer.source && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Sumber: {selectedFlyer.source}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`shrink-0 flex items-center justify-between gap-2 px-5 py-3 border-t ${
              themeStyle === 'retro'
                ? 'border-[#c9bba6] dark:border-[#4d4034] bg-[#f4ebd0]/70 dark:bg-[#25201b]'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60'
            }`}>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
              </button>

              <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 text-white ${
                  themeStyle === 'modern-glow'
                    ? 'bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : themeStyle === 'retro'
                    ? 'bg-[#8c502b] hover:bg-[#a05d33] shadow-md'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/20'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan Nasehat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
