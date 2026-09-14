import React from 'react';
import { cn } from '../../lib/utils';

export interface TabOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function Tabs<T extends string>({
  options,
  activeId,
  onChange,
  className,
  size = 'md',
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-0.5 bg-muted rounded-md border border-border',
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              'inline-flex items-center justify-center font-medium rounded transition-colors select-none cursor-pointer',
              size === 'sm' ? 'px-2 py-1 text-xs gap-1.5' : 'px-3 py-1.5 text-xs gap-2',
              isActive
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px]',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted-foreground/15 text-muted-foreground'
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
