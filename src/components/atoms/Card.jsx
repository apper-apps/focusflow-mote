import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick,
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = `
    bg-white rounded-lg shadow-soft border border-gray-100
    transition-all duration-200
    ${hover ? 'hover:shadow-medium hover:-translate-y-0.5' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${padding}
    ${className}
  `;

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 }
  } : {};

  return (
    <CardComponent
      className={baseClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;