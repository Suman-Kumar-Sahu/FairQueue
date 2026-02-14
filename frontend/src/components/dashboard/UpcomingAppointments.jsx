import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const UpcomingAppointments = ({ bookings = [] }) => {
  if (bookings.length === 0) {
    return (
      <Card className="text-center py-12">
        <Calendar size={48} className="mx-auto text-neutral-300 mb-4" />
        <p className="text-neutral-600 font-medium">No upcoming appointments</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => window.location.href = '/book'}
        >
          Book Now
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
        <Calendar size={20} />
        Upcoming Appointments
      </h3>

      {bookings.map((booking) => (
        <Card 
          key={booking._id} 
          hover 
          onClick={() => window.location.href = `/booking/${booking._id}`}
          className="cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Service and Status */}
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-neutral-800">{booking.service}</h4>
                <Badge variant={
                  booking.status === 'confirmed' ? 'success' :
                  booking.status === 'booked' ? 'primary' : 'neutral'
                }>
                  {booking.status}
                </Badge>
              </div>

              {/* Center Name */}
              <div className="flex items-center gap-2 text-neutral-600 mb-2">
                <MapPin size={16} />
                <span className="text-sm">{booking.center?.name}</span>
              </div>

              {/* Date and Time */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar size={16} />
                  <span>{format(new Date(booking.slot?.date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Clock size={16} />
                  <span>{booking.slot?.startTime}</span>
                </div>
              </div>

              {/* Booking Number */}
              <p className="text-xs text-neutral-500 mt-2 font-mono">
                #{booking.bookingNumber}
              </p>
            </div>

            {/* Arrow Icon */}
            <ArrowRight size={20} className="text-neutral-400 mt-2" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingAppointments;