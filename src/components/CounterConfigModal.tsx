import React, { useState } from 'react';
import { 
  CounterButtonSize, 
  CounterButtonPosition, 
  CounterAnimationMode 
} from '../types';
import { triggerHapticVibration, playGentleClickSound } from '../utils/feedback';
import { X, Sliders, Vibrate, Sparkles, Check } from 'lucide-react';

interface CounterConfigModalProps {
  currentSize: CounterButtonSize;
  currentPosition: CounterButtonPosition;
  currentDuration: number;
  currentAnimation: CounterAnimationMode;
  onSave: (size: CounterButtonSize, position: CounterButtonPosition, duration: number, anim: CounterAnimationMode) => void;
  onClose: () => void;
}

export const CounterConfigModal: React.FC<CounterConfigModalProps> = ({
  currentSize,
  currentPosition,
  currentDuration,
  currentAnimation,
  onSave,
  onClose
}) => {
  const [size, setSize] = useState<CounterButtonSize>(currentSize);
  const [position, setPosition] = useState<CounterButtonPosition>(currentPosition);
  const [duration, setDuration] = useState<number>(currentDuration);
  const [animation, setAnimation] = useState<CounterAnimationMode>(currentAnimation);
  const [testPressing, setTestPressing] = useState(false);

  const animationList: { id: CounterAnimationMode; label: string; desc: string; cls: string }[] = [
    { id: 'fluid', label: 'Fluid Wave', desc: 'Riak gelombang cair hijau emerald', cls: 'anim-fluid-wave' },
    { id: 'pulse', label: 'Pulse Bounce', desc: 'Pantulan pegas elastis taktil', cls: 'anim-pulse-bounce' },
    { id: 'spark', label: 'Glow Aura', desc: 'Kilau pendar emas terang', cls: 'anim-glow-spark' },
    { id: 'squish', label: 'Haptic Squish', desc: 'Kompresi taktil lembut', cls: 'anim-haptic-squish' },
    { id: 'pop', label: 'Minimal Pop', desc: 'Klik mikro tajam dan presisi', cls: 'anim-minimal-pop' }
  ];

  const handleTestPress = () => {
    setTestPressing(true);
    triggerHapticVibration(duration);
    playGentleClickSound();
    setTimeout(() => setTestPressing(false), 350);
  };

  const handleSave = () => {
    onSave(size, position, duration, animation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Opsi Tombol Counter</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Test area */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Pratinjau Animasi &amp; Getar:</span>
            <button
              onClick={handleTestPress}
              className={`w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-mono font-extrabold text-lg shadow-xl flex items-center justify-center border-2 border-emerald-300/40 opacity-60 hover:opacity-90 active:opacity-100 backdrop-blur-md ${
                testPressing ? animationList.find(a => a.id === animation)?.cls : ''
              }`}
            >
              1
            </button>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Uji efek getar &amp; animasi</span>
          </div>

          {/* Ukuran Tombol */}
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">Ukuran Tombol</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'small', label: 'Kecil', px: '52px' },
                { id: 'medium', label: 'Sedang', px: '64px' },
                { id: 'large', label: 'Besar', px: '76px' },
                { id: 'jumbo', label: 'Jumbo', px: '92px' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id as CounterButtonSize)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    size === s.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div>{s.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{s.px}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Posisi Layar */}
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">Posisi di Layar</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'left', label: 'Kiri Bawah' },
                { id: 'center', label: 'Tengah Bawah' },
                { id: 'right', label: 'Kanan Bawah' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPosition(p.id as CounterButtonPosition)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    position === p.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lama Waktu Getar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Vibrate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Durasi Getar Taktil:
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                {duration === 0 ? 'Mati (0ms)' : `${duration} ms`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={duration}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDuration(val);
                if (val > 0) triggerHapticVibration(val);
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Pilihan 5 Mode Animasi */}
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Pilihan Mode Animasi Tekanan (5 Mode):
            </label>
            <div className="space-y-1.5">
              {animationList.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setAnimation(a.id);
                    handleTestPress();
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    animation === a.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{a.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{a.desc}</div>
                  </div>
                  {animation === a.id && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
          >
            Simpan Pilihan
          </button>
        </div>
      </div>
    </div>
  );
};
