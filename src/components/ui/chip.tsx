import * as React from 'react';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/lib/options';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  icon: IconComponent;
  label: string;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected, icon: Icon, label, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        data-state={selected ? 'on' : 'off'}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border-2 px-5 py-3 text-xl font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background max-sm:border-0 max-sm:focus-visible:ring-0 max-sm:focus-visible:ring-offset-0',
          'disabled:opacity-50 disabled:pointer-events-none',
          selected
            ? 'border-[#4ed8f4] bg-[#006da8] text-white shadow-md ring-2 ring-[#4ed8f4]/30 hover:bg-[#005f94] max-sm:ring-0'
            : 'border-white/70 bg-white/90 text-[#003b70] shadow-sm hover:bg-white max-sm:border-0',
          className
        )}
        {...props}
      >
        <Icon className="size-6 shrink-0" />
        <span>{label}</span>
      </button>
    );
  }
);
Chip.displayName = 'Chip';
