import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import { getMyBookings } from '../redux/slices/bookingSlice';
import QueuePosition from '../components/dashboard/QueuePosition';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { myBookings, isLoading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  // Get active booking (checked-in or confirmed)
  const activeBooking = myBookings.find(
    (b) => b.status === 'checked-in' || b.status === 'confirmed'
  );

  // Get upcoming bookings
  const upcomingBookings = myBookings
    .filter((b) => ['booked', 'confirmed'].includes(b.status))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-neutral-600 mt-1">
            {activeBooking
              ? 'You have an active appointment'
              : 'Ready to book your next appointment?'}
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={<Calendar size={20} />}
          onClick={() => navigate('/book')}
        >
          Book Now
        </Button>
      </div>

      {/* Active Queue Position */}
      {activeBooking && (
        <QueuePosition
          position={7}
          totalInQueue={25}
          estimatedWait={12}
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">
                Total Bookings
              </p>
              <p className="text-3xl font-bold">
                {myBookings.length}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Calendar size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium mb-1">
                Completed
              </p>
              <p className="text-3xl font-bold">
                {myBookings.filter((b) => b.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">
                Upcoming
              </p>
              <p className="text-3xl font-bold">
                {upcomingBookings.length}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Clock size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      {isLoading ? (
        <SkeletonLoader type="card" count={2} />
      ) : (
        <UpcomingAppointments bookings={upcomingBookings} />
      )}

      {/* Tips Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <h3 className="font-bold text-neutral-800 mb-3 flex items-center gap-2">
          💡 Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">•</span>
            Book slots during off-peak hours (2-4 PM) for shorter wait times
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">•</span>
            Arrive 10 minutes early to avoid no-show penalties
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">•</span>
            Check alternative slots for less crowded options
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;