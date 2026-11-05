import { AppSettings } from '../types';
import { DEFAULT_REMINDERS } from '../utils/reminderService';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  themeStyle: 'classic',
  keepAwake: false,
  fullscreen: false,
  counterEnabled: true,
  hapticEnabled: true,
  hapticDuration: 40,
  counterAnimation: 'fluid',
  counterSize: 'large',
  counterPosition: 'right',
  showLatinDefault: false,
  autoExpandLatin: false,
  autoExpandDalil: false,
  arabicFontSize: 30,
  latinFontSize: 15,
  carouselInterval: 5,
  googleSheetUrl: '',
  remindersEnabled: true,
  reminders: DEFAULT_REMINDERS
};

const SETTINGS_STORAGE_KEY = 'dzikir_doa_app_settings_v3';

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    
    // Fallback if previous setting had anime-flat
    if (parsed.themeStyle === 'anime-flat') {
      parsed.themeStyle = 'retro';
    }

    return { 
      ...DEFAULT_SETTINGS, 
      ...parsed,
      reminders: parsed.reminders || DEFAULT_REMINDERS 
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    applyThemeToDOM(settings.theme, settings.themeStyle);
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

export function applyThemeToDOM(theme: 'dark' | 'light', themeStyle: AppSettings['themeStyle'] = 'classic'): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.setAttribute('data-theme-style', themeStyle || 'classic');
}

let activeWakeLock: any = null;

export async function setWakeLock(enable: boolean): Promise<boolean> {
  if (!('wakeLock' in navigator)) return false;
  try {
    if (enable) {
      if (!activeWakeLock) {
        activeWakeLock = await (navigator as any).wakeLock.request('screen');
        activeWakeLock.addEventListener('release', () => {
          activeWakeLock = null;
        });
      }
      return true;
    } else {
      if (activeWakeLock) {
        await activeWakeLock.release();
        activeWakeLock = null;
      }
      return false;
    }
  } catch (err) {
    console.warn('Wake lock error:', err);
    return false;
  }
}

export async function toggleFullscreen(enable: boolean): Promise<boolean> {
  try {
    if (enable) {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      return true;
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      return false;
    }
  } catch (err) {
    console.warn('Fullscreen error:', err);
    return false;
  }
}
