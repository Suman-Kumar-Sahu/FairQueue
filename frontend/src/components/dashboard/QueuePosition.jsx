import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock } from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';

const QueuePosition = ({ position = 0, totalInQueue = 0, estimatedWait = 0 }) => {
  const progress = totalInQueue > 0 ? ((totalInQueue - position) / totalInQueue) * 100 : 0;

  return (
    <Card className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <p className="text-neutral-600 font-medium mb-2 uppercase text-sm tracking-wide">
          Your Current Position
        </p>
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-xl opacity-30 animate-pulse-slow" />
          <div className="relative text-huge text-primary-600 font-black">
            {position}
          </div>
        </div>
      </motion.div>

      <ProgressBar 
        value={progress} 
        max={100}
        showLabel={false}
        colorScheme="gradient"
        height="h-3"
        className="mb-6"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-50 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-2 text-neutral-600 mb-1">
            <Clock size={18} />
            <span className="text-sm font-medium">Estimated Wait</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">
            {estimatedWait} min
          </p>
        </div>

        <div className="bg-neutral-50 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-2 text-neutral-600 mb-1">
            <Users size={18} />
            <span className="text-sm font-medium">In Queue</span>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {totalInQueue}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-success-50 rounded-2xl border-2 border-success-200">
        <p className="text-success-700 font-semibold">
          {position <= 3 
            ? '🎉 You\'re almost there!' 
            : position <= 10
            ? '✅ Your turn is coming soon'
            : '⏳ Please wait patiently'}
        </p>
      </div>
    </Card>
  );
};

export default QueuePosition;