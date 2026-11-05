import { NasehatFlyer } from '../types';

// Curated default Islamic advice flyers with self-contained crisp SVG graphics
export const DEFAULT_NASEHAT_FLYERS: NasehatFlyer[] = [
  {
    id: 'flyer-1',
    title: 'Keutamaan Dzikir Pagi & Petang',
    badge: 'Faedah Dzikir',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="800" height="480">
        <defs>
          <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b" />
            <stop offset="50%" stop-color="#047857" />
            <stop offset="100%" stop-color="#065f46" />
          </linearGradient>
          <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="50%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#b45309" />
          </linearGradient>
          <pattern id="pat1" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
            <circle cx="20" cy="20" r="4" fill="rgba(250,204,21,0.1)"/>
          </pattern>
        </defs>
        <rect width="800" height="480" fill="url(#bg1)"/>
        <rect width="800" height="480" fill="url(#pat1)"/>
        <!-- Inner decorative border -->
        <rect x="25" y="25" width="750" height="430" rx="20" fill="none" stroke="url(#gold1)" stroke-width="2" opacity="0.6"/>
        <rect x="35" y="35" width="730" height="410" rx="16" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        
        <!-- Sun & Dawn glow -->
        <circle cx="400" cy="180" r="90" fill="rgba(250,204,21,0.15)" />
        <circle cx="400" cy="180" r="50" fill="url(#gold1)" />
        
        <!-- Mosque silhouette base -->
        <path d="M400 135 C380 155 370 175 370 195 L430 195 C430 175 420 155 400 135 Z" fill="#064e3b"/>
        <line x1="400" y1="120" x2="400" y2="135" stroke="#fef08a" stroke-width="3"/>
        <circle cx="400" cy="118" r="4" fill="#fef08a"/>

        <!-- Text typography -->
        <text x="400" y="280" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">BENTENG DARI SEGALA MARABAHAYA</text>
        <text x="400" y="325" font-family="system-ui, sans-serif" font-size="20" font-weight="500" fill="#a7f3d0" text-anchor="middle">"Dzikir pagi dan petang ibarat baju besi bagi seorang mukmin"</text>
        <rect x="300" y="365" width="200" height="36" rx="18" fill="rgba(255,255,255,0.15)" stroke="url(#gold1)" stroke-width="1"/>
        <text x="400" y="388" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#fef08a" text-anchor="middle">Ibnul Qayyim Al-Jauziyyah</text>
      </svg>
    `),
    content: 'Berkata Imam Ibnul Qayyim rahimahullah: "Dzikir pagi dan petang ibarat baju besi. Semakin bertambah ketebalannya, maka pemiliknya tidak akan tergores oleh bahaya. Bahkan kekuatan baju besi itu bisa membalikkan panah musuh sehingga mengenai pemanahnya sendiri."',
    source: 'Al-Wabilush Shayyib hal. 71'
  },
  {
    id: 'flyer-2',
    title: 'Hati Tenang dengan Dzikir',
    badge: 'Tadabbur Ayat',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="800" height="480">
        <defs>
          <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b" />
            <stop offset="50%" stop-color="#312e81" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="cyan2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#67e8f9" />
            <stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
          <pattern id="pat2" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="rgba(255,255,255,0.2)"/>
            <polygon points="30,10 50,30 30,50 10,30" fill="none" stroke="rgba(103,232,249,0.08)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="800" height="480" fill="url(#bg2)"/>
        <rect width="800" height="480" fill="url(#pat2)"/>
        <!-- Inner decorative border -->
        <rect x="25" y="25" width="750" height="430" rx="20" fill="none" stroke="url(#cyan2)" stroke-width="2" opacity="0.6"/>
        
        <!-- Crescent Moon & Star -->
        <path d="M390 120 A40 40 0 1 0 435 185 A50 50 0 1 1 390 120 Z" fill="url(#cyan2)" />
        <polygon points="435,125 440,138 454,138 442,146 447,159 435,150 423,159 428,146 416,138 430,138" fill="#fef08a" />

        <text x="400" y="275" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">INGATLAH ALLAH, HATI MENJADI TENANG</text>
        <text x="400" y="325" font-family="'Traditional Arabic', serif" font-size="28" font-weight="700" fill="#a5f3fc" text-anchor="middle" direction="rtl">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</text>
        <rect x="280" y="365" width="240" height="36" rx="18" fill="rgba(6,182,212,0.18)" stroke="url(#cyan2)" stroke-width="1"/>
        <text x="400" y="388" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#e0f2fe" text-anchor="middle">QS. Ar-Ra'd : 28</text>
      </svg>
    `),
    content: 'Allah Subhanahu wa Ta\'ala berfirman: "(yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah-lah hati menjadi tenteram." (QS. Ar-Ra\'d: 28). Kapan pun gundah melanda jiwa, basahilah lisan dengan istighfar dan dzikrullah.',
    source: 'Al-Qur\'an Surah Ar-Ra\'d: 28'
  },
  {
    id: 'flyer-3',
    title: 'Ringan di Lisan, Berat di Timbangan',
    badge: 'Hadits Shahih',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="800" height="480">
        <defs>
          <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#78350f" />
            <stop offset="50%" stop-color="#b45309" />
            <stop offset="100%" stop-color="#9a3412" />
          </linearGradient>
          <linearGradient id="gold3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
        </defs>
        <rect width="800" height="480" fill="url(#bg3)"/>
        <!-- Islamic Arch Silhouette -->
        <path d="M400 60 C320 140 300 200 300 280 L500 280 C500 200 480 140 400 60 Z" fill="none" stroke="rgba(254,240,138,0.3)" stroke-width="2"/>
        <rect x="25" y="25" width="750" height="430" rx="20" fill="none" stroke="url(#gold3)" stroke-width="2" opacity="0.6"/>

        <circle cx="400" cy="180" r="50" fill="rgba(255,255,255,0.1)"/>
        <text x="400" y="190" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fef08a" text-anchor="middle">⚖️</text>

        <text x="400" y="280" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#ffffff" text-anchor="middle">2 KALIMAT DICINTAI AR-RAHMAN</text>
        <text x="400" y="325" font-family="'Traditional Arabic', serif" font-size="24" font-weight="700" fill="#fef08a" text-anchor="middle" direction="rtl">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ</text>
        <rect x="260" y="365" width="280" height="36" rx="18" fill="rgba(255,255,255,0.15)" stroke="url(#gold3)" stroke-width="1"/>
        <text x="400" y="388" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">HR. Bukhari no. 6682 &amp; Muslim no. 2694</text>
      </svg>
    `),
    content: 'Rasulullah shallallahu \'alaihi wa sallam bersabda: "Dua kalimat yang ringan di lisan, berat di timbangan (mizan), dan dicintai oleh Ar-Rahman: Subhanallahi wa bihamdih, Subhanallahil \'Adzim." (HR. Bukhari & Muslim). Ucapkanlah selalu saat beraktivitas maupun di sela waktu luang.',
    source: 'Shahih Bukhari & Shahih Muslim'
  }
];

const LOCAL_STORAGE_FLYERS_KEY = 'dzikir_app_nasehat_flyers_v1';

// Convert any Google Sheets link to CSV export URL
export function formatGoogleSheetCsvUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  
  // If already a csv output URL
  if (trimmed.includes('output=csv') || trimmed.includes('tqx=out:csv')) {
    return trimmed;
  }
  
  // Extract Sheet ID from standard edit URL
  // e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }
  
  return trimmed;
}

// Simple CSV parser supporting quotes and commas
function parseCsv(text: string): string[][] {
  const lines = text.split(/\r\n|\n|\r/);
  const rows: string[][] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let insideQuotes = false;
    let field = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    row.push(field.trim());
    rows.push(row);
  }
  return rows;
}

// Fetch dynamic flyers from Google Spreadsheet CSV
export async function fetchFlyersFromGoogleSheets(sheetUrl: string): Promise<NasehatFlyer[]> {
  const csvUrl = formatGoogleSheetCsvUrl(sheetUrl);
  if (!csvUrl) return DEFAULT_NASEHAT_FLYERS;

  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const text = await res.text();
    const rows = parseCsv(text);
    
    // Expect columns: Judul, Gambar_URL, Dalil_Hadits, Faedah_Nasehat, Kategori
    if (rows.length <= 1) return DEFAULT_NASEHAT_FLYERS;
    
    // Find column index headers (or fallback to position 0, 1, 2, 3)
    const header = rows[0].map(h => h.toLowerCase());
    let titleIdx = header.findIndex(h => h.includes('judul') || h.includes('title'));
    let imgIdx = header.findIndex(h => h.includes('gambar') || h.includes('image') || h.includes('foto') || h.includes('url'));
    let dalilIdx = header.findIndex(h => h.includes('dalil') || h.includes('hadits') || h.includes('isi') || h.includes('content'));
    let faedahIdx = header.findIndex(h => h.includes('faedah') || h.includes('penjelasan') || h.includes('arti') || h.includes('sumber'));
    
    if (titleIdx === -1) titleIdx = 0;
    if (imgIdx === -1) imgIdx = 1;
    if (dalilIdx === -1) dalilIdx = 2;
    if (faedahIdx === -1) faedahIdx = 3;

    const parsedFlyers: NasehatFlyer[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const title = row[titleIdx];
      const imageUrl = row[imgIdx];
      if (!title && !imageUrl) continue;
      
      const content = [row[dalilIdx], row[faedahIdx]].filter(Boolean).join('\n\n');
      
      parsedFlyers.push({
        id: `gsheet-flyer-${i}`,
        title: title || `Nasehat #${i}`,
        imageUrl: imageUrl || DEFAULT_NASEHAT_FLYERS[i % DEFAULT_NASEHAT_FLYERS.length].imageUrl,
        content: content || 'Nasehat dan faedah amalan dzikir harian.',
        source: row[faedahIdx] || 'Google Spreadsheet'
      });
    }

    if (parsedFlyers.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_FLYERS_KEY, JSON.stringify(parsedFlyers));
      return parsedFlyers;
    }
  } catch (err) {
    console.warn('Could not load flyers from Google Sheet, using cache/defaults:', err);
  }

  // Fallback to cache if available
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_FLYERS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore
  }

  return DEFAULT_NASEHAT_FLYERS;
}

export function getCachedFlyers(): NasehatFlyer[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FLYERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    //
  }
  return DEFAULT_NASEHAT_FLYERS;
}
