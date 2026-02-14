import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  padding = 'p-6'
}) => {
  const baseStyles = 'bg-white rounded-3xl shadow-soft';
  const hoverStyles = hover ? 'hover:shadow-soft-lg cursor-pointer transition-shadow duration-200' : '';

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`${baseStyles} ${hoverStyles} ${padding} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;