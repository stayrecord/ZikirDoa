import { DzikirItem, DoaItem, BabSholatItem } from '../types';

let cachedDzikirPagi: DzikirItem[] | null = null;
let cachedDzikirPetang: DzikirItem[] | null = null;
let cachedDoaHarian: DoaItem[] | null = null;
let cachedBabSholat: BabSholatItem[] | null = null;

export async function loadDzikirPagi(): Promise<DzikirItem[]> {
  if (cachedDzikirPagi) return cachedDzikirPagi;
  try {
    const res = await fetch('/assets/aistudio/DzikirPagi_b95275b5.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    cachedDzikirPagi = data;
    return data;
  } catch (err) {
    console.error('Failed to load Dzikir Pagi', err);
    return [];
  }
}

export async function loadDzikirPetang(): Promise<DzikirItem[]> {
  if (cachedDzikirPetang) return cachedDzikirPetang;
  try {
    const res = await fetch('/assets/aistudio/DzikirPetang_610f787b.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    cachedDzikirPetang = data;
    return data;
  } catch (err) {
    console.error('Failed to load Dzikir Petang', err);
    return [];
  }
}

export async function loadDoaHarian(): Promise<DoaItem[]> {
  if (cachedDoaHarian) return cachedDoaHarian;
  try {
    const res = await fetch('/assets/aistudio/DoaHarian_72837c41.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    cachedDoaHarian = data;
    return data;
  } catch (err) {
    console.error('Failed to load Doa Harian', err);
    return [];
  }
}

export async function loadBabSholat(): Promise<BabSholatItem[]> {
  if (cachedBabSholat) return cachedBabSholat;
  try {
    const res = await fetch('/assets/aistudio/BabSholat_1b8c6b12.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    cachedBabSholat = data;
    return data;
  } catch (err) {
    console.error('Failed to load Bab Sholat', err);
    return [];
  }
}

export function parseRepetitionLimit(kaliStr: string): number {
  if (!kaliStr) return 0;
  const lower = kaliStr.toLowerCase();
  if (lower.includes('100')) return 100;
  if (lower.includes('34')) return 34;
  if (lower.includes('33')) return 33;
  if (lower.includes('10')) return 10;
  if (lower.includes('7')) return 7;
  if (lower.includes('4')) return 4;
  if (lower.includes('3')) return 3;
  if (lower.includes('1')) return 1;
  const match = lower.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
