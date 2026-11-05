import React from 'react';
import { Sun, Moon, BookOpen, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { ThemeStyle } from '../types';

interface HomeMenuProps {
  onSelect: (page: 'pagi' | 'petang' | 'doa' | 'sholat' | 'setelan') => void;
  dzikirPagiCount?: number;
  dzikirPetangCount?: number;
  doaCount?: number;
  sholatCount?: number;
  themeStyle?: ThemeStyle;
}

// Clean flat Mosque Dome icon
const MosqueDomeIcon = ({ className = "w-4 h-4 sm:w-5 sm:h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3c-3 3.5-5 6.5-5 9.5a5 5 0 0 0 10 0C17 9.5 15 6.5 12 3z" />
    <path d="M4 21V13.5a1.5 1.5 0 0 1 1.5-1.5h13a1.5 1.5 0 0 1 1.5 1.5V21" />
    <path d="M10 21v-4a2 2 0 1 1 4 0v4" />
    <path d="M12 3V1.5" />
  </svg>
);

export const HomeMenu: React.FC<HomeMenuProps> = ({ 
  onSelect,
  dzikirPagiCount = 20,
  dzikirPetangCount = 20,
  doaCount = 22,
  sholatCount = 14,
  themeStyle = 'classic'
}) => {
  const menuItems: {
    id: 'pagi' | 'petang' | 'doa' | 'sholat' | 'setelan';
    title: string;
    subtitle: string;
    countTag?: string;
    iconBg: string;
    iconColor: string;
    glowBorder?: string;
    retroBorder?: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'pagi',
      title: 'Dzikir Pagi',
      subtitle: 'Dibaca setelah subuh hingga fajar',
      countTag: `${dzikirPagiCount} Dzikir`,
      iconBg: 'bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
      glowBorder: 'border-amber-400/50 dark:border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.22)] hover:shadow-[0_0_18px_rgba(245,158,11,0.45)]',
      retroBorder: 'bg-[#fcf8ed] dark:bg-[#231d17] border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3px_3px_0px_0px_#8c502b] dark:shadow-[3px_3px_0px_0px_#d97706]',
      icon: <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: 'petang',
      title: 'Dzikir Petang',
      subtitle: 'Dibaca setelah ashar menjelang maghrib',
      countTag: `${dzikirPetangCount} Dzikir`,
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      glowBorder: 'border-indigo-400/50 dark:border-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.22)] hover:shadow-[0_0_18px_rgba(99,102,241,0.45)]',
      retroBorder: 'bg-[#fcf8ed] dark:bg-[#231d17] border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3px_3px_0px_0px_#8c502b] dark:shadow-[3px_3px_0px_0px_#d97706]',
      icon: <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: 'sholat',
      title: 'Bab Sholat',
      subtitle: 'Panduan tata cara & syarat fiqh sholat',
      countTag: `${sholatCount} Bab`,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      glowBorder: 'border-emerald-400/50 dark:border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.22)] hover:shadow-[0_0_18px_rgba(16,185,129,0.45)]',
      retroBorder: 'bg-[#fcf8ed] dark:bg-[#231d17] border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3px_3px_0px_0px_#8c502b] dark:shadow-[3px_3px_0px_0px_#d97706]',
      icon: <MosqueDomeIcon />
    },
    {
      id: 'doa',
      title: 'Doa Harian',
      subtitle: 'Kumpulan doa sahih aktivitas sehari-hari',
      countTag: `${doaCount} Doa`,
      iconBg: 'bg-teal-100 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60',
      iconColor: 'text-teal-600 dark:text-teal-400',
      glowBorder: 'border-teal-400/50 dark:border-teal-400/60 shadow-[0_0_12px_rgba(20,184,166,0.22)] hover:shadow-[0_0_18px_rgba(20,184,166,0.45)]',
      retroBorder: 'bg-[#fcf8ed] dark:bg-[#231d17] border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3px_3px_0px_0px_#8c502b] dark:shadow-[3px_3px_0px_0px_#d97706]',
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: 'setelan',
      title: 'Setelan Aplikasi',
      subtitle: 'Ubah tema retro, reminder & opsi dzikir',
      countTag: 'Kustom',
      iconBg: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
      iconColor: 'text-slate-600 dark:text-slate-300',
      glowBorder: 'border-cyan-400/50 dark:border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.22)] hover:shadow-[0_0_18px_rgba(6,182,212,0.45)]',
      retroBorder: 'bg-[#fcf8ed] dark:bg-[#231d17] border-2 border-[#8c502b] dark:border-[#d97706] shadow-[3px_3px_0px_0px_#8c502b] dark:shadow-[3px_3px_0px_0px_#d97706]',
      icon: <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      {menuItems.map((item) => {
        let cardStyle = '';
        if (themeStyle === 'modern-glow') {
          cardStyle = `bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border ${item.glowBorder} text-white`;
        } else if (themeStyle === 'retro') {
          cardStyle = `${item.retroBorder} text-[#2c221a] dark:text-[#f3ede2] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`;
        } else {
          // Classic
          cardStyle = 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs shadow-xs';
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`group relative w-full py-2.5 px-3 sm:py-3 sm:px-4 rounded-2xl transition-all duration-150 flex items-center justify-between gap-2.5 text-left select-none ${cardStyle}`}
          >
            {/* Left Icon and Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-150 ${
                themeStyle === 'retro' ? 'border border-[#8c502b] dark:border-[#d97706]' : ''
              }`}>
                {item.icon}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                    themeStyle === 'modern-glow' 
                      ? 'text-white group-hover:text-cyan-300' 
                      : themeStyle === 'retro' 
                      ? 'text-[#2c221a] dark:text-[#f3ede2] font-black' 
                      : 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  }`}>
                    {item.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-tight truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            {/* Right badge & chevron */}
            <div className="flex items-center gap-1.5 shrink-0">
              {item.countTag && (
                <span className={`text-[10px] font-medium hidden xs:inline ${
                  themeStyle === 'retro'
                    ? 'font-bold px-1.5 py-0.5 rounded bg-[#f4ebd0] dark:bg-[#322920] text-[#8c502b] dark:text-[#fcd34d] border border-[#8c502b] dark:border-[#d97706]'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {item.countTag}
                </span>
              )}
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                themeStyle === 'modern-glow'
                  ? 'text-cyan-300/80 group-hover:text-cyan-200 bg-cyan-950/40 border border-cyan-500/30'
                  : themeStyle === 'retro'
                  ? 'text-[#8c502b] dark:text-[#fcd34d] bg-[#f4ebd0] dark:bg-[#322920] border border-[#8c502b] dark:border-[#d97706]'
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80'
              }`}>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
