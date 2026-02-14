import React from 'react';
import { Lightbulb, Clock, TrendingDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const AlternativeSlots = ({ alternatives = [], onSelect, onClose }) => {
  if (alternatives.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-yellow-400 rounded-xl">
            <Lightbulb className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-neutral-800 text-lg">
              Better Alternatives Available!
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              These slots have shorter wait times and are less crowded
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {alternatives.map((alt, index) => (
            <motion.div
              key={alt.slot._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => onSelect(alt.slot)}
                className="w-full bg-white rounded-2xl p-4 border-2 border-neutral-200 hover:border-success-400 hover:shadow-soft transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-success-600" />
                      <p className="font-bold text-neutral-800 text-lg">
                        {alt.slot.startTime}
                      </p>
                      {alt.timeDifferenceMinutes && (
                        <span className="text-xs text-neutral-500">
                          ({Math.round(alt.timeDifferenceMinutes)}min {
                            alt.timeDifferenceMinutes > 0 ? 'later' : 'earlier'
                          })
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-success-600">
                        <TrendingDown size={16} />
                        <span className="font-semibold">
                          {Math.round((1 - alt.loadScore) * 100)}% less crowded
                        </span>
                      </div>
                      <div className="text-neutral-600">
                        ~{alt.estimatedWait?.average || 5}min wait
                      </div>
                    </div>

                    {alt.recommendation && (
                      <p className="text-xs font-semibold text-success-600 mt-2">
                        ✨ {alt.recommendation}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="text-neutral-400" size={20} />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          fullWidth
          className="mt-4"
          onClick={onClose}
        >
          Continue with Original Slot
        </Button>
      </Card>
    </motion.div>
  );
};

export default AlternativeSlots;