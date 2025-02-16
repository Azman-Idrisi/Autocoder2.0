import React from 'react';

// Utility function to join class names
const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Button = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false, 
  onClick, 
  ...props 
}) => {
  // Base classes for all buttons
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";
  
  // Variant-specific classes with better dark mode support
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700",
    secondary: "bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:active:bg-gray-400",
    outline: "border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700 dark:border-gray-500 dark:hover:bg-gray-700 dark:active:bg-gray-600",
    ghost: "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700 dark:hover:bg-gray-700 dark:active:bg-gray-600",
    destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700",
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-4 py-2 h-10",
    lg: "text-base px-5 py-2.5 h-12",
    xl: "text-lg px-6 py-3 h-14",
  };
  
  return (
    <button
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 flex items-center">
          <svg 
            className="animate-spin h-4 w-4 text-current" 
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
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
