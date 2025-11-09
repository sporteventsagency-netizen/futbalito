import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
// FIX: Add ButtonSize type to support different button sizes.
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  // FIX: Add optional size prop to ButtonProps.
  size?: ButtonSize;
  as?: 'button' | 'span';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'md', as = 'button', ...props }) => {
  // FIX: Remove size-specific classes from base and handle them separately.
  const baseClasses = "inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    outline: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  // FIX: Define classes for different button sizes.
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (as === 'span') {
    return (
        <span className={combinedClasses}>
            {children}
        </span>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
