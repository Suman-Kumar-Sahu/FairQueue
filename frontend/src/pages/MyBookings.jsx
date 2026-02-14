import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, MapPin, X, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { getMyBookings, cancelBooking } from '../redux/slices/bookingSlice';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/common/SkeletonLoader';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { myBookings, isLoading } = useSelector((state) => state.booking);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await dispatch(cancelBooking({ id: bookingId, reason: 'User cancelled' }));
      
      if (result.type === 'booking/cancel/fulfilled') {
        toast.success('Booking cancelled successfully');
        setSelectedBooking(null);
      } else {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      'booked': 'primary',
      'confirmed': 'success',
      'checked-in': 'success',
      'completed': 'success',
      'cancelled': 'neutral',
      'no-show': 'danger',
    };
    return variants[status] || 'neutral';
  };

  const filteredBookings = myBookings.filter((booking) => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['booked', 'confirmed', 'checked-in'].includes(booking.status);
    if (filter === 'past') return ['completed', 'cancelled', 'no-show'].includes(booking.status);
    return true;
  });

  if (isLoading) {
    return <SkeletonLoader type="card" count={3} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
          My Bookings
        </h1>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-neutral-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar size={48} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-neutral-600 font-medium">No bookings found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking._id} hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-neutral-800">
                      {booking.service}
                    </h3>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono">
                    #{booking.bookingNumber}
                  </p>
                </div>

                {['booked', 'confirmed'].includes(booking.status) && (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<X size={16} />}
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin size={18} />
                  <span className="text-sm">{booking.center?.name}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar size={18} />
                  <span className="text-sm">
                    {booking.slot?.date && format(new Date(booking.slot.date), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-neutral-600">
                  <Clock size={18} />
                  <span className="text-sm">{booking.slot?.startTime}</span>
                </div>

                {booking.priority !== 'normal' && (
                  <div>
                    <Badge variant="warning" size="sm">
                      {booking.priority}
                    </Badge>
                  </div>
                )}
              </div>

              {booking.status === 'cancelled' && booking.cancellationReason && (
                <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">Reason:</span> {booking.cancellationReason}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;