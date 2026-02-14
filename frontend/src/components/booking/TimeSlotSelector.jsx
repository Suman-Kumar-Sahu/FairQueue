import React from 'react';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';
import SkeletonLoader from '../common/SkeletonLoader';

const TimeSlotSelector = ({ 
  slots = [], 
  selectedSlot, 
  onSelect,
  loading = false 
}) => {
  if (loading) {
    return <SkeletonLoader type="slot" count={6} />;
  }

  if (slots.length === 0) {
    return (
      <Card className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-neutral-300 mb-4" />
        <p className="text-neutral-600 font-medium">No slots available for this date</p>
      </Card>
    );
  }

  const getLoadColor = (loadScore) => {
    if (loadScore >= 0.8) return 'bg-red-500';
    if (loadScore >= 0.5) return 'bg-yellow-500';
    return 'bg-success-500';
  };

  const getLoadLabel = (loadScore) => {
    if (loadScore >= 0.8) return 'Busy';
    if (loadScore >= 0.5) return 'Moderate';
    return 'Available';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-neutral-800">Choose Time Slot</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {slots.map((slot, index) => {
          const isSelected = selectedSlot?._id === slot._id;
          const isFull = slot.status === 'full';
          const loadScore = slot.loadScore || (slot.currentLoad / slot.capacity);

          return (
            <motion.div
              key={slot._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => !isFull && onSelect(slot)}
                disabled={isFull}
                className={`
                  w-full p-4 rounded-2xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-500 bg-primary-50 shadow-soft' 
                    : isFull
                    ? 'border-neutral-200 bg-neutral-100 opacity-50 cursor-not-allowed'
                    : 'border-neutral-200 bg-white hover:border-primary-300 hover:shadow-soft'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={18} className={isSelected ? 'text-primary-600' : 'text-neutral-600'} />
                  <p className={`font-bold ${isSelected ? 'text-primary-600' : 'text-neutral-800'}`}>
                    {slot.startTime}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1 text-xs mb-2">
                  <Users size={14} className="text-neutral-500" />
                  <span className="text-neutral-600">
                    {slot.currentLoad}/{slot.capacity}
                  </span>
                </div>

                {isFull ? (
                  <Badge variant="danger" size="sm">Full</Badge>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getLoadColor(loadScore)}`} />
                    <span className="text-xs font-medium text-neutral-600">
                      {getLoadLabel(loadScore)}
                    </span>
                  </div>
                )}

                {slot.estimatedWait && (
                  <p className="text-xs text-neutral-500 mt-1">
                    ~{slot.estimatedWait.average}min wait
                  </p>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;