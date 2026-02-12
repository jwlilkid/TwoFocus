import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  // Use border-black in light mode, border-white in dark mode
  const baseStyles = "font-bold border-2 border-black dark:border-white transition-all transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-memphis-active disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-memphis-yellow text-black shadow-memphis hover:-translate-y-0.5 hover:shadow-memphis-hover",
    secondary: "bg-white dark:bg-memphis-dark-surface text-black dark:text-white shadow-memphis hover:-translate-y-0.5 hover:shadow-memphis-hover",
    danger: "bg-red-400 text-white shadow-memphis hover:-translate-y-0.5 hover:shadow-memphis-hover",
    success: "bg-memphis-mint text-black shadow-memphis hover:-translate-y-0.5 hover:shadow-memphis-hover",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};