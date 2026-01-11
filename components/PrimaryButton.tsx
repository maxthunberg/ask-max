import React from 'react';

export interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  className = '',
  'aria-label': ariaLabel,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        relative h-[48px] rounded-[4px] 
        bg-[#7339ff] 
        hover:bg-[#8755ff] 
        active:bg-[#7339ff]
        disabled:opacity-30 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#f4ccfd] focus:ring-offset-0
        transition-colors duration-200
        ${iconOnly ? 'w-[48px]' : 'px-[16px]'}
        ${className}
      `}
    >
      <div className="absolute content-stretch flex items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {icon && iconPosition === 'left' && !iconOnly && (
          <div className="content-stretch flex items-center relative shrink-0">
            {icon}
            <div className="w-[8px] h-[20px] opacity-0 shrink-0" aria-hidden="true" />
          </div>
        )}
        
        {iconOnly && icon && (
          <div className="content-stretch flex items-center relative shrink-0">
            {icon}
          </div>
        )}
        
        {!iconOnly && (
          <p className="font-sans font-semibold leading-[24px] relative shrink-0 text-[#f6f7fc] text-[16px] text-center text-nowrap whitespace-pre">
            {children}
          </p>
        )}
        
        {icon && iconPosition === 'right' && !iconOnly && (
          <div className="content-stretch flex items-center relative shrink-0">
            <div className="w-[8px] h-[20px] opacity-0 shrink-0" aria-hidden="true" />
            {icon}
          </div>
        )}
      </div>
    </button>
  );
}
