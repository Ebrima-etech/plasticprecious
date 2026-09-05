import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  inputSize?: 'sm' | 'base' | 'lg';
  icon?: React.ReactNode;
}

const baseStyles = 'w-full px-4 py-2.5 border border-neutral-200 rounded-md font-normal text-neutral-900 placeholder-neutral-400 transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';

const sizes = {
  sm: 'py-1.5 text-sm',
  base: 'py-2.5 text-base',
  lg: 'py-3 text-lg',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    inputSize = 'base',
    icon,
    className,
    ...props
  }, ref) => {
    const isInvalid = !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${baseStyles}
              ${sizes[inputSize]}
              ${isInvalid ? 'border-error focus:ring-error' : ''}
              ${icon ? 'pl-10' : ''}
              ${className || ''}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error mt-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.415-1.414L11 16.586V4a1 1 0 10-2 0v12.586l-5.686-5.686a1 1 0 00-1.415 1.415l8 8a1 1 0 001.415 0l8-8z" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-neutral-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
