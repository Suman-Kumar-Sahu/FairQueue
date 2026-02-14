import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/analytics/overall'),
        api.get('/bookings?limit=5')
      ]);

      setStats(statsRes.data.data);
      setRecentBookings(bookingsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for charts
  const bookingTrendsData = [
    { name: 'Mon', bookings: 45 },
    { name: 'Tue', bookings: 52 },
    { name: 'Wed', bookings: 61 },
    { name: 'Thu', bookings: 48 },
    { name: 'Fri', bookings: 70 },
    { name: 'Sat', bookings: 55 },
    { name: 'Sun', bookings: 38 },
  ];

  const statusDistribution = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'Active', value: 30, color: '#2563eb' },
    { name: 'Cancelled', value: 15, color: '#94a3b8' },
    { name: 'No-Show', value: 10, color: '#ef4444' },
  ];

  if (loading) {
    return <SkeletonLoader type="dashboard" count={1} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600 mt-1">
          Overview of system performance and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-blue-100 text-xs mt-2">
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </Card>

        {/* Active Centers */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">
                Active Centers
              </p>
              <p className="text-3xl font-bold">
                {stats?.totalCenters || 0}
              </p>
              <p className="text-purple-100 text-xs mt-2">
                Across all regions
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Building2 size={24} />
            </div>
          </div>
        </Card>

        {/* Total Bookings */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Total Bookings
              </p>
              <p className="text-3xl font-bold">
                {stats?.totalBookings || 0}
              </p>
              <p className="text-green-100 text-xs mt-2">
                All time bookings
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Calendar size={24} />
            </div>
          </div>
        </Card>

        {/* Today's Bookings */}
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">
                Today's Bookings
              </p>
              <p className="text-3xl font-bold">
                {stats?.todayBookings || 0}
              </p>
              <p className="text-orange-100 text-xs mt-2">
                {stats?.activeBookings || 0} currently active
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <Card>
          <h3 className="font-bold text-lg text-neutral-800 mb-4">
            Booking Trends (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card>
          <h3 className="font-bold text-lg text-neutral-800 mb-4">
            Booking Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-neutral-600">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <h3 className="font-bold text-lg text-neutral-800 mb-4">
          Recent Bookings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Booking ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Service
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4 text-sm font-mono text-neutral-800">
                    #{booking.bookingNumber}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-800">
                    {booking.user?.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600">
                    {booking.service}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* System Alerts */}
      <Card className="bg-yellow-50 border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 mt-1" size={20} />
          <div>
            <h3 className="font-bold text-neutral-800 mb-2">System Alerts</h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-600" />
                <span>3 slots reaching capacity today</span>
              </li>
              <li className="flex items-center gap-2">
                <Users size={16} className="text-yellow-600" />
                <span>5 users with multiple no-shows this week</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;