import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800',
    secondary: 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800',
    success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
    error: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
    high: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
    medium: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
    low: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;