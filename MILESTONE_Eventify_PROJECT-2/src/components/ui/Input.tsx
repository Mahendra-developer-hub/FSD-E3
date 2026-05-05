import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold tracking-wide uppercase text-stone-500 dark:text-stone-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white/50 dark:bg-black/20 border backdrop-blur-sm 
              transition-all duration-200 outline-none
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl
              ${error 
                ? 'border-red-300 dark:border-red-900/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                : 'border-stone-200 dark:border-stone-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1 pl-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
