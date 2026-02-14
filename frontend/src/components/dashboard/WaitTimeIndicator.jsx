import React from 'react';
import { Clock } from 'lucide-react';

const WaitTimeIndicator = ({ waitTime = 0 }) => {
  // Determine color based on wait time
  const getColorClass = () => {
    if (waitTime < 15) return 'from-success-400 to-success-600';
    if (waitTime < 30) return 'from-yellow-400 to-orange-500';
    return 'from-orange-500 to-red-600';
  };

  const getStatusText = () => {
    if (waitTime < 15) return 'Short Wait';
    if (waitTime < 30) return 'Moderate Wait';
    return 'Long Wait';
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClass()} shadow-soft`}>
        <Clock className="text-white" size={24} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 font-medium">Estimated Wait Time</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-neutral-800">{waitTime}</p>
          <span className="text-sm text-neutral-600">minutes</span>
        </div>
        <p className="text-xs font-semibold text-neutral-500">{getStatusText()}</p>
      </div>
    </div>
  );
};

export default WaitTimeIndicator;