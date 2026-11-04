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

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl?: string;
  bgGradient: string;
  linkPage?: 'pagi' | 'petang' | 'doa' | 'sholat';
}

export type CounterAnimationMode = 'fluid' | 'pulse' | 'spark' | 'squish' | 'pop';
export type CounterButtonSize = 'small' | 'medium' | 'large' | 'jumbo';
export type CounterButtonPosition = 'right' | 'center' | 'left' | 'float';
export type OrientationLockMode = 'auto' | 'portrait' | 'landscape';
export type ThemeStyle = 'classic' | 'modern-glow' | 'anime-flat';

export interface AppSettings {
  theme: 'dark' | 'light';
  themeStyle: ThemeStyle;
  orientationLock: OrientationLockMode;
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
  arabicFontSize: number; // 24 to 48 px
  latinFontSize: number;  // 13 to 22 px
  
  // Carousel
  carouselInterval: number; // seconds, default 5
}
