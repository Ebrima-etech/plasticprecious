import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  shadow?: 'none' | 'sm' | 'base' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
}

const shadowMap = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  base: 'shadow-base',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    shadow = 'base',
    hover = false,
    interactive = false,
    className,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-lg bg-white border border-neutral-100
          ${shadowMap[shadow]}
          ${hover ? 'transition-all duration-normal hover:shadow-lg hover:border-neutral-200' : ''}
          ${interactive ? 'cursor-pointer' : ''}
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={`px-6 py-5 border-b border-neutral-100 ${className || ''}`}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => (
  <div className={`px-6 py-5 ${className || ''}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className }: CardFooterProps) => (
  <div className={`px-6 py-4 border-t border-neutral-100 bg-neutral-50 rounded-b-lg ${className || ''}`}>
    {children}
  </div>
);
