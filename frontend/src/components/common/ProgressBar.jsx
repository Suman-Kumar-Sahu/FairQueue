import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  showLabel = true,
  colorScheme = 'gradient',
  height = 'h-2',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = () => {
    if (colorScheme === 'gradient') {
      if (percentage < 33) return 'bg-gradient-to-r from-red-500 to-orange-500';
      if (percentage < 66) return 'bg-gradient-to-r from-orange-500 to-yellow-500';
      return 'bg-gradient-to-r from-yellow-500 to-success-500';
    }
    return 'bg-primary-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-600">Progress</span>
          <span className="text-sm font-bold text-neutral-800">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${height}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${height} ${getColor()} rounded-full`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;