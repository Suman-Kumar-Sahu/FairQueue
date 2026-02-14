import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';

const BookingConfirmation = ({ booking, onDone }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      {/* Success Animation */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="inline-flex items-center justify-center w-24 h-24 bg-success-100 rounded-full mb-4"
        >
          <CheckCircle className="text-success-500" size={48} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-neutral-600">
            Your appointment has been successfully booked
          </p>
        </motion.div>
      </div>

      {/* Booking Details Card */}
      <Card>
        <div className="space-y-4">
          {/* Booking Number */}
          <div className="text-center p-4 bg-primary-50 rounded-2xl border-2 border-primary-200">
            <p className="text-sm text-primary-600 font-medium mb-1">Booking Number</p>
            <p className="text-2xl font-bold text-primary-700 font-mono">
              {booking.bookingNumber}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="text-neutral-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-neutral-600">Service</p>
                <p className="font-semibold text-neutral-800">{booking.service}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-neutral-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-neutral-600">Center</p>
                <p className="font-semibold text-neutral-800">{booking.center?.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-neutral-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-neutral-600">Date</p>
                <p className="font-semibold text-neutral-800">
                  {format(new Date(booking.slot?.date), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-neutral-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-neutral-600">Time</p>
                <p className="font-semibold text-neutral-800">
                  {booking.slot?.startTime} - {booking.slot?.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">⚠️ Important:</span> Please arrive 10 minutes before your scheduled time. 
              Late arrivals may result in automatic cancellation.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onDone}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => window.print()}
        >
          Print Confirmation
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;