import { ReminderItem } from '../types';

export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'pagi',
    title: 'Dzikir Pagi',
    subtitle: 'Waktu utama dzikir pagi setelah shubuh',
    time: '05:30',
    enabled: true
  },
  {
    id: 'petang',
    title: 'Dzikir Petang',
    subtitle: 'Waktu utama dzikir petang setelah ashar',
    time: '16:30',
    enabled: true
  },
  {
    id: 'tidur',
    title: 'Dzikir Sebelum Tidur',
    subtitle: 'Dzikir & doa perlindungan malam hari',
    time: '21:30',
    enabled: false
  }
];

// Play gentle spiritual notification chime using Web Audio API
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tone 1 (soft bell)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.8);

    // Tone 2 (higher harmonic)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
    gain2.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (e) {
    // AudioContext blocked or unsupported
  }
}

// Request Notification Permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// Dispatch browser notification or fallback
export function triggerNotification(title: string, body: string, icon = '/assets/aistudio/appIco_5f517e82.png') {
  playNotificationChime();

  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
        tag: 'dzikir-reminder'
      });
      return;
    } catch {
      // Fallback
    }
  }

  // Dispatch custom event for in-app alert banner
  window.dispatchEvent(
    new CustomEvent('dzikir-reminder-alert', {
      detail: { title, body }
    })
  );
}
