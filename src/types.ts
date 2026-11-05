export interface DzikirItem {
  JUDUL: string;
  KALI: string;
  ARAB: string;
  LATIN: string;
  ARTI: string;
  SUMBER: string;
}

export interface DoaItem {
  judul: string;
  isi: Array<string[]>;
}

export interface BabSholatItem {
  judul: string;
  isi: Array<string[]>;
}

export interface AsmaulHusnaItem {
  number: number;
  arab: string;
  latin: string;
  arti: string;
}

export interface NasehatFlyer {
  id: string;
  title: string;
  imageUrl: string;
  content: string; // Hadits / dalil & penjelasan
  source?: string;
  badge?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  subtitle: string;
  time: string; // "05:30" (24h format)
  enabled: boolean;
}

export type CounterAnimationMode = 'fluid' | 'pulse' | 'spark' | 'squish' | 'pop';
export type CounterButtonSize = 'small' | 'medium' | 'large' | 'jumbo';
export type CounterButtonPosition = 'right' | 'center' | 'left' | 'float';
export type ThemeStyle = 'classic' | 'modern-glow' | 'retro';

export interface AppSettings {
  theme: 'dark' | 'light';
  themeStyle: ThemeStyle;
  keepAwake: boolean;
  fullscreen: boolean;
  
  // Dzikir options
  counterEnabled: boolean;
  hapticEnabled: boolean;
  hapticDuration: number; // ms, e.g. 40
  counterAnimation: CounterAnimationMode;
  counterSize: CounterButtonSize;
  counterPosition: CounterButtonPosition;
  showLatinDefault: boolean;
  autoExpandLatin: boolean;
  autoExpandDalil: boolean;
  
  // Font sizes
  arabicFontSize: number; // 22 to 44 px
  latinFontSize: number;  // 13 to 22 px
  
  // Carousel & Nasehat
  carouselInterval: number; // seconds, default 5
  googleSheetUrl: string;   // Google Spreadsheet CSV URL for dynamic flyers
  
  // Reminders
  remindersEnabled: boolean;
  reminders: ReminderItem[];
}
