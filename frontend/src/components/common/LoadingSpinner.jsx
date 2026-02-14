import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 24,
    md: 40,
    lg: 56,
    xl: 80,
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 
        className="animate-spin text-primary-500" 
        size={sizes[size]} 
      />
      {text && (
        <p className="mt-4 text-neutral-600 font-medium">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;