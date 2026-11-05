import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  activeColor?: string;
  ariaLabel?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  activeColor = 'bg-emerald-500',
  ariaLabel = 'Beralih status'
}) => {
  const isSm = size === 'sm';
  const widthClass = isSm ? 'w-9 h-5' : 'w-11 h-6';
  const knobSize = isSm ? 'w-4 h-4' : 'w-5 h-5';
  const translateClass = isSm 
    ? (checked ? 'translate-x-4' : 'translate-x-0.5') 
    : (checked ? 'translate-x-5' : 'translate-x-0.5');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${widthClass} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        checked ? activeColor : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${knobSize} ${translateClass}`}
      />
    </button>
  );
};
