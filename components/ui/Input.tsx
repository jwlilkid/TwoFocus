import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-bold text-sm text-memphis-black dark:text-white transition-colors">{label}</label>}
      <input 
        className={`border-2 border-black dark:border-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_var(--memphis-shadow)] transition-shadow bg-white dark:bg-memphis-dark-surface dark:text-white ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, children, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="font-bold text-sm text-memphis-black dark:text-white transition-colors">{label}</label>}
            <select
                className={`border-2 border-black dark:border-white p-2 bg-white dark:bg-memphis-dark-surface dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_var(--memphis-shadow)] transition-shadow ${className}`}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};