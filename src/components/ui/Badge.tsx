import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'base';
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-primary-100 text-primary-700 border border-primary-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
};

const sizes = {
  sm: 'px-2 py-1 text-xs font-medium rounded',
  base: 'px-3 py-1.5 text-sm font-medium rounded-md',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    variant = 'primary',
    size = 'base',
    children,
    className,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium transition-colors
          ${variants[variant]}
          ${sizes[size]}
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Alias for badge/pill
export const Pill = Badge;
