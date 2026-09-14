import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
      md: 'h-8 px-3 text-xs rounded-md gap-1.5',
      lg: 'h-9 px-4 text-sm rounded-md gap-2',
      icon: 'h-8 w-8 p-0 rounded-md justify-center',
    };

    const variantClasses = {
      primary:
        'bg-primary hover:bg-primary/90 text-primary-foreground font-medium',
      secondary:
        'bg-muted hover:bg-muted/80 text-foreground border border-border',
      outline:
        'border border-border bg-transparent hover:bg-muted text-foreground',
      ghost:
        'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground',
      danger:
        'bg-[#BF4040] hover:bg-[#BF4040]/90 text-white font-medium',
      subtle:
        'bg-primary/8 text-primary hover:bg-primary/15',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
