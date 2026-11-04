import React from 'react';
import { X, HelpCircle, MoveHorizontal, Hand, Vibrate, BookOpen, Layers } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
  title?: string;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose, title = 'Bantuan Navigasi' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
            <MoveHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Geser Kiri / Kanan</strong>
              <span>Usap layar secara horizontal atau gunakan tombol panah untuk berpindah halaman dzikir.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
            <Hand className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Ketuk Teks Arab</strong>
              <span>Membuka kartu pelafalan Latin di bawah tulisan Arab (default tersembunyi).</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
            <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Ketuk Arti / Terjemahan</strong>
              <span>Membuka kartu rujukan Sumber Hadits &amp; Dalil shahih yang mendasarinya.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
            <Vibrate className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Counter &amp; Tekan Lama</strong>
              <span>Ketuk untuk menghitung putaran dzikir. Tekan dan tahan (long press) untuk mengubah ukuran, posisi, getaran &amp; animasi tombol.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Daftar Loncat Cepat</strong>
              <span>Ketuk nomor halaman di kanan atas untuk membuka indeks daftar isi langsung.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-xs"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
