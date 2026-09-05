import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'base' | 'lg';
  color?: 'primary' | 'white' | 'neutral';
  fullscreen?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  base: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const colorMap = {
  primary: 'text-primary-500',
  white: 'text-white',
  neutral: 'text-neutral-600',
};

export const Spinner = ({
  size = 'base',
  color = 'primary',
  fullscreen = false,
}: SpinnerProps) => {
  const spinner = (
    <svg
      className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
